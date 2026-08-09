import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expertos MKD - Ingeniería de Crecimiento",
  description: "Sistemas de ventas y marketing basados en datos.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Leemos la cookie asíncronamente (Requisito Next.js 15+)
  const cookieStore = await cookies();
  const shouldTrack = !cookieStore.get('ignore_analytics');

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {shouldTrack && (
          <>
            {/* Aquí debes agregar tus scripts de marketing reales.
                Ejemplo: Google Analytics (GA4) o Meta Pixel */}
            <Script id="marketing-scripts" strategy="afterInteractive">
              {`
                console.log('Marketing scripts activados. La visita ESTÁ siendo rastreada.');
                // window.dataLayer = window.dataLayer || [];
                // function gtag(){dataLayer.push(arguments);}
                // gtag('js', new Date());
                // gtag('config', 'G-XXXXXXXXXX');
              `}
            </Script>
          </>
        )}
        
        {!shouldTrack && (
          <Script id="marketing-scripts-disabled" strategy="afterInteractive">
            {`console.log('Opt-out activado. No se rastreará esta visita.');`}
          </Script>
        )}

        {children}
      </body>
    </html>
  );
}
