import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { redirect } from "next/navigation";
import { QuoteBuilderClient } from "@/components/dashboard/quotes/QuoteBuilderClient";

export default async function NewQuotePage({
  params,
}: {
  params: { tenant: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.tenantId) {
    redirect("/admin/login");
  }

  // Obtenemos los contactos del CRM (si existen)
  const people = await prisma.crmPerson.findMany({
    where: { tenantId: session.user.tenantId },
    select: { id: true, firstName: true, lastName: true, email: true },
    orderBy: { firstName: "asc" },
  });

  const tenantInfo = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId },
    select: { name: true, customDomain: true, subdomain: true }
  });

  return (
    <QuoteBuilderClient 
      people={people} 
      tenantName={tenantInfo?.name || "Empresa"}
      tenantSubdomain={params.tenant}
    />
  );
}
