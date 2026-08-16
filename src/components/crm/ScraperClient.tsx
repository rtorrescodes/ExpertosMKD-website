'use client'

import { useState } from 'react'
import { mineLeads } from '@/actions/ai-scraper'
import { Loader2, Search, Database, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface ScraperClientProps {
  currentUserId: string
}

export function ScraperClient({ currentUserId }: ScraperClientProps) {
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState('Nuevo León')
  const [city, setCity] = useState('Monterrey')
  const [keyword, setKeyword] = useState('Restaurantes')
  const [count, setCount] = useState(10)
  
  const [result, setResult] = useState<{
    success: boolean
    added?: number
    duplicates?: number
    totalExtracted?: number
    error?: string
  } | null>(null)

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    
    try {
      const res = await mineLeads(state, city, keyword, count, currentUserId)
      setResult(res)
    } catch (err: any) {
      setResult({ success: false, error: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Columna Izquierda: Formulario */}
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-card p-6 rounded-2xl border border-white/5">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Search className="w-5 h-5 mr-2 text-primary-400" />
            Parámetros de Búsqueda
          </h2>
          
          <form onSubmit={handleScrape} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Estado</label>
              <input 
                type="text" 
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                placeholder="Ej. Nuevo León"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Ciudad / Municipio</label>
              <input 
                type="text" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                placeholder="Ej. Monterrey"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Categoría / Palabra Clave</label>
              <input 
                type="text" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                placeholder="Ej. Escuelas Privadas"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Cantidad Máxima (Resultados)</label>
              <select 
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary-500 [&>option]:bg-slate-900"
              >
                <option value={10}>10 Prospectos (Rápido)</option>
                <option value={20}>20 Prospectos (Normal)</option>
                <option value={30}>30 Prospectos (Profundo)</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-4 bg-primary-600 hover:bg-primary-500 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(var(--primary-600-rgb),0.3)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Minería en Proceso...
                </>
              ) : (
                'Iniciar Scraping con IA'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Columna Derecha: Resultados y Status */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card p-6 rounded-2xl border border-white/5 min-h-[400px] flex flex-col relative overflow-hidden">
          
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center relative z-10">
            <Database className="w-5 h-5 mr-2 text-slate-400" />
            Consola de Resultados
          </h2>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Analizando la Web...</h3>
              <p className="text-slate-400 max-w-sm">
                El sistema está rotando un proxy de Webshare, rastreando resultados en {city} y utilizando DeepSeek IA para extraer datos estructurados. Esto puede tomar unos segundos.
              </p>
            </div>
          ) : result ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 animate-fade-in">
              {result.success ? (
                <>
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">¡Scraping Completado!</h3>
                  <div className="grid grid-cols-3 gap-4 w-full max-w-md mt-6 text-left">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Extraídos</p>
                      <p className="text-2xl font-bold text-white">{result.totalExtracted}</p>
                    </div>
                    <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                      <p className="text-xs text-emerald-400/80 uppercase tracking-wider mb-1">Nuevos</p>
                      <p className="text-2xl font-bold text-emerald-400">{result.added}</p>
                    </div>
                    <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20">
                      <p className="text-xs text-amber-400/80 uppercase tracking-wider mb-1">Duplicados</p>
                      <p className="text-2xl font-bold text-amber-400">{result.duplicates}</p>
                    </div>
                  </div>
                  
                  <Link 
                    href="/admin/leads"
                    className="mt-8 text-primary-400 hover:text-primary-300 font-medium flex items-center transition-colors"
                  >
                    Ver nuevos prospectos en el Directorio
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Error de Extracción</h3>
                  <p className="text-red-400/80 max-w-md bg-red-500/10 p-4 rounded-xl border border-red-500/20 mt-4">
                    {result.error}
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 opacity-50">
              <Database className="w-16 h-16 text-slate-600 mb-4" />
              <p className="text-slate-400 max-w-sm">
                Configura los parámetros de búsqueda a la izquierda y presiona "Iniciar Scraping con IA" para comenzar a poblar tu base de datos B2B.
              </p>
            </div>
          )}
          
          {/* Background Decoration */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-600/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
        </div>
      </div>
    </div>
  )
}
