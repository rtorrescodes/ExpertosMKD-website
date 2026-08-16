import { NextResponse } from 'next/server'
import { ImapFlow } from 'imapflow'
import { simpleParser } from 'mailparser'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  // En producción, aquí deberías verificar un header de autorización cron (ej. de Google Cloud Scheduler)
  
  const client = new ImapFlow({
    host: 'imap.titan.email',
    port: 993,
    secure: true,
    tls: { rejectUnauthorized: false },
    auth: {
      user: process.env.SMTP_USER || 'rtorres@expertosmkd.com',
      pass: process.env.SMTP_PASS || 'dSs^qg4pYJe#xd8uaJ0f'
    },
    logger: false,
    connectionTimeout: 10000
  })

  try {
    await client.connect()
    const lock = await client.getMailboxLock('INBOX')
    
    let processedCount = 0

    try {
      // Buscar correos que NO han sido marcados como leídos ni contestados
      // En un caso real, podríamos buscar \Seen = false, o crear un custom flag
      // Para este MVP vamos a buscar mensajes recientes y ver si ya están en Activity
      
      const mailbox = client.mailbox
      if (!mailbox || mailbox.exists === 0) {
        return NextResponse.json({ success: true, message: 'Inbox vacío' })
      }

      const start = Math.max(1, mailbox.exists - 10) // Últimos 10 correos
      const range = `${start}:*`

      for await (const message of client.fetch(range, { source: true, flags: true, uid: true })) {
        if (!message.source) continue

        const parsed = await simpleParser(message.source)
        const htmlContent = parsed.html || parsed.textAsHtml || parsed.text || ''
        const senderEmail = parsed.from?.value[0]?.address || ''
        const subject = parsed.subject || ''

        // Buscar ID inyectado: #id:cly...
        const idMatch = htmlContent.match(/#id:([a-zA-Z0-9]+)/)
        let leadId = idMatch ? idMatch[1] : null

        // Buscar Lead en la BD
        let lead = null
        if (leadId) {
          lead = await prisma.lead.findUnique({ where: { id: leadId } })
        } 
        if (!lead && senderEmail) {
          // Fallback por correo del remitente
          lead = await prisma.lead.findFirst({ where: { email: senderEmail } })
          if (lead) leadId = lead.id
        }

        if (lead && leadId) {
          // Verificar si ya guardamos este correo para no duplicar
          // (Podríamos usar message.uid o message-id como identificador único)
          const existingActivity = await prisma.activity.findFirst({
            where: {
              leadId: leadId,
              type: 'EMAIL_RECEIVED',
              subject: subject,
              createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // último día
              }
            }
          })

          if (!existingActivity) {
            await prisma.activity.create({
              data: {
                leadId,
                type: 'EMAIL_RECEIVED',
                subject,
                content: htmlContent
              }
            })
            processedCount++
          }
        }
      }

      return NextResponse.json({ success: true, processedCount })
    } finally {
      lock.release()
    }
  } catch (error: any) {
    console.error('Cron IMAP Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  } finally {
    if (client.usable) {
      await client.logout()
    } else {
      client.close()
    }
  }
}
