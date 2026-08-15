import { posts } from '@/data/posts'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, User, Tag, Folder, Search, ArrowLeft, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/Logo'
import Footer from '@/components/Footer'
import { ShareButtons } from '@/components/ShareButtons'
import Script from 'next/script'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ lang: 'es' | 'en'; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const { lang, slug } = resolvedParams
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  const content = post.content[lang]
  const baseUrl = 'https://expertosmkd.com'
  const postUrl = `${baseUrl}/${lang}/blog/${slug}`

  return {
    title: `${content.title} | Expertos MKD`,
    description: content.excerpt,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: content.title,
      description: content.excerpt,
      url: postUrl,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author.name],
      images: [
        {
          url: `${baseUrl}${post.coverImage}`,
          width: 1200,
          height: 630,
          alt: content.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description: content.excerpt,
      images: [`${baseUrl}${post.coverImage}`],
    },
  }
}

export default async function BlogPost({ params }: Props) {
  const resolvedParams = await params
  const { lang, slug } = resolvedParams
  
  const post = posts.find((p) => p.slug === slug)
  
  if (!post) {
    notFound()
  }

  const content = post.content[lang]

  // Dynamic data for widgets
  const allCategories = posts.reduce((acc, p) => {
    const cat = p.category[lang]
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const categories = Object.keys(allCategories)
  
  // Get all unique tags from all posts
  const tags = Array.from(new Set(posts.flatMap(p => p.tags)))

  const baseUrl = 'https://expertosmkd.com'
  const postUrl = `${baseUrl}/${lang}/blog/${slug}`

  return (
    <div className="min-h-screen bg-[#01040f] text-slate-50 font-sans selection:bg-cyan-500/30">
      {/* JSON-LD Article Schema */}
      <Script id="article-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": content.title,
          "image": `${baseUrl}${post.coverImage}`,
          "datePublished": post.date,
          "dateModified": post.date,
          "author": [{
            "@type": "Person",
            "name": post.author.name,
            "url": baseUrl
          }],
          "publisher": {
            "@type": "Organization",
            "name": "Expertos MKD",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/logo.png`
            }
          },
          "description": content.excerpt
        })
      }} />

      {/* NAVBAR SIMPLE */}
      <nav className="w-full z-50 glass border-b border-white/10 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href={`/${lang}`} className="flex items-center gap-2 text-cyan-400 hover:text-white transition-colors text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" /> {lang === 'es' ? 'Volver al inicio' : 'Back to home'}
          </Link>
          <Logo className="text-xl" />
        </div>
      </nav>

      {/* HERO BANNER */}
      <div className="w-full h-[50vh] min-h-[400px] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#01040f] via-[#01040f]/60 to-transparent z-10"></div>
        <img src={post.coverImage} alt={content.title} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 w-full z-20 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="inline-block bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full px-3 py-1 text-sm font-bold mb-4">
              {post.category[lang]}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl">
              {content.title}
            </h1>
            <div className="flex items-center gap-6 text-slate-300 text-sm font-mono">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-500" />
                {post.author.name}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-500" />
                {post.date}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT & SIDEBAR */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-3 gap-16 relative">
        {/* MAIN ARTICLE CONTENT */}
        <article className="lg:col-span-2">
          <div 
            className="prose prose-invert prose-cyan max-w-none prose-headings:text-white prose-p:text-slate-300 prose-a:text-cyan-400 prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: content.body }}
          />

          {/* POST TAGS */}
          <div className="mt-12 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-cyan-900/20 text-cyan-400 border border-cyan-500/20 rounded-full text-sm font-semibold">
                #{tag}
              </span>
            ))}
          </div>
          
          <ShareButtons url={postUrl} title={content.title} lang={lang} />
          
          <div className="mt-8 pt-8 flex items-center gap-4">
            <img src={post.author.avatar} alt={post.author.name} className="w-16 h-16 rounded-full bg-slate-800" />
            <div>
              <div className="text-white font-bold text-lg">{post.author.name}</div>
              <div className="text-cyan-500 text-sm">{post.author.role}</div>
            </div>
          </div>

          {/* SILO ARCHITECTURE: RELATED POSTS */}
          {posts.filter(p => p.category.es === post.category.es && p.slug !== post.slug).length > 0 && (
            <div className="mt-16 pt-12 border-t border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">
                {lang === 'es' ? 'Artículos Relacionados en este Clúster' : 'Related Posts in this Cluster'}
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {posts
                  .filter(p => p.category.es === post.category.es && p.slug !== post.slug)
                  .slice(0, 2)
                  .map(related => (
                    <Link href={`/${lang}/blog/${related.slug}`} key={related.slug} className="group glass rounded-2xl p-4 border border-white/10 hover:border-cyan-500/50 transition-all hover:-translate-y-1">
                      <div className="aspect-video w-full rounded-xl overflow-hidden mb-4">
                        <img src={related.coverImage} alt={related.content[lang].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <h4 className="text-white font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {related.content[lang].title}
                      </h4>
                      <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                        {related.content[lang].excerpt}
                      </p>
                      <div className="flex items-center text-xs font-bold text-cyan-500 group-hover:translate-x-1 transition-transform">
                        {lang === 'es' ? 'Leer Artículo' : 'Read Article'} <ArrowRight className="w-3 h-3 ml-1" />
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </article>

        {/* WORDPRESS-STYLE SIDEBAR */}
        <aside className="space-y-10 lg:pl-8 lg:border-l border-white/10">
          {/* SEARCH WIDGET */}
          <div className="glass rounded-2xl p-6 border border-white/10">
            <h3 className="text-white font-bold text-lg mb-4">{lang === 'es' ? 'Buscar' : 'Search'}</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder={lang === 'es' ? 'Buscar artículos...' : 'Search articles...'} 
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* CATEGORIES WIDGET */}
          <div className="glass rounded-2xl p-6 border border-white/10">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Folder className="w-5 h-5 text-cyan-500" /> {lang === 'es' ? 'Categorías' : 'Categories'}
            </h3>
            <ul className="space-y-3">
              {categories.map(cat => {
                const catSlug = cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                return (
                  <li key={cat}>
                    <Link href={`/${lang}/blog/category/${catSlug}`} className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center justify-between text-sm">
                      {cat}
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-xs">{allCategories[cat]}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* TAGS CLOUD WIDGET */}
          <div className="glass rounded-2xl p-6 border border-white/10">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-cyan-500" /> {lang === 'es' ? 'Etiquetas Populares' : 'Popular Tags'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <a href="#" key={tag} className="px-3 py-1.5 bg-slate-900 border border-white/5 rounded-lg text-xs text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
                  #{tag}
                </a>
              ))}
            </div>
          </div>

          {/* CTA WIDGET */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-cyan-900/40 to-purple-900/40 border border-cyan-500/30 text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full"></div>
            <h3 className="text-white font-bold text-xl mb-3 relative z-10">{lang === 'es' ? 'Impulsa tu negocio' : 'Boost your business'}</h3>
            <p className="text-slate-300 text-sm mb-6 relative z-10">
              {lang === 'es' ? 'Obtén una auditoría gratuita de tu presencia digital.' : 'Get a free audit of your digital presence.'}
            </p>
            <a href={`/${lang}/#contact`} className="inline-block w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl transition-colors relative z-10 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              {lang === 'es' ? 'Solicitar Auditoría' : 'Request Audit'}
            </a>
          </div>
        </aside>
      </div>

      <Footer lang={lang} />
    </div>
  )
}
