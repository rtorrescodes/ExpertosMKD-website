"use server"

import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'

interface DirectEmailOptions {
  to: string
  subject: string
  htmlContent: string
  leadId?: string
  inReplyTo?: string // Message-ID del correo original si es una respuesta
}

export async function sendDirectEmail(options: DirectEmailOptions) {
  try {
    const { to, subject, htmlContent, leadId, inReplyTo } = options

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.titan.email',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const mailOptions: any = {
      from: `ExpertosMKD <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html: htmlContent,
    }

    if (inReplyTo) {
      mailOptions.inReplyTo = inReplyTo
      mailOptions.references = [inReplyTo]
    }

    const info = await transporter.sendMail(mailOptions)

    // Si hay leadId, registrar en el historial de actividades
    if (leadId) {
      await prisma.activity.create({
        data: {
          leadId,
          type: 'EMAIL_SENT',
          subject,
          content: htmlContent
        }
      })
    }

    return { success: true, messageId: info.messageId }
  } catch (error: any) {
    console.error('Error enviando correo directo:', error)
    return { success: false, error: error.message }
  }
}
