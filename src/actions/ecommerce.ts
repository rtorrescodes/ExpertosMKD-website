"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";

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
    const order = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsData = [];

      for (const item of data.cartItems) {
        const variant = await tx.ecomVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true }
        });

        if (!variant) throw new Error(`Variante no encontrada: ${item.variantId}`);
        if (variant.inventoryQuantity < item.quantity) {
          throw new Error(`Inventario insuficiente para ${variant.product.title}`);
        }

        // Deduct inventory
        await tx.ecomVariant.update({
          where: { id: variant.id },
          data: { inventoryQuantity: variant.inventoryQuantity - item.quantity }
        });

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

      return newOrder;
    });

    return { success: true, orderId: order.displayId };
  } catch (error: any) {
    console.error(error);
    return { error: error.message || "Error al procesar la orden" };
  }
}
