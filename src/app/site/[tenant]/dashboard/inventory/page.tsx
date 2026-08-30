import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { redirect } from "next/navigation";
import { InventoryClient } from "@/components/dashboard/inventory/InventoryClient";

export default async function InventoryDashboard(props: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await props.params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.tenantId) redirect("/admin/login");

  // Fetch Inventory Items
  const items = await prisma.invItem.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { name: "asc" }
  });

  // Fetch recent movements for analytics if needed
  const movements = await prisma.invMovement.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { item: true }
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold leading-6 text-white">Almacén e Inventario (Kardex)</h1>
        <p className="mt-2 text-sm text-slate-400">
          Administra tu inventario, ajusta existencias y mantén el control de tus insumos o mercancías.
        </p>
      </div>

      <InventoryClient 
        items={JSON.parse(JSON.stringify(items))} 
        movements={JSON.parse(JSON.stringify(movements))} 
      />
    </div>
  );
}
