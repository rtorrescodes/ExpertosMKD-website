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

export async function createAccount(data: { name: string; currency?: string }) {
  try {
    const user = await requireTenantUser();
    const account = await prisma.erpAccount.create({
      data: {
        tenantId: user.tenantId,
        name: data.name,
        currency: data.currency || "MXN",
      },
    });
    revalidatePath(`/site/[tenant]/dashboard/erp`, "layout");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { error: error.message };
  }
}

export async function createTransaction(data: {
  accountId: string;
  type: string; // "INCOME" or "EXPENSE"
  status: string; // "PENDING" or "PAID"
  category: string;
  amount: number;
  description?: string;
  date?: string;
  ecomOrderId?: string;
  apptBookingId?: string;
  crmQuoteId?: string;
}) {
  try {
    const user = await requireTenantUser();
    
    // Verify account belongs to tenant
    const account = await prisma.erpAccount.findFirst({
      where: { id: data.accountId, tenantId: user.tenantId },
    });
    if (!account) throw new Error("Cuenta bancaria inválida");

    await prisma.erpTransaction.create({
      data: {
        tenantId: user.tenantId,
        accountId: data.accountId,
        type: data.type,
        status: data.status,
        category: data.category,
        amount: data.amount,
        description: data.description,
        date: data.date ? new Date(data.date) : new Date(),
        ecomOrderId: data.ecomOrderId,
        apptBookingId: data.apptBookingId,
        crmQuoteId: data.crmQuoteId,
      },
    });

    revalidatePath(`/site/[tenant]/dashboard/erp`, "layout");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { error: error.message };
  }
}

export async function updateTransactionStatus(id: string, newStatus: string) {
  try {
    const user = await requireTenantUser();
    
    const count = await prisma.erpTransaction.updateMany({
      where: { id, tenantId: user.tenantId },
      data: { status: newStatus },
    });

    if (count.count === 0) throw new Error("Transacción no encontrada");

    revalidatePath(`/site/[tenant]/dashboard/erp`, "layout");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteTransaction(id: string) {
  try {
    const user = await requireTenantUser();
    await prisma.erpTransaction.deleteMany({
      where: { id, tenantId: user.tenantId },
    });
    revalidatePath(`/site/[tenant]/dashboard/erp`, "layout");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function registerAutomaticIncome(tenantId: string, amount: number, source: string, sourceId: string, description: string) {
  try {
    if (amount <= 0) return; // No registrar transacciones en cero

    // 1. Find or create a default account for income
    let account = await prisma.erpAccount.findFirst({
      where: { tenantId, name: "Cuenta Principal" }
    });

    if (!account) {
      account = await prisma.erpAccount.create({
        data: {
          tenantId,
          name: "Cuenta Principal",
          currency: "MXN"
        }
      });
    }

    // 2. Create the transaction
    await prisma.erpTransaction.create({
      data: {
        tenantId,
        accountId: account.id,
        type: "INCOME",
        status: "PENDING", // Pendiente hasta que se marque como pagada
        category: source === "ECOM" ? "SALES" : "SERVICES",
        amount,
        description,
        ecomOrderId: source === "ECOM" ? sourceId : undefined,
        apptBookingId: source === "APPT" ? sourceId : undefined,
      }
    });

  } catch (error) {
    console.error("Error registering automatic ERP income:", error);
  }
}
