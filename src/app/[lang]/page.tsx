import { getDictionary } from '@/app/dictionaries'
import { Code2, TrendingUp, Cpu, Database, ChevronRight, MessageCircle, Globe, MonitorSmartphone, PenTool, Smartphone, Bot, Search, Mail, LineChart, FileText, ArrowRight, Zap, CheckCircle2 } from 'lucide-react'
import ContactForm from '@/components/ContactForm'
import ParticlesBackground from '@/components/ParticlesBackground'
import { BorderBeam } from '@/components/magicui/border-beam'
import { VideoText } from '@/components/magicui/video-text'
import RotatingHero from '@/components/RotatingHero'
import { Safari } from '@/components/magicui/safari'
import { Iphone15Pro } from '@/components/magicui/iphone-15-pro'
import { ShinyButton } from '@/components/magicui/shiny-button'
import { HexagonPattern } from '@/components/magicui/hexagon-pattern'
import { GlyphMatrix } from '@/components/magicui/glyph-matrix'
import { Logo } from '@/components/Logo'
import { HeroMockups } from '@/components/HeroMockups'
import { ScrollToTop } from '@/components/ScrollToTop'
import DomainSearch from '@/components/DomainSearch'
import { posts } from '@/data/posts'
import BlogCarousel from '@/components/BlogCarousel'
import Link from 'next/link'
import Footer from '@/components/Footer'

