'use client'

import { useState, useRef } from 'react'
import { TipTapEditor } from './TipTapEditor'
import { downloadElementAsPdf } from '@/lib/pdf-generator'
import { sendProposalEmail } from '@/actions/send-proposal'
import { FileText, Mail, Loader2, CheckCircle, Send, Download } from 'lucide-react'

// Definimos un tipo parcial para los leads que recibimos del servidor
type LeadOption = {
  id: string
  name: string
  companyName: string
  email: string | null
}

export function ProposalGenerator({ leads, initialLeadId = '' }: { leads: LeadOption[], initialLeadId?: string }) {
  const [selectedLeadId, setSelectedLeadId] = useState(initialLeadId)
  const [subject, setSubject] = useState('Propuesta de Marketing Digital - Expertos MKD')
  const [content, setContent] = useState(`
    <h1>Propuesta de Crecimiento Digital</h1>
    <p>Hola,</p>
    <p>He revisado la presencia digital de su negocio y he notado áreas de oportunidad críticas donde podríamos ayudarles a captar más clientes en la zona.</p>
    <ul>
      <li>Optimización de SEO Local.</li>
      <li>Diseño Web de Alta Conversión.</li>
      <li>Campañas en Google Ads y Meta.</li>
    </ul>
    <p>Me encantaría tener una breve llamada para mostrarles nuestra metodología.</p>
    <p>Atentamente,<br><b>El Equipo de Expertos MKD</b></p>
  `)
  
  const [isExporting, setIsExporting] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [message, setMessage] = useState('')
  
  const letterRef = useRef<HTMLDivElement>(null)

  const handleExportPdf = async () => {
    if (!letterRef.current) return
    setIsExporting(true)
    setMessage('')
    
    const lead = leads.find(l => l.id === selectedLeadId)
    const filename = lead ? `Propuesta_${lead.companyName.replace(/\s+/g, '_')}.pdf` : 'Propuesta_ExpertosMKD.pdf'
    
    const success = await downloadElementAsPdf(letterRef.current, filename)
    
    setIsExporting(false)
    if (success) {
      setMessage('PDF generado y descargado correctamente.')
    } else {
      setMessage('Error al generar el PDF.')
    }
  }

  const handleSendEmail = async () => {
    if (!selectedLeadId) {
      setMessage('Por favor, selecciona un prospecto primero.')
      return
    }
    
    setIsSending(true)
    setMessage('')
    
    const res = await sendProposalEmail(selectedLeadId, subject, content)
    
    setIsSending(false)
    if (res.success) {
      setMessage('¡Correo enviado exitosamente!')
    } else {
      setMessage(`Error enviando correo: ${res.error}`)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Columna Izquierda: Editor */}
      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Configuración de la Propuesta
          </h2>
          
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Prospecto Destino</label>
            <select 
              value={selectedLeadId}
              onChange={e => setSelectedLeadId(e.target.value)}
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
            >
              <option value="">Selecciona un Lead...</option>
              {leads.map(lead => (
                <option key={lead.id} value={lead.id}>
                  {lead.companyName} {lead.email ? `(${lead.email})` : '(Sin correo)'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Asunto del Correo</label>
            <input 
              type="text" 
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Ej. Propuesta Comercial..." 
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Contenido de la Propuesta</label>
            <TipTapEditor value={content} onChange={setContent} />
          </div>

          {message && (
            <div className={`p-3 rounded-xl text-sm border ${message.includes('Error') ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
              <div className="flex items-center gap-2">
                {!message.includes('Error') && <CheckCircle className="w-4 h-4" />}
                {message}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button 
              onClick={handleExportPdf}
              disabled={isExporting || isSending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-xl transition border border-white/10 disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Descargar PDF
            </button>
            <button 
              onClick={handleSendEmail}
              disabled={isExporting || isSending || !selectedLeadId}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-sm font-medium rounded-xl transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Enviar Correo
            </button>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Vista Previa PDF */}
      <div>
        <div className="sticky top-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            Vista Previa de Impresión
          </h3>
          
          <div className="bg-slate-800/50 pt-4 rounded-2xl border border-white/5 overflow-hidden flex justify-center w-full">
            <div 
              className="origin-top"
              style={{ transform: 'scale(0.55)', width: '816px', marginBottom: '-45%' }}
            >
              <div 
                ref={letterRef}
                className="bg-white w-[816px] min-h-[1056px] mx-auto p-12 shadow-2xl relative"
              >
              {/* Membrete Header */}
              <div className="flex justify-between items-center border-b-2 border-cyan-500 pb-6 mb-8">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">EXPERTOS<span className="text-cyan-500">MKD</span></h1>
                  <p className="text-sm text-slate-500 mt-1">Agencia de Marketing Digital B2B</p>
                </div>
                <div className="text-right text-xs text-slate-500 space-y-1">
                  <p>contacto@expertosmkd.com</p>
                  <p>www.expertosmkd.com</p>
                  <p>Tel: (55) 1234-5678</p>
                </div>
              </div>

              {/* Fecha y Destinatario */}
              <div className="mb-10 text-slate-800">
                <p className="mb-4">{new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                {selectedLeadId ? (
                  <div>
                    <p className="font-bold">{leads.find(l => l.id === selectedLeadId)?.companyName}</p>
                    <p>Atención: Mesa Directiva / Administración</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-slate-400">[Selecciona un prospecto]</p>
                  </div>
                )}
              </div>

              {/* Contenido HTML de TipTap */}
              <div 
                className="prose prose-slate max-w-none prose-p:text-slate-700 prose-headings:text-slate-900"
                dangerouslySetInnerHTML={{ __html: content }} 
              />

              {/* Membrete Footer */}
              <div className="absolute bottom-12 left-12 right-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
                <p>Expertos MKD - Elevando el estándar digital en México.</p>
                <p>Este documento es confidencial y dirigido exclusivamente a su destinatario.</p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
