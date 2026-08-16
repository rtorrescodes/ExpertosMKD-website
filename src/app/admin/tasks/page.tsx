import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { TasksClient } from '@/components/crm/TasksClient'

export const metadata = {
  title: 'Mis Tareas - ExpertosMKD CRM'
}

export default async function TasksPage() {
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

  const tasks = await prisma.task.findMany({
    where: {
      userId: user.id
    },
    include: {
      lead: {
        select: {
          id: true,
          name: true,
          companyName: true,
          email: true,
          phone: true,
          rating: true
        }
      }
    },
    orderBy: {
      dueDate: 'asc'
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Calendario y Tareas</h1>
          <p className="text-slate-400 text-sm mt-1">
            Gestiona tus seguimientos, llamadas y reuniones programadas.
          </p>
        </div>
      </div>

      <TasksClient initialTasks={tasks} currentUserId={user.id} />
    </div>
  )
}
