import { prisma } from "@/lib/prisma/client";
import { ProjectGanttClient } from "@/components/dashboard/projects/ProjectGanttClient";
import { notFound } from "next/navigation";

export default async function ProjectGanttPage({ params }: { params: { tenant: string, id: string } }) {
  const project = await prisma.prjProject.findUnique({
    where: { id: params.id },
    include: {
      tasks: {
        include: { assignedTo: true, dependsOn: true },
        orderBy: { startDate: 'asc' } // Basic ordering for Gantt
      }
    }
  });

  if (!project) notFound();

  return (
    <ProjectGanttClient project={JSON.parse(JSON.stringify(project))} />
  );
}
