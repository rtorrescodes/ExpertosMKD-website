import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, challenge } = body

    if (!name || !email || !challenge) {
      return NextResponse.json(
        { error: 'Name, email, and challenge are required' },
        { status: 400 }
      )
    }

    // SMTP Configuration
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #06b6d4; margin-bottom: 20px;">Nuevo Lead - ExpertosMKD</h2>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <p style="margin: 0 0 10px 0;"><strong>👤 Nombre:</strong> ${name}</p>
          <p style="margin: 0 0 10px 0;"><strong>✉️ Email:</strong> <a href="mailto:${email}" style="color: #0ea5e9;">${email}</a></p>
        </div>
        
        <h3 style="color: #334155; margin-bottom: 10px;">Reto de Negocio:</h3>
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 5px; border-left: 4px solid #06b6d4;">
          <p style="margin: 0; color: #475569; line-height: 1.5;">${challenge}</p>
        </div>
        
        <p style="font-size: 12px; color: #94a3b8; margin-top: 30px; text-align: center;">
          Este correo fue enviado automáticamente desde el formulario de contacto de la web de ExpertosMKD.
        </p>
      </div>
    `

    const mailOptions = {
      from: `"ExpertosMKD Web" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      subject: `🔥 Nuevo Lead B2B: ${name}`,
      replyTo: email,
      html: htmlContent,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true, message: 'Email sent successfully' })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
