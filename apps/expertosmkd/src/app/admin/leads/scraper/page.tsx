import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ScraperClient } from '@/components/crm/ScraperClient'

export const metadata = {
  title: 'Scraper B2B - ExpertosMKD CRM'
}

export default async function ScraperPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    redirect('/api/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    redirect('/api/auth/signin')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Scraper B2B</h1>
          <p className="text-slate-400 text-sm mt-1">
            Extrae prospectos de forma masiva y segura utilizando IA y rotación de proxies.
          </p>
        </div>
      </div>

      <ScraperClient currentUserId={user.id} />
    </div>
  )
}
