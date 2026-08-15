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
import Link from 'next/link'

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
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32">
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

          <div className="relative hidden lg:block h-[600px] w-full" style={{ perspective: '1000px' }}>
             {/* Desktop Mockup (Safari) */}
             <div 
                className="absolute top-10 -right-20 w-[120%] transition-transform duration-700 hover:transform-none"
                style={{ transform: 'rotateY(-10deg) rotateX(5deg)' }}
             >
                <Safari src="/mockup-desktop.jpg" className="w-full shadow-[0_0_50px_rgba(34,211,238,0.15)]" />
             </div>
             
             {/* Mobile Mockup (iPhone) */}
             <div 
                className="absolute -bottom-10 left-0 w-[35%] z-20 transition-transform duration-700 hover:-translate-y-4"
                style={{ transform: 'rotateY(15deg) rotateX(5deg) translateY(2.5rem)', transformOrigin: 'bottom left' }}
             >
                <Iphone15Pro src="/mockup-mobile.jpg" className="shadow-[0_0_50px_rgba(168,85,247,0.2)]" />
             </div>
          </div>
        </div>
      </section>

      {/* INFINITE MARQUEE */}
      <div className="w-full bg-cyan-900/20 border-y border-cyan-500/20 py-4 overflow-hidden relative flex">
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
                
                <div className="relative z-10 flex flex-col gap-6 w-full px-12">
                   {[1,2,3].map((item) => (
                     <div key={item} className="w-full h-20 glass bg-white/5 rounded-2xl border border-white/10 flex items-center px-6 gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r from-cyan-400 to-indigo-500 w-${item}/3`}></div>
                        </div>
                     </div>
                   ))}
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

      {/* BLOG PREVIEW */}
      <section id="blog" className="py-24 relative border-t border-white/5">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
               <div>
                 <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">{dict.blog.title}</h2>
                 <p className="text-slate-400 text-lg">{dict.blog.subtitle}</p>
               </div>
               <a href="#blog" className="flex items-center gap-2 text-cyan-400 font-bold hover:text-cyan-300 transition-colors px-6 py-3 rounded-full glass border border-white/10 hover:border-cyan-500/30">
                  {dict.blog.read_more} <ArrowRight className="w-4 h-4" />
               </a>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               {[1,2,3].map((item) => (
                 <div key={item} className="glass-card rounded-3xl overflow-hidden hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(34,211,238,0.1)] transition-all duration-500 group">
                    <div className="h-56 bg-slate-900 flex items-center justify-center relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/40 to-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                       <PenTool className="w-10 h-10 text-slate-700 group-hover:scale-110 group-hover:text-cyan-400 transition-all duration-500 relative z-10" />
                    </div>
                    <div className="p-8">
                       <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold mb-4 border border-cyan-500/20">MARKETING</div>
                       <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">Lorem ipsum dolor sit amet consectetur</h3>
                       <span className="text-sm font-bold text-slate-400 flex items-center gap-2 group-hover:text-white transition-colors">
                          {dict.blog.read_more} <ChevronRight className="w-4 h-4 text-cyan-400" />
                       </span>
                    </div>
                 </div>
               ))}
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

      {/* FOOTER */}
      <footer className="relative bg-[#01040f] border-t border-white/10 overflow-hidden pt-20 pb-12">
        {/* Magic UI Hexagon Pattern Background */}
        <div className="absolute inset-0 z-0">
          <HexagonPattern size={40} className="text-cyan-500/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#01040f] via-transparent to-[#01040f]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="mb-6">
                <Logo className="text-2xl" />
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {dict.footer.description}
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-cyan-500/20 transition-all border border-white/10">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-cyan-500/20 transition-all border border-white/10">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-6">{dict.footer.services_title}</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">{dict.footer.services.web}</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">{dict.footer.services.leads}</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">{dict.footer.services.seo}</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">{dict.footer.services.ai}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-6">{dict.footer.company_title}</h3>
              <ul className="space-y-4">
                <li><a href="#about" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">{dict.footer.company.about}</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">{dict.footer.company.cases}</a></li>
                <li><a href="#blog" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">{dict.footer.company.blog}</a></li>
                <li><a href="#contact" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">{dict.footer.company.contact}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-6">{dict.footer.legal_title}</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">{dict.footer.legal.privacy}</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">{dict.footer.legal.terms}</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">{dict.footer.legal.cookies}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/10">
            <p className="text-slate-500 text-sm font-medium">{dict.footer.rights}</p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              {dict.footer.made_with.split("❤")[0]}<span className="text-red-500">❤</span>{dict.footer.made_with.split("❤")[1]}
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP */}
      <a 
        href="https://wa.me/526246220525?text=Hola" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-110 transition-all duration-300 z-50 group"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute inset-0 rounded-full border border-white/50 animate-ping pointer-events-none"></span>
      </a>
    </div>
  )
}
