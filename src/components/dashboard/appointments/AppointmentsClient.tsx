"use client";

import { useState } from "react";
import { X, Calendar as CalendarIcon, User, Clock, Check, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { updateBookingStatus } from "@/actions/appointments";

export function AppointmentsClient({ bookings, tenantSubdomain }: { bookings: any[], tenantSubdomain: string }) {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Update local state to reflect status changes without refreshing
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

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedBooking) return;
    setLoading(true);
    const res = await updateBookingStatus(selectedBooking.id, newStatus);
    if (res.success) {
      setLocalBookings(localBookings.map(b => 
        b.id === selectedBooking.id ? { ...b, status: newStatus } : b
      ));
      setSelectedBooking((prev: any) => ({ ...prev, status: newStatus }));
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  // Helper to place booking in the grid
  const getBookingStyle = (booking: any) => {
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);
    
    // Grid starts at 7 AM (hour 7)
    const startHour = start.getHours() + (start.getMinutes() / 60);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // hours
    
    // Map to grid rows (each row is 1 hour, starting at 7 AM = row 1)
    const topRow = (startHour - 7) + 1;
    
    return {
      gridRow: `${Math.max(1, Math.floor(topRow * 4))} / span ${Math.ceil(duration * 4)}`, // 4 rows per hour (15min slots)
      backgroundColor: booking.status === "CONFIRMED" ? "rgba(16, 185, 129, 0.2)" : 
                       booking.status === "CANCELLED" ? "rgba(239, 68, 68, 0.2)" : 
                       "rgba(245, 158, 11, 0.2)",
      borderColor: booking.status === "CONFIRMED" ? "rgba(16, 185, 129, 0.5)" : 
                   booking.status === "CANCELLED" ? "rgba(239, 68, 68, 0.5)" : 
                   "rgba(245, 158, 11, 0.5)",
      color: booking.status === "CONFIRMED" ? "#10b981" : 
             booking.status === "CANCELLED" ? "#ef4444" : 
             "#f59e0b",
    };
  };

  return (
    <div className="bg-[#0a1526] p-6 rounded-xl border border-white/5 shadow-2xl flex flex-col h-[80vh]">
      
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-white capitalize">
            {currentDate.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex bg-[#051424] rounded-lg border border-white/10 p-1">
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
              // Filter bookings for this day
              const dayBookings = localBookings.filter(b => {
                const bDate = new Date(b.startTime);
                return bDate.getDate() === day.getDate() && bDate.getMonth() === day.getMonth() && bDate.getFullYear() === day.getFullYear();
              });

              return (
                <div key={dayIndex} className="border-r border-white/10 relative">
                  {/* Grid lines */}
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div key={i} className="h-16 border-b border-white/5 pointer-events-none" />
                  ))}

                  {/* Booking Events */}
                  <div className="absolute top-0 left-0 right-0 bottom-0 grid grid-rows-[repeat(56,minmax(0,1fr))] p-1 pointer-events-none">
                    {dayBookings.map((booking) => (
                      <div 
                        key={booking.id}
                        onClick={() => setSelectedBooking(booking)}
                        className="rounded-md border border-l-4 p-1 overflow-hidden cursor-pointer hover:brightness-125 transition-all shadow-md pointer-events-auto"
                        style={getBookingStyle(booking)}
                      >
                        <div className="text-[10px] font-bold truncate">{booking.eventType.title}</div>
                        <div className="text-[9px] opacity-80 truncate">{booking.customerName}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
    </div>
  );
}
