'use client'

import { useState } from 'react'
import { Search, Globe, CheckCircle2, XCircle, Loader2 } from 'lucide-react'

type DomainSearchDict = {
  title: string
  subtitle: string
  placeholder: string
  button_search: string
  loading: string
  available: string
  unavailable: string
  cta_reserve: string
  error: string
}

export default function DomainSearch({ dict }: { dict: DomainSearchDict }) {
  const [domain, setDomain] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'available' | 'taken' | 'error'>('idle')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    let query = domain.trim().toLowerCase()
    if (!query) return
    
    // Add default TLD if not provided
    if (!query.includes('.')) {
      query += '.com'
      setDomain(query)
    }

    setStatus('loading')

    try {
      const res = await fetch(`/api/check-domain?domain=${encodeURIComponent(query)}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'API Error')
      }

      setStatus(data.status as 'available' | 'taken')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto glass rounded-3xl p-8 md:p-12 border border-white/10 shadow-[0_0_50px_rgba(34,211,238,0.1)] relative overflow-hidden group mt-16 mb-24">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-cyan-500/10 to-transparent opacity-50 pointer-events-none blur-3xl"></div>
      
      <div className="relative z-10 text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 mb-6 border border-cyan-500/30">
          <Globe className="w-8 h-8" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
          {dict.title}
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          {dict.subtitle}
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative z-10 max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-slate-400 pointer-events-none">
            <Search className="w-6 h-6" />
          </div>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder={dict.placeholder}
            className="w-full h-16 bg-[#01040f] border-2 border-white/10 focus:border-cyan-500 rounded-2xl pl-14 pr-32 md:pr-40 text-lg text-white placeholder:text-slate-600 transition-all focus:outline-none focus:shadow-[0_0_30px_rgba(34,211,238,0.2)]"
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            disabled={status === 'loading' || !domain.trim()}
            className="absolute right-2 top-2 bottom-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold px-6 rounded-xl transition-all flex items-center justify-center min-w-[100px] md:min-w-[120px]"
          >
            {status === 'loading' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              dict.button_search
            )}
          </button>
        </div>
      </form>

      {/* Results Area */}
      {status !== 'idle' && status !== 'loading' && (
        <div className="relative z-10 mt-8 max-w-2xl mx-auto animate-in slide-in-from-top-4 fade-in duration-300">
          {status === 'available' && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-emerald-400">
                <CheckCircle2 className="w-8 h-8 shrink-0" />
                <div className="text-left">
                  <h4 className="font-bold text-lg text-white">{domain}</h4>
                  <p className="text-sm">{dict.available}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('reserve-domain', { detail: domain }));
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full md:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-colors text-center shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                {dict.cta_reserve}
              </button>
            </div>
          )}

          {status === 'taken' && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 flex items-center gap-4 text-rose-400">
              <XCircle className="w-8 h-8 shrink-0" />
              <div className="text-left">
                <h4 className="font-bold text-lg text-white">{domain}</h4>
                <p className="text-sm">{dict.unavailable}</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-amber-400 text-center">
              <p>{dict.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
