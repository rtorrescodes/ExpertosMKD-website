"use server"

import { ImapFlow } from 'imapflow'
import { simpleParser } from 'mailparser'

// DTO para enviar al Frontend de forma segura (sin objetos Date complejos ni streams)
export type EmailDTO = {
  id: string
  uid: number
  seq: number
  subject: string
  from: string
  date: string
  text: string
  html: string
  flags: string[]
}

const getImapClient = () => {
  return new ImapFlow({
    host: 'imap.titan.email',
    port: 993,
    secure: true,
    tls: {
      rejectUnauthorized: false // Permite conectar a Titan sin problemas de certificado local
    },
    auth: {
      user: process.env.SMTP_USER || 'rtorres@expertosmkd.com',
      pass: process.env.SMTP_PASS || 'dSs^qg4pYJe#xd8uaJ0f'
    },
    logger: false,
    connectionTimeout: 10000
  })
}

/**
 * Obtiene los últimos N correos de la bandeja de entrada
 */
export async function fetchRecentEmails(limit: number = 20): Promise<{ success: boolean, emails?: EmailDTO[], error?: string }> {
  const client = getImapClient()
  
  try {
    await client.connect()
    const lock = await client.getMailboxLock('INBOX')
    
    try {
      const messages: EmailDTO[] = []
      
      // Obtener el total de mensajes para sacar los últimos
      const mailbox = client.mailbox
      if (!mailbox || mailbox.exists === 0) {
        return { success: true, emails: [] }
      }

      // Rango: los últimos `limit` mensajes (ej. "100:120")
      const start = Math.max(1, mailbox.exists - limit + 1)
      const range = `${start}:*`

      // Fetch messages
      for await (const message of client.fetch(range, { source: true, flags: true, uid: true })) {
        if (!message.source) continue

        // Parsear el raw email con mailparser
        const parsed = await simpleParser(message.source)
        
        messages.push({
          id: message.uid.toString(),
          uid: message.uid,
          seq: message.seq,
          subject: parsed.subject || 'Sin Asunto',
          from: parsed.from?.text || 'Desconocido',
          date: parsed.date ? parsed.date.toISOString() : new Date().toISOString(),
          text: parsed.text || '',
          html: parsed.html || parsed.textAsHtml || '',
          flags: Array.from(message.flags)
        })
      }

      // Ordenar del más reciente al más antiguo
      messages.reverse()

      return { success: true, emails: messages }
    } finally {
      lock.release()
    }
  } catch (error: any) {
    console.error('IMAP Fetch Error:', error)
    return { success: false, error: error.message }
  } finally {
    if (client.usable) {
      await client.logout()
    } else {
      client.close()
    }
  }
}

/**
 * Marca un correo como leído (Añade flag \Seen)
 */
export async function markEmailAsRead(uid: number): Promise<boolean> {
  const client = getImapClient()
  try {
    await client.connect()
    const lock = await client.getMailboxLock('INBOX')
    try {
      await client.messageFlagsAdd({ uid }, ['\\Seen'], { uid: true })
      return true
    } finally {
      lock.release()
    }
  } catch (error) {
    console.error('Error marcando correo como leído:', error)
    return false
  } finally {
    if (client.usable) {
      await client.logout()
    } else {
      client.close()
    }
  }
}

/**
 * Mueve un correo a la papelera (añade flag \Deleted y expunge)
 */
export async function deleteEmail(uid: number): Promise<boolean> {
  const client = getImapClient()
  try {
    await client.connect()
    const lock = await client.getMailboxLock('INBOX')
    try {
      await client.messageFlagsAdd({ uid }, ['\\Deleted'], { uid: true })
      // Ejecutar expunge para purgar los mensajes marcados como eliminados
      await client.mailboxClose() // Cierra el mailbox, lo que dispara expunge automáticamente en algunos servidores
      return true
    } finally {
      lock.release()
    }
  } catch (error) {
    console.error('Error borrando correo:', error)
    return false
  } finally {
    if (client.usable) {
      await client.logout()
    } else {
      client.close()
    }
  }
}
