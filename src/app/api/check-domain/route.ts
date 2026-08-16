import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const domain = searchParams.get('domain')

  if (!domain) {
    return NextResponse.json({ error: 'Domain parameter is required' }, { status: 400 })
  }

  // Split domain into name and TLD
  const parts = domain.split('.')
  if (parts.length < 2) {
    return NextResponse.json({ error: 'Invalid domain format' }, { status: 400 })
  }

  const name = parts[0]
  const tld = parts.slice(1).join('.')

  // Read credentials from Environment
  const resellerId = process.env.RESELLER_USER_ID
  const apiKey = process.env.RESELLER_API_KEY

  if (!resellerId || !apiKey) {
    // If keys are not set, we return a mock response for testing the UI
    console.warn('RESELLER_USER_ID or RESELLER_API_KEY is not set. Returning MOCK response.')
    
    // Mock logic: assume domains ending in "123" are available, others taken
    const isAvailable = name.endsWith('123')
    
    return NextResponse.json({
      domain: domain,
      status: isAvailable ? 'available' : 'taken',
      mocked: true
    })
  }

  try {
    // Import node-fetch and HttpsProxyAgent dynamically to avoid Edge runtime conflicts if any
    const fetchWithProxy = (await import('node-fetch')).default
    const { HttpsProxyAgent } = await import('https-proxy-agent')

    // Usamos el proxy fijo de Los Ángeles para el buscador de dominios
    // (Para no tener que whitelistar 10 IPs en LogicBoxes)
    const proxyUrl = 'http://fbgfnpwd:rzhsae1p7jeu@198.23.243.226:6361/'
    const proxyAgent = new HttpsProxyAgent(proxyUrl)

    // LogicBoxes API Call
    const url = `https://httpapi.com/api/domains/available.json?auth-userid=${resellerId}&api-key=${apiKey}&domain-name=${name}&tlds=${tld}`
    
    const response = await fetchWithProxy(url, {
      agent: proxyAgent,
      headers: {
        'User-Agent': 'ExpertosMKD-Agency-Client/1.0',
        'Accept': 'application/json'
      }
    })
    
    // Check if response is HTML (like Cloudflare block)
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('text/html')) {
      const html = await response.text()
      if (html.includes('Cloudflare')) {
        return NextResponse.json({ error: 'API bloqueada por Cloudflare. Verifica que la IP del servidor esté en la lista blanca (Whitelist) de ResellerClub.' }, { status: 403 })
      }
      return NextResponse.json({ error: 'Respuesta HTML inesperada de la API.' }, { status: 502 })
    }

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: `Error de API: ${response.status} - ${errorText}` }, { status: response.status })
    }
    
    const data = await response.json() as any
    
    if (data.status === 'ERROR') {
      return NextResponse.json({ error: data.message || 'Error en credenciales o IP no autorizada.' }, { status: 403 })
    }
    
    const domainData = data[domain]
    
    if (!domainData || !domainData.status) {
      return NextResponse.json({ error: 'Respuesta inválida del registrador.' }, { status: 502 })
    }
    
    return NextResponse.json({
      domain: domain,
      status: domainData.status === 'available' ? 'available' : 'taken',
    })

  } catch (error: any) {
    console.error('Error checking domain:', error)
    return NextResponse.json({ error: error.message || 'Falló la conexión con la API.' }, { status: 500 })
  }
}
