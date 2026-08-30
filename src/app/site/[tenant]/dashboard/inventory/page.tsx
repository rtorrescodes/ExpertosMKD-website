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

  // Fetch Inventory Items with their stocks across all warehouses
  const items = await prisma.invItem.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { name: "asc" },
    include: {
      stocks: true
    }
  });

  const warehouses = await prisma.invWarehouse.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { createdAt: "asc" }
  });

  const movements = await prisma.invMovement.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { item: true, warehouse: true }
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold leading-6 text-white">Almacenes y Kardex</h1>
        <p className="mt-2 text-sm text-slate-400">
          Administra múltiples ubicaciones, ajusta existencias y mantén el control de tus insumos o mercancías.
        </p>
      </div>

      <InventoryClient 
        items={JSON.parse(JSON.stringify(items))} 
        movements={JSON.parse(JSON.stringify(movements))} 
        warehouses={JSON.parse(JSON.stringify(warehouses))}
      />
    </div>
  );
}
