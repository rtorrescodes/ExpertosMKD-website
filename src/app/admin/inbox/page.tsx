import { InboxClient } from '@/components/crm/InboxClient'

export const metadata = {
  title: 'Inbox - ExpertosMKD CRM'
}

export default function InboxPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Bandeja de Entrada</h1>
          <p className="text-slate-400 text-sm mt-1">
            Revisa las respuestas de tus prospectos directamente desde tu cuenta de Titan Mail.
          </p>
        </div>
      </div>

      <InboxClient />
    </div>
  )
}
