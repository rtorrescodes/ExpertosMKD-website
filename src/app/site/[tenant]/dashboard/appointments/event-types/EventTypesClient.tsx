"use client";

import { useState } from "react";
import { Plus, Clock, ExternalLink } from "lucide-react";
import { createEventType } from "@/actions/appointments";
import { useRouter } from "next/navigation";

export function EventTypesClient({ tenantSubdomain, eventTypes }: { tenantSubdomain: string, eventTypes: any[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [price, setPrice] = useState(0);

  const handleCreate = async () => {
    const res = await createEventType({ title, description, durationMinutes: Number(duration), price: Number(price) });
    if (res.success) {
      setIsModalOpen(false);
      setTitle("");
      setDescription("");
      setDuration(30);
      setPrice(0);
      router.refresh();
    } else {
      alert(res.error);
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Servicios (Event Types)</h1>
          <p className="mt-2 text-sm text-gray-700">
            Define los servicios que ofreces y su duración para que los clientes agenden.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" />
            Nuevo Servicio
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {eventTypes.map((et) => (
          <div key={et.id} className="relative flex flex-col justify-between rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{et.title}</h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{et.description || "Sin descripción"}</p>
              
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-700 font-semibold">
                <Clock className="h-4 w-4 text-gray-400" />
                {et.durationMinutes} min
              </div>
            </div>
            
            <div className="mt-6 flex justify-between items-center border-t border-gray-100 pt-4">
              <a 
                href={`/site/${tenantSubdomain}/book/${et.slug}`} 
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center gap-1"
              >
                Ver Página Pública <ExternalLink className="h-3 w-3" />
              </a>
              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                Activo
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Creación Simple */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold mb-4">Crear Nuevo Servicio</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nombre del Servicio</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full border rounded-md p-2 text-sm" placeholder="Ej. Corte de Cabello" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Duración (minutos)</label>
                <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="mt-1 w-full border rounded-md p-2 text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Precio (Opcional)</label>
                <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-1 w-full border rounded-md p-2 text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Descripción</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full border rounded-md p-2 text-sm" rows={3}></textarea>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">Cancelar</button>
              <button onClick={handleCreate} className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md">Crear</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
