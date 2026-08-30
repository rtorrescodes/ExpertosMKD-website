import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { redirect } from "next/navigation";
import { CompaniesClient } from "@/components/dashboard/crm/CompaniesClient";

export default async function CompaniesPage({
  params,
}: {
  params: { tenant: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.tenantId) {
    redirect("/admin/login");
  }

  const companies = await prisma.crmCompany.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <CompaniesClient 
      companies={JSON.parse(JSON.stringify(companies))} 
    />
  );
}
