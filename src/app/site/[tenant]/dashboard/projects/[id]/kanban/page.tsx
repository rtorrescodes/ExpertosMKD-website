import { prisma } from "@/lib/prisma/client";
import { ProjectKanbanClient } from "@/components/dashboard/projects/ProjectKanbanClient";
import { notFound } from "next/navigation";

export default async function ProjectKanbanPage(props: {
  params: Promise<{ tenant: string, id: string }>;
}) {
  const { tenant, id } = await props.params;
  const project = await prisma.prjProject.findUnique({
    where: { id: id },
    include: {
      tasks: {
        include: { assignedTo: true }
      }
    }
  });

  if (!project) notFound();

  return <ProjectKanbanClient tenantSubdomain={tenant} project={JSON.parse(JSON.stringify(project))} />;
}
