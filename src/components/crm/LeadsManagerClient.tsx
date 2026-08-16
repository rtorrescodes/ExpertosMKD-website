'use client'

import { useState, useMemo } from 'react'
import { Building, Globe, MapPin, Mail, Search, Download, Plus, AlertTriangle, ShieldX, UserPlus, X, Filter, Circle } from 'lucide-react'
import Link from 'next/link'
import { claimLead, blacklistLead, createManualLead, rateLead } from '@/actions/lead-actions'
import { LeadsHeader } from './LeadsHeader'
import { useRouter } from 'next/navigation'
import { createIndustry } from '@/actions/industry-actions'

export function LeadsManagerClient({ initialLeads, initialIndustries, currentUserId }: { initialLeads: any[], initialIndustries: any[], currentUserId: string }) {
  const router = useRouter()
  const [leads, setLeads] = useState(initialLeads)
  const [industries, setIndustries] = useState(initialIndustries)
  const [activeTab, setActiveTab] = useState<'mine' | 'pool'>('mine')
  const [searchQuery, setSearchQuery] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filtros Avanzados (Barra Superior)
  const [filterState, setFilterState] = useState('')
  const [filterCity, setFilterCity] = useState('')
  const [filterIndustry, setFilterIndustry] = useState('')

  // Estado del Formulario Manual
  const [manualForm, setManualForm] = useState({
    companyName: '', name: '', email: '', phone: '', industry: '', city: '', state: ''
  })

  // Derivar listas
  const poolLeads = leads.filter(l => l.assignedToId === null && !l.isBlacklisted)
  const myLeads = leads.filter(l => l.assignedToId === currentUserId && !l.isBlacklisted)

  // Filtrado final
  const currentList = activeTab === 'pool' ? poolLeads : myLeads

  // Obtener opciones únicas para los filtros basados en la lista actual
  const states = Array.from(new Set(currentList.map(l => l.state).filter(Boolean))) as string[]
  const cities = Array.from(new Set(currentList.filter(l => !filterState || l.state === filterState).map(l => l.city).filter(Boolean))) as string[]
  
  const filteredList = useMemo(() => {
    return currentList.filter(l => {
      const matchesSearch = (l.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             l.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             l.email?.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesState = filterState ? l.state === filterState : true
      const matchesCity = filterCity ? l.city === filterCity : true
      const matchesIndustry = filterIndustry ? l.industryId === filterIndustry : true

      return matchesSearch && matchesState && matchesCity && matchesIndustry
    })
  }, [currentList, searchQuery, filterState, filterCity, filterIndustry])

  const handleClaim = async (leadId: string) => {
    setIsProcessing(true)
    const res = await claimLead(leadId, currentUserId)
    if (res.success) {
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, assignedToId: currentUserId } : l))
    } else {
      alert('Error asignando prospecto')
    }
    setIsProcessing(false)
  }

  const handleBlacklist = async (leadId: string) => {
    if (!confirm('¿Estás seguro de eliminar este prospecto? No volverá a aparecer en el Pool y el Scraper lo ignorará en el futuro.')) return
    setIsProcessing(true)
    const res = await blacklistLead(leadId)
    if (res.success) {
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, isBlacklisted: true } : l))
    } else {
      alert('Error eliminando prospecto')
    }
    setIsProcessing(false)
  }

  const handleRate = async (leadId: string, rating: string) => {
    setIsProcessing(true)
    const res = await rateLead(leadId, rating)
    if (res.success) {
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, rating } : l))
    }
    setIsProcessing(false)
  }

  const handleCreateManual = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    const res = await createManualLead({ ...manualForm, assignedToId: currentUserId })
    if (res.success && res.lead) {
      setLeads(prev => [res.lead, ...prev])
      setIsModalOpen(false)
      setActiveTab('mine') // Cambiar a la pestaña de mis leads
      setManualForm({ companyName: '', name: '', email: '', phone: '', industry: '', city: '', state: '' })
    } else {
      alert('Error creando prospecto manualmente: ' + res.error)
    }
    setIsProcessing(false)
  }

  const getRatingColor = (rating: string) => {
    if (rating === 'RED') return 'text-red-500 hover:text-red-400'
    if (rating === 'YELLOW') return 'text-yellow-500 hover:text-yellow-400'
    if (rating === 'GREEN') return 'text-green-500 hover:text-green-400'
    return 'text-slate-600 hover:text-slate-400'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <LeadsHeader activeTab={activeTab} industries={industries} />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" /> Agregar Manual
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        {/* Pestañas (Tabs) */}
        <div className="flex border-b border-white/5 bg-slate-900/60">
          <button 
            onClick={() => { setActiveTab('mine'); setFilterState(''); setFilterCity(''); setFilterIndustry(''); }}
            className={`flex-1 md:flex-none px-8 py-4 text-sm font-bold transition-colors relative ${activeTab === 'mine' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
          >
            MIS PROSPECTOS
            <span className="ml-2 px-2 py-0.5 rounded-full bg-white/10 text-xs font-normal">{myLeads.length}</span>
            {activeTab === 'mine' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500" />}
          </button>
          <button 
            onClick={() => { setActiveTab('pool'); setFilterState(''); setFilterCity(''); setFilterIndustry(''); }}
            className={`flex-1 md:flex-none px-8 py-4 text-sm font-bold transition-colors relative ${activeTab === 'pool' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
          >
            MERCADO DE LEADS (POOL)
            <span className="ml-2 px-2 py-0.5 rounded-full bg-white/10 text-xs font-normal">{poolLeads.length}</span>
            {activeTab === 'pool' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500" />}
          </button>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div className="p-4 border-b border-white/5 bg-slate-900/40 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por empresa, nombre o correo..." 
              className="w-full bg-[#050810] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <Filter className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Filtros:</span>
            </div>
            <select 
              value={filterState} 
              onChange={e => { setFilterState(e.target.value); setFilterCity('') }}
              className="bg-[#050810] border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="">Todo el País</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select 
              value={filterCity} 
              onChange={e => setFilterCity(e.target.value)}
              disabled={!filterState}
              className="bg-[#050810] border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
            >
              <option value="">Cualquier Ciudad</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select 
              value={filterIndustry} 
              onChange={e => setFilterIndustry(e.target.value)}
              className="bg-[#050810] border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 hidden sm:block"
            >
              <option value="">Cualquier Giro</option>
              {industries.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0b101e] text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4 font-bold w-12 text-center">Rtg</th>
                <th className="px-6 py-4 font-bold">Empresa / Contacto</th>
                <th className="px-6 py-4 font-bold">Información</th>
                <th className="px-6 py-4 font-bold">Ubicación</th>
                <th className="px-6 py-4 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-slate-900/20">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <AlertTriangle className="w-10 h-10 mb-4 opacity-50" />
                      <p className="text-base font-medium">No se encontraron prospectos</p>
                      <p className="text-sm">Intenta ajustar tus filtros de búsqueda o usa el Scraper.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredList.map((lead) => (
                  <tr 
                    key={lead.id} 
                    onClick={() => router.push(`/admin/leads/${lead.id}`)}
                    className="hover:bg-white/[0.04] transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4 text-center" onClick={e => e.stopPropagation()}>
                      <div className="flex flex-col gap-1 items-center opacity-30 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleRate(lead.id, 'GREEN')} className={`p-0.5 ${lead.rating === 'GREEN' ? 'text-green-500' : 'text-slate-600 hover:text-green-400'}`} title="Interesado"><Circle className="w-3 h-3 fill-current" /></button>
                        <button onClick={() => handleRate(lead.id, 'YELLOW')} className={`p-0.5 ${lead.rating === 'YELLOW' ? 'text-yellow-500' : 'text-slate-600 hover:text-yellow-400'}`} title="En proceso"><Circle className="w-3 h-3 fill-current" /></button>
                        <button onClick={() => handleRate(lead.id, 'RED')} className={`p-0.5 ${lead.rating === 'RED' ? 'text-red-500' : 'text-slate-600 hover:text-red-400'}`} title="No interesado"><Circle className="w-3 h-3 fill-current" /></button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-white/5 group-hover:border-cyan-500/30 transition-colors shadow-inner ${lead.rating === 'GREEN' ? 'ring-1 ring-green-500/50' : lead.rating === 'YELLOW' ? 'ring-1 ring-yellow-500/50' : lead.rating === 'RED' ? 'ring-1 ring-red-500/50' : ''}`}>
                          <Building className={`w-5 h-5 ${lead.rating === 'GREEN' ? 'text-green-500' : lead.rating === 'YELLOW' ? 'text-yellow-500' : lead.rating === 'RED' ? 'text-red-500' : 'text-slate-400'}`} />
                        </div>
                        <div>
                          <p className="font-bold text-white text-base">{lead.companyName || lead.name}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <span className="font-medium text-cyan-400/80">{lead.industry?.name || 'General'}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-500" />
                          <span className={lead.usesGenericEmail ? 'text-amber-400/80 font-medium text-xs' : 'text-xs text-slate-300'}>
                            {lead.email || 'No disponible'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <Globe className="w-4 h-4 text-slate-500" />
                          {lead.hasWebsite && lead.websiteUrl ? (
                            <a href={lead.websiteUrl.startsWith('http') ? lead.websiteUrl : `https://${lead.websiteUrl}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400/80 hover:text-emerald-300 font-medium text-xs">Sitio Web</a>
                          ) : (
                            <span className={lead.hasWebsite ? 'text-emerald-400/80 font-medium text-xs' : 'text-xs text-slate-500'}>
                              {lead.hasWebsite ? 'Sitio Web' : 'Sin Sitio Web'}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lead.companyName || lead.name}, ${lead.city || ''}, ${lead.state || ''}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors inline-flex"
                        title="Ver en Google Maps"
                      >
                        <MapPin className="w-4 h-4 text-slate-500 group-hover:text-cyan-400/50" />
                        <span>{lead.city || ''} {lead.state ? `, ${lead.state}` : 'No disponible'}</span>
                      </a>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                      {activeTab === 'pool' ? (
                        <div className="flex items-center justify-end gap-3">
                           <button 
                             onClick={() => handleClaim(lead.id)}
                             disabled={isProcessing}
                             className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold transition disabled:opacity-50"
                           >
                             <UserPlus className="w-4 h-4" /> TOMAR
                           </button>
                           <button 
                             onClick={() => handleBlacklist(lead.id)}
                             disabled={isProcessing}
                             className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition disabled:opacity-50"
                             title="Rechazar y enviar a Blacklist"
                           >
                             <ShieldX className="w-4 h-4" />
                           </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-3">
                           <button 
                             onClick={() => handleBlacklist(lead.id)}
                             disabled={isProcessing}
                             className="flex items-center gap-1 px-3 py-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg text-xs font-bold transition disabled:opacity-50"
                             title="Borrar de mis prospectos y enviar a Blacklist"
                           >
                             <ShieldX className="w-4 h-4" /> ELIMINAR
                           </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Agregar Manual */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0b101e] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">Agregar Nuevo Lead</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleCreateManual} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Empresa / Negocio *</label>
                  <input required value={manualForm.companyName} onChange={e=>setManualForm({...manualForm, companyName: e.target.value})} className="w-full bg-[#050810] border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 focus:border-cyan-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Nombre del Contacto</label>
                  <input value={manualForm.name} onChange={e=>setManualForm({...manualForm, name: e.target.value})} className="w-full bg-[#050810] border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 focus:border-cyan-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Giro / Industria</label>
                  <div className="flex gap-2">
                    <select 
                      value={manualForm.industry} 
                      onChange={e => setManualForm({...manualForm, industry: e.target.value})} 
                      className="flex-1 bg-[#050810] border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 focus:border-cyan-500 outline-none"
                    >
                      <option value="">Selecciona o crea...</option>
                      {industries.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                    </select>
                    <button type="button" onClick={async () => {
                      const newIndustryName = prompt('Nombre del nuevo giro:')
                      if (newIndustryName) {
                        const res = await createIndustry(newIndustryName)
                        if (res.success && res.industry) {
                          setIndustries(prev => [...prev, res.industry!].sort((a,b) => a.name.localeCompare(b.name)))
                          setManualForm({...manualForm, industry: res.industry.id})
                        }
                      }
                    }} className="px-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-bold transition">+</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Correo Electrónico</label>
                  <input type="email" value={manualForm.email} onChange={e=>setManualForm({...manualForm, email: e.target.value})} className="w-full bg-[#050810] border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 focus:border-cyan-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Teléfono</label>
                  <input value={manualForm.phone} onChange={e=>setManualForm({...manualForm, phone: e.target.value})} className="w-full bg-[#050810] border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 focus:border-cyan-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Estado</label>
                  <input value={manualForm.state} onChange={e=>setManualForm({...manualForm, state: e.target.value})} className="w-full bg-[#050810] border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 focus:border-cyan-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Ciudad</label>
                  <input value={manualForm.city} onChange={e=>setManualForm({...manualForm, city: e.target.value})} className="w-full bg-[#050810] border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 focus:border-cyan-500 outline-none" />
                </div>
              </div>
              
              <div className="pt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white transition">Cancelar</button>
                <button type="submit" disabled={isProcessing} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition disabled:opacity-50">
                  {isProcessing ? 'Guardando...' : 'Guardar Prospecto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
