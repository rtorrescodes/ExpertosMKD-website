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

export async function createProject(data: { name: string, description?: string }) {
  try {
    const user = await requireTenantUser();
    const prj = await prisma.prjProject.create({
      data: {
        tenantId: user.tenantId!,
        name: data.name,
        description: data.description,
      }
    });
    revalidatePath(`/site/[tenant]/dashboard/projects`, "layout");
    return { success: true, project: prj };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createTask(data: {
  projectId: string;
  title: string;
  description?: string;
  status?: string;
  assignedToId?: string;
  startDate?: string;
  dueDate?: string;
}) {
  try {
    const user = await requireTenantUser();
    
    // Verify project belongs to tenant
    const project = await prisma.prjProject.findFirst({
      where: { id: data.projectId, tenantId: user.tenantId! }
    });
    if (!project) throw new Error("Proyecto no encontrado");

    const task = await prisma.prjTask.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description,
        status: data.status || "TODO",
        assignedToId: data.assignedToId,
        startDate: data.startDate ? new Date(data.startDate) : null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      }
    });
    revalidatePath(`/site/[tenant]/dashboard/projects/${data.projectId}`, "layout");
    return { success: true, task };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateTaskStatus(taskId: string, status: string) {
  try {
    await requireTenantUser();
    await prisma.prjTask.update({
      where: { id: taskId },
      data: { status }
    });
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
