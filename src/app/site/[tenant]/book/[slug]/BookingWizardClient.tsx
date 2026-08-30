"use client";

import { useState, useEffect } from "react";
import { getAvailableSlots, createBooking } from "@/actions/appointments";
import { ChevronRight, ArrowLeft, CheckCircle } from "lucide-react";
// Usaremos un input simple tipo "date" para MVP en lugar de una librería pesada.
// Para un look más "cal.com", deberíamos usar react-day-picker, pero un grid de días nativo es suficiente aquí.

export function BookingWizardClient({ tenantSubdomain, eventSlug }: { tenantSubdomain: string, eventSlug: string }) {
  const [step, setStep] = useState(1); // 1 = Date, 2 = Time, 3 = Form, 4 = Success
  
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  
  const [selectedTime, setSelectedTime] = useState<string>("");
  
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleDateSelect = async (e: any) => {
    const date = e.target.value;
    setSelectedDate(date);
    if (!date) return;
    
    setIsLoadingSlots(true);
    const result = await getAvailableSlots(tenantSubdomain, eventSlug, date);
    setIsLoadingSlots(false);
    
    if (result.success) {
      setAvailableSlots(result.slots);
      setStep(2);
    } else {
      setAvailableSlots([]);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const res = await createBooking({
      tenantSubdomain,
      eventSlug,
      dateString: selectedDate,
      timeString: selectedTime,
      customerName,
      customerEmail,
      customerPhone,
      notes
    });

    setIsSubmitting(false);

    if (res.success) {
      setStep(4);
    } else {
      setErrorMsg(res.error);
    }
  };

  if (step === 4) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4 fade-in">
        <CheckCircle className="w-16 h-16 text-green-500" />
        <h2 className="text-2xl font-bold text-gray-900">¡Cita Confirmada!</h2>
        <p className="text-gray-600">
          Tu cita ha sido agendada para el <strong>{selectedDate}</strong> a las <strong>{selectedTime}</strong>.<br />
          Te hemos enviado los detalles a tu correo electrónico.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header Steps */}
      <div className="flex items-center text-sm font-medium text-gray-500 mb-8 border-b pb-4">
        <button onClick={() => setStep(1)} className={`${step >= 1 ? 'text-black' : ''}`}>Fecha</button>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className={`${step >= 2 ? 'text-black' : ''}`}>Hora</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className={`${step >= 3 ? 'text-black' : ''}`}>Datos</span>
      </div>

      <div className="flex-1">
        {step === 1 && (
          <div className="space-y-6 fade-in">
            <h3 className="text-lg font-semibold text-gray-900">Selecciona una fecha</h3>
            <div className="max-w-xs">
              <input 
                type="date" 
                min={new Date().toISOString().split("T")[0]}
                value={selectedDate}
                onChange={handleDateSelect}
                className="w-full border-gray-300 rounded-md p-3 text-lg focus:ring-black focus:border-black shadow-sm"
              />
            </div>
            {isLoadingSlots && <p className="text-sm text-gray-500 animate-pulse">Buscando horarios...</p>}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 fade-in">
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setStep(1)} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft className="w-4 h-4" /></button>
              <h3 className="text-lg font-semibold text-gray-900">Horarios para {selectedDate}</h3>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-2">
              {availableSlots.length > 0 ? availableSlots.map(time => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className="py-3 border border-gray-200 rounded-md text-sm font-medium hover:border-black hover:bg-black hover:text-white transition-colors"
                >
                  {time}
                </button>
              )) : (
                <p className="col-span-4 text-gray-500 text-sm">No hay horarios disponibles para esta fecha.</p>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 fade-in">
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setStep(2)} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft className="w-4 h-4" /></button>
              <h3 className="text-lg font-semibold text-gray-900">Tus datos</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
                <input required type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 p-2 border shadow-sm focus:border-black focus:ring-black sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                <input required type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 p-2 border shadow-sm focus:border-black focus:ring-black sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono (Opcional)</label>
                <input type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 p-2 border shadow-sm focus:border-black focus:ring-black sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notas Adicionales</label>
                <textarea rows={2} placeholder="¿Hay algo que debamos saber?" value={notes} onChange={e => setNotes(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 p-2 border shadow-sm focus:border-black focus:ring-black sm:text-sm"></textarea>
              </div>
              
              {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-black text-white rounded-md py-3 font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors mt-4"
              >
                {isSubmitting ? "Confirmando..." : "Confirmar Cita"}
              </button>
            </form>
          </div>
        )}
      </div>
      <style>{`.fade-in { animation: fadeIn 0.3s ease-in-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
