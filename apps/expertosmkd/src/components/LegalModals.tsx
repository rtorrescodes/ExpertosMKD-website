'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

type LegalContent = {
  title: string
  content: string
}

type Props = {
  linksText: {
    privacy: string
    terms: string
    cookies: string
  }
  content: {
    privacy: LegalContent
    terms: LegalContent
    cookies: LegalContent
  }
}

export default function LegalModals({ linksText, content }: Props) {
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | 'cookies' | null>(null)

  return (
    <>
      <ul className="space-y-4">
        <li>
          <button 
            onClick={() => setActivePolicy('privacy')}
            className="text-slate-400 hover:text-cyan-400 text-sm transition-colors text-left"
          >
            {linksText.privacy}
          </button>
        </li>
        <li>
          <button 
            onClick={() => setActivePolicy('terms')}
            className="text-slate-400 hover:text-cyan-400 text-sm transition-colors text-left"
          >
            {linksText.terms}
          </button>
        </li>
        <li>
          <button 
            onClick={() => setActivePolicy('cookies')}
            className="text-slate-400 hover:text-cyan-400 text-sm transition-colors text-left"
          >
            {linksText.cookies}
          </button>
        </li>
      </ul>

      {/* MODAL */}
      {activePolicy && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setActivePolicy(null)}
          ></div>
          
          <div className="relative w-full max-w-3xl max-h-[85vh] glass rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-900/50">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {content[activePolicy].title}
              </h2>
              <button 
                onClick={() => setActivePolicy(null)}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 transition-all border border-transparent"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 md:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-transparent">
              <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-p:leading-relaxed whitespace-pre-wrap font-sans text-sm md:text-base">
                {content[activePolicy].content}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
