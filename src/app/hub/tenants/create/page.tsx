import { TenantForm } from "@/components/hub/TenantForm";

export default function CreateTenantPage() {
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Create New Tenant
          </h2>
        </div>
      </div>
      
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <TenantForm />
        </div>
      </div>
    </div>
  );
}
