"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTenant } from "@/actions/tenant";

export function TenantForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createTenant(formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      router.push("/hub");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-6 sm:space-y-5">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Tenant Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Provision a new isolated SaaS environment.
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6 sm:space-y-5">
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Business Name
            </label>
            <div className="mt-1 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="name"
                id="name"
                required
                className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:max-w-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="subdomain"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Subdomain
            </label>
            <div className="mt-1 sm:col-span-2 sm:mt-0">
              <div className="flex max-w-lg rounded-md shadow-sm">
                <input
                  type="text"
                  name="subdomain"
                  id="subdomain"
                  required
                  pattern="[a-z0-9]+"
                  title="Only lowercase letters and numbers"
                  className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 focus:border-black focus:ring-black sm:text-sm"
                />
                <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                  .celeritas.local
                </span>
              </div>
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="ownerEmail"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Owner Email (Invite)
            </label>
            <div className="mt-1 sm:col-span-2 sm:mt-0">
              <input
                id="ownerEmail"
                name="ownerEmail"
                type="email"
                required
                className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:max-w-xs sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Feature Flags
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Enable or disable modules for this tenant.
          </p>
        </div>
        <div className="space-y-6 sm:space-y-5">
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
            <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
              Modules
            </label>
            <div className="mt-1 sm:col-span-2 sm:mt-0">
              <div className="max-w-lg space-y-4">
                <div className="relative flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="feature_crm"
                      name="feature_crm"
                      type="checkbox"
                      value="true"
                      className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="feature_crm" className="font-medium text-gray-700">
                      CRM Module
                    </label>
                    <p className="text-gray-500">Enable lead tracking and pipeline.</p>
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="feature_ecommerce"
                      name="feature_ecommerce"
                      type="checkbox"
                      value="true"
                      className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="feature_ecommerce" className="font-medium text-gray-700">
                      E-commerce Module
                    </label>
                    <p className="text-gray-500">Enable online store and cart.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.push("/hub")}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Tenant & Send Invite"}
          </button>
        </div>
      </div>
    </form>
  );
}
