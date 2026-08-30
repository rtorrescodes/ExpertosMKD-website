import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { redirect } from "next/navigation";
import { EcomDashboardClient } from "@/components/dashboard/ecommerce/EcomDashboardClient";

export default async function EcommerceDashboard({ params }: { params: { tenant: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) redirect("/login");

  const products = await prisma.ecomProduct.findMany({
    where: { tenantId: session.user.tenantId },
    include: { variants: true },
    orderBy: { createdAt: "desc" }
  });

  const orders = await prisma.ecomOrder.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { createdAt: "desc" },
    include: { items: true }
  });

  return (
    <EcomDashboardClient 
      tenantSubdomain={params.tenant}
      products={JSON.parse(JSON.stringify(products))}
      orders={JSON.parse(JSON.stringify(orders))}
    />
  );
}
