import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { redirect } from "next/navigation";
import { QuotesListClient } from "@/components/dashboard/quotes/QuotesListClient";

export default async function QuotesPage(props: { params: Promise<{ tenant: string }> })) {
  const { tenant } = await props.params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.tenantId) {
    redirect("/admin/login");
  }

  const quotes = await prisma.crmQuote.findMany({
    where: { tenantId: session.user.tenantId },
    include: { person: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <QuotesListClient 
      tenantSubdomain={tenant}
      quotes={JSON.parse(JSON.stringify(quotes))} 
    />
  );
}
