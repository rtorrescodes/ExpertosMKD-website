"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";

// Utility to enforce Global SuperAdmin access
async function requireGlobalAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("No estás autenticado.");
  }
  // En nuestro esquema actual, los usuarios globales del Hub tienen rol SUPER_ADMIN
  // O en el MVP 1 pudimos haber definido otra regla. Validemos SUPER_ADMIN.
  if (session.user.role !== "SUPER_ADMIN") {
    throw new Error("Acceso denegado. Se requiere nivel de Super Administrador.");
  }
  return session.user;
}

export async function updateTenantFeatures(tenantId: string, flags: object) {
  try {
    const admin = await requireGlobalAdmin();

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) return { error: "Tenant no encontrado." };

    await prisma.$transaction(async (tx) => {
      await tx.tenant.update({
        where: { id: tenant.id },
        data: { featureFlags: flags as any },
      });

      // Insert global audit log for this event inside the tenant's space so the tenant knows
      await tx.auditLog.create({
        data: {
          tenantId: tenant.id,
          userId: admin.id, 
          action: "feature.enabled",
          details: { updatedBy: "SuperAdmin", features: flags },
        },
      });
    });

    revalidatePath("/hub");
    
    return { success: true };
  } catch (error: any) {
    console.error("Update Features Error:", error);
    return { error: error.message || "Error interno del servidor." };
  }
}
