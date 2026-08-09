import ContactForm from '@/components/ContactForm'
import { Code2, TrendingUp, Cpu, Database, ChevronRight, MessageCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white selection:bg-cyan-500/30">
      {/* NAVBAR */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-[#0a0f1c]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Expertos MKD</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#servicios" className="hover:text-cyan-400 transition">Servicios</a>
            <a href="#metodologia" className="hover:text-cyan-400 transition">Metodología</a>
            <a href="#casos" className="hover:text-cyan-400 transition">Casos de Éxito</a>
          </div>
          <a href="#contacto" className="hidden md:inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 rounded-full transition">
            Agenda una Auditoría
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-cyan-400 mb-8 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Ingeniería de Crecimiento 2026
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            <span className="block text-slate-300">No hacemos &quot;marketing&quot;.</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              Construimos sistemas de ventas.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Somos ingenieros de software, científicos de pauta y expertos en automatización comercial. Escalamos negocios B2B y SaaS basados 100% en datos.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#contacto" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-sm tracking-wide hover:scale-105 transition duration-300 shadow-xl shadow-white/10 flex items-center justify-center gap-2">
              Auditoría Gratuita <ChevronRight className="w-4 h-4" />
            </a>
            <a href="#servicios" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-slate-700 hover:border-slate-500 text-white rounded-full font-semibold text-sm tracking-wide transition duration-300 flex items-center justify-center">
              Ver Metodología
            </a>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="servicios" className="py-24 relative border-t border-white/5 bg-[#0d1326]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">El Stack de Crecimiento</h2>
            <p className="text-slate-400">Implementamos arquitecturas completas que abarcan desde la adquisición hasta la retención, sin fricciones técnicas.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#131b31] border border-white/5 p-8 rounded-2xl hover:border-cyan-500/30 transition-colors group">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Ingeniería & Web Apps</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Desarrollo de portales, SaaS y Landing Pages con React, Next.js y Tailwind optimizados para máxima velocidad de conversión.
              </p>
            </div>
            <div className="bg-[#131b31] border border-white/5 p-8 rounded-2xl hover:border-blue-500/30 transition-colors group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Growth & Performance Ads</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Gestión avanzada de pauta en Google, Meta y LinkedIn Ads utilizando modelos de atribución y Server-Side Tracking.
              </p>
            </div>
            <div className="bg-[#131b31] border border-white/5 p-8 rounded-2xl hover:border-purple-500/30 transition-colors group">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Automatización & CRM</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Despliegue y arquitectura de CRMs (HubSpot, Salesforce) y flujos de automatización para nutrir prospectos 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contacto" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Escalemos tu negocio de forma predecible.</h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                Déjanos tus datos y el reto principal que estás enfrentando. Un estratega técnico analizará tu stack actual y te presentará un plan de acción concreto, sin costo.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-cyan-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Decisiones basadas en datos</h4>
                    <p className="text-sm text-slate-400">No adivinamos, optimizamos iterando.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-purple-400">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Ejecución Técnica Impecable</h4>
                    <p className="text-sm text-slate-400">Tu propio equipo de desarrollo y growth.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#131b31]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative">
              <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-xs font-bold shadow-lg">
                Respuesta en 24h
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#0a0f1c] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Code2 className="w-6 h-6 text-slate-500" />
            <span className="text-lg font-bold text-slate-300">Expertos MKD</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 Expertos MKD. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <a 
        href="https://wa.me/526246220525?text=Hola,%20vi%20su%20sitio%20web%20y%20me%20gustaria%20saber%20mas%20sobre%20los%20servicios%20de%20Expertos%20MKD" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition duration-300 z-50 group"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute inset-0 rounded-full border-4 border-emerald-500/30 animate-ping pointer-events-none -z-10"></span>
      </a>
    </div>
  )
}
