import { NextResponse } from 'next/server'
import whois from 'whois-parsed'

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

  try {
    // Usamos el protocolo WHOIS directo (Port 43) en lugar de la API de ResellerClub.
    // Esto puentea por completo la necesidad de un Proxy o de Whitelist de IP, 
    // y evita que Cloudflare nos bloquee.
    const result = await whois.lookup(domain)
    
    return NextResponse.json({
      domain: domain,
      status: result.isAvailable ? 'available' : 'taken',
      via: 'whois'
    })

  } catch (error: any) {
    console.error('Error checking domain via WHOIS:', error)
    
    // Si falla el WHOIS por alguna razón de timeout o formato, devolvemos 'taken' por precaución 
    // o un error 500 para que la UI lo maneje.
    return NextResponse.json({ 
      error: error.message || 'Falló la conexión con el servidor WHOIS.',
      status: 'taken'
    }, { status: 200 }) // Status 200 para que la UI no truene, pero asuma que está tomado.
  }
}
