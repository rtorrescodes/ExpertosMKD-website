import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { redirect } from "next/navigation";
import { CompaniesClient } from "@/components/dashboard/crm/CompaniesClient";

export default async function CompaniesPage(props: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await props.params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.tenantId) {
    redirect("/admin/login");
  }

  const companies = await prisma.crmCompany.findMany({
    where: { tenantId: session.user.tenantId },
    include: { people: true, opportunities: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <CompaniesClient 
      tenantSubdomain={tenant}
      companies={JSON.parse(JSON.stringify(companies))} 
    />
  );
}
