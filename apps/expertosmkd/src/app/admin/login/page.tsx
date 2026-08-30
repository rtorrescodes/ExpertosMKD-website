'use client'

import { signIn } from 'next-auth/react'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Lock, Mail } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('from') || '/admin/dashboard'
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl,
      })

      if (res?.error) {
        setError('Credenciales inválidas')
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      setError('Ocurrió un error inesperado')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md glass-card rounded-[2rem] p-8 md:p-12 relative z-10 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Acceso a CRM</h1>
        <p className="text-slate-400 text-sm">Ingresa con tus credenciales de administrador</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Correo Electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <Mail className="h-5 w-5" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
              placeholder="admin@tuagencia.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <Lock className="h-5 w-5" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold tracking-wider rounded-xl transition duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/40 flex items-center justify-center disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#01040f] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[500px] bg-cyan-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-cyan-500 relative z-10" />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
