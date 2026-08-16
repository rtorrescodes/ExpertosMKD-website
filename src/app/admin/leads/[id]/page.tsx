import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { LeadProfileClient } from '@/components/crm/LeadProfileClient'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

// Next.js 15+ requiere que params se extraiga como Promesa o destructurado si es asíncrono
export default async function LeadProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const leadId = params.id
  
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      activities: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!lead) {
    notFound()
  }

  // Serializamos el objeto para evitar el error de Server Components a Client Components con fechas
  const safeLead = JSON.parse(JSON.stringify(lead))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Link 
          href="/admin/leads" 
          className="p-2 text-slate-400 hover:text-white bg-slate-900/50 hover:bg-slate-800 rounded-lg transition-colors border border-white/5"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Perfil del Cliente</h1>
          <p className="text-slate-400 text-sm mt-1">
            Gestión y seguimiento de <strong>{lead.companyName || lead.name}</strong>
          </p>
        </div>
      </div>

      <LeadProfileClient lead={safeLead} />
    </div>
  )
}
