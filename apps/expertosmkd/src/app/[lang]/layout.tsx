import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import Script from "next/script";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const lang = resolvedParams.lang
  
  const title = lang === 'es' ? 'Expertos MKD - Agencia de Marketing y Desarrollo Web Premium' : 'Expertos MKD - Premium Marketing & Web Development Agency'
  const description = lang === 'es' ? 'Diseñamos sitios web que venden y estrategias de marketing que escalan. Especialistas en CRO, UX/UI y embudos de conversión.' : 'We design websites that sell and marketing strategies that scale. Specialists in CRO, UX/UI, and conversion funnels.'

  return {
    title,
    description,
    metadataBase: new URL('https://expertosmkd.com'), // Replace with your actual domain
    alternates: {
      languages: {
        'es': '/es',
        'en': '/en',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://expertosmkd.com/${lang}`,
      siteName: 'Expertos MKD',
      locale: lang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@ExpertosMKD',
    },
  }
}

export async function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }]
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>
}>) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;
  
  const cookieStore = await cookies();
  const shouldTrack = !cookieStore.get('ignore_analytics');

  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-cyan-500/30">
        {shouldTrack && (
           <Script id="marketing-scripts" strategy="afterInteractive">
             {`console.log('Marketing scripts activados.');`}
           </Script>
        )}
        {!shouldTrack && (
          <Script id="marketing-scripts-disabled" strategy="afterInteractive">
            {`console.log('Opt-out activado.');`}
          </Script>
        )}
        {children}
        
        {/* JSON-LD Organization Schema */}
        <Script id="organization-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "Expertos MKD",
            "image": "https://expertosmkd.com/logo.png",
            "url": "https://expertosmkd.com",
            "description": lang === 'es' ? "Agencia premium de desarrollo web y marketing digital." : "Premium web development and digital marketing agency.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Los Cabos",
              "addressRegion": "BCS",
              "addressCountry": "MX"
            },
            "priceRange": "$$$"
          })
        }} />
      </body>
    </html>
  );
}
