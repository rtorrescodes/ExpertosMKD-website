'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Search,
  Bell,
  Menu,
  Mail
} from 'lucide-react'
import { useState } from 'react'
export function AdminClientLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Bandeja Inbox', href: '/admin/inbox', icon: Mail },
    { name: 'Prospectos', href: '/admin/leads', icon: Users },
    { name: 'Generador de Propuestas', href: '/admin/proposals', icon: FileText },
    { name: 'Configuración', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-[#01040f] flex text-slate-300">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 glass-card border-r border-white/5 
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
            E
          </div>
          <span className="font-bold text-white tracking-wide">ExpertosMKD</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-cyan-500/10 text-cyan-400 font-medium' 
                    : 'hover:bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold border border-white/10">
              {session?.user?.name?.[0] || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{session?.user?.name || 'Administrador'}</p>
              <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
            </div>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 glass-card flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-lg border border-white/5 focus-within:border-cyan-500/50 transition-colors">
              <Search className="w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Buscar prospectos..." 
                className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 w-64"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
