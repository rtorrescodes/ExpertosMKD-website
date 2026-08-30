'use client'

import { useState } from 'react'
import { generateLeadsWithDeepSeek } from '@/actions/ai-scraper'
import { Search, Loader2, Sparkles, X, MapPin } from 'lucide-react'
import { MEXICAN_STATES, MEXICAN_STATES_AND_CITIES } from '@/lib/locations'

import { createIndustry } from '@/actions/industry-actions'

export function ScraperModal({ isOpen, onClose, onComplete, industries = [] }: { isOpen: boolean, onClose: () => void, onComplete: () => void, industries?: any[] }) {
  const [state, setState] = useState('Jalisco')
  const [city, setCity] = useState('')
  const [industryId, setIndustryId] = useState('')
  const [localIndustries, setLocalIndustries] = useState(industries)
  const [count, setCount] = useState(10)
  
  // Advanced filters
  const [requireNoWebsite, setRequireNoWebsite] = useState(false)
  const [requireFreeEmail, setRequireFreeEmail] = useState(false)
  const [allowWebsite, setAllowWebsite] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // When state changes, update city to the first city of that state
  const handleStateChange = (newState: string) => {
    setState(newState)
    const cities = MEXICAN_STATES_AND_CITIES[newState] || []
    setCity(cities.length > 0 ? cities[0] : '')
  }

  if (!isOpen) return null

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!city.trim()) {
      setError('Por favor ingresa una ciudad')
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const selectedIndustry = localIndustries.find(i => i.id === industryId)
      const result = await generateLeadsWithDeepSeek({
        state,
        city,
        industryId,
        terms: selectedIndustry ? selectedIndustry.name : '',
        count,
        requireNoWebsite,
        requireFreeEmail,
        allowWebsite
      })

      if (result.success) {
        setSuccess(`¡Scraping exitoso! Se encontraron y guardaron ${result.count} leads nuevos.`)
        setTimeout(() => {
          onComplete()
          onClose()
        }, 2500)
      } else {
        setError(result.error || 'Ocurrió un error al minar los datos.')
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-[#01040f] border border-white/10 shadow-[0_0_50px_rgba(6,182,212,0.15)] rounded-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
        
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-slate-900/40 shrink-0">
          <div className="flex items-center gap-2 text-cyan-400">
            <Sparkles className="w-5 h-5" />
            <h2 className="font-semibold text-white">AI Scraper (DeepSeek)</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form onSubmit={handleScrape} className="space-y-5" id="scraper-form">
            <p className="text-sm text-slate-400 mb-4">
              Configura los parámetros para que la IA extraiga los mejores prospectos para tu agencia.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Estado</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select 
                    value={state}
                    onChange={e => handleStateChange(e.target.value)}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition appearance-none cursor-pointer"
                  >
                    {MEXICAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Ciudad</label>
                <div className="relative">
                  <select 
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Selecciona una ciudad</option>
                    {(MEXICAN_STATES_AND_CITIES[state] || []).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Giro del Negocio</label>
              <div className="flex gap-2">
                <select 
                  required
                  value={industryId}
                  onChange={e => setIndustryId(e.target.value)}
                  className="flex-1 bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                >
                  <option value="" disabled>Selecciona un giro...</option>
                  {localIndustries.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
                <button 
                  type="button" 
                  onClick={async () => {
                    const newIndustryName = prompt('Nombre del nuevo giro (ej. Escuelas, Ferreterías):')
                    if (newIndustryName) {
                      const res = await createIndustry(newIndustryName)
                      if (res.success && res.industry) {
                        setLocalIndustries(prev => [...prev, res.industry!].sort((a,b) => a.name.localeCompare(b.name)))
                        setIndustryId(res.industry.id)
                      }
                    }
                  }} 
                  className="px-4 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white font-bold transition flex items-center justify-center"
                  title="Crear Nuevo Giro"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Filtros Avanzados (Objetivo)</label>
              <div className="space-y-3 bg-slate-900/40 p-4 rounded-xl border border-white/5">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={requireNoWebsite}
                    onChange={e => setRequireNoWebsite(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-white/20 bg-slate-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                  />
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-cyan-400 transition">No tienen página web</p>
                    <p className="text-xs text-slate-500">Ideal para vender desarrollo web inicial.</p>
                  </div>
                </label>
                
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={requireFreeEmail}
                    onChange={e => setRequireFreeEmail(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-white/20 bg-slate-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                  />
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-cyan-400 transition">Usan correo gratuito</p>
                    <p className="text-xs text-slate-500">Hotmail, Gmail, etc. Ideal para vender correos corporativos.</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group pt-2 border-t border-white/5">
                  <input 
                    type="checkbox" 
                    checked={allowWebsite}
                    onChange={e => setAllowWebsite(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-white/20 bg-slate-900 text-purple-500 focus:ring-purple-500 focus:ring-offset-slate-900"
                  />
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-purple-400 transition">Sí tienen sitio web</p>
                    <p className="text-xs text-slate-500">Ideal para vender servicios de rediseño web o posicionamiento SEO.</p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Cantidad de Prospectos a Minar</label>
              <input 
                type="number" 
                min={1}
                max={50}
                value={count}
                onChange={e => setCount(parseInt(e.target.value))}
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            {error && <div className="p-3 rounded-xl bg-red-500/10 text-red-400 text-sm border border-red-500/20">{error}</div>}
            {success && <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 text-sm border border-emerald-500/20">{success}</div>}
          </form>
        </div>

        <div className="p-6 pt-2 border-t border-white/5 bg-slate-900/40 shrink-0 flex gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition border border-white/10"
          >
            Cancelar
          </button>
          <button 
            form="scraper-form"
            type="submit" 
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-medium rounded-xl transition shadow-lg shadow-cyan-500/20 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? 'Minando Datos...' : 'Iniciar Extracción'}
          </button>
        </div>
      </div>
    </div>
  )
}
