"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";

// Helper to ensure tenant isolation
async function requireTenantUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) {
    throw new Error("No estás autenticado o no perteneces a un tenant.");
  }
  return session.user;
}

// ==========================================
// COMPANIES
// ==========================================

export async function createCompany(data: {
  name: string;
  domain?: string;
  linkedin?: string;
  annualRevenue?: number;
  address?: string;
}) {
  try {
    const user = await requireTenantUser();
    
    const company = await prisma.crmCompany.create({
      data: {
        tenantId: user.tenantId!,
        ...data,
      },
    });
    
    revalidatePath(`/site/[tenant]/dashboard/crm/companies`, "page");
    return { success: true, company };
  } catch (error: any) {
    console.error(error);
    return { error: error.message || "Error al crear la empresa" };
  }
}

// ==========================================
// PEOPLE
// ==========================================

export async function createPerson(data: {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  linkedin?: string;
  companyId?: string;
}) {
  try {
    const user = await requireTenantUser();
    
    // Si envían companyId, verificar que pertenece al mismo tenant
    if (data.companyId) {
      const company = await prisma.crmCompany.findFirst({
        where: { id: data.companyId, tenantId: user.tenantId! },
      });
      if (!company) throw new Error("La empresa no existe o no tienes acceso.");
    }

    const person = await prisma.crmPerson.create({
      data: {
        tenantId: user.tenantId!,
        ...data,
      },
    });
    
    revalidatePath(`/site/[tenant]/dashboard/crm/people`, "page");
    return { success: true, person };
  } catch (error: any) {
    console.error(error);
    return { error: error.message || "Error al crear la persona" };
  }
}

// ==========================================
// OPPORTUNITIES
// ==========================================

export async function createOpportunity(data: {
  name: string;
  amount?: number;
  stage?: string;
  personId?: string;
  companyId?: string;
}) {
  try {
    const user = await requireTenantUser();

    // Zero Trust validations
    if (data.companyId) {
      const company = await prisma.crmCompany.findFirst({
        where: { id: data.companyId, tenantId: user.tenantId! },
      });
      if (!company) throw new Error("La empresa no existe.");
    }
    if (data.personId) {
      const person = await prisma.crmPerson.findFirst({
        where: { id: data.personId, tenantId: user.tenantId! },
      });
      if (!person) throw new Error("La persona no existe.");
    }

    const opportunity = await prisma.crmOpportunity.create({
      data: {
        tenantId: user.tenantId!,
        ...data,
      },
    });
    
    revalidatePath(`/site/[tenant]/dashboard/crm/opportunities`, "page");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { error: error.message || "Error al crear oportunidad" };
  }
}

export async function updateOpportunityStage(id: string, newStage: string) {
  try {
    const user = await requireTenantUser();

    const opp = await prisma.crmOpportunity.findFirst({
      where: { id, tenantId: user.tenantId! },
    });

    if (!opp) throw new Error("Oportunidad no encontrada");

    await prisma.crmOpportunity.update({
      where: { id },
      data: { stage: newStage },
    });

    // We do NOT revalidate path here if we rely on optimistic UI in the Kanban,
    // but doing so ensures state sync on next load.
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { error: error.message || "Error al actualizar la etapa" };
  }
}

export async function updateCompany(id: string, data: { name: string; domain?: string; linkedin?: string; annualRevenue?: number; address?: string; }) {
  try {
    const user = await requireTenantUser();
    const comp = await prisma.crmCompany.updateMany({ where: { id, tenantId: user.tenantId! }, data });
    if (comp.count === 0) throw new Error("No encontrado");
    revalidatePath(/site/[tenant]/dashboard/crm/companies, "page");
    return { success: true };
  } catch (error: any) { return { error: error.message }; }
}

export async function deleteCompany(id: string) {
  try {
    const user = await requireTenantUser();
    await prisma.crmCompany.deleteMany({ where: { id, tenantId: user.tenantId! } });
    revalidatePath(/site/[tenant]/dashboard/crm/companies, "page");
    return { success: true };
  } catch (error: any) { return { error: error.message }; }
}

export async function updatePerson(id: string, data: { firstName: string; lastName: string; email?: string; phone?: string; jobTitle?: string; companyId?: string; }) {
  try {
    const user = await requireTenantUser();
    if (data.companyId) {
      const company = await prisma.crmCompany.findFirst({ where: { id: data.companyId, tenantId: user.tenantId! } });
      if (!company) throw new Error("La empresa no existe.");
    }
    const comp = await prisma.crmPerson.updateMany({ where: { id, tenantId: user.tenantId! }, data });
    if (comp.count === 0) throw new Error("No encontrado");
    revalidatePath(/site/[tenant]/dashboard/crm/people, "page");
    return { success: true };
  } catch (error: any) { return { error: error.message }; }
}

export async function deletePerson(id: string) {
  try {
    const user = await requireTenantUser();
    await prisma.crmPerson.deleteMany({ where: { id, tenantId: user.tenantId! } });
    revalidatePath(/site/[tenant]/dashboard/crm/people, "page");
    return { success: true };
  } catch (error: any) { return { error: error.message }; }
}

export async function updateOpportunity(id: string, data: { name: string; amount?: number; stage?: string; personId?: string; companyId?: string; }) {
  try {
    const user = await requireTenantUser();
    if (data.companyId) {
      const company = await prisma.crmCompany.findFirst({ where: { id: data.companyId, tenantId: user.tenantId! } });
      if (!company) throw new Error("La empresa no existe.");
    }
    if (data.personId) {
      const person = await prisma.crmPerson.findFirst({ where: { id: data.personId, tenantId: user.tenantId! } });
      if (!person) throw new Error("La persona no existe.");
    }
    const comp = await prisma.crmOpportunity.updateMany({ where: { id, tenantId: user.tenantId! }, data });
    if (comp.count === 0) throw new Error("No encontrado");
    revalidatePath(/site/[tenant]/dashboard/crm/opportunities, "page");
    return { success: true };
  } catch (error: any) { return { error: error.message }; }
}

export async function deleteOpportunity(id: string) {
  try {
    const user = await requireTenantUser();
    await prisma.crmOpportunity.deleteMany({ where: { id, tenantId: user.tenantId! } });
    revalidatePath(/site/[tenant]/dashboard/crm/opportunities, "page");
    return { success: true };
  } catch (error: any) { return { error: error.message }; }
}
