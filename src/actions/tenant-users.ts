"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { z } from "zod";
import crypto from "crypto";
import { sendTenantInvite } from "@/lib/email/mailer";

// Utility to enforce Zero Trust
async function requireTenantAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) {
    throw new Error("No estás autenticado o no perteneces a un tenant.");
  }
  if (session.user.role !== "OWNER" && session.user.role !== "ADMIN") {
    throw new Error("No tienes permisos para realizar esta acción.");
  }
  return session.user;
}

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "MEMBER"]),
});

export async function inviteUser(formData: FormData) {
  try {
    const userSession = await requireTenantAdmin();
    const data = Object.fromEntries(formData.entries());
    const validated = inviteSchema.safeParse(data);

    if (!validated.success) {
      return { error: "Datos inválidos" };
    }

    const { email, role } = validated.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Este correo ya está registrado en el sistema." };
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: userSession.tenantId! },
    });

    if (!tenant) return { error: "Tenant no encontrado." };

    const token = crypto.randomBytes(32).toString("hex");

    await prisma.$transaction(async (tx) => {
      // 1. Create User
      const newUser = await tx.user.create({
        data: {
          email,
          role,
          tenantId: tenant.id,
          password: "",
        },
      });

      // 2. Create Verification Token
      await tx.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
        },
      });

      // 3. Create Audit Log
      await tx.auditLog.create({
        data: {
          tenantId: tenant.id,
          userId: userSession.id,
          action: "user.invited",
          details: { invitedEmail: email, assignedRole: role },
        },
      });
    });

    // 4. Send Email (out of transaction to prevent rollback on email failure, though it's debatable)
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const inviteLink = `${protocol}://${tenant.subdomain}.${process.env.NEXT_PUBLIC_APP_DOMAIN || "localhost:3000"}/auth/verify?token=${token}&email=${encodeURIComponent(email)}`;
    
    await sendTenantInvite(email, tenant.name, inviteLink);

    return { success: true };
  } catch (error: any) {
    console.error("Invite User Error:", error);
    return { error: error.message || "Error interno del servidor." };
  }
}

export async function updateUserRole(userId: string, newRole: string) {
  try {
    const userSession = await requireTenantAdmin();

    if (newRole !== "ADMIN" && newRole !== "MEMBER") {
      return { error: "Rol inválido." };
    }

    // Zero Trust: Enforce target user belongs to same tenant
    const targetUser = await prisma.user.findFirst({
      where: {
        id: userId,
        tenantId: userSession.tenantId!,
      },
    });

    if (!targetUser) return { error: "Usuario no encontrado." };
    if (targetUser.role === "OWNER") return { error: "No se puede editar a un OWNER." };

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: targetUser.id },
        data: { role: newRole as any },
      });

      await tx.auditLog.create({
        data: {
          tenantId: userSession.tenantId!,
          userId: userSession.id,
          action: "user.role_updated",
          details: { targetUserId: targetUser.id, oldRole: targetUser.role, newRole },
        },
      });
    });

    return { success: true };
  } catch (error: any) {
    console.error("Update Role Error:", error);
    return { error: error.message || "Error interno del servidor." };
  }
}

export async function removeUser(userId: string) {
  try {
    const userSession = await requireTenantAdmin();

    const targetUser = await prisma.user.findFirst({
      where: {
        id: userId,
        tenantId: userSession.tenantId!,
      },
    });

    if (!targetUser) return { error: "Usuario no encontrado." };
    if (targetUser.role === "OWNER") return { error: "No se puede eliminar a un OWNER." };

    await prisma.$transaction(async (tx) => {
      // Clean up verification tokens if they were pending
      await tx.verificationToken.deleteMany({
        where: { identifier: targetUser.email },
      });
      
      // Delete user
      await tx.user.delete({
        where: { id: targetUser.id },
      });

      await tx.auditLog.create({
        data: {
          tenantId: userSession.tenantId!,
          userId: userSession.id,
          action: "user.removed",
          details: { removedUserId: targetUser.id, removedEmail: targetUser.email },
        },
      });
    });

    return { success: true };
  } catch (error: any) {
    console.error("Remove User Error:", error);
    return { error: error.message || "Error interno del servidor." };
  }
}
