'use client'

import { useState, useEffect } from 'react'
import { Send, Loader2, CheckCircle } from 'lucide-react'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    const handleReserve = (e: any) => {
      const domain = e.detail;
      const challengeEl = document.getElementById('challenge') as HTMLTextAreaElement;
      if (challengeEl) {
        challengeEl.value = `Me interesa reservar el dominio: ${domain}`;
      }
    };
    window.addEventListener('reserve-domain', handleReserve);
    return () => window.removeEventListener('reserve-domain', handleReserve);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      company: formData.get('company'),
      challenge: formData.get('challenge'),
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Error al enviar')
      setStatus('success')
    } catch (error) {
      console.error(error)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center animate-fade-in">
        <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">¡Recibido con éxito!</h3>
        <p className="text-slate-300">
          Un ingeniero de crecimiento revisará tu caso y te contactará a la brevedad.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 relative">
      <div>
        <label htmlFor="name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Nombre Completo</label>
        <input 
          required 
          id="name" 
          name="name" 
          type="text" 
          placeholder="Juan Pérez" 
          className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Correo Corporativo</label>
          <input 
            required 
            id="email" 
            name="email" 
            type="email" 
            placeholder="juan@tuempresa.com" 
            className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Empresa</label>
          <input 
            required 
            id="company" 
            name="company" 
            type="text" 
            placeholder="Tu Startup S.A." 
            className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>
      </div>

      <div>
        <label htmlFor="challenge" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Reto Principal de Crecimiento</label>
        <textarea 
          required
          id="challenge" 
          name="challenge"
          rows={4} 
          placeholder="¿Qué te impide escalar hoy? Ej: Mi web es lenta, el CPL es alto, mi CRM está desorganizado..." 
          className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition resize-none"
        ></textarea>
      </div>

      {status === 'error' && (
        <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">
          Ocurrió un error al enviar tu mensaje. Por favor intenta de nuevo.
        </div>
      )}

      <div>
        <button 
          type="submit" 
          disabled={status === 'loading'}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold tracking-wider text-sm rounded-xl transition duration-300 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-400/25 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {status === 'loading' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Iniciar Crecimiento</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
