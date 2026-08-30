"use client";

import { useState } from "react";
import { X, Calendar as CalendarIcon, User, Clock, Check, XCircle, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { updateBookingStatus, createManualBooking } from "@/actions/appointments";
import { useRouter } from "next/navigation";

export function AppointmentsClient({ bookings, eventTypes, tenantSubdomain }: { bookings: any[], eventTypes: any[], tenantSubdomain: string }) {
  const router = useRouter();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  
  // Create Modal State
  const [isCreating, setIsCreating] = useState(false);
  const [createDate, setCreateDate] = useState("");
  const [createTime, setCreateTime] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [localBookings, setLocalBookings] = useState(bookings);

  // Generate week days
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Monday
  
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });

  const nextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };
  const prevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const getBookingStyle = (booking: any) => {
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);
    
    // Grid starts at 7:00 AM
    const startHour = start.getHours() - 7;
    const startMinutes = start.getMinutes();
    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);

    // Each hour is 4 rows in our 56-row grid (15 min per row)
    // Actually the grid is 14 hours * 4 rows = 56 rows.
    const startRow = (startHour * 4) + Math.floor(startMinutes / 15) + 1;
    const spanRows = Math.max(1, Math.ceil(durationMinutes / 15));

    let colorClass = "bg-blue-500/20 border-blue-500 text-blue-100"; // Default
    if (booking.status === "CONFIRMED") colorClass = "bg-emerald-500/20 border-emerald-500 text-emerald-100";
    if (booking.status === "CANCELLED") colorClass = "bg-slate-500/20 border-slate-500 text-slate-300 opacity-50";

    return {
      gridRow: `${startRow} / span ${spanRows}`,
    };
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedBooking) return;
    setLoading(true);
    const res = await updateBookingStatus(selectedBooking.id, newStatus);
    if (res.success) {
      setLocalBookings(prev => prev.map(b => b.id === selectedBooking.id ? { ...b, status: newStatus } : b));
      setSelectedBooking(null);
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const eventTypeId = formData.get("eventTypeId") as string;
    const eventType = eventTypes.find((et: any) => et.id === eventTypeId);
    
    const dateStr = formData.get("date") as string;
    const timeStr = formData.get("time") as string; // HH:mm
    
    const startDateTime = new Date(`${dateStr}T${timeStr}:00`);
    const endDateTime = new Date(startDateTime.getTime() + (eventType?.durationMinutes || 30) * 60000);

    const res = await createManualBooking({
      eventTypeId,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      customerName: formData.get("customerName") as string,
      customerEmail: formData.get("customerEmail") as string,
      customerPhone: formData.get("customerPhone") as string,
    });

    if (res.success) {
      setIsCreating(false);
      router.refresh();
      // Or manually add to localBookings to avoid waiting for refresh
      window.location.reload();
    } else {
      alert(res.error);
      setLoading(false);
    }
  };

  const handleGridClick = (day: Date, hour: number) => {
    // Open modal pre-filled with this day and hour
    const year = day.getFullYear();
    const month = String(day.getMonth() + 1).padStart(2, '0');
    const date = String(day.getDate()).padStart(2, '0');
    const hh = String(hour).padStart(2, '0');
    
    setCreateDate(`${year}-${month}-${date}`);
    setCreateTime(`${hh}:00`);
    setIsCreating(true);
  };

  return (
    <div className="flex flex-col h-[800px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white capitalize flex items-center gap-2">
          {startOfWeek.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => {
              setCreateDate("");
              setCreateTime("");
              setIsCreating(true);
            }} 
            className="flex items-center gap-2 rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20 px-3 py-1.5 text-sm font-semibold text-white hover:from-cyan-400 hover:to-purple-500 transition-all"
          >
            <Plus className="w-4 h-4" />
            Nueva Cita
          </button>
          
          <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
            <button onClick={prevWeek} className="p-1 hover:bg-white/10 rounded text-slate-400"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 hover:bg-white/10 rounded text-slate-300 text-sm font-medium">Hoy</button>
            <button onClick={nextWeek} className="p-1 hover:bg-white/10 rounded text-slate-400"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      {/* Custom Weekly Grid */}
      <div className="flex-1 overflow-y-auto glass-card rounded-lg border border-white/5 flex flex-col">
        <div className="grid grid-cols-8 border-b border-white/10 sticky top-0 bg-[#0a1526] z-20">
          <div className="p-3 text-center border-r border-white/10">
            <span className="text-xs font-semibold text-slate-500 uppercase">Hora</span>
          </div>
          {weekDays.map((day, i) => (
            <div key={i} className={`p-3 text-center border-r border-white/10 ${day.toDateString() === new Date().toDateString() ? 'bg-cyan-500/10' : ''}`}>
              <div className="text-xs font-semibold text-slate-400 uppercase">{day.toLocaleDateString('es-MX', { weekday: 'short' })}</div>
              <div className={`text-lg font-bold mt-1 ${day.toDateString() === new Date().toDateString() ? 'text-cyan-400' : 'text-slate-300'}`}>
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto relative bg-[#051424]">
          <div className="grid grid-cols-8 min-h-[800px]">
            
            {/* Time labels column */}
            <div className="border-r border-white/10 flex flex-col relative z-10 bg-[#0a1526]">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="h-16 border-b border-white/5 flex justify-center py-2">
                  <span className="text-xs text-slate-500 font-medium">{i + 7}:00</span>
                </div>
              ))}
            </div>

            {/* Days columns */}
            {weekDays.map((day, dayIndex) => {
              const dayBookings = localBookings.filter(b => {
                const bDate = new Date(b.startTime);
                return bDate.getDate() === day.getDate() && bDate.getMonth() === day.getMonth() && bDate.getFullYear() === day.getFullYear();
              });

              return (
                <div key={dayIndex} className="border-r border-white/10 relative">
                  {/* Grid lines (Clickable to create manual booking) */}
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleGridClick(day, i + 7)}
                      className="h-16 border-b border-white/5 cursor-crosshair hover:bg-white/5 transition-colors" 
                    />
                  ))}

                  {/* Booking Events */}
                  <div className="absolute top-0 left-0 right-0 bottom-0 grid grid-rows-[repeat(56,minmax(0,1fr))] p-1 pointer-events-none">
                    {dayBookings.map((booking) => {
                       let colorClass = "bg-blue-500/20 border-blue-500 text-blue-100"; // Default
                       if (booking.status === "CONFIRMED") colorClass = "bg-emerald-500/20 border-emerald-500 text-emerald-100";
                       if (booking.status === "CANCELLED") colorClass = "bg-slate-500/20 border-slate-500 text-slate-300 opacity-50";
                       
                       return (
                        <div 
                          key={booking.id}
                          onClick={() => setSelectedBooking(booking)}
                          className={`rounded-md border border-l-4 p-1 overflow-hidden cursor-pointer hover:brightness-125 transition-all shadow-md pointer-events-auto ${colorClass}`}
                          style={getBookingStyle(booking)}
                        >
                          <div className="text-[10px] font-bold truncate">{booking.eventType.title}</div>
                          <div className="text-[9px] opacity-80 truncate">{booking.customerName}</div>
                        </div>
                       );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Manual Creation Modal */}
      {isCreating && (
        <div className="relative z-50">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCreating(false)} />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="mx-auto max-w-md w-full bg-[#0a1526] rounded-xl shadow-2xl border border-white/10 overflow-hidden flex flex-col">
              
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <h2 className="text-lg font-semibold text-white">Agendar Nueva Cita</h2>
                <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Servicio</label>
                  <select required name="eventTypeId" className="block w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:outline-none focus:border-cyan-500">
                    <option value="">Selecciona un servicio...</option>
                    {eventTypes.map(et => (
                      <option key={et.id} value={et.id}>{et.title} ({et.durationMinutes} min)</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Fecha</label>
                    <input required type="date" name="date" defaultValue={createDate} className="block w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:outline-none focus:border-cyan-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Hora (Ej. 10:45 AM)</label>
                    {/* step 300 allows 5-minute increments */}
                    <input required type="time" name="time" step="300" defaultValue={createTime} className="block w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:outline-none focus:border-cyan-500 [color-scheme:dark]" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Nombre del Cliente</label>
                  <input required type="text" name="customerName" className="block w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:outline-none focus:border-cyan-500" placeholder="Ej. Juan Pérez" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Correo Electrónico</label>
                  <input required type="email" name="customerEmail" className="block w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:outline-none focus:border-cyan-500" placeholder="juan@ejemplo.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Teléfono (Opcional)</label>
                  <input type="text" name="customerPhone" className="block w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:outline-none focus:border-cyan-500" placeholder="Ej. 555-1234" />
                </div>

                <div className="mt-6">
                  <button disabled={loading} type="submit" className="w-full flex justify-center items-center gap-2 rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20 px-4 py-2 text-sm font-semibold text-white hover:from-cyan-400 hover:to-purple-500 transition-all disabled:opacity-50">
                    {loading ? "Guardando..." : "Confirmar Cita"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}
