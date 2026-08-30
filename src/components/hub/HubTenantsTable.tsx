"use client";

import { useState } from "react";
import { MoreVertical, Settings } from "lucide-react";
import { format } from "date-fns";
import { FeatureFlagsModal } from "./FeatureFlagsModal";

export function HubTenantsTable({ tenants }: { tenants: any[] }) {
  const [selectedTenant, setSelectedTenant] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openFeaturesModal = (tenant: any) => {
    setSelectedTenant(tenant);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Subdomain
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Created
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {tenants.map((tenant) => (
                    <tr key={tenant.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {tenant.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {tenant.subdomain}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                            tenant.status === "ACTIVE"
                              ? "bg-green-50 text-green-700 ring-green-600/20"
                              : "bg-red-50 text-red-700 ring-red-600/10"
                          }`}
                        >
                          {tenant.status === "ACTIVE" ? "Active" : "Suspended"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {format(new Date(tenant.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => openFeaturesModal(tenant)}
                          className="text-gray-600 hover:text-black flex items-center gap-1 justify-end w-full"
                          title="Gestionar Módulos"
                        >
                          <Settings className="h-4 w-4" />
                          <span className="text-xs">Módulos</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {tenants.length === 0 && (
                    <tr>
                      <td colSpan={5} className="whitespace-nowrap py-8 text-center text-sm text-gray-500">
                        No tenants found. Create one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <FeatureFlagsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tenant={selectedTenant}
      />
    </>
  );
}
