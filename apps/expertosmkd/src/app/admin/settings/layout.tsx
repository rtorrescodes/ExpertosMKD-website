'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Settings, Briefcase, Mail } from 'lucide-react'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const tabs = [
    { name: 'General', href: '/admin/settings', icon: Settings },
    { name: 'Giros (Industries)', href: '/admin/settings/industries', icon: Briefcase },
    { name: 'Email & IA', href: '/admin/settings/integrations', icon: Mail },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Configuración</h1>
        <p className="text-sm text-slate-400 mt-1">Administra los parámetros de tu CRM.</p>
      </div>

      <div className="border-b border-white/10">
        <nav className="flex gap-6">
          {tabs.map(tab => {
            const isActive = pathname === tab.href
            const Icon = tab.icon
            return (
              <Link 
                key={tab.href}
                href={tab.href}
                className={`pb-4 text-sm font-medium transition-colors relative flex items-center gap-2 ${isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
                {isActive && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 rounded-t-full" />}
              </Link>
            )
          })}
        </nav>
      </div>

      <div>
        {children}
      </div>
    </div>
  )
}
