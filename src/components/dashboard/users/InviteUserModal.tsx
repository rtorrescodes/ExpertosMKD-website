"use client";

import { useState } from "react";
import { inviteUser } from "@/actions/tenant-users";
import { useRouter } from "next/navigation";

export function InviteUserModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await inviteUser(formData);

    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
      onClose();
      router.refresh(); // Refrescar la tabla
    }
  };

  return (
    <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-white/50 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          
          <div className="relative transform overflow-hidden rounded-lg glass-card border-white/5 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div>
              <div className="mt-3 text-center sm:mt-5">
                <h3 className="text-base font-semibold leading-6 text-white" id="modal-title">
                  Invitar Nuevo Usuario
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-slate-400">
                    Se enviará un correo con un enlace único para que el usuario establezca su contraseña.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="mt-1 block w-full rounded-md border-white/10 shadow-sm focus:border-cyan-400 focus:ring-cyan-400 focus:ring-black sm:text-sm p-2 border"
                  placeholder="ejemplo@agencia.com"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-300">
                  Rol
                </label>
                <select
                  id="role"
                  name="role"
                  className="mt-1 block w-full rounded-md border-white/10 shadow-sm focus:border-cyan-400 focus:ring-cyan-400 focus:ring-black sm:text-sm p-2 border glass-card border-white/5"
                >
                  <option value="MEMBER">Miembro (Lectura/Escritura limitada)</option>
                  <option value="ADMIN">Administrador (Control total)</option>
                </select>
              </div>

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full justify-center rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:from-cyan-400 hover:to-purple-500 hover:shadow-cyan-400/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:col-start-2 disabled:opacity-50"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Invitación"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 inline-flex w-full justify-center rounded-md glass-card border-white/5 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/10 hover:bg-white/5 sm:col-start-1 sm:mt-0"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
