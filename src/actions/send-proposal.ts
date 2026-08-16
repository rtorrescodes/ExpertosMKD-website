"use server"

import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function sendProposalEmail(leadId: string, subject: string, htmlContent: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      throw new Error('No autorizado')
    }

    // 1. Obtener el Lead
    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    })

    if (!lead || !lead.email) {
      throw new Error('El prospecto no existe o no tiene un correo electrónico configurado.')
    }

    // 2. Configurar Transporter (Titan SMTP)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.titan.email',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true, // SSL/TLS
      auth: {
        user: process.env.SMTP_USER || 'rtorres@expertosmkd.com',
        pass: process.env.SMTP_PASS || 'dSs^qg4pYJe#xd8uaJ0f',
      },
    })

    // 3. Plantilla de Correo (Inyectando el contenido HTML de TipTap y el ID oculto)
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        ${htmlContent}
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
        <div style="font-size: 12px; color: #666;">
          <p>Este correo fue enviado por ExpertosMKD. Si no deseas recibir más correos, responde a este mensaje.</p>
          <p style="color: transparent; font-size: 1px;">#id:${leadId}</p>
        </div>
      </div>
    `

    // 4. Enviar Correo
    const info = await transporter.sendMail({
      from: `"Expertos MKD" <${process.env.SMTP_USER || 'rtorres@expertosmkd.com'}>`,
      to: lead.email,
      subject: subject,
      html: emailHtml,
    })

    // 5. Registrar la actividad en el CRM y actualizar estado
    await prisma.$transaction([
      prisma.lead.update({
        where: { id: leadId },
        data: { status: 'CONTACTED' }
      }),
      prisma.activity.create({
        data: {
          leadId: leadId,
          type: 'EMAIL_SENT',
          subject: subject,
          content: htmlContent
        }
      })
    ])

    return { success: true, messageId: info.messageId }

  } catch (error: any) {
    console.error('Error enviando correo SMTP:', error)
    return { success: false, error: error.message }
  }
}
