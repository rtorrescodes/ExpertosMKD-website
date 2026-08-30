import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { redirect } from "next/navigation";
import { OpportunitiesClient } from "@/components/dashboard/crm/OpportunitiesClient";

export default async function OpportunitiesPage({
  params,
}: {
  params: { tenant: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.tenantId) {
    redirect("/login");
  }

  const opportunities = await prisma.crmOpportunity.findMany({
    where: { tenantId: session.user.tenantId },
    include: { company: true, person: true },
    orderBy: { createdAt: "desc" },
  });

  const companies = await prisma.crmCompany.findMany({
    where: { tenantId: session.user.tenantId },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const people = await prisma.crmPerson.findMany({
    where: { tenantId: session.user.tenantId },
    select: { id: true, firstName: true, lastName: true },
    orderBy: { firstName: "asc" },
  });

  return (
    <OpportunitiesClient 
      opportunities={JSON.parse(JSON.stringify(opportunities))} 
      companies={companies}
      people={people}
    />
  );
}
