import { getDictionary } from '@/app/dictionaries'
import { Logo } from '@/components/Logo'
import { HexagonPattern } from '@/components/magicui/hexagon-pattern'
import { MessageCircle } from 'lucide-react'
import { ScrollToTop } from '@/components/ScrollToTop'

export default async function Footer({ lang }: { lang: 'en' | 'es' }) {
  const dict = await getDictionary(lang)
  return (
    <>
      <footer className="relative bg-[#01040f] border-t border-white/10 overflow-hidden pt-20 pb-12 mt-auto">
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
                <li><a href={`/${lang}#about`} className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">{dict.footer.company.about}</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">{dict.footer.company.cases}</a></li>
                <li><a href={`/${lang}/blog`} className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">{dict.footer.company.blog}</a></li>
                <li><a href={`/${lang}#contact`} className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">{dict.footer.company.contact}</a></li>
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
      <ScrollToTop />
    </>
  )
}
