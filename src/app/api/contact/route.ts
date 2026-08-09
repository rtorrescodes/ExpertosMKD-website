import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { name, email, company, challenge } = data

    // 1. Guardar el Lead en la base de datos (Supabase)
    const newLead = await prisma.lead.create({
      data: {
        name,
        email,
        company,
        challenge,
      },
    })

    // 2. Enviar el correo usando Titan SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // true para 465, false para otros
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: `Expertos MKD <${process.env.SMTP_FROM}>`,
      to: process.env.SMTP_TO,
      subject: `🔥 Nuevo Lead: ${name} de ${company}`,
      html: `
        <h2>Nuevo prospecto recibido desde ExpertosMKD.com</h2>
        <ul>
          <li><strong>Nombre:</strong> ${name}</li>
          <li><strong>Correo:</strong> ${email}</li>
          <li><strong>Empresa:</strong> ${company}</li>
        </ul>
        <h3>Reto / Mensaje:</h3>
        <p>${challenge}</p>
        <hr/>
        <p><small>Este lead ya está guardado automáticamente en tu panel de Supabase (/admin).</small></p>
      `,
    })

    return NextResponse.json({ success: true, lead: newLead }, { status: 200 })
  } catch (error) {
    console.error('Error in contact API:', error)
    return NextResponse.json(
      { error: 'Internal server error while processing the lead.' },
      { status: 500 }
    )
  }
}
