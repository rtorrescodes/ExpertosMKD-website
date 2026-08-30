import { prisma } from "@/lib/prisma/client";
import { ProjectKanbanClient } from "@/components/dashboard/projects/ProjectKanbanClient";
import { notFound } from "next/navigation";

export default async function ProjectKanbanPage({ params }: { params: { tenant: string, id: string } }) {
  const project = await prisma.prjProject.findUnique({
    where: { id: params.id },
    include: {
      tasks: {
        include: { assignedTo: true }
      }
    }
  });

  if (!project) notFound();

  // Load tenant users for assignment
  const users = await prisma.user.findMany({
    where: { tenantId: project.tenantId }
  });

  return (
    <ProjectKanbanClient 
      project={JSON.parse(JSON.stringify(project))} 
      tenantUsers={JSON.parse(JSON.stringify(users))}
    />
  );
}
