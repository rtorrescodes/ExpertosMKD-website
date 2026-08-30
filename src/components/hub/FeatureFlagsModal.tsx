"use client";

import { useState, useEffect } from "react";
import { updateTenantFeatures } from "@/actions/hub";
import { useRouter } from "next/navigation";

export function FeatureFlagsModal({
  isOpen,
  onClose,
  tenant,
}: {
  isOpen: boolean;
  onClose: () => void;
  tenant: { id: string; name: string; featureFlags: any } | null;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flags, setFlags] = useState({
    crm: false,
    ecommerce: false,
    quotes: false,
    appointments: false,
    projects: false,
  });

  useEffect(() => {
    if (tenant?.featureFlags) {
      setFlags({
        crm: !!tenant.featureFlags.crm,
        ecommerce: !!tenant.featureFlags.ecommerce,
        quotes: !!tenant.featureFlags.quotes,
        appointments: !!tenant.featureFlags.appointments,
        projects: !!tenant.featureFlags.projects,
      });
    }
  }, [tenant]);

  if (!isOpen || !tenant) return null;

  const handleToggle = (key: keyof typeof flags) => {
    setFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setError(null);

    const result = await updateTenantFeatures(tenant.id, flags);

    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
      onClose();
      router.refresh();
    }
  };

  const featuresList = [
    { key: "crm", label: "Módulo CRM", desc: "Gestión de oportunidades y pipelines." },
    { key: "ecommerce", label: "Tienda Virtual", desc: "Integración completa con Medusa." },
    { key: "quotes", label: "Cotizador Automático", desc: "Creación y envío de presupuestos." },
    { key: "appointments", label: "Control de Citas", desc: "Agenda y reservas públicas." },
    { key: "projects", label: "Control de Proyectos", desc: "Kanban y seguimiento de progreso." },
  ];

  return (
    <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
            
            <div>
              <div className="mt-3 text-center sm:mt-5">
                <h3 className="text-lg font-semibold leading-6 text-gray-900" id="modal-title">
                  Gestionar Módulos ({tenant.name})
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Habilita o deshabilita features para este inquilino de manera inmediata.
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-6 space-y-4">
              {featuresList.map((f) => {
                const isActive = flags[f.key as keyof typeof flags];
                return (
                  <div key={f.key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{f.label}</p>
                      <p className="text-xs text-gray-500">{f.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle(f.key as keyof typeof flags)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                        isActive ? "bg-black" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isActive ? "translate-x-5" : "translate-x-0"
                        }`}
                      ></span>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSubmitting}
                className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:col-start-2 disabled:opacity-50"
              >
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
              >
                Cancelar
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
