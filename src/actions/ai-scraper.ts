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
import { getRandomProxyUrl } from '@/lib/proxies'
import * as cheerio from 'cheerio'

export async function mineLeads(state: string, city: string, keyword: string, count: number, currentUserId: string) {
  if (!process.env.DEEPSEEK_API_KEY) {
    return { success: false, error: 'DEEPSEEK_API_KEY no está configurada.' }
  }

  try {
    const fetchWithProxy = (await import('node-fetch')).default
    const { HttpsProxyAgent } = await import('https-proxy-agent')

    const proxyUrl = getRandomProxyUrl()
    const proxyAgent = new HttpsProxyAgent(proxyUrl)

    const searchQuery = keyword + ' en ' + city + ', ' + state + ' contacto telefono correo sitio web'
    const searchUrl = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(searchQuery)

    const response = await fetchWithProxy(searchUrl, {
      agent: proxyAgent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'text/html'
      }
    })

    if (!response.ok) {
      throw new Error('Error en búsqueda: ' + response.status)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    const searchResults: string[] = []
    $('.result__body').each((i, el) => {
      const title = $(el).find('.result__title').text().trim()
      const snippet = $(el).find('.result__snippet').text().trim()
      searchResults.push('Titulo: ' + title + '\nDescripción: ' + snippet)
    })

    if (searchResults.length === 0) return { success: false, error: 'No se encontraron resultados.' }

    const rawData = searchResults.slice(0, 15).join('\n---\n')

    const prompt = 'Eres un minero de datos B2B. A continuación presento resultados crudos. Extrae un máximo de ' + count + ' negocios de categoria: ' + keyword + '. Responde ESTRICTAMENTE un JSON array plano: [{"name":"", "companyName":"", "email":"", "phone":"", "website":"", "state":"' + state + '", "city":"' + city + '"}]. Resultados crudos:\n' + rawData

    const aiResponse = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1
    })

    const content = aiResponse.choices[0].message.content || '[]'
    const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim()
    let leads: any[] = []
    
    try { leads = JSON.parse(cleanContent) } catch (e) { return { success: false, error: 'Formato IA inválido.' } }
    if (!Array.isArray(leads) || leads.length === 0) return { success: false, error: 'No se encontraron prospectos válidos.' }

    let industry = await prisma.industry.findFirst({ where: { name: keyword } })
    if (!industry) industry = await prisma.industry.create({ data: { name: keyword, description: 'Generada' } })

    let addedCount = 0
    let duplicatesCount = 0

    for (const lead of leads) {
      if (!lead.companyName) continue
      const exists = await prisma.lead.findFirst({
        where: {
          OR: [
            { companyName: lead.companyName },
            { email: lead.email ? lead.email : 'NON_EXISTENT_EMAIL_123' },
            { phone: lead.phone ? lead.phone : 'NON_EXISTENT_PHONE_123' }
          ]
        }
      })

      if (exists) {
        duplicatesCount++
        continue
      }

      await prisma.lead.create({
        data: {
          name: lead.name || 'Prospecto Web',
          companyName: lead.companyName,
          email: lead.email || null,
          phone: lead.phone || null,
          website: lead.website || null,
          state: lead.state,
          city: lead.city,
          status: 'NEW',
          source: 'B2B_SCRAPER',
          industryId: industry.id,
          assignedToId: currentUserId
        }
      })
      addedCount++
    }

    return { success: true, added: addedCount, duplicates: duplicatesCount, totalExtracted: leads.length }

  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
