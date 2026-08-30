import { prisma } from "@/lib/prisma/client";
import { ProjectGanttClient } from "@/components/dashboard/projects/ProjectGanttClient";
import { notFound } from "next/navigation";

export default async function ProjectGanttPage(props: {
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

  return <ProjectGanttClient tenantSubdomain={tenant} project={JSON.parse(JSON.stringify(project))} />;
}
