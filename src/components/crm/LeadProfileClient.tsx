'use client'

import { useState } from 'react'
import { Building, Mail, MapPin, Globe, Phone, Calendar, CheckCircle2, AlertCircle, Send, StickyNote, Clock, Plus, PhoneCall, Calculator, MessageCircle, Circle, X } from 'lucide-react'
import { updateLeadStatus, addManualActivity, rateLead } from '@/actions/lead-actions'
import { createTask } from '@/actions/tasks'
import { sendDirectEmail } from '@/actions/send-direct-email'
import { TipTapEditor } from '@/components/crm/TipTapEditor'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function LeadProfileClient({ lead: initialLead }: { lead: any }) {
  const router = useRouter()
  const [lead, setLead] = useState(initialLead)
  const [activeTab, setActiveTab] = useState<'timeline' | 'details'>('timeline')
  const [isUpdating, setIsUpdating] = useState(false)
  const [noteType, setNoteType] = useState('LLAMADA')
  const [noteContent, setNoteContent] = useState('')

  // Email Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailContent, setEmailContent] = useState('')
  const [emailTemplate, setEmailTemplate] = useState('blank')
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  // Task Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [taskForm, setTaskForm] = useState({ title: '', description: '', date: '', time: '', type: 'CALL' })
  const [isCreatingTask, setIsCreatingTask] = useState(false)

  // Demo Templates
  const EMAIL_TEMPLATES = {
    escuelas: [
      {
        id: 'escuelas_1',
        name: 'Presentación de Agencia para Colegios',
        subject: 'Estrategia de Inscripciones para {{companyName}}',
        content: `
          <h2>Hola {{name}},</h2>
          <p>Hemos notado que <strong>{{companyName}}</strong> tiene un gran potencial para incrementar su matrícula este próximo ciclo escolar.</p>
          <p>En ExpertosMKD nos especializamos en marketing educativo. Ayudamos a colegios a llenar sus aulas mediante estrategias digitales comprobadas.</p>
          <p>¿Tendrías 15 minutos esta semana para platicar sobre cómo podemos colaborar?</p>
          <br/>
          <p>Saludos cordiales,<br/><strong>Equipo ExpertosMKD</strong></p>
        `
      }
    ],
    restaurantes: [
      {
        id: 'restaurantes_1',
        name: 'Atracción de Comensales Locales',
        subject: 'Más clientes todos los días en {{companyName}}',
        content: `
          <h2>Hola {{name}},</h2>
          <p>Sabemos que el flujo constante de clientes es vital para <strong>{{companyName}}</strong>.</p>
          <p>Nuestras campañas de geolocalización pueden poner tu restaurante frente a personas que buscan comer justo en tu zona.</p>
          <p>¿Te gustaría ver algunos casos de éxito?</p>
          <br/>
          <p>Saludos,<br/><strong>Equipo ExpertosMKD</strong></p>
        `
      }
    ]
  }

  const handleTemplateChange = (templateId: string) => {
    setEmailTemplate(templateId)
    if (templateId === 'blank') {
      setEmailSubject('')
      setEmailContent('')
      return
    }

    // Buscar en todas las categorías
    let selectedTemp = null
    for (const category of Object.values(EMAIL_TEMPLATES)) {
      const found = category.find(t => t.id === templateId)
      if (found) selectedTemp = found
    }

    if (selectedTemp) {
      const nameVal = lead.name || 'Director'
      const companyVal = lead.companyName || 'su negocio'
      
      const parsedSubject = selectedTemp.subject.replace(/{{name}}/g, nameVal).replace(/{{companyName}}/g, companyVal)
      const parsedContent = selectedTemp.content.replace(/{{name}}/g, nameVal).replace(/{{companyName}}/g, companyVal)
      
      setEmailSubject(parsedSubject)
      setEmailContent(parsedContent)
    }
  }

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailSubject.trim() || !emailContent.trim()) {
      alert('El asunto y el mensaje son requeridos')
      return
    }
    
    setIsSendingEmail(true)
    const res = await sendDirectEmail({
      to: lead.email,
      subject: emailSubject,
      htmlContent: emailContent,
      leadId: lead.id
    })
    
    if (res.success) {
      setIsEmailModalOpen(false)
      setEmailSubject('')
      setEmailContent('')
      // Para mostrarlo en el historial, podemos forzar recarga (refresh) o añadirlo localmente
      router.refresh()
    } else {
      alert('Error al enviar correo: ' + res.error)
    }
    setIsSendingEmail(false)
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskForm.title || !taskForm.date || !taskForm.time) return
    setIsCreatingTask(true)
    
    // Convert date and time to Date object
    const [year, month, day] = taskForm.date.split('-').map(Number)
    const [hours, minutes] = taskForm.time.split(':').map(Number)
    const dueDate = new Date(year, month - 1, day, hours, minutes)

    const res = await createTask({
      title: taskForm.title,
      description: taskForm.description,
      dueDate,
      type: taskForm.type,
      userId: lead.assignedToId,
      leadId: lead.id
    })
    
    if (res.success) {
      setIsTaskModalOpen(false)
      setTaskForm({ title: '', description: '', date: '', time: '', type: 'CALL' })
      alert('Tarea programada exitosamente')
      router.refresh()
    } else {
      alert('Error al programar tarea: ' + res.error)
    }
    setIsCreatingTask(false)
  }

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    const res = await updateLeadStatus(lead.id, newStatus)
    if (!res.success) {
      alert('Error al actualizar estatus')
    }
    setIsUpdating(false)
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!noteContent.trim()) return
    setIsUpdating(true)
    // Type mapping to our backend types
    const mappedType = noteType === 'LLAMADA' ? 'CALL' :
                       noteType === 'COTIZACIÓN' ? 'PROPOSAL_SENT' :
                       noteType === 'WHATSAPP' ? 'WHATSAPP' : 'NOTE'

    const res = await addManualActivity(lead.id, mappedType, noteType, noteContent)
    if (res.success) {
      setNoteContent('')
    } else {
      alert('Error al guardar la nota')
    }
    setIsUpdating(false)
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'NEW': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'CONTACTED': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      case 'QUALIFIED': return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      case 'PROPOSAL_SENT': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
      case 'CLOSED_WON': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'CLOSED_LOST': return 'bg-red-500/10 text-red-400 border-red-500/20'
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }
  }

  const getActivityUI = (type: string) => {
    switch(type) {
      case 'CALL':
      case 'LLAMADA':
        return { icon: <PhoneCall className="w-4 h-4 text-blue-400" />, ring: 'border-blue-500/50', label: 'LLAMADA' }
      case 'PROPOSAL_SENT':
      case 'COTIZACIÓN':
        return { icon: <Calculator className="w-4 h-4 text-amber-400" />, ring: 'border-amber-500/50', label: 'COTIZACIÓN' }
      case 'EMAIL_SENT':
      case 'EMAIL_RECEIVED':
        return { icon: <Mail className="w-4 h-4 text-cyan-400" />, ring: 'border-cyan-500/50', label: 'CORREO' }
      case 'WHATSAPP':
        return { icon: <MessageCircle className="w-4 h-4 text-emerald-400" />, ring: 'border-emerald-500/50', label: 'WHATSAPP' }
      case 'STATUS_CHANGE':
        return { icon: <CheckCircle2 className="w-4 h-4 text-purple-400" />, ring: 'border-purple-500/50', label: 'ESTATUS' }
      default:
        return { icon: <StickyNote className="w-4 h-4 text-slate-400" />, ring: 'border-slate-500/50', label: 'NOTA' }
    }
  }

  const handleRate = async (rating: string) => {
    setIsUpdating(true)
    const res = await rateLead(lead.id, rating)
    if (res.success) {
      lead.rating = rating
    }
    setIsUpdating(false)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      
      {/* Panel Lateral: Info y Acciones */}
      <div className="w-full lg:w-1/3 space-y-6">
        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-slate-900/40">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 rounded-2xl bg-slate-800 border flex items-center justify-center shadow-inner ${lead.rating === 'GREEN' ? 'border-green-500/50 text-green-500' : lead.rating === 'YELLOW' ? 'border-yellow-500/50 text-yellow-500' : lead.rating === 'RED' ? 'border-red-500/50 text-red-500' : 'border-white/10 text-cyan-500'}`}>
              <Building className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white leading-tight">{lead.companyName || lead.name}</h2>
              <p className="text-sm text-slate-400 mb-2">{lead.industry || 'Industria no especificada'}</p>
              
              {/* Semáforo Rating */}
              <div className="flex items-center gap-1.5 bg-slate-950/50 px-2 py-1.5 rounded-lg border border-white/5 w-fit">
                <button onClick={() => handleRate('GREEN')} disabled={isUpdating} className={`p-1 rounded-full transition-all ${lead.rating === 'GREEN' ? 'bg-green-500/20 text-green-500 scale-110' : 'text-slate-600 hover:text-green-500 hover:bg-white/5'}`} title="Interesado"><Circle className="w-3 h-3 fill-current" /></button>
                <button onClick={() => handleRate('YELLOW')} disabled={isUpdating} className={`p-1 rounded-full transition-all ${lead.rating === 'YELLOW' ? 'bg-yellow-500/20 text-yellow-500 scale-110' : 'text-slate-600 hover:text-yellow-500 hover:bg-white/5'}`} title="En proceso"><Circle className="w-3 h-3 fill-current" /></button>
                <button onClick={() => handleRate('RED')} disabled={isUpdating} className={`p-1 rounded-full transition-all ${lead.rating === 'RED' ? 'bg-red-500/20 text-red-500 scale-110' : 'text-slate-600 hover:text-red-500 hover:bg-white/5'}`} title="No interesado"><Circle className="w-3 h-3 fill-current" /></button>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Estatus del Pipeline</label>
              <select 
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isUpdating}
                className={`w-full appearance-none px-4 py-2.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-colors ${getStatusColor(lead.status)}`}
              >
                <option value="NEW">Nuevo / Prospecto</option>
                <option value="CONTACTED">Contactado</option>
                <option value="QUALIFIED">Calificado</option>
                <option value="PROPOSAL_SENT">Propuesta Enviada</option>
                <option value="CLOSED_WON">Cierre Ganado</option>
                <option value="CLOSED_LOST">Cierre Perdido</option>
              </select>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-3 text-sm">
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="truncate">{lead.email || 'Sin correo'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-4 h-4 text-slate-500" />
                <span>{lead.phone || 'Sin teléfono'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Globe className="w-4 h-4 text-slate-500" />
                <a href={lead.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline truncate">
                  {lead.websiteUrl || 'Sin sitio web'}
                </a>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>{lead.city}, {lead.state}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => setIsTaskModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 transition-colors"
            >
              <Calendar className="w-4 h-4" /> Agendar Seguimiento
            </button>
            <Link 
              href={`/admin/proposals?leadId=${lead.id}`}
              className="w-full flex items-center justify-center gap-2 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium shadow-lg shadow-cyan-500/20 transition-colors"
            >
              <Calculator className="w-4 h-4" /> Generar Cotización
            </Link>
            <button 
              onClick={() => setIsEmailModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors"
            >
              Enviar Correo Normal
            </button>
          </div>
        </div>
      </div>

      {/* Panel Central: Tabs */}
      <div className="flex-1 glass-card rounded-2xl border border-white/5 bg-[#080b14] overflow-hidden flex flex-col">
        <div className="flex border-b border-white/5 bg-slate-900/60">
          <button 
            onClick={() => setActiveTab('timeline')}
            className={`px-6 py-4 text-sm font-medium transition-colors relative ${activeTab === 'timeline' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Historial de Actividad
            {activeTab === 'timeline' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500" />}
          </button>
          <button 
            onClick={() => setActiveTab('details')}
            className={`px-6 py-4 text-sm font-medium transition-colors relative ${activeTab === 'details' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Detalles y Notas
            {activeTab === 'details' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500" />}
          </button>
        </div>

        <div className="p-8 flex-1 overflow-y-auto">
          {activeTab === 'timeline' ? (
            <div className="space-y-8">
              
              <div>
                <h3 className="text-white font-bold tracking-wider mb-6 uppercase text-lg">BITÁCORA DE SEGUIMIENTO</h3>
                
                {/* Formulario de Notas */}
                <form onSubmit={handleAddNote} className="bg-[#0b101e] p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <select 
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value)}
                    className="bg-[#050810] border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 min-w-[140px]"
                  >
                    <option value="LLAMADA">Llamada</option>
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="COTIZACIÓN">Cotización</option>
                    <option value="NOTA">Nota</option>
                  </select>
                  
                  <input 
                    type="text"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Resumen de la interacción..."
                    className="flex-1 bg-[#050810] border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                  
                  <button 
                    type="submit"
                    disabled={isUpdating || !noteContent.trim()}
                    className="flex items-center gap-2 px-6 py-2 bg-[#5CE1E6] hover:bg-[#4bc1c5] text-[#050810] rounded-lg text-sm font-bold transition disabled:opacity-50 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" /> AGREGAR
                  </button>
                </form>
              </div>

              {/* Timeline */}
              <div className="relative pl-0 space-y-6 before:absolute before:inset-0 before:mx-auto before:w-px before:bg-slate-700/50 mt-12 pt-4">
                {lead.activities?.map((activity: any) => {
                  const ui = getActivityUI(activity.type)
                  return (
                    <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      {/* Icon */}
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${ui.ring} bg-[#0b101e] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 mx-auto shadow-lg shadow-black/50`}>
                        {ui.icon}
                      </div>
                      
                      {/* Card */}
                      <div className="w-[calc(50%-2.5rem)] p-5 rounded-xl border border-white/5 bg-[#0b101e] shadow-lg relative">
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2 py-1 bg-white/5 text-slate-300 text-[10px] font-bold uppercase rounded-md tracking-wider">
                            {ui.label}
                          </span>
                          <time className="text-xs text-slate-500 font-mono">
                            {new Date(activity.createdAt).toLocaleString('es-MX', { 
                              day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                            })}
                          </time>
                        </div>
                        <div className="text-slate-300 text-sm mb-3">
                          {activity.type === 'EMAIL_RECEIVED' || activity.type === 'EMAIL_SENT' ? (
                             <div dangerouslySetInnerHTML={{ __html: activity.content }} className="prose prose-invert prose-sm max-w-none line-clamp-3" />
                          ) : (
                            activity.content
                          )}
                        </div>

                        {activity.type === 'PROPOSAL_SENT' && (
                           <Link href={`/admin/proposals?leadId=${lead.id}`} className="text-[#5CE1E6] hover:text-[#4bc1c5] text-xs font-bold uppercase tracking-wider flex items-center gap-1 mt-4">
                             ABRIR COTIZACIÓN &rarr;
                           </Link>
                        )}
                        {(activity.type === 'EMAIL_SENT' || activity.type === 'EMAIL_RECEIVED') && (
                           <Link href={`/admin/inbox`} className="text-[#5CE1E6] hover:text-[#4bc1c5] text-xs font-bold uppercase tracking-wider flex items-center gap-1 mt-4">
                             VER EN BANDEJA &rarr;
                           </Link>
                        )}
                      </div>
                    </div>
                  )
                })}

                {(!lead.activities || lead.activities.length === 0) && (
                  <div className="text-center text-slate-500 py-8 bg-[#0b101e] rounded-xl border border-white/5 mt-8 z-10 relative max-w-md mx-auto">
                    No hay historial de actividad registrado para este lead.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-slate-300 text-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Información de la Empresa</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-slate-500 mb-1">Origen del Lead</p>
                  <p className="font-medium text-white">{lead.source || 'Manual'}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Fecha de Creación</p>
                  <p className="font-medium text-white">{new Date(lead.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-500 mb-1">Notas de Scrapping / Generales</p>
                  <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                    {lead.notes || 'No hay notas generales registradas.'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Task Scheduling Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0b101e] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-white/5 bg-slate-900/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Agendar Tarea</h2>
                  <p className="text-xs text-slate-400">Seguimiento con {lead.companyName || lead.name}</p>
                </div>
              </div>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors">
                <X className="w-5 h-5"/>
              </button>
            </div>
            
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Tipo de Tarea</label>
                <select 
                  required
                  value={taskForm.type}
                  onChange={e => setTaskForm({...taskForm, type: e.target.value})}
                  className="w-full bg-[#050810] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="CALL">Llamada</option>
                  <option value="MEETING">Reunión</option>
                  <option value="EMAIL">Enviar Correo</option>
                  <option value="TODO">Otra Tarea</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Título / Asunto</label>
                <input 
                  required
                  type="text"
                  value={taskForm.title}
                  onChange={e => setTaskForm({...taskForm, title: e.target.value})}
                  placeholder="Ej. Llamada de descubrimiento"
                  className="w-full bg-[#050810] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Fecha</label>
                  <input 
                    required
                    type="date"
                    value={taskForm.date}
                    onChange={e => setTaskForm({...taskForm, date: e.target.value})}
                    className="w-full bg-[#050810] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Hora</label>
                  <input 
                    required
                    type="time"
                    value={taskForm.time}
                    onChange={e => setTaskForm({...taskForm, time: e.target.value})}
                    className="w-full bg-[#050810] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Notas Adicionales (Opcional)</label>
                <textarea 
                  value={taskForm.description}
                  onChange={e => setTaskForm({...taskForm, description: e.target.value})}
                  rows={3}
                  className="w-full bg-[#050810] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
                <button type="button" onClick={() => setIsTaskModalOpen(false)} className="px-5 py-2.5 text-slate-400 hover:text-white transition-colors text-sm font-medium">
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isCreatingTask}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50 text-sm flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  {isCreatingTask ? 'Agendando...' : 'Agendar Tarea'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Composer Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0b101e] border border-white/10 rounded-2xl w-full max-w-6xl overflow-hidden shadow-2xl flex flex-col h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-white/5 bg-slate-900/40 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                  <Mail className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Redactar Correo</h2>
                  <p className="text-xs text-slate-400">Para: {lead.email}</p>
                </div>
              </div>
              <button onClick={() => setIsEmailModalOpen(false)} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors">
                <X className="w-5 h-5"/>
              </button>
            </div>
            
            <form onSubmit={handleSendEmail} className="flex flex-col flex-1 overflow-hidden min-h-0">
              <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                
                {/* Panel Izquierdo: Editor */}
                <div className="flex-1 flex flex-col p-6 space-y-4 overflow-y-auto">
                  <div className="flex-1 flex flex-col space-y-4 min-h-[400px]">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Plantilla por Giro</label>
                      <select 
                        value={emailTemplate}
                        onChange={(e) => handleTemplateChange(e.target.value)}
                        className="w-full bg-[#050810] border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                      >
                        <option value="blank">Correo en Blanco</option>
                        <optgroup label="Sector Educativo (Escuelas)">
                          {EMAIL_TEMPLATES.escuelas.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Sector Gastronómico (Restaurantes)">
                          {EMAIL_TEMPLATES.restaurantes.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Asunto del Correo *</label>
                      <input 
                        required 
                        value={emailSubject} 
                        onChange={e => setEmailSubject(e.target.value)} 
                        placeholder="Ej. Propuesta de Servicios para su Empresa"
                        className="w-full bg-[#050810] border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors" 
                      />
                    </div>

                    <div className="flex-1 flex flex-col h-full">
                      <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Cuerpo del Correo *</label>
                      <div className="flex-1 border border-white/10 rounded-lg overflow-hidden flex flex-col bg-white">
                        <TipTapEditor value={emailContent} onChange={setEmailContent} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Panel Derecho: Preview */}
                <div className="flex-1 bg-slate-900/20 p-6 flex flex-col overflow-y-auto min-h-[400px]">
                  <label className="block text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Vista Previa del Cliente</label>
                  
                  <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200 flex-1 flex flex-col">
                    {/* Fake Email Client Header */}
                    <div className="bg-slate-100 border-b border-slate-200 p-4 space-y-2 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-sm w-12 text-right">De:</span>
                        <span className="text-slate-800 text-sm font-semibold">Equipo ExpertosMKD &lt;hola@expertosmkd.com&gt;</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-sm w-12 text-right">Para:</span>
                        <span className="text-slate-800 text-sm">{lead.email}</span>
                      </div>
                      <div className="flex items-start gap-2 pt-1">
                        <span className="text-slate-500 text-sm w-12 text-right">Asunto:</span>
                        <span className="text-slate-900 text-sm font-bold">{emailSubject || '(Sin asunto)'}</span>
                      </div>
                    </div>
                    {/* Fake Email Client Body */}
                    <div className="p-6 text-slate-800 text-sm flex-1 overflow-y-auto">
                      <div 
                        className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2" 
                        dangerouslySetInnerHTML={{ __html: emailContent || '<p class="text-slate-400 italic">El contenido del correo aparecerá aquí...</p>' }}
                      />
                    </div>
                  </div>
                </div>

              </div>
              
              <div className="p-4 border-t border-white/5 bg-slate-900/40 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setIsEmailModalOpen(false)} className="px-5 py-2.5 text-slate-400 hover:text-white transition-colors text-sm font-medium">
                  Descartar
                </button>
                <button 
                  type="submit" 
                  disabled={isSendingEmail || !emailSubject.trim()} 
                  className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50 shadow-lg shadow-cyan-500/20 text-sm"
                >
                  <Send className="w-4 h-4" />
                  {isSendingEmail ? 'Enviando...' : 'Enviar Correo Real'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
