"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";
import { registerAutomaticIncome } from "./erp";

async function requireTenantUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) throw new Error("No autorizado");
  return session.user;
}

export async function createProduct(data: {
  title: string;
  description?: string;
  price: number;
  inventoryQuantity: number;
}) {
  try {
    const user = await requireTenantUser();
    
    // Generate a handle (slug)
    const handle = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.floor(Math.random() * 1000);

    const product = await prisma.$transaction(async (tx) => {
      const p = await tx.ecomProduct.create({
        data: {
          tenantId: user.tenantId!,
          title: data.title,
          description: data.description,
          handle,
        }
      });

      // Create default variant
      await tx.ecomVariant.create({
        data: {
          productId: p.id,
          title: "Default",
          price: data.price,
          inventoryQuantity: data.inventoryQuantity
        }
      });

      return p;
    });

    revalidatePath(`/site/[tenant]/dashboard/ecommerce`, "layout");
    return { success: true, product };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createOrder(data: {
  tenantSubdomain: string;
  customerName: string;
  customerEmail: string;
  cartItems: { variantId: string, quantity: number }[];
}) {
  try {
    const tenant = await prisma.tenant.findUnique({ where: { subdomain: data.tenantSubdomain } });
    if (!tenant) throw new Error("Tenant no encontrado");

    // Process order in a transaction to safely deduct inventory
      const defaultWarehouse = await prisma.invWarehouse.findFirst({
        where: { tenantId: tenant.id, isDefault: true }
      }) || await prisma.invWarehouse.findFirst({
        where: { tenantId: tenant.id }
      });

      const order = await prisma.$transaction(async (tx) => {
        let subtotal = 0;
        const orderItemsData = [];
        const invMovementsData = []; // To store kardex triggers

        for (const item of data.cartItems) {
          const variant = await tx.ecomVariant.findUnique({
            where: { id: item.variantId },
            include: { product: true, invItem: true }
          });

          if (!variant) throw new Error(`Variante no encontrada: ${item.variantId}`);
          if (variant.inventoryQuantity < item.quantity) {
            throw new Error(`Inventario insuficiente para ${variant.product.title}`);
          }

          // Deduct Ecom inventory
          await tx.ecomVariant.update({
            where: { id: variant.id },
            data: { inventoryQuantity: variant.inventoryQuantity - item.quantity }
          });

          // Prepare Inv Movement if linked and warehouse exists
          if (variant.invItem && defaultWarehouse) {
            invMovementsData.push({
              itemId: variant.invItem.id,
              quantity: item.quantity,
              tenantId: tenant.id,
              warehouseId: defaultWarehouse.id
            });
            
            const existingStock = await tx.invStock.findUnique({
              where: { itemId_warehouseId: { itemId: variant.invItem.id, warehouseId: defaultWarehouse.id } }
            });

            if (existingStock) {
              await tx.invStock.update({
                where: { id: existingStock.id },
                data: { quantity: { decrement: item.quantity } }
              });
            } else {
              await tx.invStock.create({
                data: {
                  itemId: variant.invItem.id,
                  warehouseId: defaultWarehouse.id,
                  quantity: -item.quantity
                }
              });
            }
          }

          const lineTotal = Number(variant.price) * item.quantity;
          subtotal += lineTotal;

          orderItemsData.push({
            variantId: variant.id,
            title: `${variant.product.title} (${variant.title})`,
            quantity: item.quantity,
            unitPrice: variant.price,
            total: lineTotal
          });
        }

      // Check if CRM person exists
      const person = await tx.crmPerson.findFirst({
        where: { tenantId: tenant.id, email: data.customerEmail }
      });

      // Create Order
      const newOrder = await tx.ecomOrder.create({
        data: {
          tenantId: tenant.id,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          personId: person?.id,
          subtotal,
          total: subtotal, // Add taxes/shipping later if needed
          items: {
            create: orderItemsData
          }
        }
      });

      // Create Kardex OUT movements
      if (invMovementsData.length > 0) {
        await tx.invMovement.createMany({
          data: invMovementsData.map(m => ({
            tenantId: m.tenantId,
            itemId: m.itemId,
            warehouseId: m.warehouseId,
            type: "OUT",
            quantity: m.quantity,
            reason: `Venta online #${newOrder.displayId}`,
            referenceId: newOrder.id
          }))
        });
      }

      return newOrder;
    });

    // ERP Trigger
    await registerAutomaticIncome(tenant.id, Number(order.total), "ECOM", order.id, `Venta en línea #${order.displayId}`);

    return { success: true, orderId: order.displayId };
  } catch (error: any) {
    console.error(error);
    return { error: error.message || "Error al procesar la orden" };
  }
}

export async function updateProduct(id: string, data: { title: string; description?: string; price: number; inventoryQuantity: number; }) {
  try {
    const user = await requireTenantUser();
    await prisma.$transaction(async (tx) => {
      await tx.ecomProduct.updateMany({
        where: { id, tenantId: user.tenantId! },
        data: { title: data.title, description: data.description }
      });
      // Update default variant
      const defaultVariant = await tx.ecomVariant.findFirst({ where: { productId: id } });
      if (defaultVariant) {
        await tx.ecomVariant.update({
          where: { id: defaultVariant.id },
          data: { price: data.price, inventoryQuantity: data.inventoryQuantity }
        });
      }
    });
    revalidatePath(/site/[tenant]/dashboard/ecommerce, "layout");
    return { success: true };
  } catch (error: any) { return { error: error.message }; }
}

export async function deleteProduct(id: string) {
  try {
    const user = await requireTenantUser();
    // This will cascade delete variants if schema is configured properly, otherwise delete variants first.
    await prisma.$transaction(async (tx) => {
      await tx.ecomVariant.deleteMany({ where: { productId: id } });
      await tx.ecomProduct.deleteMany({ where: { id, tenantId: user.tenantId! } });
    });
    revalidatePath(/site/[tenant]/dashboard/ecommerce, "layout");
    return { success: true };
  } catch (error: any) { return { error: error.message }; }
}
