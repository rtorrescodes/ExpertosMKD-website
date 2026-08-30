import { prisma } from "@/lib/prisma/client";
import Link from "next/link";
import { Plus } from "lucide-react";
import { HubTenantsTable } from "@/components/hub/HubTenantsTable";

export default async function HubDashboard() {
  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-2xl font-bold leading-6 text-gray-900">
            Tenants
          </h2>
          <p className="mt-2 text-sm text-gray-700">
            A list of all clients and agencies currently active in the platform.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/hub/tenants/create"
            className="flex items-center gap-2 rounded-md bg-black px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            <Plus className="h-4 w-4" />
            Add Tenant
          </Link>
        </div>
      </div>

      <HubTenantsTable tenants={tenants} />
    </div>
  );
}
