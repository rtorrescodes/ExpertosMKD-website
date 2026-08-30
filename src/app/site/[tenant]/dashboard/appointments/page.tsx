import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Settings } from "lucide-react";

export default async function AppointmentsDashboard({ params }: { params: { tenant: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) redirect("/admin/login");

  const bookings = await prisma.apptBooking.findMany({
    where: { tenantId: session.user.tenantId, startTime: { gte: new Date() } },
    include: { eventType: true, person: true },
    orderBy: { startTime: "asc" }
  });

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Agenda de Citas</h1>
          <p className="mt-2 text-sm text-gray-700">
            Próximas reservas confirmadas.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 flex gap-3">
          <Link
            href={`/site/${params.tenant}/dashboard/appointments/event-types`}
            className="flex items-center gap-2 rounded-md bg-white border px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 shadow-sm"
          >
            <Settings className="h-4 w-4" />
            Servicios y Horarios
          </Link>
        </div>
      </div>

      <div className="mt-8 overflow-hidden bg-white shadow sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {bookings.map((booking) => (
            <li key={booking.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium text-black">
                    {booking.eventType.title}
                  </p>
                  <div className="ml-2 flex flex-shrink-0">
                    <p className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {booking.status}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex sm:flex-col">
                    <p className="flex items-center text-sm text-gray-500">
                      Cliente: {booking.customerName} ({booking.customerPhone || booking.customerEmail})
                    </p>
                    {booking.notes && <p className="text-sm text-gray-400 mt-1">Notas: {booking.notes}</p>}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <Calendar className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                    <p>
                      {new Date(booking.startTime).toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' })} 
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
          {bookings.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-gray-500">
              No hay citas próximas programadas.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
