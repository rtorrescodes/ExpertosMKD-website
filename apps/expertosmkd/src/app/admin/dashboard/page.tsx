import { prisma } from '@/lib/prisma'
import { Users, Mail, CheckCircle, TrendingUp } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // Fetch stats from database
  const totalLeads = await prisma.lead.count()
  const newLeads = await prisma.lead.count({ where: { status: 'NEW' } })
  const qualifiedLeads = await prisma.lead.count({ where: { status: 'QUALIFIED' } })
  
  const stats = [
    { name: 'Total de Prospectos', value: totalLeads.toString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { name: 'Nuevos (Sin Tocar)', value: newLeads.toString(), icon: Mail, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { name: 'Prospectos Calificados', value: qualifiedLeads.toString(), icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { name: 'Tasa de Conversión', value: '0%', icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard General</h1>
          <p className="text-slate-400 text-sm mt-1">Resumen del rendimiento de tu embudo de ventas y extracción B2B.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/5 min-h-[400px]">
          <h2 className="text-lg font-semibold text-white mb-4">Actividad Reciente</h2>
          <div className="flex items-center justify-center h-full text-slate-500 text-sm">
            El gráfico de extracciones se mostrará aquí cuando el Scraper esté activo.
          </div>
        </div>
        
        <div className="glass-card rounded-2xl p-6 border border-white/5 min-h-[400px]">
          <h2 className="text-lg font-semibold text-white mb-4">Leads Prioritarios</h2>
          <div className="space-y-4">
            {/* Placeholder for priority leads */}
            <div className="flex items-center justify-center h-[300px] text-slate-500 text-sm">
              No hay leads urgentes.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
