'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowLeft } from 'lucide-react'

type Post = {
  slug: string;
  coverImage: string;
  category: { es: string; en: string };
  date: string;
  author: { name: string; avatar: string };
  content: {
    es: { title: string; excerpt: string };
    en: { title: string; excerpt: string };
  };
}

export default function BlogCarousel({ posts, lang }: { posts: Post[], lang: 'es' | 'en' }) {
  const [currentBatch, setCurrentBatch] = useState(0)
  
  // Agrupar posts en lotes de 3
  const chunkSize = 3
  const batches: Post[][] = []
  for (let i = 0; i < posts.length; i += chunkSize) {
    batches.push(posts.slice(i, i + chunkSize))
  }

  useEffect(() => {
    if (batches.length <= 1) return
    const timer = setInterval(() => {
      setCurrentBatch((prev) => (prev + 1) % batches.length)
    }, 15000)
    return () => clearInterval(timer)
  }, [batches.length])

  if (posts.length === 0) return null

  const slugify = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  return (
    <div className="relative w-full">
      <div className="relative min-h-[500px]">
        {batches.map((batch, batchIdx) => {
          const isActive = batchIdx === currentBatch
          return (
            <div 
              key={batchIdx}
              className={`absolute inset-0 grid md:grid-cols-3 gap-8 transition-all duration-1000 ease-in-out ${isActive ? 'opacity-100 z-20 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}
            >
              {batch.map((post, idx) => {
                const catSlug = slugify(post.category.es)
                // Efecto cascada: retrasamos la transición de cada tarjeta
                const delayStyle = { transitionDelay: isActive ? `${idx * 150}ms` : '0ms' }

                return (
                  <div 
                    key={post.slug}
                    style={delayStyle}
                    className={`glass rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/50 transition-all duration-700 h-full flex flex-col hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(34,211,238,0.15)] relative ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                  >
                    <div className="aspect-[16/9] w-full overflow-hidden relative">
                      <img 
                        src={post.coverImage} 
                        alt={post.content[lang].title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                      
                      {/* Badge con z-index alto para interceptar clic */}
                      <div className="absolute top-4 left-4 z-30">
                        <Link 
                          href={`/${lang}/blog/category/${catSlug}`}
                          className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-semibold text-cyan-400 hover:bg-cyan-500/40 hover:text-white transition-colors"
                        >
                          {post.category[lang]}
                        </Link>
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow relative z-20 pointer-events-none">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 font-mono">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.author.name}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 transition-colors">
                        {post.content[lang].title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                        {post.content[lang].excerpt}
                      </p>
                      <div className="flex items-center text-sm font-bold text-cyan-500 transition-transform duration-300">
                        {lang === 'es' ? 'Leer Artículo' : 'Read Article'} <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>

                    {/* Enlace que cubre toda la tarjeta excepto el badge */}
                    <Link 
                      href={`/${lang}/blog/${post.slug}`} 
                      className="absolute inset-0 z-10"
                      aria-label={post.content[lang].title}
                    />
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Controles del Carrusel */}
      {batches.length > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          {batches.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentBatch(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentBatch ? 'bg-cyan-400 w-8' : 'bg-white/20 hover:bg-white/50'}`}
              aria-label={`Go to batch ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