export default async function LandingPage({
  params
}: {
  params: Promise<{ lang: 'en' | 'es' }>
}) {
  const resolvedParams = await params
  const lang = resolvedParams.lang
  const dict = await getDictionary(lang)
  
  const otherLang = lang === 'es' ? 'en' : 'es'

  return (
    <div className="min-h-screen bg-[#01040f] text-slate-50 font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      <GlyphMatrix opacity={0.12} />
      
      {/* BACKGROUND BLOBS & PARTICLES */}
      <ParticlesBackground />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-600/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-purple-600/10 rounded-full mix-blend-screen filter blur-[150px] animate-blob animation-delay-4000"></div>
        
        {/* Floating Code Decorations inspired by Codanta.DEV */}
        <div className="absolute top-[15%] left-[5%] text-cyan-500/10 font-mono text-sm rotate-[-10deg]">&lt;React.Fragment&gt;</div>
        <div className="absolute top-[35%] right-[8%] text-indigo-500/10 font-mono text-xs rotate-[15deg]">export const config = &#123; runtime: 'edge' &#125;</div>
        <div className="absolute bottom-[25%] left-[12%] text-cyan-400/5 font-mono text-xl rotate-[-5deg]">&lt;/&gt;</div>
        <div className="absolute bottom-[40%] right-[15%] text-purple-500/10 font-mono text-sm rotate-[5deg]">await kernel.sync();</div>
      </div>

      {/* NAVBAR */}
      <nav className="fixed w-full z-50 top-0 glass border-b-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center group cursor-pointer hover:scale-105 transition-transform duration-300">
            <Logo className="text-2xl" />
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#services" className="hover:text-cyan-400 transition-colors">{dict.nav.services}</a>
            <a href="#methodology" className="hover:text-cyan-400 transition-colors">{dict.nav.methodology}</a>
            <a href="#blog" className="hover:text-cyan-400 transition-colors">{dict.nav.blog}</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href={`/${otherLang}`} className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
              <Globe className="w-3 h-3" /> {dict.nav.language}
            </Link>
            <a href="#contact" className="hidden md:inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-full transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]">
              {dict.nav.audit}
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-visible z-20">
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-cyan-400 mb-8 font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              {dict.hero.badge}
            </div>
            
            <RotatingHero phrases={dict.hero.rotating_phrases} />
            <p className="text-lg md:text-xl text-slate-400 max-w-xl mb-10 leading-relaxed font-medium">
              {dict.hero.description}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <ShinyButton href="#contact" className="w-full sm:w-auto">
                {dict.hero.cta_audit} <ArrowRight className="w-4 h-4" />
              </ShinyButton>
              <a href="#services" className="w-full sm:w-auto px-8 py-4 glass text-white rounded-full font-bold text-sm tracking-wide hover:bg-white/10 transition duration-300 flex items-center justify-center border border-white/10 hover:border-white/20">
                {dict.hero.cta_services}
              </a>
            </div>
          </div>

          <HeroMockups />
        </div>
      </section>

      {/* INFINITE MARQUEE */}
      <div className="w-full bg-cyan-900/20 border-y border-cyan-500/20 py-4 overflow-hidden relative flex z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950 z-10 w-full pointer-events-none"></div>
        <div className="whitespace-nowrap flex animate-marquee items-center gap-16 text-cyan-400/70 font-bold tracking-widest text-sm uppercase">
          {Array(8).fill(0).map((_, i) => (
             <span key={i} className="flex items-center gap-16">
               <span>Next.js Architecture</span>
               <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
               <span>Meta Business Partners</span>
               <span className="w-2 h-2 rounded-full bg-purple-500"></span>
               <span>AI Lead Generation</span>
               <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
               <span>Premium Web Development</span>
               <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
             </span>
          ))}
        </div>
      </div>

      {/* DOMAIN SEARCH SECTION */}
      <section className="px-6 relative z-10">
        <DomainSearch dict={dict.domain_search as any} />
      </section>

      {/* WEB DEV FUNNEL */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass-card rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 group hover:border-cyan-500/30 transition-colors duration-500">
            
            {/* Animated Glow in Card */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/20 transition-colors duration-700"></div>

            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                 <Zap className="w-5 h-5 text-cyan-400" />
                 <h3 className="text-cyan-400 font-bold uppercase tracking-wider text-sm">{dict.web_dev.subtitle}</h3>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">{dict.web_dev.title}</h2>
              <p className="text-slate-400 text-lg leading-relaxed">{dict.web_dev.description}</p>
            </div>
            
            <a href="#contact" className="relative z-10 whitespace-nowrap px-8 py-5 bg-white text-slate-950 font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] flex items-center gap-3 text-lg">
              {dict.web_dev.cta} <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">{dict.services.title}</h2>
            <p className="text-slate-400 text-lg">{dict.services.subtitle}</p>
          </div>

          {/* FEXORA-STYLE GRID */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* ROW 1 */}
            <div className="glass-card p-8 rounded-3xl hover:-translate-y-2 hover:border-cyan-500/50 hover:shadow-[0_10px_40px_rgba(34,211,238,0.1)] transition-all duration-300 group">
              <div className="w-14 h-14 bg-slate-800/50 border border-slate-700 rounded-2xl flex items-center justify-center text-cyan-400 mb-8 group-hover:scale-110 group-hover:bg-cyan-500/10 transition-all">
                <Code2 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{dict.services.web_design.title}</h3>
              <p className="text-slate-400 leading-relaxed">{dict.services.web_design.desc}</p>
            </div>

            <div className="glass-card p-8 rounded-3xl hover:-translate-y-2 hover:border-indigo-500/50 hover:shadow-[0_10px_40px_rgba(99,102,241,0.1)] transition-all duration-300 group">
              <div className="w-14 h-14 bg-slate-800/50 border border-slate-700 rounded-2xl flex items-center justify-center text-indigo-400 mb-8 group-hover:scale-110 group-hover:bg-indigo-500/10 transition-all">
                <Database className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{dict.services.hosting.title}</h3>
              <p className="text-slate-400 leading-relaxed">{dict.services.hosting.desc}</p>
            </div>

            <div className="glass-card p-8 rounded-3xl hover:-translate-y-2 hover:border-purple-500/50 hover:shadow-[0_10px_40px_rgba(168,85,247,0.1)] transition-all duration-300 group">
              <div className="w-14 h-14 bg-slate-800/50 border border-slate-700 rounded-2xl flex items-center justify-center text-purple-400 mb-8 group-hover:scale-110 group-hover:bg-purple-500/10 transition-all">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{dict.services.campaigns.title}</h3>
              <p className="text-slate-400 leading-relaxed">{dict.services.campaigns.desc}</p>
            </div>

            {/* ROW 2 */}
            <div className="glass-card p-8 rounded-3xl hover:-translate-y-2 hover:border-pink-500/50 hover:shadow-[0_10px_40px_rgba(236,72,153,0.1)] transition-all duration-300 group">
              <div className="w-14 h-14 bg-slate-800/50 border border-slate-700 rounded-2xl flex items-center justify-center text-pink-400 mb-8 group-hover:scale-110 group-hover:bg-pink-500/10 transition-all">
                <MessageCircle className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{dict.services.social.title}</h3>
              <p className="text-slate-400 leading-relaxed">{dict.services.social.desc}</p>
            </div>

            <div className="glass-card p-8 rounded-3xl hover:-translate-y-2 hover:border-orange-500/50 hover:shadow-[0_10px_40px_rgba(249,115,22,0.1)] transition-all duration-300 group">
              <div className="w-14 h-14 bg-slate-800/50 border border-slate-700 rounded-2xl flex items-center justify-center text-orange-400 mb-8 group-hover:scale-110 group-hover:bg-orange-500/10 transition-all">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{dict.services.apps.title}</h3>
              <p className="text-slate-400 leading-relaxed">{dict.services.apps.desc}</p>
            </div>

            <div className="glass-card p-8 rounded-3xl hover:-translate-y-2 hover:border-blue-500/50 hover:shadow-[0_10px_40px_rgba(59,130,246,0.1)] transition-all duration-300 md:col-span-2 lg:col-span-1 group">
              <div className="w-14 h-14 bg-slate-800/50 border border-slate-700 rounded-2xl flex items-center justify-center text-blue-400 mb-8 group-hover:scale-110 group-hover:bg-blue-500/10 transition-all">
                <Bot className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{dict.services.crm_ai.title}</h3>
              <p className="text-slate-400 leading-relaxed">{dict.services.crm_ai.desc}</p>
            </div>

            {/* ROW 3 (SEO, Email, CRO, Content) */}
            <div className="glass-card p-8 rounded-3xl hover:-translate-y-2 hover:border-yellow-500/50 hover:shadow-[0_10px_40px_rgba(234,179,8,0.1)] transition-all duration-300 group">
              <div className="w-14 h-14 bg-slate-800/50 border border-slate-700 rounded-2xl flex items-center justify-center text-yellow-400 mb-8 group-hover:scale-110 group-hover:bg-yellow-500/10 transition-all">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{dict.services.seo.title}</h3>
              <p className="text-slate-400 leading-relaxed">{dict.services.seo.desc}</p>
            </div>

            <div className="glass-card p-8 rounded-3xl hover:-translate-y-2 hover:border-red-500/50 hover:shadow-[0_10px_40px_rgba(239,68,68,0.1)] transition-all duration-300 group">
              <div className="w-14 h-14 bg-slate-800/50 border border-slate-700 rounded-2xl flex items-center justify-center text-red-400 mb-8 group-hover:scale-110 group-hover:bg-red-500/10 transition-all">
                <Mail className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{dict.services.email.title}</h3>
              <p className="text-slate-400 leading-relaxed">{dict.services.email.desc}</p>
            </div>

            <div className="glass-card p-8 rounded-3xl hover:-translate-y-2 hover:border-teal-500/50 hover:shadow-[0_10px_40px_rgba(20,184,166,0.1)] transition-all duration-300 group lg:col-span-1">
              <div className="w-14 h-14 bg-slate-800/50 border border-slate-700 rounded-2xl flex items-center justify-center text-teal-400 mb-8 group-hover:scale-110 group-hover:bg-teal-500/10 transition-all">
                <LineChart className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{dict.services.cro.title}</h3>
              <p className="text-slate-400 leading-relaxed">{dict.services.cro.desc}</p>
            </div>

            {/* FULL WIDTH BOTTOM ROW */}
            <div className="glass-card p-8 rounded-3xl hover:-translate-y-2 hover:border-fuchsia-500/50 hover:shadow-[0_10px_40px_rgba(217,70,239,0.1)] transition-all duration-300 md:col-span-2 lg:col-span-2 group flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="w-16 h-16 shrink-0 bg-slate-800/50 border border-slate-700 rounded-2xl flex items-center justify-center text-fuchsia-400 group-hover:scale-110 group-hover:bg-fuchsia-500/10 transition-all">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{dict.services.content.title}</h3>
                <p className="text-slate-400 leading-relaxed text-lg">{dict.services.content.desc}</p>
              </div>
            </div>

            <div className="glass-card p-8 rounded-3xl hover:-translate-y-2 hover:border-emerald-500/50 hover:shadow-[0_10px_40px_rgba(16,185,129,0.1)] transition-all duration-300 md:col-span-2 lg:col-span-1 group flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="w-16 h-16 shrink-0 bg-slate-800/50 border border-slate-700 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all">
                <Cpu className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{dict.services.consulting.title}</h3>
                <p className="text-slate-400 leading-relaxed">{dict.services.consulting.desc}</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* METHODOLOGY (FEXORA STYLE) */}
      <section id="methodology" className="py-24 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none"></div>
         <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="relative h-[600px] hidden lg:block glass-card rounded-[3rem] border border-white/5 overflow-hidden">
              {/* Abstract Representation of Process */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl absolute animate-blob"></div>
                <div className="w-64 h-64 bg-purple-500/20 rounded-full blur-3xl absolute animate-blob animation-delay-2000 translate-x-20"></div>
                
                <div className="relative z-10 flex flex-col gap-4 w-full px-6 md:px-8">
                  
                  {/* Main Metric Card */}
                  <div className="group relative p-6 rounded-2xl glass border border-white/10 bg-slate-900/50 backdrop-blur-md shadow-2xl hover:-translate-y-1 transition-transform cursor-default">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-slate-300 font-semibold text-sm flex items-center gap-2">
                        Conversion Rate
                        <div className="w-4 h-4 rounded-full bg-slate-700/50 border border-slate-600 text-[10px] flex items-center justify-center text-slate-300">?</div>
                      </span>
                      <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">+124%</span>
                    </div>
                    <div className="text-4xl font-extrabold text-white mb-3">4.85%</div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-500 w-[75%] rounded-full"></div>
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute -top-14 left-0 right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="bg-slate-800 border border-slate-600 text-slate-100 text-xs p-3 rounded-xl shadow-xl text-center">
                        <strong>Tasa de Conversión:</strong> Porcentaje de visitantes que se transforman en prospectos o ventas reales.
                      </div>
                    </div>
                  </div>

                  {/* Secondary Metrics Row */}
                  <div className="flex gap-4">
                    <div className="group relative flex-1 p-5 rounded-2xl glass border border-white/10 bg-slate-900/50 backdrop-blur-md shadow-lg hover:-translate-y-1 hover:z-50 transition-all cursor-default">
                       <div className="text-slate-400 text-xs font-medium mb-2 uppercase tracking-wider flex items-center justify-between">
                         CPL
                         <div className="w-4 h-4 rounded-full bg-slate-700/50 border border-slate-600 text-[10px] flex items-center justify-center text-slate-300">?</div>
                       </div>
                       <div className="text-2xl font-bold text-white">$12.40</div>
                       <div className="text-emerald-400 text-xs mt-2 font-medium flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> ↓ 32% (MoM)
                       </div>
                       
                       <div className="absolute -top-16 left-0 w-full min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60]">
                         <div className="bg-slate-800 border border-slate-600 text-slate-100 text-xs p-3 rounded-xl shadow-xl text-center">
                           <strong>Costo por Lead:</strong> Lo que cuesta adquirir un nuevo prospecto calificado.
                         </div>
                       </div>
                    </div>
                    
                    <div className="group relative flex-1 p-5 rounded-2xl glass border border-white/10 bg-slate-900/50 backdrop-blur-md shadow-lg hover:-translate-y-1 hover:z-50 transition-all cursor-default">
                       <div className="text-slate-400 text-xs font-medium mb-2 uppercase tracking-wider flex items-center justify-between">
                         ROAS
                         <div className="w-4 h-4 rounded-full bg-slate-700/50 border border-slate-600 text-[10px] flex items-center justify-center text-slate-300">?</div>
                       </div>
                       <div className="text-2xl font-bold text-white">4.2x</div>
                       <div className="text-emerald-400 text-xs mt-2 font-medium flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> ↑ 1.5x (MoM)
                       </div>
                       
                       <div className="absolute -top-16 right-0 w-full min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60]">
                         <div className="bg-slate-800 border border-slate-600 text-slate-100 text-xs p-3 rounded-xl shadow-xl text-center">
                           <strong>Retorno de Inversión:</strong> Por cada $1 invertido, generamos $4.2.
                         </div>
                       </div>
                    </div>
                  </div>
                  
                  {/* Mini Chart Row */}
                  <div className="p-5 rounded-2xl glass border border-white/10 bg-slate-900/50 backdrop-blur-md shadow-lg cursor-default">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-slate-300 font-semibold text-sm">Leads Generados (Q3)</span>
                      <span className="text-cyan-400 font-bold">+850</span>
                    </div>
                    <div className="flex items-end gap-2 h-10">
                       {[35, 45, 30, 60, 85, 70, 90, 100].map((h, i) => (
                         <div key={i} className="flex-1 bg-cyan-900/50 rounded-t-sm hover:bg-cyan-400 transition-colors" style={{ height: `${h}%` }}></div>
                       ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-white">{dict.methodology.title}</h2>
              <div className="space-y-8">
                 {[1,2,3,4].map((num) => {
                   const stepKey = `step${num}` as keyof typeof dict.methodology;
                   const descKey = `step${num}_desc` as keyof typeof dict.methodology;
                   
                   return (
                     <div key={num} className="flex gap-6 group">
                        <div className="shrink-0 w-16 h-16 rounded-2xl glass flex items-center justify-center text-xl font-bold text-cyan-400 border border-white/10 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 group-hover:scale-110 transition-all duration-300 shadow-lg">
                          0{num}
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                            {dict.methodology[stepKey]}
                          </h4>
                          <p className="text-slate-400 leading-relaxed">
                            {dict.methodology[descKey]}
                          </p>
                        </div>
                     </div>
                   );
                 })}
              </div>
            </div>
         </div>
      </section>


      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 relative overflow-hidden border-t border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-5xl bg-gradient-to-b from-cyan-900/20 to-transparent blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-extrabold mb-8 tracking-tight text-white leading-[1.1]">{dict.contact.title}</h2>
              <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                {dict.contact.desc}
              </p>
              
              <div className="flex items-center gap-6 text-slate-300">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-cyan-400">
                     <Mail className="w-5 h-5" />
                   </div>
                   <span className="font-semibold">Soporte 24/7</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-indigo-400">
                     <Globe className="w-5 h-5" />
                   </div>
                   <span className="font-semibold">Alcance Global</span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <BorderBeam size={300} duration={12} delay={0} />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG / INSIGHTS SECTION */}
      <section id="blog" className="py-24 relative overflow-hidden bg-transparent backdrop-blur-md">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Insights & Estrategias</h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-8">
              {lang === 'es' 
                ? 'Ideas y estrategias accionables sobre diseño, desarrollo web y marketing digital para escalar tu negocio.' 
                : 'Actionable ideas and strategies on design, web development, and digital marketing to scale your business.'}
            </p>
            <Link 
              href={`/${lang}/blog`}
              className="inline-flex items-center justify-center px-6 py-3 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 rounded-xl font-bold transition-all hover:scale-105"
            >
              {lang === 'es' ? 'Ver todos los artículos' : 'View all articles'} <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
          
          <BlogCarousel posts={posts} lang={lang as 'es' | 'en'} />
        </div>
      </section>

      <Footer lang={lang as 'es' | 'en'} />
    </div>
  )
}
