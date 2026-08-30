'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

type Props = {
  url: string
  title: string
  lang: 'es' | 'en'
}

export function ShareButtons({ url, title, lang }: Props) {
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy', err)
    }
  }

  const shareTwitter = () => {
    const text = encodeURIComponent(`Check out this article: ${title}`)
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const shareLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    window.open(shareUrl, '_blank', 'width=600,height=600')
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 py-8 mt-12 border-t border-b border-white/10">
      <span className="text-slate-400 font-semibold text-sm">
        {lang === 'es' ? 'Compartir este insight:' : 'Share this insight:'}
      </span>
      <div className="flex items-center gap-3">
        <button 
          onClick={copyLink}
          className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all group"
          title={lang === 'es' ? 'Copiar enlace' : 'Copy link'}
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Link2 className="w-4 h-4 group-hover:scale-110 transition-transform" />}
        </button>
        <button 
          onClick={shareTwitter}
          className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-slate-300 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2]/30 transition-all group"
          title="Twitter / X"
        >
          <TwitterIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>
        <button 
          onClick={shareLinkedIn}
          className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-slate-300 hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/30 transition-all group"
          title="LinkedIn"
        >
          <LinkedinIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  )
}
