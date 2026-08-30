"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { X, Calendar as CalendarIcon, User, Clock, Check, XCircle } from "lucide-react";
import { updateBookingStatus } from "@/actions/appointments"; // We need to create this action!

export function AppointmentsClient({ bookings, tenantSubdomain }: { bookings: any[], tenantSubdomain: string }) {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState(
    bookings.map(b => ({
      id: b.id,
      title: `${b.eventType.title} - ${b.customerName}`,
      start: b.startTime,
      end: b.endTime,
      extendedProps: { ...b },
      backgroundColor: b.status === "CONFIRMED" ? "#10b981" : b.status === "CANCELLED" ? "#ef4444" : "#f59e0b",
      borderColor: "transparent",
    }))
  );

  const handleEventClick = (info: any) => {
    setSelectedBooking(info.event.extendedProps);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedBooking) return;
    setLoading(true);
    // update backend
    const res = await updateBookingStatus(selectedBooking.id, newStatus);
    if (res.success) {
      // update local state
      setEvents(events.map(ev => {
        if (ev.id === selectedBooking.id) {
          return {
            ...ev,
            extendedProps: { ...ev.extendedProps, status: newStatus },
            backgroundColor: newStatus === "CONFIRMED" ? "#10b981" : newStatus === "CANCELLED" ? "#ef4444" : "#f59e0b"
          };
        }
        return ev;
      }));
      setSelectedBooking(prev => ({ ...prev, status: newStatus }));
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#051424] p-6 rounded-xl border border-white/5 shadow-2xl">
      
      <div className="glass-card p-4 rounded-xl border-white/5 mb-6">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
          }}
          locale="es"
          slotMinTime="07:00:00"
          slotMaxTime="21:00:00"
          allDaySlot={false}
          events={events}
          eventClick={handleEventClick}
          height="75vh"
          themeSystem="standard"
          eventClassNames="cursor-pointer hover:opacity-80 transition-opacity shadow-lg"
        />
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="relative z-50">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedBooking(null)} />
          <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
            <div className="mx-auto max-w-md w-full bg-[#0a1526] rounded-xl shadow-2xl border border-white/10 overflow-hidden flex flex-col pointer-events-auto">
              
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <h2 className="text-lg font-semibold text-white">Detalles de la Cita</h2>
                <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-cyan-400">{selectedBooking.eventType.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      selectedBooking.status === "CONFIRMED" ? "bg-emerald-500/20 text-emerald-400" :
                      selectedBooking.status === "CANCELLED" ? "bg-red-500/20 text-red-400" :
                      "bg-amber-500/20 text-amber-400"
                    }`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  <User className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium">{selectedBooking.customerName}</p>
                    <p className="text-xs text-slate-400">{selectedBooking.customerEmail} • {selectedBooking.customerPhone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  <CalendarIcon className="w-5 h-5 text-slate-500" />
                  <p className="text-sm">
                    {new Date(selectedBooking.startTime).toLocaleDateString("es-MX", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  <Clock className="w-5 h-5 text-slate-500" />
                  <p className="text-sm">
                    {new Date(selectedBooking.startTime).toLocaleTimeString("es-MX", { hour: '2-digit', minute: '2-digit' })} - 
                    {new Date(selectedBooking.endTime).toLocaleTimeString("es-MX", { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {selectedBooking.notes && (
                  <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/5">
                    <p className="text-xs text-slate-400 font-medium mb-1">Notas del cliente:</p>
                    <p className="text-sm text-slate-300">{selectedBooking.notes}</p>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex gap-3 justify-end">
                {selectedBooking.status !== "CANCELLED" && (
                  <button 
                    onClick={() => handleStatusChange("CANCELLED")} 
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-bold"
                  >
                    <XCircle className="w-4 h-4" /> Cancelar
                  </button>
                )}
                {selectedBooking.status !== "CONFIRMED" && (
                  <button 
                    onClick={() => handleStatusChange("CONFIRMED")}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm font-bold"
                  >
                    <Check className="w-4 h-4" /> Confirmar
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .fc-theme-standard .fc-scrollgrid { border-color: rgba(255,255,255,0.1); }
        .fc-theme-standard th { border-color: rgba(255,255,255,0.1); padding: 8px 0; color: #94a3b8; font-weight: 600; }
        .fc-theme-standard td { border-color: rgba(255,255,255,0.1); }
        .fc .fc-timegrid-slot { border-color: rgba(255,255,255,0.05); }
        .fc .fc-button-primary { background-color: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: #e2e8f0; text-transform: capitalize; }
        .fc .fc-button-primary:not(:disabled):active, .fc .fc-button-primary:not(:disabled).fc-button-active { background-color: rgba(0,240,255,0.2); border-color: rgba(0,240,255,0.5); color: #00f0ff; }
        .fc .fc-toolbar-title { color: #f8fafc; font-size: 1.25rem; font-weight: 700; text-transform: capitalize; }
        .fc-event-main { padding: 2px 4px; font-size: 0.75rem; font-weight: 600; }
        .fc .fc-timegrid-now-indicator-line { border-color: #00f0ff; }
        .fc .fc-timegrid-now-indicator-arrow { border-color: #00f0ff; }
      `}</style>
    </div>
  );
}
