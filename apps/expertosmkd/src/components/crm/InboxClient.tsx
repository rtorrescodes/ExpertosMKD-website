'use client'

import { useState, useEffect } from 'react'
import { fetchRecentEmails, markEmailAsRead, deleteEmail, type EmailDTO } from '@/actions/imap-client'
import { sendDirectEmail } from '@/actions/send-direct-email'
import { Mail, Loader2, RefreshCw, ChevronRight, ArrowLeft, Trash2, Reply, Forward, Send } from 'lucide-react'
import { TipTapEditor } from '@/components/crm/TipTapEditor'

export function InboxClient() {
  const [emails, setEmails] = useState<EmailDTO[]>([])
  const [selectedEmail, setSelectedEmail] = useState<EmailDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Reply / Forward States
  const [isComposing, setIsComposing] = useState(false)
  const [composeType, setComposeType] = useState<'reply' | 'forward'>('reply')
  const [replyContent, setReplyContent] = useState('')
  const [forwardTo, setForwardTo] = useState('')
  const [sending, setSending] = useState(false)

  const loadEmails = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await fetchRecentEmails(30)
      if (result.success && result.emails) {
        setEmails(result.emails)
      } else {
        setError(result.error || 'Error desconocido al obtener correos')
      }
    } catch (err: any) {
      setError(err.message || 'Error de red')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmails()
  }, [])

  const handleSelectEmail = async (email: EmailDTO) => {
    setSelectedEmail(email)
    setIsComposing(false)
    
    if (!email.flags.includes('\\Seen')) {
      try {
        await markEmailAsRead(email.uid)
        setEmails(prev => prev.map(e => e.id === email.id ? { ...e, flags: [...e.flags, '\\Seen'] } : e))
      } catch (e) {
        console.error('Error marcando como leído:', e)
      }
    }
  }

  const handleDelete = async () => {
    if (!selectedEmail) return
    const confirmed = confirm('¿Estás seguro de que deseas eliminar este correo?')
    if (!confirmed) return

    setLoading(true)
    const success = await deleteEmail(selectedEmail.uid)
    if (success) {
      setEmails(prev => prev.filter(e => e.id !== selectedEmail.id))
      setSelectedEmail(null)
    } else {
      alert('Hubo un error al eliminar el correo.')
    }
    setLoading(false)
  }

  const handleReply = () => {
    setComposeType('reply')
    setReplyContent('<p><br></p>')
    setIsComposing(true)
  }

  const handleForward = () => {
    setComposeType('forward')
    setForwardTo('')
    setReplyContent(`<p><br></p><hr/><p><strong>Mensaje reenviado:</strong></p><div>${selectedEmail?.html || selectedEmail?.text}</div>`)
    setIsComposing(true)
  }

  const handleSend = async () => {
    if (!selectedEmail) return
    setSending(true)

    const subject = composeType === 'reply' ? `Re: ${selectedEmail.subject}` : `Fwd: ${selectedEmail.subject}`
    const to = composeType === 'reply' ? selectedEmail.from.match(/<([^>]+)>/)?.[1] || selectedEmail.from : forwardTo

    if (!to) {
      alert('Por favor ingresa un destinatario válido.')
      setSending(false)
      return
    }

    const result = await sendDirectEmail({
      to,
      subject,
      htmlContent: replyContent,
      inReplyTo: composeType === 'reply' ? selectedEmail.id : undefined // Id original (en un caso real se usa el Message-ID del header)
    })

    if (result.success) {
      alert('¡Mensaje enviado con éxito!')
      setIsComposing(false)
    } else {
      alert('Error al enviar mensaje: ' + result.error)
    }
    setSending(false)
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] border border-white/5 bg-slate-900/40 rounded-2xl overflow-hidden glass-card">
      
      {/* Panel Izquierdo: Lista de Correos */}
      <div className={`w-full lg:w-1/3 flex flex-col border-r border-white/5 ${selectedEmail ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-900/60">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-400" />
            Bandeja de Entrada
          </h2>
          <button 
            onClick={loadEmails}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading && emails.length === 0 ? (
            <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mb-4" />
              <p>Conectando con Titan IMAP...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <div className="bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20 text-sm">
                Error: {error}
              </div>
            </div>
          ) : emails.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <p>No hay correos en la bandeja de entrada.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {emails.map(email => {
                const isUnread = !email.flags.includes('\\Seen')
                const isSelected = selectedEmail?.id === email.id
                
                return (
                  <button
                    key={email.id}
                    onClick={() => handleSelectEmail(email)}
                    className={`w-full text-left p-4 hover:bg-white/5 transition relative flex items-start gap-3 ${isSelected ? 'bg-cyan-500/10' : ''}`}
                  >
                    {isUnread && <span className="w-2 h-2 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className={`text-sm truncate pr-2 ${isUnread ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
                          {email.from.split('<')[0].trim()}
                        </span>
                        <span className="text-xs text-slate-500 flex-shrink-0">
                          {new Date(email.date).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${isUnread ? 'font-semibold text-slate-200' : 'text-slate-400'}`}>
                        {email.subject}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Panel Derecho: Visualizador de Correo y Composer */}
      <div className={`flex-1 flex flex-col bg-[#01040f] ${!selectedEmail ? 'hidden lg:flex' : 'flex'}`}>
        {selectedEmail ? (
          <>
            {/* Toolbar */}
            <div className="p-4 border-b border-white/5 bg-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedEmail(null)}
                  className="p-2 -ml-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 lg:hidden"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                
                <div className="flex gap-2">
                  <button 
                    onClick={handleReply}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition"
                  >
                    <Reply className="w-4 h-4" /> Responder
                  </button>
                  <button 
                    onClick={handleForward}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition"
                  >
                    <Forward className="w-4 h-4" /> Reenviar
                  </button>
                </div>
              </div>

              <button 
                onClick={handleDelete}
                className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition"
                title="Eliminar correo"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            {/* Cabecera del Mensaje */}
            <div className="p-6 border-b border-white/5 bg-slate-900/40">
              <h1 className="text-xl font-bold text-white mb-4">{selectedEmail.subject}</h1>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-slate-300">
                    {selectedEmail.from.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">{selectedEmail.from}</p>
                    <p className="text-slate-500 text-xs">Para: mí</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto relative bg-white">
              <iframe
                title="Email Content"
                sandbox="allow-same-origin allow-popups"
                className="w-full h-full border-none p-6"
                srcDoc={selectedEmail.html || `<div style="font-family: sans-serif; white-space: pre-wrap;">${selectedEmail.text}</div>`}
              />
            </div>

            {/* Composer Integrado (Responder/Reenviar) */}
            {isComposing && (
              <div className="border-t border-white/10 bg-slate-900/90 p-4 h-80 flex flex-col shadow-2xl z-20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-300 w-full">
                    <span className="font-medium text-cyan-400">
                      {composeType === 'reply' ? 'Responder a:' : 'Reenviar a:'}
                    </span>
                    {composeType === 'reply' ? (
                      <span className="truncate">{selectedEmail.from.match(/<([^>]+)>/)?.[1] || selectedEmail.from}</span>
                    ) : (
                      <input 
                        type="email" 
                        value={forwardTo}
                        onChange={(e) => setForwardTo(e.target.value)}
                        placeholder="correo@ejemplo.com"
                        className="bg-black/50 border border-white/10 rounded-lg px-3 py-1 outline-none text-white focus:border-cyan-500 w-full max-w-xs"
                      />
                    )}
                  </div>
                  <button 
                    onClick={() => setIsComposing(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    X
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto mb-4 bg-white/5 rounded-xl border border-white/10">
                   <TipTapEditor content={replyContent} onChange={setReplyContent} />
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={handleSend}
                    disabled={sending}
                    className="flex items-center gap-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-xl transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {sending ? 'Enviando...' : 'Enviar Mensaje'}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-6 border border-white/5">
              <Mail className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Bandeja de Entrada</h3>
            <p className="max-w-sm">Selecciona un correo de la lista izquierda para leer o interactuar.</p>
          </div>
        )}
      </div>
    </div>
  )
}
