"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";

async function requireTenantUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) {
    throw new Error("No autenticado o sin tenant asignado.");
  }
  return session.user;
}

export async function createWarehouse(data: { name: string; location?: string; isDefault?: boolean }) {
  try {
    const user = await requireTenantUser();
    
    // Si es el primero o se marcó como default, quitamos el default a los demás
    if (data.isDefault) {
      await prisma.invWarehouse.updateMany({
        where: { tenantId: user.tenantId },
        data: { isDefault: false }
      });
    }

    await prisma.invWarehouse.create({
      data: {
        tenantId: user.tenantId,
        name: data.name,
        location: data.location,
        isDefault: data.isDefault || false
      }
    });

    revalidatePath(`/site/[tenant]/dashboard/inventory`, "layout");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createInvItem(data: { name: string; sku?: string; minStockAlert: number; unitCost: number }) {
  try {
    const user = await requireTenantUser();
    await prisma.invItem.create({
      data: {
        tenantId: user.tenantId,
        name: data.name,
        sku: data.sku,
        minStockAlert: data.minStockAlert,
        unitCost: data.unitCost,
      },
    });
    revalidatePath(`/site/[tenant]/dashboard/inventory`, "layout");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createInvMovement(data: { itemId: string; warehouseId: string; type: string; quantity: number; reason: string; referenceId?: string }) {
  try {
    const user = await requireTenantUser();
    
    const item = await prisma.invItem.findFirst({
      where: { id: data.itemId, tenantId: user.tenantId }
    });
    if (!item) throw new Error("Artículo no encontrado");

    await prisma.$transaction(async (tx) => {
      // 1. Create movement
      await tx.invMovement.create({
        data: {
          tenantId: user.tenantId,
          itemId: data.itemId,
          warehouseId: data.warehouseId,
          type: data.type,
          quantity: data.quantity,
          reason: data.reason,
          referenceId: data.referenceId,
        }
      });

      // 2. Upsert stock
      const stockChange = data.type === "IN" ? data.quantity : -data.quantity;
      
      const existingStock = await tx.invStock.findUnique({
        where: {
          itemId_warehouseId: { itemId: data.itemId, warehouseId: data.warehouseId }
        }
      });

      if (existingStock) {
        await tx.invStock.update({
          where: { id: existingStock.id },
          data: { quantity: { increment: stockChange } }
        });
      } else {
        await tx.invStock.create({
          data: {
            itemId: data.itemId,
            warehouseId: data.warehouseId,
            quantity: stockChange
          }
        });
      }
    });

    revalidatePath(`/site/[tenant]/dashboard/inventory`, "layout");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { error: error.message };
  }
}

export async function createInvPurchase(data: { supplierId: string; warehouseId: string; totalAmount: number; items: { itemId: string, quantity: number, unitCost: number, total: number }[] }) {
  try {
    const user = await requireTenantUser();
    
    const purchase = await prisma.invPurchase.create({
      data: {
        tenantId: user.tenantId,
        supplierId: data.supplierId,
        totalAmount: data.totalAmount,
        status: "RECEIVED",
        items: {
          create: data.items.map(i => ({
            itemId: i.itemId,
            quantity: i.quantity,
            unitCost: i.unitCost,
            total: i.total
          }))
        }
      }
    });

    for (const item of data.items) {
      await createInvMovement({
        itemId: item.itemId,
        warehouseId: data.warehouseId,
        type: "IN",
        quantity: item.quantity,
        reason: `Compra #${purchase.id.slice(-5).toUpperCase()}`,
        referenceId: purchase.id
      });
    }

    const { createTransaction } = await import("./erp");
    const account = await prisma.erpAccount.findFirst({ where: { tenantId: user.tenantId }});
    if (account) {
      await createTransaction({
        accountId: account.id,
        type: "EXPENSE",
        status: "PAID",
        category: "PURCHASES",
        amount: data.totalAmount,
        description: `Pago de inventario a proveedor. Orden #${purchase.id.slice(-5).toUpperCase()}`
      });
    }

    revalidatePath(`/site/[tenant]/dashboard/inventory`, "layout");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createSupplier(data: { name: string; contactName?: string; email?: string; phone?: string }) {
  try {
    const user = await requireTenantUser();
    await prisma.invSupplier.create({
      data: {
        tenantId: user.tenantId,
        ...data
      }
    });
    revalidatePath(`/site/[tenant]/dashboard/inventory`, "layout");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
