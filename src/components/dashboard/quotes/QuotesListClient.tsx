"use client";

import { Plus, FileText, ExternalLink, Download } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function QuotesListClient({ tenantSubdomain, quotes }: { tenantSubdomain: string; quotes: any[] }) {
  const router = useRouter();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT": return <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">Borrador</span>;
      case "SENT": return <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Enviada</span>;
      case "ACCEPTED": return <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Aceptada</span>;
      case "DECLINED": return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">Rechazada</span>;
      default: return <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">{status}</span>;
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Cotizaciones</h1>
          <p className="mt-2 text-sm text-gray-700">
            Historial de propuestas enviadas y su estado de conversión.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href={`/site/${tenantSubdomain}/dashboard/quotes/new`}
            className="flex items-center gap-2 rounded-md bg-black px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" />
            Nueva Cotización
          </Link>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Folio</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cliente</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fecha</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {quotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          #{String(quote.quoteNumber).padStart(4, '0')}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {quote.person ? (
                          <div className="font-medium text-gray-900">{quote.person.firstName} {quote.person.lastName}</div>
                        ) : (
                          <div className="font-medium text-gray-900">{quote.customerName || "Sin Nombre"}</div>
                        )}
                        <div className="text-xs text-gray-400">{quote.person?.email || quote.customerEmail}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-gray-900">
                        ${Number(quote.grandTotal).toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {getStatusBadge(quote.status)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {format(new Date(quote.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 flex gap-2 justify-end">
                        <a 
                          href={`/site/${tenantSubdomain}/quote/${quote.publicToken}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-gray-400 hover:text-gray-900"
                          title="Abrir vista pública"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      </td>
                    </tr>
                  ))}
                  {quotes.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-sm text-gray-500">
                        Aún no tienes cotizaciones.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
