import { AuthProvider } from '@/components/providers/AuthProvider'
import { AdminClientLayout } from '@/components/crm/AdminClientLayout'
import '../globals.css' // Important to load tailwind for /admin

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased bg-[#01040f] text-slate-300">
        <AuthProvider>
          <AdminClientLayout>
            {children}
          </AdminClientLayout>
        </AuthProvider>
      </body>
    </html>
  )
}
