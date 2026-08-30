import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Users, Activity, CheckCircle } from "lucide-react";
import { format } from "date-fns";

export default async function TenantDashboardPage({
  params,
}: {
  params: { tenant: string };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.tenantId) return null;

  // Fetch basic metrics
  const totalUsers = await prisma.user.count({
    where: { tenantId: session.user.tenantId },
  });

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId },
  });

  // Fetch Recent Activity (Audit Logs)
  const recentLogs = await prisma.auditLog.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      user: { select: { name: true, email: true } },
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Bienvenido a {tenant?.name}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Resumen general de tu plataforma.
        </p>
      </div>

      {/* Metrics */}
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard 
          title="Total Usuarios" 
          value={totalUsers} 
          icon={Users} 
          description="Usuarios con acceso al sistema" 
        />
        <MetricCard 
          title="Estado" 
          value={tenant?.status === "ACTIVE" ? "Activo" : tenant?.status || "N/A"} 
          icon={CheckCircle} 
          description="Estado actual de la cuenta" 
        />
        <MetricCard 
          title="Nivel de Actividad" 
          value="Normal" 
          icon={Activity} 
          description="Basado en los últimos 7 días" 
        />
      </dl>

      {/* Recent Activity */}
      <div>
        <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">
          Actividad Reciente
        </h3>
        <div className="overflow-hidden bg-white shadow sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {recentLogs.map((log) => (
              <li key={log.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-medium text-black">
                      {log.action}
                    </p>
                    <div className="ml-2 flex flex-shrink-0">
                      <p className="inline-flex rounded-full bg-green-50 px-2 text-xs font-semibold leading-5 text-green-700">
                        {log.entityType}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {log.user?.name || log.user?.email || "Sistema"}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        {format(new Date(log.createdAt), "MMM d, yyyy HH:mm")}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
            {recentLogs.length === 0 && (
              <li>
                <div className="px-4 py-8 text-center text-sm text-gray-500 sm:px-6">
                  No hay actividad reciente registrada.
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
