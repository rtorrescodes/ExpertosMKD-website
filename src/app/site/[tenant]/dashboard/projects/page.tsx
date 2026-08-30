import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { redirect } from "next/navigation";
import { ProjectsListClient } from "@/components/dashboard/projects/ProjectsListClient";

export default async function ProjectsDashboard({ params }: { params: { tenant: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) redirect("/admin/login");

  const projects = await prisma.prjProject.findMany({
    where: { tenantId: session.user.tenantId },
    include: { tasks: true, person: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <ProjectsListClient 
      tenantSubdomain={params.tenant}
      projects={JSON.parse(JSON.stringify(projects))}
    />
  );
}
