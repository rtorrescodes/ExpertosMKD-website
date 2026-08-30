import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Settings } from "lucide-react";
import { AppointmentsClient } from "@/components/dashboard/appointments/AppointmentsClient";

export default async function AppointmentsDashboard(props: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await props.params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.tenantId) redirect("/admin/login");

  // Fetch upcoming and past bookings for the calendar
  const bookings = await prisma.apptBooking.findMany({
    where: { tenantId: session.user.tenantId },
    include: { eventType: true, person: true },
    orderBy: { startTime: "asc" }
  });

  return (
    <div>
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-bold leading-6 text-white">Calendario de Citas</h1>
          <p className="mt-2 text-sm text-slate-400">
            Gestiona las reservas de tus clientes en tiempo real.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 flex gap-3">
          <Link
            href={`/site/${tenant}/dashboard/appointments/event-types`}
            className="flex items-center gap-2 rounded-md glass-card border-white/5 border px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 shadow-sm transition-colors"
          >
            <Settings className="h-4 w-4" />
            Servicios y Horarios
          </Link>
        </div>
      </div>

      <AppointmentsClient bookings={JSON.parse(JSON.stringify(bookings))} tenantSubdomain={tenant} />
    </div>
  );
}
