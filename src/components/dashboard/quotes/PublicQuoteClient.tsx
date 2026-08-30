"use client";

import { useState } from "react";
import { CheckCircle, Download, CreditCard } from "lucide-react";
import { acceptQuote } from "@/actions/quote";
import { useRouter } from "next/navigation";

export function PublicQuoteClient({ quote }: { quote: any }) {
  const router = useRouter();
  const [isAccepting, setIsAccepting] = useState(false);
  
  const customerName = quote.person ? `${quote.person.firstName} ${quote.person.lastName}` : quote.customerName;
  const customerEmail = quote.person ? quote.person.email : quote.customerEmail;
  const isAccepted = quote.status === "ACCEPTED" || quote.status === "PAID";

  const handleAccept = async () => {
    setIsAccepting(true);
    const result = await acceptQuote(quote.publicToken);
    
    if (result.success) {
      router.refresh(); // Status should update to ACCEPTED
    } else {
      alert(result.error);
      setIsAccepting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8 flex justify-center">
      
      {/* Mobile/Floating Action Bar */}
      {!isAccepted && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex justify-between items-center z-50 print:hidden md:hidden">
          <div>
            <p className="text-xs text-gray-500">Total a pagar</p>
            <p className="text-lg font-bold text-gray-900">${Number(quote.grandTotal).toLocaleString()}</p>
          </div>
          <button 
            onClick={handleAccept}
            disabled={isAccepting}
            className="bg-black text-white px-6 py-3 rounded-full font-semibold text-sm shadow-md active:scale-95 transition-transform"
          >
            {isAccepting ? "Procesando..." : "Aceptar Propuesta"}
          </button>
        </div>
      )}

      {/* Main Quote Container */}
      <div className="w-full max-w-4xl pb-24 md:pb-0">
        
        {/* Desktop Header Actions */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            Estado: 
            {isAccepted ? (
              <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md font-semibold">
                <CheckCircle className="h-4 w-4" /> Aceptada
              </span>
            ) : (
              <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-md font-semibold">Pendiente</span>
            )}
          </div>
          
          <div className="flex gap-3 hidden md:flex">
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 shadow-sm transition-colors">
              <Download className="h-4 w-4" /> Descargar PDF
            </button>
            {!isAccepted && (
              <button 
                onClick={handleAccept}
                disabled={isAccepting}
                className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-md text-sm font-semibold hover:bg-gray-800 shadow-sm transition-colors disabled:opacity-50"
              >
                {isAccepting ? "Procesando..." : "Aceptar Propuesta"}
              </button>
            )}
            {isAccepted && (
              <button className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md text-sm font-semibold hover:bg-green-700 shadow-sm transition-colors">
                <CreditCard className="h-4 w-4" /> Proceder al Pago
              </button>
            )}
          </div>
        </div>

        {/* Paper Document */}
        <div className="bg-white shadow-xl rounded-lg p-8 sm:p-12 print:shadow-none print:p-0">
          
          {/* Header */}
          <div className={`flex justify-between items-start border-b-2 pb-6 mb-8 ${quote.template === 'MODERN' ? 'border-black' : quote.template === 'CLASSIC' ? 'border-gray-300' : 'border-gray-100'}`}>
            <div>
              <h1 className={`font-bold text-4xl ${quote.template === 'MINIMALIST' ? 'tracking-widest uppercase font-light text-gray-700' : 'text-gray-900'}`}>
                {quote.tenant.name}
              </h1>
              <p className="text-gray-500 text-sm mt-1">Cotización Oficial</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">Folio: #{String(quote.quoteNumber).padStart(4, '0')}</p>
              <p className="text-xs text-gray-500 mt-1">Emitida: {new Date(quote.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Client Info */}
          <div className="mb-12">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Preparado para:</p>
            <p className="text-xl font-medium text-gray-900">{customerName}</p>
            <p className="text-sm text-gray-500">{customerEmail}</p>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full mb-10 text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 text-sm font-semibold text-gray-700 w-1/2">Concepto</th>
                  <th className="py-3 text-sm font-semibold text-gray-700 text-center w-16">Cant.</th>
                  <th className="py-3 text-sm font-semibold text-gray-700 text-right w-32">Precio U.</th>
                  <th className="py-3 text-sm font-semibold text-gray-700 text-right w-32">Total</th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((it: any) => {
                  return (
                    <tr key={it.id} className="border-b border-gray-100">
                      <td className="py-4 text-sm text-gray-800 pr-4">
                        <div className="font-medium">{it.name}</div>
                        {it.description && <div className="text-xs text-gray-500 mt-1">{it.description}</div>}
                        {Number(it.discount) > 0 && <div className="text-xs text-red-500 mt-1">Incluye descuento: -${Number(it.discount).toLocaleString()}</div>}
                      </td>
                      <td className="py-4 text-sm text-gray-600 text-center">{it.quantity}</td>
                      <td className="py-4 text-sm text-gray-600 text-right">${Number(it.unitPrice).toLocaleString()}</td>
                      <td className="py-4 text-sm font-semibold text-gray-900 text-right">${Number(it.total).toLocaleString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-12">
            <div className="w-full sm:w-1/2 md:w-1/3">
              <div className="flex justify-between py-2 text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${Number(quote.subtotal).toLocaleString()}</span>
              </div>
              {Number(quote.discountTotal) > 0 && (
                <div className="flex justify-between py-2 text-sm text-red-500">
                  <span>Descuento Aplicado</span>
                  <span>-${Number(quote.discountTotal).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between py-3 text-lg font-bold text-gray-900 border-t-2 border-black mt-2">
                <span>Total</span>
                <span>${Number(quote.grandTotal).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {quote.notes && (
            <div className={`p-5 rounded-md ${quote.template === 'MODERN' ? 'bg-gray-50 border-l-4 border-black' : 'border border-gray-200'}`}>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Notas y Términos</h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{quote.notes}</p>
            </div>
          )}

          {/* Footer Branding */}
          <div className="mt-20 text-center text-xs text-gray-400 border-t border-gray-100 pt-8 pb-4">
            Documento generado a través de <strong>Celeritas</strong> SaaS.
          </div>
        </div>
      </div>
    </div>
  );
}
