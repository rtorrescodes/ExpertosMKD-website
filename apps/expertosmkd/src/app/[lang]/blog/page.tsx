import { posts } from '@/data/posts'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/Logo'
import Footer from '@/components/Footer'
import { Metadata } from 'next'

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const isEs = resolvedParams.lang === 'es'
  return {
    title: isEs ? 'Blog & Insights | Expertos MKD' : 'Blog & Insights | Expertos MKD',
    description: isEs 
      ? 'Estrategias accionables sobre diseño, desarrollo web y marketing digital para escalar tu negocio.' 
      : 'Actionable strategies on design, web development, and digital marketing to scale your business.'
  }
}

export default async function BlogIndexPage({ params }: Props) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as 'es' | 'en'

  return (
    <main className="min-h-screen bg-[#01040f] text-slate-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      <nav className="w-full z-50 glass border-b border-white/10 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href={`/${lang}`} className="flex items-center gap-2 text-cyan-400 hover:text-white transition-colors text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" /> {lang === 'es' ? 'Volver al inicio' : 'Back to home'}
          </Link>
          <div className="text-xl font-bold text-white tracking-tighter">
            <Logo className="text-xl" />
          </div>
        </div>
      </nav>

      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full px-4 py-1.5 text-sm font-bold mb-6">
              Expertos MKD
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              {lang === 'es' ? 'Blog & Insights' : 'Blog & Insights'}
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-8">
              {lang === 'es' 
                ? 'Ideas y estrategias accionables sobre diseño, desarrollo web y marketing digital para escalar tu negocio.' 
                : 'Actionable ideas and strategies on design, web development, and digital marketing to scale your business.'}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.slug} className="group glass rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/50 transition-all duration-300 h-full flex flex-col hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(34,211,238,0.15)] relative">
                <div className="aspect-[16/9] w-full overflow-hidden relative">
                  <img 
                    src={post.coverImage} 
                    alt={post.content[lang].title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                </div>
                <div className="p-6 flex flex-col flex-1 relative z-20 pointer-events-none">
                  {/* Category Badge with z-index and pointer-events-auto */}
                  <div className="mb-3">
                    <Link 
                      href={`/${lang}/blog/category/${post.category.es.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                      className="text-xs font-bold text-cyan-400 tracking-wider uppercase pointer-events-auto hover:text-cyan-300"
                    >
                      {post.category[lang]}
                    </Link>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {post.content[lang].title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-3">
                    {post.content[lang].excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <img src={post.author.avatar} alt={post.author.name} className="w-6 h-6 rounded-full bg-slate-800" />
                      <span>{post.author.name}</span>
                    </div>
                    <span>{post.date}</span>
                  </div>
                </div>

                {/* Full card link (except category badge) */}
                <Link 
                  href={`/${lang}/blog/${post.slug}`} 
                  className="absolute inset-0 z-10"
                  aria-label={post.content[lang].title}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer lang={lang as 'es' | 'en'} />
    </main>
  )
}
