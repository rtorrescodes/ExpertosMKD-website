'use client'

import { useState } from 'react'
import { Filter, Sparkles, Plus } from 'lucide-react'
import { ScraperModal } from './ScraperModal'
import { useRouter } from 'next/navigation'

export function LeadsHeader({ activeTab = 'pool', industries = [] }: { activeTab?: 'mine' | 'pool', industries?: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Prospectos</h1>
        <p className="text-sm text-slate-400 mt-1">Gestiona, filtra y convierte tus prospectos.</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-xl transition-colors border border-white/10">
          <Filter className="w-4 h-4" />
          Filtros
        </button>
        {activeTab === 'pool' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-cyan-500/20"
          >
            <Sparkles className="w-4 h-4" />
            Extraer con IA
          </button>
        )}
      </div>

      <ScraperModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onComplete={() => router.refresh()} 
        industries={industries}
      />
    </div>
  )
}
