import { prisma } from "@/lib/prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Activity, TestTube, FileText, CheckCircle, Clock, Calendar } from "lucide-react";

export default async function TenantLandingPage(props: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: subdomain } = await props.params;

  const tenant = await prisma.tenant.findUnique({
    where: { subdomain },
  });

  if (!tenant) notFound();

  // If this is the 'qa-demo' tenant, we show Clinical Lab content, otherwise generic
  const isLab = subdomain === "qa-demo";
  
  const heroTitle = isLab ? "Precisión y Confiabilidad en tus Análisis Clínicos" : `Bienvenido a ${tenant.name}`;
  const heroSubtitle = isLab 
    ? "Resultados rápidos, tecnología de punta y el mejor trato humano para cuidar tu salud y la de tu familia." 
    : "Descubre nuestros servicios y productos diseñados especialmente para ti.";

  const services = isLab ? [
    { icon: TestTube, title: "Análisis de Sangre", desc: "Biometría hemática, química sanguínea y perfiles completos." },
    { icon: Activity, title: "Check-up Médico", desc: "Evaluación preventiva integral para hombres y mujeres." },
    { icon: FileText, title: "Resultados en Línea", desc: "Consulta e imprime tus resultados desde cualquier dispositivo." }
  ] : [
    { icon: CheckCircle, title: "Calidad Garantizada", desc: "Nuestros procesos cumplen con los más altos estándares." },
    { icon: Clock, title: "Atención Rápida", desc: "No esperes más, optimizamos tu tiempo al máximo." },
    { icon: FileText, title: "Servicios Digitales", desc: "Todo el control y seguimiento directamente desde tu perfil." }
  ];

  return (
    <div className="min-h-screen bg-[#01040f] text-slate-300 font-sans selection:bg-cyan-500/30">
      
      {/* Navigation */}
      <nav className="border-b border-white/5 glass-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20 text-xl">
                {tenant.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-bold text-xl text-white tracking-wide">{tenant.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link href="#servicios" className="text-slate-400 hover:text-cyan-400 transition-colors">Servicios</Link>
              <Link href={`/site/${subdomain}/store`} className="text-slate-400 hover:text-cyan-400 transition-colors">Tienda Virtual</Link>
              <Link href={`/admin/login`} className="text-slate-400 hover:text-cyan-400 transition-colors">Portal Pacientes</Link>
              {tenant.featureFlags?.appointments && (
                <Link 
                  href={`/site/${subdomain}/book`}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-5 py-2.5 rounded-lg transition-all"
                >
                  Agendar Cita
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#01040f] to-[#01040f] -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight mb-8">
            {heroTitle}
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed mb-12">
            {heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {tenant.featureFlags?.appointments && (
              <Link 
                href={`/site/${subdomain}/book`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-purple-500 hover:-translate-y-0.5 transition-all"
              >
                <Calendar className="w-5 h-5" />
                Agendar Estudio
              </Link>
            )}
            {tenant.featureFlags?.ecommerce && (
              <Link 
                href={`/site/${subdomain}/store`}
                className="inline-flex items-center justify-center rounded-xl glass-card border border-white/10 px-8 py-4 text-base font-bold text-white hover:bg-white/5 hover:border-cyan-400/50 transition-all"
              >
                Comprar Paquetes Preventivos
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="servicios" className="py-24 border-t border-white/5 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">Nuestros Servicios</h2>
            <p className="mt-4 text-slate-400 max-w-2xl mx-auto">Equipamiento de última generación y profesionales altamente capacitados para brindarte resultados exactos.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((svc, i) => (
              <div key={i} className="glass-card border border-white/5 p-8 rounded-2xl hover:border-cyan-500/30 transition-colors group">
                <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors">
                  <svc.icon className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{svc.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {svc.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 glass-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-white">
              {tenant.name.charAt(0).toUpperCase()}
            </div>
            <span className="font-bold text-white">{tenant.name}</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} {tenant.name}. Todos los derechos reservados.
          </p>
          <div className="text-sm text-slate-500 flex items-center gap-1">
            Powered by <span className="font-bold text-white">ExpertosMKD Celeritas</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
