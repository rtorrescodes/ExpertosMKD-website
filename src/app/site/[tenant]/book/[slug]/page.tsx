import { prisma } from "@/lib/prisma/client";
import { notFound } from "next/navigation";
import { BookingWizardClient } from "./BookingWizardClient";

export default async function BookingPage(props: {
  params: Promise<{ tenant: string, slug: string }>;
}) {
  const { tenant: tenantSubdomain, slug } = await props.params;
  const tenantRecord = await prisma.tenant.findUnique({ where: { subdomain: tenantSubdomain } });
  
  if (!tenantRecord) notFound();

  const eventType = await prisma.apptEventType.findUnique({
    where: { tenantId_slug: { tenantId: tenantRecord.id, slug: slug } }
  });

  if (!eventType || !eventType.isActive) notFound();

  return (
    <div className="min-h-screen bg-white/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl glass-card border-white/5 shadow-xl rounded-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row min-h-[500px]">
        {/* Left Side: Info */}
        <div className="bg-white/5/50 p-8 md:w-1/3 border-r border-gray-100">
          <h2 className="text-slate-400 font-semibold mb-2">{tenantRecord.name}</h2>
          <h1 className="text-2xl font-bold text-white mb-4">{eventType.title}</h1>
          <p className="text-sm text-slate-400 mb-6">{eventType.description}</p>
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {eventType.durationMinutes} minutos
          </div>
        </div>

        {/* Right Side: Interactive Calendar/Form */}
        <div className="p-8 md:w-2/3">
          <BookingWizardClient tenantSubdomain={tenantSubdomain} eventSlug={slug} />
        </div>
      </div>
    </div>
  );
}
