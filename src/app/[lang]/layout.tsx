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

export const metadata: Metadata = {
  title: "Expertos MKD - Marketing & Web Development",
  description: "Websites that sell and marketing that scales. Premium agency in Los Cabos.",
};

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
      </body>
    </html>
  );
}
