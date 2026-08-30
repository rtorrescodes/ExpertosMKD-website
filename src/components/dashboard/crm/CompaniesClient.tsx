"use client";

import { useState } from "react";
import { createCompany } from "@/actions/crm";
import { Plus, Building2, Globe, Link, DollarSign, MapPin } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export function CompaniesClient({ companies }: { companies: any[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createCompany({
      name: formData.get("name") as string,
      domain: formData.get("domain") as string,
      linkedin: formData.get("linkedin") as string,
      annualRevenue: formData.get("annualRevenue") ? Number(formData.get("annualRevenue")) : undefined,
      address: formData.get("address") as string,
    });

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
          <h1 className="text-base font-semibold leading-6 text-gray-900">Empresas (Cuentas)</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gestiona todas las empresas u organizaciones con las que haces negocios.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => setIsModalOpen(true)}
            type="button"
            className="flex items-center gap-2 rounded-md bg-black px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
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
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Nombre de la Empresa
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Dominio
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Ingresos Anuales
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Creado en
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {companies.map((company) => (
                    <tr key={company.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-400">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div className="ml-4 font-medium text-gray-900">{company.name}</div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {company.domain ? (
                          <a href={`https://${company.domain}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                            {company.domain}
                          </a>
                        ) : "-"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {company.annualRevenue ? `$${company.annualRevenue.toLocaleString()}` : "-"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {format(new Date(company.createdAt), "MMM d, yyyy")}
                      </td>
                    </tr>
                  ))}
                  {companies.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-sm text-gray-500">
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <h3 className="text-lg font-semibold leading-6 text-gray-900">Crear Empresa</h3>
                  {error && <p className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
                  <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nombre</label>
                      <input required type="text" name="name" className="mt-1 block w-full rounded-md border p-2 text-sm border-gray-300" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Dominio web</label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Globe className="h-4 w-4 text-gray-400" />
                        </div>
                        <input type="text" name="domain" placeholder="agencia.com" className="block w-full rounded-md border p-2 pl-10 text-sm border-gray-300" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Link className="h-4 w-4 text-gray-400" />
                        </div>
                        <input type="url" name="linkedin" className="block w-full rounded-md border p-2 pl-10 text-sm border-gray-300" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ingresos Anuales (USD)</label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                        </div>
                        <input type="number" name="annualRevenue" className="block w-full rounded-md border p-2 pl-10 text-sm border-gray-300" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Dirección</label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <MapPin className="h-4 w-4 text-gray-400" />
                        </div>
                        <input type="text" name="address" className="block w-full rounded-md border p-2 pl-10 text-sm border-gray-300" />
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                      <button disabled={isSubmitting} type="submit" className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 sm:col-start-2 disabled:opacity-50">
                        {isSubmitting ? "Guardando..." : "Guardar"}
                      </button>
                      <button onClick={() => setIsModalOpen(false)} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0">
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
