import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { redirect } from "next/navigation";
import { EcomDashboardClient } from "@/components/dashboard/ecommerce/EcomDashboardClient";

export default async function EcommerceDashboard(props: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await props.params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) redirect("/login");

  const products = await prisma.ecomProduct.findMany({
    where: { tenantId: session.user.tenantId },
    include: { variants: true },
    orderBy: { createdAt: 'desc' }
  });

  const orders = await prisma.ecomOrder.findMany({
    where: { tenantId: session.user.tenantId },
    include: { items: { include: { variant: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <EcomDashboardClient 
      products={JSON.parse(JSON.stringify(products))} 
      orders={JSON.parse(JSON.stringify(orders))} 
      tenantSubdomain={tenant} 
    />
  );
}
