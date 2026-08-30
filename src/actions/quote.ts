"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";

async function requireTenantUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) {
    throw new Error("No estás autenticado o no perteneces a un tenant.");
  }
  return session.user;
}

export async function createQuote(data: {
  personId?: string;
  customerName?: string;
  customerEmail?: string;
  notes?: string;
  template: string;
  items: {
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    total: number;
  }[];
}) {
  try {
    const user = await requireTenantUser();

    // Verify person belongs to tenant if provided
    if (data.personId) {
      const person = await prisma.crmPerson.findFirst({
        where: { id: data.personId, tenantId: user.tenantId! },
      });
      if (!person) throw new Error("El contacto no existe.");
    }

    // Calculate totals
    const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const discountTotal = data.items.reduce((sum, item) => sum + item.discount, 0);
    const grandTotal = subtotal - discountTotal; // Add tax logic later if needed

    // Create Transaction
    const quote = await prisma.$transaction(async (tx) => {
      const newQuote = await tx.crmQuote.create({
        data: {
          tenantId: user.tenantId!,
          personId: data.personId,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          template: data.template,
          notes: data.notes,
          subtotal,
          discountTotal,
          grandTotal,
          items: {
            create: data.items.map(item => ({
              name: item.name,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discount: item.discount,
              total: item.total,
            }))
          }
        },
      });

      // Record Activity if linked to CRM
      if (data.personId) {
        await tx.crmActivity.create({
          data: {
            tenantId: user.tenantId!,
            type: "QUOTE_CREATED",
            content: `Cotización #${newQuote.quoteNumber} generada.`,
            personId: data.personId,
            quoteId: newQuote.id,
          }
        });
      }

      return newQuote;
    });

    revalidatePath(`/site/[tenant]/dashboard/quotes`, "page");
    return { success: true, quoteId: quote.id, publicToken: quote.publicToken };

  } catch (error: any) {
    console.error(error);
    return { error: error.message || "Error al crear la cotización" };
  }
}

export async function acceptQuote(publicToken: string) {
  try {
    const quote = await prisma.crmQuote.findUnique({
      where: { publicToken },
    });

    if (!quote) throw new Error("Cotización no encontrada");
    if (quote.status === "ACCEPTED" || quote.status === "PAID") {
      throw new Error("Esta cotización ya fue procesada");
    }

    const updated = await prisma.$transaction(async (tx) => {
      const q = await tx.crmQuote.update({
        where: { id: quote.id },
        data: { status: "ACCEPTED" }
      });

      if (q.personId) {
        await tx.crmActivity.create({
          data: {
            tenantId: q.tenantId,
            type: "QUOTE_ACCEPTED",
            content: `Cotización #${q.quoteNumber} fue aceptada por el cliente.`,
            personId: q.personId,
            quoteId: q.id,
          }
        });
      }

      return q;
    });

    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { error: error.message || "Error al aceptar cotización" };
  }
}
