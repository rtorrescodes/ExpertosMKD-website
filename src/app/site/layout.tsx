import '../globals.css';

export default function SiteRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen bg-[#01040f] text-slate-300">
        {children}
      </body>
    </html>
  );
}
