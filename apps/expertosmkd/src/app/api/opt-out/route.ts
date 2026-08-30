import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  
  cookieStore.set('ignore_analytics', 'true', {
    maxAge: 60 * 60 * 24 * 365 * 10,
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
  })

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Opt-out Exitoso | Expertos MKD</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          background-color: #0a0f1c;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          text-align: center;
        }
        .container {
          background: rgba(255,255,255,0.05);
          padding: 3rem;
          border-radius: 1.5rem;
          border: 1px solid rgba(255,255,255,0.1);
          max-width: 500px;
        }
        h1 { color: #34d399; margin-bottom: 1rem; }
        p { color: #94a3b8; line-height: 1.6; margin-bottom: 2rem; }
        a {
          display: inline-block;
          background: linear-gradient(to right, #06b6d4, #9333ea);
          color: white;
          text-decoration: none;
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          font-weight: 600;
          transition: transform 0.2s;
        }
        a:hover { transform: scale(1.05); }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Tracking Desactivado ✅</h1>
        <p>Tu visita como administrador/desarrollador ya no será contabilizada en las analíticas (GA4, Pixel, etc.). La cookie "ignore_analytics" ha sido configurada exitosamente por 10 años.</p>
        <a href="/">Volver al Inicio</a>
      </div>
    </body>
    </html>
  `

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  })
}
