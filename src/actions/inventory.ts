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

export async function createInvMovement(data: { itemId: string; type: string; quantity: number; reason: string; referenceId?: string }) {
  try {
    const user = await requireTenantUser();
    
    // Verify item belongs to tenant
    const item = await prisma.invItem.findFirst({
      where: { id: data.itemId, tenantId: user.tenantId }
    });
    if (!item) throw new Error("Artículo no encontrado");

    await prisma.$transaction(async (tx) => {
      // Create movement
      await tx.invMovement.create({
        data: {
          tenantId: user.tenantId,
          itemId: data.itemId,
          type: data.type,
          quantity: data.quantity,
          reason: data.reason,
          referenceId: data.referenceId,
        }
      });

      // Update current stock
      const stockChange = data.type === "IN" ? data.quantity : -data.quantity; // OUT and ADJUSTMENT decrement (assuming adjustments are losses for now, or you can do signed adjustments)
      
      await tx.invItem.update({
        where: { id: data.itemId },
        data: {
          currentStock: {
            increment: stockChange
          }
        }
      });
    });

    revalidatePath(`/site/[tenant]/dashboard/inventory`, "layout");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { error: error.message };
  }
}

export async function createInvPurchase(data: { supplierId: string; totalAmount: number; items: { itemId: string, quantity: number, unitCost: number, total: number }[] }) {
  try {
    const user = await requireTenantUser();
    
    const purchase = await prisma.invPurchase.create({
      data: {
        tenantId: user.tenantId,
        supplierId: data.supplierId,
        totalAmount: data.totalAmount,
        status: "RECEIVED", // We assume it's received for immediate effect MVP
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

    // Automatically generate IN movements for the received items
    for (const item of data.items) {
      await createInvMovement({
        itemId: item.itemId,
        type: "IN",
        quantity: item.quantity,
        reason: `Compra #${purchase.id.slice(-5).toUpperCase()}`,
        referenceId: purchase.id
      });
    }

    // Trigger ERP Expense
    // We import locally to avoid circular dependencies if erp imports inventory later
    const { registerAutomaticIncome } = await import("./erp");
    // Actually, we need an ERP expense trigger. Let's add that to erp.ts later, but for now we can do it via createTransaction directly
    const { createTransaction } = await import("./erp");
    
    // We need an account ID. Find the default one.
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
