"use client";

import { useState } from "react";
import { createCompany, updateCompany, deleteCompany } from "@/actions/crm";
import { format } from "date-fns";
import { Building2, Globe, Link, DollarSign, MapPin, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function CompaniesClient({ companies }: { companies: any[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    let result;
    if (editingCompany) {
      result = await updateCompany(editingCompany.id, {
        name: formData.get("name") as string,
        domain: formData.get("domain") as string,
        linkedin: formData.get("linkedin") as string,
        annualRevenue: Number(formData.get("annualRevenue")) || undefined,
        address: formData.get("address") as string,
      });
    } else {
      result = await createCompany({
        name: formData.get("name") as string,
        domain: formData.get("domain") as string,
        linkedin: formData.get("linkedin") as string,
        annualRevenue: Number(formData.get("annualRevenue")) || undefined,
        address: formData.get("address") as string,
      });
    }

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
      setIsModalOpen(false);
      router.refresh();
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-white">Empresas (Cuentas)</h1>
          <p className="mt-2 text-sm text-slate-300">
            Gestiona todas las empresas u organizaciones con las que haces negocios.
          </p>
        </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={() => { setEditingCompany(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20 px-3 py-2 text-center text-sm font-semibold text-white hover:from-cyan-400 hover:to-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 transition-all"
            >
            <Plus className="h-4 w-4" />
            Nueva Empresa
          </button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-white/5">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">
                      Nombre de la Empresa
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Dominio
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Ingresos Anuales
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Creado en
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 glass-card border-white/5">
                  {companies.map((company) => (
                    <tr key={company.id} className="hover:bg-white/5 cursor-pointer" onClick={() => { setEditingCompany(company); setIsModalOpen(true); }}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-md border border-white/10 glass-card border-white/5 text-slate-500">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div className="ml-4 font-medium text-white">{company.name}</div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-400">
                        {company.domain ? (
                          <a href={`https://${company.domain}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                            {company.domain}
                          </a>
                        ) : "-"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-400">
                        {company.annualRevenue ? `$${company.annualRevenue.toLocaleString()}` : "-"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-400">
                        {format(new Date(company.createdAt), "MMM d, yyyy")}
                      </td>
                    </tr>
                  ))}
                  {companies.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-sm text-slate-400">
                        Aún no tienes empresas registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="relative z-50">
          <div className="fixed inset-0 bg-white/50 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg glass-card border-white/5 px-4 pb-4 pt-5 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold leading-6 text-white">{editingCompany ? "Editar Empresa" : "Crear Empresa"}</h3>
                    {editingCompany && (
                      <button 
                        type="button" 
                        onClick={async () => {
                          if (confirm('¿Eliminar empresa?')) {
                            await deleteCompany(editingCompany.id);
                            setIsModalOpen(false);
                          }
                        }} 
                        className="text-red-400 hover:text-red-300 transition-colors p-1"
                        title="Eliminar Empresa"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  {error && <p className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
                  <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300">Nombre</label>
                      <input required type="text" name="name" defaultValue={editingCompany?.name} className="mt-1 block w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:outline-none focus:border-cyan-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300">Dominio web</label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Globe className="h-4 w-4 text-slate-500" />
                        </div>
                        <input type="text" defaultValue={editingCompany?.domain} className="bg-slate-900/60 border-white/10 text-white placeholder-slate-500 block w-full rounded-md border p-2 pl-10 text-sm focus:outline-none focus:border-cyan-500" name="domain" placeholder="agencia.com" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300">LinkedIn URL</label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Link className="h-4 w-4 text-slate-500" />
                        </div>
                        <input type="url" name="linkedin" defaultValue={editingCompany?.linkedin} className="bg-slate-900/60 border-white/10 text-white placeholder-slate-500 block w-full rounded-md border p-2 pl-10 text-sm focus:outline-none focus:border-cyan-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300">Ingresos Anuales (USD)</label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <DollarSign className="h-4 w-4 text-slate-500" />
                        </div>
                        <input type="number" defaultValue={editingCompany?.annualRevenue} className="bg-slate-900/60 border-white/10 text-white placeholder-slate-500 block w-full rounded-md border p-2 pl-10 text-sm focus:outline-none focus:border-cyan-500" name="annualRevenue" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300">Dirección</label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <MapPin className="h-4 w-4 text-slate-500" />
                        </div>
                        <input type="text" defaultValue={editingCompany?.address} className="bg-slate-900/60 border-white/10 text-white placeholder-slate-500 block w-full rounded-md border p-2 pl-10 text-sm focus:outline-none focus:border-cyan-500" name="address" />
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                      <button disabled={isSubmitting} type="submit" className="inline-flex w-full justify-center rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:from-cyan-400 hover:to-purple-500 hover:shadow-cyan-400/40 sm:col-start-2 disabled:opacity-50">
                        {isSubmitting ? "Guardando..." : "Guardar"}
                      </button>
                      <button onClick={() => setIsModalOpen(false)} type="button" className="mt-3 inline-flex w-full justify-center rounded-md glass-card border-white/5 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/10 hover:bg-white/5 sm:col-start-1 sm:mt-0">
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
