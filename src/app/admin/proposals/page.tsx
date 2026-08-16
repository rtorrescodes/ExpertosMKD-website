import { prisma } from '@/lib/prisma'
import { ProposalGenerator } from '@/components/crm/ProposalGenerator'

export default async function ProposalsPage(props: { searchParams: Promise<{ leadId?: string }> }) {
  const searchParams = await props.searchParams
  const initialLeadId = searchParams.leadId || ''

  // Traemos los leads (solo los campos esenciales para el select)
  const leads = await prisma.lead.findMany({
    select: {
      id: true,
      name: true,
      companyName: true,
      email: true,
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Generador de Propuestas</h1>
          <p className="text-slate-400 text-sm mt-1">
            Redacta, envía por correo o exporta a PDF tus cartas comerciales usando tecnología DOM-to-PDF.
          </p>
        </div>
      </div>

      <ProposalGenerator leads={leads} initialLeadId={initialLeadId} />
    </div>
  )
}
