import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { redirect } from "next/navigation";
import { OpportunitiesClient } from "@/components/dashboard/crm/OpportunitiesClient";

export default async function OpportunitiesPage(props: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await props.params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.tenantId) {
    redirect("/admin/login");
  }

  const opportunities = await prisma.crmOpportunity.findMany({
    where: { tenantId: session.user.tenantId },
    include: { person: true, company: true },
    orderBy: { createdAt: "desc" }
  });

  const companies = await prisma.crmCompany.findMany({
    where: { tenantId: session.user.tenantId },
    select: { id: true, name: true }
  });

  const people = await prisma.crmPerson.findMany({
    where: { tenantId: session.user.tenantId },
    select: { id: true, firstName: true, lastName: true }
  });

  return (
    <OpportunitiesClient 
      tenantSubdomain={tenant}
      opportunities={JSON.parse(JSON.stringify(opportunities))} 
      companies={companies}
      people={people}
    />
  );
}
