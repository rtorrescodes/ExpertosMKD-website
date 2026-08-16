"use server"

import OpenAI from 'openai'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export interface ScraperOptions {
  state: string
  city: string
  industryId: string
  terms: string
  count?: number
  requireNoWebsite: boolean
  requireFreeEmail: boolean
  allowWebsite: boolean
}

export async function generateLeadsWithDeepSeek(options: ScraperOptions) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      throw new Error('No autorizado')
    }

    const { state, city, industryId, terms, count = 10, requireNoWebsite, requireFreeEmail, allowWebsite } = options

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      throw new Error("No hay una llave de API de DeepSeek configurada en .env (DEEPSEEK_API_KEY).")
    }

    // Usamos el SDK de OpenAI pero apuntando a la API de DeepSeek
    const openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: apiKey
    })

    const locationStr = `${city}, ${state}`

    let rules = ''
    if (requireNoWebsite && !allowWebsite) {
      rules += 'Busca negocios que estrictamente NO tengan un sitio web profesional. '
    } else if (allowWebsite) {
      rules += 'Busca negocios que tengan sitio web (probablemente desactualizado) para venderles rediseño. '
    }
    
    if (requireFreeEmail) {
      rules += 'Busca negocios que usen correos electrónicos gratuitos (hotmail, gmail, yahoo, prodigy, etc.). '
    }

    if (!rules) {
      rules = 'Busca negocios de forma general en este giro, independientemente de si tienen sitio web o correo profesional. '
    }

    const prompt = `
Eres un experto en extracción de datos B2B y marketing digital.
Necesito que busques en tu conocimiento y generes una lista de ${count} negocios reales (o estimaciones realistas basadas en negocios típicos de la zona) que coincidan con los siguientes términos: "${terms}" ubicados estrictamente en "${locationStr}".

Reglas de búsqueda:
${rules}

Devuelve tu respuesta ÚNICAMENTE como un JSON válido que contenga un arreglo llamado "leads".
Cada lead debe tener la siguiente estructura exacta:
- "name": Nombre del negocio o persona de contacto.
- "email": Un correo electrónico (si lo conoces o general, según las reglas).
- "phone": Un número de teléfono si lo conoces, o null.
- "companyName": El nombre comercial.
- "address": La dirección física y municipio.
- "state": El estado (ej. "${state}").
- "usesGenericEmail": (booleano true/false).
- "hasWebsite": (booleano true/false según si encontraste un dominio).
- "websiteUrl": La URL si aplica o null.

No devuelvas ningún texto adicional, ni explicaciones, solo el JSON estructurado.
`

    const response = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a data extraction assistant that outputs strictly in JSON.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' }
    })

    const resultText = response.choices[0].message.content
    if (!resultText) throw new Error('Respuesta vacía de DeepSeek')
    
    const parsed = JSON.parse(resultText)
    const leadsToInsert = parsed.leads || parsed

    if (!Array.isArray(leadsToInsert) || leadsToInsert.length === 0) {
        throw new Error('DeepSeek no devolvió un arreglo válido de leads.')
    }

    let insertedCount = 0;
    for (const l of leadsToInsert) {
      // Verificar si ya existe por nombre y estado
      const existing = await prisma.lead.findFirst({
        where: { name: l.name, state: l.state }
      })
      
      if (!existing) {
        await prisma.lead.create({
          data: {
            name: l.name || 'Desconocido',
            email: l.email || null,
            phone: l.phone ? String(l.phone) : null,
            companyName: l.companyName || l.name,
            industryId: industryId,
            city: city, // Force current target city
            state: state, // Force current target state
            usesGenericEmail: l.usesGenericEmail ?? true,
            hasWebsite: l.hasWebsite ?? false,
            websiteUrl: l.websiteUrl || null,
            status: 'NEW',
            source: 'DeepSeek AI Scraper',
            assignedToId: null, // Los leads escrapeados caen al Pool
            notes: "Extraído automáticamente mediante IA.\nParámetros: " + JSON.stringify(options),
          }
        })
        insertedCount++;
      }
    }

    return { success: true, count: insertedCount }

  } catch (error: any) {
    console.error('DeepSeek Scraping Error:', error)
    return { success: false, error: error.message }
  }
}
