import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { LeadsManagerClient } from '@/components/crm/LeadsManagerClient'
import { redirect } from 'next/navigation'

export default async function LeadsPage() {
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

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: { industry: true }
  })

  const industries = await prisma.industry.findMany({
    orderBy: { name: 'asc' }
  })

  // Convertimos a JSON seguro
  const safeLeads = JSON.parse(JSON.stringify(leads))
  const safeIndustries = JSON.parse(JSON.stringify(industries))

  return (
    <div className="space-y-6">
      <LeadsManagerClient initialLeads={safeLeads} initialIndustries={safeIndustries} currentUserId={user.id} />
    </div>
  )
}
