import { prisma } from "@/lib/prisma/client";
import { notFound } from "next/navigation";
import { BookingWizardClient } from "./BookingWizardClient";

export default async function BookingPage(props: {
  const { tenant, slug } = await props.params; params: Promise<{ tenant: string, slug: string }> }) {
  const tenant = await prisma.tenant.findUnique({ where: { subdomain: tenant } });
  if (!tenant) notFound();

  const eventType = await prisma.apptEventType.findUnique({
    where: { tenantId_slug: { tenantId: tenant.id, slug: slug } }
  });

  if (!eventType || !eventType.isActive) notFound();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row min-h-[500px]">
        {/* Left Side: Info */}
        <div className="bg-gray-50/50 p-8 md:w-1/3 border-r border-gray-100">
          <h2 className="text-gray-500 font-semibold mb-2">{tenant.name}</h2>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{eventType.title}</h1>
          <p className="text-sm text-gray-600 mb-6">{eventType.description}</p>
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {eventType.durationMinutes} minutos
          </div>
        </div>

        {/* Right Side: Interactive Calendar/Form */}
        <div className="p-8 md:w-2/3">
          <BookingWizardClient tenantSubdomain={tenant} eventSlug={slug} />
        </div>
      </div>
    </div>
  );
}
