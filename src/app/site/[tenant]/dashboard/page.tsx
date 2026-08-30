import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Users, Activity, CheckCircle } from "lucide-react";
import { format } from "date-fns";

export default async function TenantDashboardPage(props: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: tenantSubdomain } = await props.params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.tenantId) return null;

  // Fetch basic metrics
  const totalUsers = await prisma.user.count({
    where: { tenantId: session.user.tenantId },
  });

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId },
  });

  // Fetch Recent Activity (Audit Logs or similar if available)
  // For now, mock it with some placeholder data based on actual features
  const recentActivity = [
    { id: 1, action: "Nueva cotización generada", time: "Hace 2 horas" },
    { id: 2, action: "Usuario invitado al tenant", time: "Ayer" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white leading-tight">Dashboard General</h1>
        <p className="mt-1 text-sm text-slate-400">
          Resumen de actividad para {tenant?.name || "tu organización"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Usuarios Activos"
          value={totalUsers.toString()}
          icon={<Users className="h-6 w-6 text-white" />}
          trend="+2 esta semana"
          trendUp={true}
        />
        <MetricCard
          title="Plan Actual"
          value="Pro"
          icon={<CheckCircle className="h-6 w-6 text-white" />}
          description="Suscripción activa"
        />
        <MetricCard
          title="Última Actividad"
          value={format(new Date(), "dd/MM/yyyy")}
          icon={<Activity className="h-6 w-6 text-white" />}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity List */}
        <div className="glass-card border border-white/5 rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-base font-semibold leading-6 text-white">Actividad Reciente</h2>
            <div className="mt-6 flow-root">
              <ul role="list" className="-my-5 divide-y divide-white/5">
                {recentActivity.map((item) => (
                  <li key={item.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">{item.action}</p>
                        <p className="truncate text-sm text-slate-400">{item.time}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Links / Actions */}
        <div className="glass-card border border-white/5 rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-base font-semibold leading-6 text-white">Accesos Rápidos</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <a href={`/site/${tenantSubdomain}/dashboard/users`} className="flex items-center justify-center rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/10">
                Gestionar Equipo
              </a>
              <a href={`/site/${tenantSubdomain}/dashboard/settings`} className="flex items-center justify-center rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/10">
                Configuración
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
