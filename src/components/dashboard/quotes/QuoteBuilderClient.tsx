"use client";

import { useState } from "react";
import { Plus, Trash2, Save, FileText, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createQuote } from "@/actions/quote";

export function QuoteBuilderClient({ people, tenantName, tenantSubdomain }: { people: any[], tenantName: string, tenantSubdomain: string }) {
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [template, setTemplate] = useState("MODERN");
  const [useCrm, setUseCrm] = useState(false);
  const [personId, setPersonId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");
  
  const [items, setItems] = useState([
    { id: Date.now().toString(), name: "", description: "", quantity: 1, unitPrice: 0, discount: 0 }
  ]);

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const discountTotal = items.reduce((sum, item) => sum + Number(item.discount), 0);
  const grandTotal = subtotal - discountTotal;

  const handleAddItem = () => {
    setItems([...items, { id: Date.now().toString(), name: "", description: "", quantity: 1, unitPrice: 0, discount: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id: string, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Prepare items for DB
    const finalItems = items.map(item => ({
      name: item.name,
      description: item.description,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      discount: Number(item.discount),
      total: (Number(item.quantity) * Number(item.unitPrice)) - Number(item.discount)
    }));

    const result = await createQuote({
      personId: useCrm && personId ? personId : undefined,
      customerName: !useCrm ? customerName : undefined,
      customerEmail: !useCrm ? customerEmail : undefined,
      notes,
      template,
      items: finalItems
    });

    if (result.success) {
      router.push(`/site/${tenantSubdomain}/dashboard/quotes`);
    } else {
      alert(result.error);
      setIsSubmitting(false);
    }
  };

  // Preview data gathering
  const selectedPerson = people.find(p => p.id === personId);
  const previewName = useCrm ? (selectedPerson ? `${selectedPerson.firstName} ${selectedPerson.lastName}` : "[Selecciona Cliente]") : (customerName || "[Nombre del Cliente]");
  const previewEmail = useCrm ? (selectedPerson?.email || "") : customerEmail;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      
      {/* BUILDER (Left) */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4 overflow-y-auto pr-2 pb-10">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Configurar Propuesta</h2>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20 text-white px-4 py-2 rounded-md text-sm font-semibold hover:from-cyan-400 hover:to-purple-500 hover:shadow-cyan-400/40 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Guardando..." : "Guardar Cotización"}
          </button>
        </div>

        {/* Client Selection */}
        <div className="glass-card border-white/5 p-5 rounded-lg border border-white/10 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-200">1. Información del Cliente</h3>
          
          <div className="flex items-center gap-4 mb-2">
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input type="radio" checked={!useCrm} onChange={() => setUseCrm(false)} className="text-white focus:ring-black" />
              Cliente Manual
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input type="radio" checked={useCrm} onChange={() => setUseCrm(true)} className="text-white focus:ring-black" />
              Seleccionar del CRM
            </label>
          </div>

          {useCrm ? (
            <div>
              <select 
                value={personId} 
                onChange={(e) => setPersonId(e.target.value)}
                className="w-full border border-white/10 rounded-md p-2 text-sm glass-card border-white/5"
              >
                <option value="">-- Selecciona un contacto --</option>
                {people.map(p => (
                  <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.email || 'Sin correo'})</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <input type="text" className="bg-slate-900/60 border-white/10 text-white placeholder-slate-500" placeholder="Nombre completo" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="border border-white/10 rounded-md p-2 text-sm" />
              <input type="email" placeholder="Correo electrónico" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="border border-white/10 rounded-md p-2 text-sm" />
            </div>
          )}
        </div>

        {/* Template & Notes */}
        <div className="glass-card border-white/5 p-5 rounded-lg border border-white/10 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-200">2. Diseño y Notas</h3>
          <div className="grid grid-cols-3 gap-3">
            {["MODERN", "CLASSIC", "MINIMALIST"].map(t => (
              <button 
                key={t}
                onClick={() => setTemplate(t)}
                className={`p-2 border rounded-md text-sm font-medium ${template === t ? 'border-black bg-white/5 text-white' : 'border-white/10 text-slate-400 hover:bg-white/5'}`}
              >
                {t === "MODERN" ? "Moderno" : t === "CLASSIC" ? "Clásico" : "Minimalista"}
              </button>
            ))}
          </div>
          <textarea className="bg-slate-900/60 border-white/10 text-white placeholder-slate-500" 
            placeholder="Notas, términos de pago, tiempo de entrega..." 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-white/10 rounded-md p-2 text-sm min-h-[100px]"
          />
        </div>

        {/* Items */}
        <div className="glass-card border-white/5 p-5 rounded-lg border border-white/10 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-slate-200">3. Productos o Servicios</h3>
            <button onClick={handleAddItem} className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">
              <Plus className="h-4 w-4" /> Agregar Ítem
            </button>
          </div>
          
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="p-4 border border-gray-100 bg-white/5 rounded-md relative group">
                {items.length > 1 && (
                  <button onClick={() => handleRemoveItem(item.id)} className="absolute top-2 right-2 text-slate-500 hover:text-red-600 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                
                <div className="grid grid-cols-12 gap-3 mt-2">
                  <div className="col-span-12 sm:col-span-6">
                    <label className="text-xs text-slate-400 mb-1 block">Concepto</label>
                    <input type="text" className="bg-slate-900/60 border-white/10 text-white placeholder-slate-500" value={item.name} onChange={(e) => handleItemChange(item.id, 'name', e.target.value)} placeholder="Ej. Diseño de Logotipo" className="w-full border border-white/10 rounded p-1.5 text-sm" />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <label className="text-xs text-slate-400 mb-1 block">Cant.</label>
                    <input type="number" className="bg-slate-900/60 border-white/10 text-white placeholder-slate-500" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)} className="w-full border border-white/10 rounded p-1.5 text-sm" />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <label className="text-xs text-slate-400 mb-1 block">Precio U.</label>
                    <input type="number" className="bg-slate-900/60 border-white/10 text-white placeholder-slate-500" value={item.unitPrice} onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)} className="w-full border border-white/10 rounded p-1.5 text-sm" />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <label className="text-xs text-slate-400 mb-1 block">Desc. ($)</label>
                    <input type="number" className="bg-slate-900/60 border-white/10 text-white placeholder-slate-500" value={item.discount} onChange={(e) => handleItemChange(item.id, 'discount', e.target.value)} className="w-full border border-white/10 rounded p-1.5 text-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4 mt-4 text-sm flex flex-col items-end gap-1 text-slate-400">
            <div className="flex justify-between w-48"><span>Subtotal:</span> <span>${subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between w-48 text-red-600"><span>Descuento:</span> <span>-${discountTotal.toLocaleString()}</span></div>
            <div className="flex justify-between w-48 font-bold text-white text-lg mt-2 pt-2 border-t border-white/10"><span>Total:</span> <span>${grandTotal.toLocaleString()}</span></div>
          </div>
        </div>
      </div>


      {/* LIVE PREVIEW (Right) */}
      <div className="w-full lg:w-1/2 bg-white/20 rounded-lg p-6 flex justify-center overflow-y-auto">
        <div className="w-full max-w-[210mm] min-h-[297mm] glass-card border-white/5 shadow-2xl p-10 print:shadow-none transition-all duration-300">
          
          {/* Header */}
          <div className={`flex justify-between items-start border-b-2 pb-6 mb-6 ${template === 'MODERN' ? 'border-black' : template === 'CLASSIC' ? 'border-white/10' : 'border-gray-100'}`}>
            <div>
              <h1 className={`font-bold text-3xl ${template === 'MINIMALIST' ? 'tracking-widest uppercase font-light text-slate-300' : 'text-white'}`}>
                {tenantName}
              </h1>
              <p className="text-slate-400 text-sm mt-1">Cotización Oficial</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-200">C-0000</p>
              <p className="text-xs text-slate-400 mt-1">Fecha: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Client Info */}
          <div className="mb-10">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Preparado para:</p>
            <p className="text-lg font-medium text-white">{previewName}</p>
            <p className="text-sm text-slate-400">{previewEmail}</p>
          </div>

          {/* Items Table */}
          <table className="w-full mb-8 text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-2 text-sm font-semibold text-slate-300">Concepto</th>
                <th className="py-2 text-sm font-semibold text-slate-300 text-right">Cant.</th>
                <th className="py-2 text-sm font-semibold text-slate-300 text-right">Precio</th>
                <th className="py-2 text-sm font-semibold text-slate-300 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => {
                const itemTotal = (Number(it.quantity) * Number(it.unitPrice)) - Number(it.discount);
                return (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-3 text-sm text-slate-200">
                      <div className="font-medium">{it.name || "Sin concepto"}</div>
                      {it.discount > 0 && <div className="text-xs text-red-500 mt-0.5">Incluye descuento: -${it.discount}</div>}
                    </td>
                    <td className="py-3 text-sm text-slate-400 text-right">{it.quantity}</td>
                    <td className="py-3 text-sm text-slate-400 text-right">${Number(it.unitPrice).toLocaleString()}</td>
                    <td className="py-3 text-sm font-medium text-white text-right">${itemTotal.toLocaleString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-10">
            <div className="w-1/2">
              <div className="flex justify-between py-1 text-sm text-slate-400">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              {discountTotal > 0 && (
                <div className="flex justify-between py-1 text-sm text-red-500">
                  <span>Descuento</span>
                  <span>-${discountTotal.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between py-2 text-base font-bold text-white border-t border-black mt-2">
                <span>Total</span>
                <span>${grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {notes && (
            <div className={`p-4 rounded-md ${template === 'MODERN' ? 'bg-white/5 border-l-4 border-black' : 'border border-white/10'}`}>
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Notas y Términos</h4>
              <p className="text-sm text-slate-400 whitespace-pre-wrap">{notes}</p>
            </div>
          )}

          {/* Footer Branding */}
          <div className="mt-16 text-center text-xs text-slate-500 border-t border-gray-100 pt-6">
            Generado por {tenantName} a través de la plataforma.
          </div>
        </div>
      </div>
    </div>
  );
}
