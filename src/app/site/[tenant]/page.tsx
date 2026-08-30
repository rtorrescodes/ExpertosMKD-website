import { prisma } from "@/lib/prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Activity, TestTube, FileText, CheckCircle, Clock, HeartPulse, ArrowRight } from "lucide-react";

export default async function TenantLandingPage(props: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: subdomain } = await props.params;

  const tenant = await prisma.tenant.findUnique({
    where: { subdomain },
  });

  if (!tenant) notFound();

  // Si es qa-demo usamos los textos de laboratorio clínico
  const isLab = subdomain === "qa-demo";
  
  const heroTitle = isLab ? "Excelencia Clínica" : tenant.name;
  const heroTitleHighlight = isLab ? "a su Alcance" : "al Siguiente Nivel";
  const heroSubtitle = isLab 
    ? "Tecnología de vanguardia para diagnósticos precisos y resultados rápidos. Un entorno digital diseñado para su salud." 
    : "Descubre nuestros servicios y productos premium diseñados especialmente para ti, con la tecnología más avanzada.";

  const services = isLab ? [
    { icon: TestTube, title: "Análisis de Sangre", desc: "Paneles comprensivos con tecnología de última generación para resultados exactos y confiables." },
    { icon: HeartPulse, title: "Chequeos Ejecutivos", desc: "Evaluación de salud holística y personalizada, diseñada para prevenir y optimizar su bienestar." },
    { icon: FileText, title: "Resultados Online", desc: "Acceso rápido, seguro y encriptado a sus informes médicos desde cualquier dispositivo." }
  ] : [
    { icon: CheckCircle, title: "Calidad Garantizada", desc: "Nuestros procesos cumplen con los más altos estándares de exigencia del mercado global." },
    { icon: Clock, title: "Atención Rápida", desc: "No esperes más, optimizamos tu tiempo al máximo con flujos de atención prioritarios." },
    { icon: FileText, title: "Servicios Digitales", desc: "Todo el control, facturación y seguimiento directamente desde tu perfil." }
  ];

  return (
    <div className="min-h-screen bg-[#051424] text-slate-300 font-sans selection:bg-cyan-500/30 flex flex-col">
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-[#051424]/80 backdrop-blur-md border-b border-white/5 h-20 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(0,240,255,0.3)] text-xl">
              {tenant.name.charAt(0).toUpperCase()}
            </div>
            <span className="font-bold text-xl text-white tracking-wide">{tenant.name}</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#servicios" className="text-slate-400 hover:text-cyan-400 transition-colors">Servicios</Link>
            <Link href={`/site/${subdomain}/store`} className="text-slate-400 hover:text-cyan-400 transition-colors">Tienda Virtual</Link>
            <Link href={`/admin/login`} className="text-slate-400 hover:text-cyan-400 transition-colors">Portal de Acceso</Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section (Stitch Style) */}
        <section className="relative min-h-[85vh] flex items-center px-6 overflow-hidden">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#051424] via-[#0a1526] to-[#052c38] z-0"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
          
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 py-12">
            {/* Hero Content */}
            <div className="flex flex-col items-start gap-6">
              <div className="glass-card px-4 py-2 rounded-full inline-flex items-center gap-2 border-cyan-500/30">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Sistemas Online</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight">
                {heroTitle} <br/>
                <span className="text-cyan-400/90">{heroTitleHighlight}</span>
              </h1>
              
              <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                {heroSubtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
                {tenant.featureFlags?.appointments && (
                  <Link 
                    href={`/site/${subdomain}/book`}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider hover:from-blue-500 hover:to-cyan-400 transition-all w-full sm:w-auto text-center shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                  >
                    Agendar Estudio
                  </Link>
                )}
                {tenant.featureFlags?.ecommerce && (
                  <Link 
                    href={`/site/${subdomain}/store`}
                    className="glass-card text-cyan-400 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-cyan-500/10 transition-all w-full sm:w-auto text-center border-cyan-500/30"
                  >
                    Ver Especialidades
                  </Link>
                )}
              </div>
            </div>

            {/* Hero Visual (Abstract Medical) */}
            <div className="hidden lg:block relative h-[600px] w-full">
              <div 
                className="w-full h-full rounded-2xl glass-card opacity-80 mix-blend-screen bg-cover bg-center border border-white/5" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCV1RLTNLCp4RTIbJ0dd-0skrDZKRs6uzkXpt13LEov4ZJwQLJwh2pgPTQVL69_KfJ8Fz5tZ8ON_OA9PZaEYzziiodraVmiF5hEddbVYGov6b2_bIeeZNOBF4lRM7V_p-FB5utD5v1SVPKSQfIR1DZ8zz6noINbYYNhljxs1IJCB6lC6ipQ0GgznR2tKpsbr1g0NAkWBhKGJLIOqEKLbdDZeaPshbH78fAd77693s997YFez9B3ZWpJMvEJzm32jH56EMHWPtiQua8')" }}
              ></div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="servicios" className="py-24 px-6 relative z-10 bg-[#020813]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-4">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Servicios Destacados</h2>
                <p className="text-slate-400">Precisión analítica y atención integral.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((svc, i) => (
                <div key={i} className="glass-card p-8 rounded-xl flex flex-col gap-4 border border-white/5 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.1)] transition-all duration-300 group cursor-pointer h-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/50 transition-colors relative z-10">
                    <svc.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mt-2 relative z-10">{svc.title}</h3>
                  <p className="text-slate-400 flex-grow relative z-10">{svc.desc}</p>
                  
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-cyan-400 text-xs font-bold uppercase relative z-10">
                    <span>Saber más</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer Component */}
      <footer className="w-full py-12 bg-[#020813] border-t border-white/10 mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col gap-4">
            <div className="text-xl font-semibold text-cyan-400">{tenant.name}</div>
            <p className="text-slate-500 text-sm">© {new Date().getFullYear()} {tenant.name}. Clinical Excellence Defined.</p>
          </div>
          <div className="flex flex-col gap-2">
            <a className="text-slate-400 text-sm hover:text-cyan-400 transition-colors w-fit" href="#">Privacy Policy</a>
            <a className="text-slate-400 text-sm hover:text-cyan-400 transition-colors w-fit" href="#">Terms of Service</a>
          </div>
          <div className="flex flex-col gap-2">
            <a className="text-slate-400 text-sm hover:text-cyan-400 transition-colors w-fit" href="#">Contact Us</a>
            <div className="text-sm text-slate-500 flex items-center gap-1 mt-4">
              Powered by <span className="font-bold text-white">ExpertosMKD Celeritas</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
