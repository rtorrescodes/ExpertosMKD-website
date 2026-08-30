'use client'

import { useState } from 'react'
import { Calendar, CheckCircle2, Clock, Mail, Phone, Users, X, CalendarIcon, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { updateTaskStatus, deleteTask } from '@/actions/tasks'
import { format, isPast, isToday, isTomorrow, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export function TasksClient({ initialTasks, currentUserId }: { initialTasks: any[], currentUserId: string }) {
  const [tasks, setTasks] = useState(initialTasks)
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending')
  const [loading, setLoading] = useState(false)

  const pendingTasks = tasks.filter(t => t.status === 'PENDING')
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED' || t.status === 'CANCELLED')

  const currentTasks = activeTab === 'pending' ? pendingTasks : completedTasks

  const handleComplete = async (taskId: string) => {
    setLoading(true)
    const res = await updateTaskStatus(taskId, 'COMPLETED')
    if (res.success) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'COMPLETED' } : t))
    }
    setLoading(false)
  }

  const handleDelete = async (taskId: string) => {
    if (!confirm('¿Seguro que deseas eliminar esta tarea?')) return
    setLoading(true)
    const res = await deleteTask(taskId)
    if (res.success) {
      setTasks(prev => prev.filter(t => t.id !== taskId))
    }
    setLoading(false)
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'CALL': return <Phone className="w-4 h-4 text-emerald-400" />
      case 'MEETING': return <Users className="w-4 h-4 text-purple-400" />
      case 'EMAIL': return <Mail className="w-4 h-4 text-blue-400" />
      default: return <CheckCircle2 className="w-4 h-4 text-slate-400" />
    }
  }

  const getDateBadge = (date: Date) => {
    if (isPast(date) && !isToday(date)) {
      return <span className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md text-xs font-bold">VENCIDA</span>
    }
    if (isToday(date)) {
      return <span className="px-2 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-md text-xs font-bold">HOY</span>
    }
    if (isTomorrow(date)) {
      return <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-xs font-bold">MAÑANA</span>
    }
    return <span className="px-2 py-1 bg-slate-800 text-slate-400 border border-white/5 rounded-md text-xs font-bold">{format(date, "d MMM", { locale: es })}</span>
  }

  return (
    <div className="space-y-6">
      <div className="flex border-b border-white/5">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-3 text-sm font-bold transition-colors relative ${activeTab === 'pending' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
        >
          TAREAS PENDIENTES
          <span className="ml-2 px-2 py-0.5 rounded-full bg-white/10 text-xs font-normal">{pendingTasks.length}</span>
          {activeTab === 'pending' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500" />}
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={`px-6 py-3 text-sm font-bold transition-colors relative ${activeTab === 'completed' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
        >
          HISTORIAL COMPLETADO
          <span className="ml-2 px-2 py-0.5 rounded-full bg-white/10 text-xs font-normal">{completedTasks.length}</span>
          {activeTab === 'completed' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500" />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentTasks.length === 0 ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center glass-card rounded-2xl border border-white/5">
            <CalendarIcon className="w-12 h-12 text-slate-600 mb-4" />
            <p className="text-white font-medium text-lg">No hay tareas aquí</p>
            <p className="text-slate-400 text-sm mt-1">
              Las tareas y seguimientos que programes desde el perfil de tus prospectos aparecerán aquí.
            </p>
            <Link 
              href="/admin/leads"
              className="mt-6 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Ir a Mis Prospectos
            </Link>
          </div>
        ) : (
          currentTasks.map(task => (
            <div key={task.id} className="glass-card p-5 rounded-2xl border border-white/5 relative group hover:border-white/10 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-white/5">
                    {getTypeIcon(task.type)}
                  </div>
                  {activeTab === 'pending' && getDateBadge(new Date(task.dueDate))}
                </div>
                {activeTab === 'pending' && (
                  <button 
                    onClick={() => handleDelete(task.id)}
                    disabled={loading}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1 opacity-0 group-hover:opacity-100 disabled:opacity-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <h3 className="font-bold text-white text-lg leading-tight mb-1">{task.title}</h3>
              {task.description && (
                <p className="text-sm text-slate-400 line-clamp-2 mb-4">{task.description}</p>
              )}

              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-4">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {format(new Date(task.dueDate), "EEEE d 'de' MMMM, h:mm a", { locale: es })} 
                  <span className="text-slate-600 font-normal ml-1">
                    ({formatDistanceToNow(new Date(task.dueDate), { addSuffix: true, locale: es })})
                  </span>
                </span>
              </div>

              {task.lead && (
                <Link href={`/admin/leads/${task.lead.id}`} className="block mb-4">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 hover:border-primary-500/30 transition-colors flex justify-between items-center group/lead">
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Relacionado con</p>
                      <p className="text-sm text-white font-medium">{task.lead.companyName || task.lead.name}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover/lead:text-primary-400 transition-colors" />
                  </div>
                </Link>
              )}

              {activeTab === 'pending' && (
                <button 
                  onClick={() => handleComplete(task.id)}
                  disabled={loading}
                  className="w-full mt-auto flex items-center justify-center gap-2 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" /> Marcar como Completada
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
