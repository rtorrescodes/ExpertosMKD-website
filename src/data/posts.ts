export type BlogPost = {
  slug: string
  coverImage: string
  author: {
    name: string
    avatar: string
    role: string
  }
  category: {
    es: string
    en: string
  }
  tags: string[]
  date: string
  content: {
    es: {
      title: string
      excerpt: string
      body: string
    }
    en: {
      title: string
      excerpt: string
      body: string
    }
  }
}

export const posts: BlogPost[] = [
  {
    slug: '5-razones-tu-sitio-no-convierte',
    coverImage: '/blog/post-1.jpg',
    author: { 
      name: 'ExpertosMKD', 
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix', 
      role: 'Growth & Strategy' 
    },
    category: { es: 'Estrategia Web', en: 'Web Strategy' },
    tags: ['Conversión', 'UX/UI', 'CRO', 'Growth'],
    date: '2024-10-15',
    content: {
      es: {
        title: '5 Razones por las que tu sitio web no convierte (y cómo arreglarlo)',
        excerpt: 'Tener miles de visitas no sirve de nada si tu sitio web funciona como un colador. Descubre los 5 errores críticos que matan tu tasa de conversión.',
        body: `
          <p class="text-xl text-slate-300 leading-relaxed mb-8">Muchos empresarios invierten miles de dólares en campañas de publicidad solo para enviar tráfico a un sitio web que no está preparado para convertir. El resultado: un <strong>costo de adquisición (CPA) por los cielos y ventas nulas</strong>.</p>
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">1. Tu propuesta de valor está oculta</h2>
          <p class="text-slate-400 mb-6">Si un usuario entra a tu sitio y en menos de 5 segundos no entiende qué vendes y cómo le ayuda, se irá. La sección Hero (la primera parte visible de tu web) debe tener un mensaje hiper-claro y directo. Evita la jerga técnica y enfócate en el beneficio real.</p>
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">2. Fricción excesiva en los formularios</h2>
          <p class="text-slate-400 mb-6">Pedir demasiados datos asusta a los prospectos. A menos que vendas algo extremadamente complejo, reduce tus formularios al mínimo necesario. Considera solicitar únicamente:</p>
          <ul class="list-disc pl-6 text-slate-400 mb-6 space-y-2">
            <li><strong>Nombre completo:</strong> Para personalizar el seguimiento.</li>
            <li><strong>Correo electrónico:</strong> Obligatorio para enviar el *lead magnet*.</li>
            <li><strong>Teléfono (Opcional):</strong> Solo si tu equipo de ventas hace llamadas en frío.</li>
          </ul>
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">3. Diseño amateur que destruye la confianza</h2>
          <p class="text-slate-400 mb-6">El diseño es el vendedor silencioso. Un sitio que parece hecho en 2005 genera desconfianza instantánea. Elementos visuales modernos, márgenes limpios y la correcta aplicación del <a href="#" class="text-cyan-400 hover:underline">diseño UI/UX</a> son críticos para proyectar profesionalismo.</p>
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">4. Llamados a la Acción (CTA) invisibles</h2>
          <p class="text-slate-400 mb-6">Tus botones de CTA deben contrastar agresivamente con el resto del sitio y utilizar verbos de acción específicos ("Agenda una llamada", "Descargar guía gratuita"), en lugar de los clásicos y aburridos "Enviar" o "Aceptar".</p>
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">5. Velocidad de carga deficiente</h2>
          <p class="text-slate-400 mb-6">Amazon calculó que 1 segundo de retraso en la carga de la página le costaría $1.6 mil millones de dólares al año. Las principales causas de lentitud suelen ser:</p>
          <ul class="list-disc pl-6 text-slate-400 mb-6 space-y-2">
            <li>Imágenes sin comprimir en formatos antiguos.</li>
            <li>Exceso de plugins en plataformas como WordPress.</li>
            <li>Servidores de bajo rendimiento o compartidos.</li>
          </ul>
          <div class="p-6 mt-10 rounded-2xl bg-cyan-900/20 border border-cyan-500/20 text-cyan-50">
            <h3 class="text-lg font-bold text-cyan-400 mb-2">¿Quieres saber si tu sitio sufre de estos problemas?</h3>
            <p>Agenda una auditoría gratuita con nuestros especialistas en CRO (Conversion Rate Optimization) y encontraremos las fugas de dinero en tu ecosistema digital.</p>
          </div>
        `
      },
      en: {
        title: '5 Reasons Your Website Is Not Converting (And How to Fix It)',
        excerpt: 'Having thousands of visits is useless if your website acts like a sieve. Discover the 5 critical errors killing your conversion rate.',
        body: `
          <p class="text-xl text-slate-300 leading-relaxed mb-8">Many entrepreneurs invest thousands of dollars in ad campaigns only to send traffic to a website that isn't ready to convert. The result: sky-high acquisition costs and zero sales.</p>
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">1. Your value proposition is hidden</h2>
          <p class="text-slate-400 mb-6">If a user lands on your site and doesn't understand what you sell and how it helps them within 5 seconds, they will leave. The Hero section must have a hyper-clear and direct message.</p>
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">2. Excessive friction in forms</h2>
          <p class="text-slate-400 mb-6">Asking for too much data scares prospects away. Unless you are selling something extremely complex, reduce your forms to the absolute minimum: Name, Email, and maybe a phone number.</p>
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">3. Amateur design destroys trust</h2>
          <p class="text-slate-400 mb-6">Design is the silent salesperson. A site that looks like it was made in 2005 generates instant distrust, no matter how good your product is.</p>
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">4. Invisible Calls to Action (CTA)</h2>
          <p class="text-slate-400 mb-6">Your CTA buttons should contrast aggressively with the rest of the site and use action verbs ("Schedule a call", "Download now"), instead of the classic boring "Submit" or "Accept".</p>
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">5. Poor loading speed</h2>
          <p class="text-slate-400 mb-6">Amazon calculated that a 1-second page load slowdown would cost them $1.6 billion a year. If your website takes more than 3 seconds to load, you are losing 40% of your potential customers.</p>
          <div class="p-6 mt-10 rounded-2xl bg-cyan-900/20 border border-cyan-500/20 text-cyan-50">
            <h3 class="text-lg font-bold text-cyan-400 mb-2">Want to know if your site suffers from these issues?</h3>
            <p>Schedule a free audit with our specialists and we will find the money leaks in your digital ecosystem.</p>
          </div>
        `
      }
    }
  },
  {
    slug: 'el-secreto-del-growth-marketing',
    coverImage: '/blog/post-2.jpg',
    author: { 
      name: 'Rodrigo Torres', 
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Walter', 
      role: 'Growth Architect' 
    },
    category: { es: 'Growth & Ads', en: 'Growth & Ads' },
    tags: ['Ads', 'Meta', 'Data-driven', 'ROI'],
    date: '2024-09-28',
    content: {
      es: {
        title: 'El secreto del Growth Marketing para negocios B2B en 2024',
        excerpt: 'Olvídate de comprar likes o seguidores. El Growth Marketing trata sobre experimentar, medir y escalar la rentabilidad agresivamente.',
        body: `
          <p class="text-xl text-slate-300 leading-relaxed mb-8">El marketing tradicional se enfocaba en la etapa alta del embudo: notoriedad de marca y alcance. El Growth Marketing asume la responsabilidad de todo el viaje del cliente, desde que ve el primer anuncio hasta que se convierte en un evangelizador de tu marca.</p>
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">Experimentación de Alto Ritmo</h2>
          <p class="text-slate-400 mb-6">La base del Growth Marketing no es la genialidad creativa (aunque ayuda), sino la metodología científica. Consiste en formular hipótesis ("Si cambiamos el botón de 'Registrarse' por 'Probar 14 días', la conversión subirá"), probarlas rápidamente con un segmento de tráfico (Test A/B), y analizar los datos estadísticamente.</p>
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">Retención sobre Adquisición</h2>
          <p class="text-slate-400 mb-6">Muchos negocios se obsesionan con atraer nuevos clientes, pero el verdadero motor del crecimiento está en la retención. Cuesta hasta 5 veces más adquirir un cliente nuevo que retener a uno existente. Mejorar tu onboarding y el ciclo de vida de tu producto es la palanca más potente de Growth.</p>
          <blockquote class="border-l-4 border-cyan-500 pl-6 my-8 italic text-lg text-slate-300">
            "El Growth Marketing no es una caja de trucos, es un proceso disciplinado de experimentación enfocado en el crecimiento a lo largo del embudo."
          </blockquote>
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">El poder de los Micro-Embudos</h2>
          <p class="text-slate-400 mb-6">En 2024, la atención es fragmentada. En lugar de un embudo larguísimo, los profesionales usan micro-embudos que resuelven una pequeña fricción a la vez. Por ejemplo, ofrecer un mini-curso de 3 minutos en video antes de intentar vender una consultoría de 5,000 dólares.</p>
        `
      },
      en: {
        title: 'The Growth Marketing Secret for B2B Businesses in 2024',
        excerpt: 'Forget about buying likes or followers. Growth Marketing is about experimenting, measuring, and aggressively scaling profitability.',
        body: `
          <p class="text-xl text-slate-300 leading-relaxed mb-8">Traditional marketing focused on the top of the funnel: brand awareness and reach. Growth Marketing takes responsibility for the entire customer journey, from the first ad they see to them becoming a brand evangelist.</p>
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">High-Tempo Testing</h2>
          <p class="text-slate-400 mb-6">The foundation of Growth Marketing isn't creative genius (though it helps), but the scientific method. It consists of formulating hypotheses ("If we change the 'Register' button to 'Try for 14 days', conversion will go up"), testing them rapidly with a segment of traffic (A/B Test), and analyzing the data statistically.</p>
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">Retention over Acquisition</h2>
          <p class="text-slate-400 mb-6">Many businesses obsess over attracting new customers, but the true engine of growth is retention. It costs up to 5 times more to acquire a new customer than to retain an existing one. Improving your onboarding and your product lifecycle is the most powerful Growth lever.</p>
          <blockquote class="border-l-4 border-cyan-500 pl-6 my-8 italic text-lg text-slate-300">
            "Growth Marketing is not a bag of tricks, it's a disciplined process of experimentation focused on growth throughout the funnel."
          </blockquote>
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">The Power of Micro-Funnels</h2>
          <p class="text-slate-400 mb-6">In 2024, attention is fragmented. Instead of a very long funnel, professionals use micro-funnels that solve one small friction point at a time. For example, offering a 3-minute mini-video course before trying to sell a $5,000 consulting engagement.</p>
        `
      }
    }
  },
  {
    slug: 'diseno-ui-ux-vendedor-silencioso',
    coverImage: '/blog/post-3.jpg',
    author: { 
      name: 'Isabella C.', 
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Jocelyn', 
      role: 'Lead UI/UX Designer' 
    },
    category: { es: 'Diseño UX', en: 'UX Design' },
    tags: ['UX', 'UI', 'Figma', 'Desarrollo Web'],
    date: '2024-08-05',
    content: {
      es: {
        title: 'Por qué el diseño UI/UX es tu mejor vendedor silencioso',
        excerpt: 'La estética atrae, pero la experiencia de usuario es lo que cierra la venta. Descubre cómo la fricción cognitiva está destruyendo tus métricas.',
        body: `
          <p class="text-xl text-slate-300 leading-relaxed mb-8">Vivimos en la era de la impaciencia. Si un usuario se confunde al navegar por tu aplicación o sitio web, no va a leer tu manual de instrucciones; simplemente se irá a la competencia.</p>
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">La Fricción Cognitiva</h2>
          <p class="text-slate-400 mb-6">Cada vez que un usuario tiene que "pensar" dónde hacer clic o cómo volver atrás, su carga cognitiva aumenta. Un buen diseño UX minimiza esta carga utilizando patrones mentales que el usuario ya conoce (por ejemplo, el carrito de compras en la esquina superior derecha).</p>
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">Estética = Confianza (Efecto Halo)</h2>
          <p class="text-slate-400 mb-6">El "Efecto Halo" es un sesgo cognitivo que hace que las personas asuman que si algo es hermoso por fuera, debe funcionar excelentemente por dentro. Por eso, un sitio web visualmente impresionante (UI) no es solo "bonito", es una herramienta psicológica para aumentar el precio percibido de tus servicios.</p>
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">Microinteracciones: El diablo está en los detalles</h2>
          <p class="text-slate-400 mb-6">Las animaciones sutiles cuando pasas el ratón sobre un botón, o las transiciones suaves al cambiar de página (como las que implementamos en ExpertosMKD), segregan pequeñas dosis de dopamina en el cerebro del usuario, haciéndole sentir que tiene el control de una plataforma premium.</p>
        `
      },
      en: {
        title: 'Why UI/UX Design is Your Best Silent Salesperson',
        excerpt: 'Aesthetics attract, but the user experience is what closes the sale. Discover how cognitive friction is destroying your metrics.',
        body: `
          <p class="text-xl text-slate-300 leading-relaxed mb-8">We live in the era of impatience. If a user gets confused navigating your application or website, they won't read your instruction manual; they will simply go to the competition.</p>
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">Cognitive Friction</h2>
          <p class="text-slate-400 mb-6">Every time a user has to "think" about where to click or how to go back, their cognitive load increases. Good UX design minimizes this load by using mental patterns the user already knows (for example, the shopping cart in the top right corner).</p>
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">Aesthetics = Trust (Halo Effect)</h2>
          <p class="text-slate-400 mb-6">The "Halo Effect" is a cognitive bias that makes people assume that if something is beautiful on the outside, it must function excellently on the inside. That is why a visually stunning website (UI) is not just "pretty," it is a psychological tool to increase the perceived price of your services.</p>
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">Microinteractions: The Devil is in the Details</h2>
          <p class="text-slate-400 mb-6">Subtle animations when you hover over a button, or smooth transitions when changing pages (like the ones we implement at ExpertosMKD), release small doses of dopamine in the user's brain, making them feel like they are in control of a premium platform.</p>
        `
      }
    }
  },
  {
    slug: 'arquitectura-silos-seo-contenido',
    coverImage: '/blog/post-4.jpg',
    author: { 
      name: 'ExpertosMKD', 
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix', 
      role: 'Growth & Strategy' 
    },
    category: { es: 'Estrategia Web', en: 'Web Strategy' },
    tags: ['SEO', 'Marketing de Contenidos', 'Silos', 'Arquitectura'],
    date: '2024-10-25',
    content: {
      es: {
        title: 'Por qué tu blog no genera ventas (y la arquitectura de "Silos" que necesitas)',
        excerpt: 'Publicar artículos al azar es quemar dinero. Descubre cómo estructurar tu marketing de contenidos en pilares semánticos para dominar a Google y bajar tu Costo de Adquisición.',
        body: `
          <p class="text-xl text-slate-300 leading-relaxed mb-8">El 90% de las empresas usan su blog como un basurero de noticias corporativas que a nadie le importan. El marketing de contenidos no se trata de "escribir mucho", se trata de <strong>ingeniería semántica</strong>.</p>
          
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">El Problema del Contenido Huérfano</h2>
          <p class="text-slate-400 mb-6">Si escribes un post sobre "Diseño Web" hoy, y otro sobre "Google Ads" mañana sin conectarlos, Google los ve como islas flotantes. No construyes autoridad. Tu contenido compite contra sí mismo y se pierde en la página 10 de los resultados.</p>
          
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">La Arquitectura de Silos (Cluster Topic Model)</h2>
          <ul class="list-disc list-inside text-slate-400 mb-6 space-y-2">
            <li><strong>El Pilar (Pillar Page):</strong> Una página maestra ultra exhaustiva (ej. "Guía Definitiva de Marketing Digital B2B").</li>
            <li><strong>Los Clústeres (Cluster Posts):</strong> Artículos más específicos (ej. "Cómo bajar el CPA en B2B") que se enlazan <em>exclusivamente</em> hacia el Pilar.</li>
            <li><strong>Flujo de Autoridad (Link Juice):</strong> Al enlazarse entre sí temáticamente, le gritas a Google: "Soy el experto absoluto en esta categoría entera".</li>
          </ul>
          
          <p class="text-slate-400 mb-6">Implementar esta estrategia convierte un blog inerte en una máquina de generación de leads orgánicos, reduciendo dramáticamente tu dependencia de los anuncios pagados (Ads).</p>
        `
      },
      en: {
        title: 'Why your blog doesn\'t generate sales (and the "Silo" architecture you need)',
        excerpt: 'Publishing random articles is burning money. Discover how to structure your content marketing into semantic pillars to dominate Google and lower your CAC.',
        body: `
          <p class="text-xl text-slate-300 leading-relaxed mb-8">90% of companies use their blog as a dumpster for corporate news that nobody cares about. Content marketing isn't about "writing a lot", it's about <strong>semantic engineering</strong>.</p>
          
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">The Orphan Content Problem</h2>
          <p class="text-slate-400 mb-6">If you write a post about "Web Design" today, and another about "Google Ads" tomorrow without connecting them, Google sees them as floating islands. You build no authority. Your content competes against itself and gets lost on page 10 of the results.</p>
          
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">Silo Architecture (Topic Cluster Model)</h2>
          <ul class="list-disc list-inside text-slate-400 mb-6 space-y-2">
            <li><strong>The Pillar Page:</strong> An ultra-comprehensive master page (e.g., "The Ultimate Guide to B2B Digital Marketing").</li>
            <li><strong>The Clusters:</strong> Highly specific articles (e.g., "How to lower CPA in B2B") that link <em>exclusively</em> back to the Pillar.</li>
            <li><strong>Authority Flow (Link Juice):</strong> By linking them thematically, you scream to Google: "I am the absolute expert in this entire category."</li>
          </ul>
          
          <p class="text-slate-400 mb-6">Implementing this strategy turns an inert blog into an organic lead generation machine, dramatically reducing your dependence on paid ads.</p>
        `
      }
    }
  },
  {
    slug: 'ads-nativos-ugc-fin-publicidad',
    coverImage: '/blog/post-5.jpg',
    author: { 
      name: 'Rodrigo Torres', 
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Walter', 
      role: 'Growth Architect' 
    },
    category: { es: 'Growth & Ads', en: 'Growth & Ads' },
    tags: ['TikTok', 'Meta Ads', 'UGC', 'Growth'],
    date: '2024-10-26',
    content: {
      es: {
        title: 'Pauta con Contenido: El fin de los anuncios tradicionales',
        excerpt: 'La ceguera publicitaria está en su punto máximo. Si tus anuncios de Meta o TikTok parecen anuncios, ya perdiste. El Growth moderno exige Ads Nativos y UGC.',
        body: `
          <p class="text-xl text-slate-300 leading-relaxed mb-8">Imagina que estás viendo TikTok o Instagram Reels. Estás consumiendo entretenimiento. De repente, aparece un gráfico corporativo diciendo "Compra nuestros servicios con 20% de descuento". ¿Qué haces? <strong>Haces scroll en milisegundos.</strong></p>
          
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">Ceguera Publicitaria (Banner Blindness)</h2>
          <p class="text-slate-400 mb-6">El cerebro humano ha evolucionado para detectar y bloquear instantáneamente cualquier estímulo visual que parezca un anuncio publicitario. Los gráficos sobre-diseñados con logos gigantes y botones de "Comprar Ahora" están destruyendo tu ROAS.</p>
          
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">UGC (User Generated Content) como pauta</h2>
          <p class="text-slate-400 mb-6">La solución es pautar <strong>marketing de contenidos nativo</strong>. El anuncio no debe vender, debe aportar valor, educar o entretener en el formato exacto de la plataforma.</p>
          <ul class="list-disc list-inside text-slate-400 mb-6 space-y-2">
            <li>Un video vertical grabado con el celular de un cliente explicando cómo tu software le ahorró 10 horas a la semana (UGC).</li>
            <li>Un "Hilo" de Twitter educando sobre un problema complejo, pautado en LinkedIn Ads.</li>
          </ul>
          <p class="text-slate-400 mb-6">Cuando el anuncio parece contenido orgánico, la resistencia mental del usuario cae a cero. El Costo por Clic (CPC) se desploma y las conversiones se disparan.</p>
        `
      },
      en: {
        title: 'Content Paid Media: The end of traditional advertising',
        excerpt: 'Banner blindness is at an all-time high. If your Meta or TikTok ads look like ads, you\'ve already lost. Modern Growth demands Native Ads and UGC.',
        body: `
          <p class="text-xl text-slate-300 leading-relaxed mb-8">Imagine you are watching TikTok or Instagram Reels. You are consuming entertainment. Suddenly, a corporate graphic appears saying "Buy our services with a 20% discount". What do you do? <strong>You scroll in milliseconds.</strong></p>
          
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">Banner Blindness</h2>
          <p class="text-slate-400 mb-6">The human brain has evolved to instantly detect and block any visual stimulus that looks like an advertisement. Over-designed graphics with giant logos and "Buy Now" buttons are destroying your ROAS.</p>
          
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">UGC (User Generated Content) as Ads</h2>
          <p class="text-slate-400 mb-6">The solution is to sponsor <strong>native content marketing</strong>. The ad shouldn't sell; it should provide value, educate, or entertain in the exact format of the platform.</p>
          <ul class="list-disc list-inside text-slate-400 mb-6 space-y-2">
            <li>A vertical video recorded with a customer's phone explaining how your software saved them 10 hours a week (UGC).</li>
            <li>A Twitter "Thread" educating about a complex problem, sponsored on LinkedIn Ads.</li>
          </ul>
          <p class="text-slate-400 mb-6">When the ad looks like organic content, the user's mental resistance drops to zero. Cost Per Click (CPC) plummets and conversions skyrocket.</p>
        `
      }
    }
  },
  {
    slug: 'diseno-invisible-ux-marketing-contenidos',
    coverImage: '/blog/post-6.jpg',
    author: { 
      name: 'Isabella C.', 
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Jocelyn', 
      role: 'Lead UI/UX Designer' 
    },
    category: { es: 'Diseño UX', en: 'UX Design' },
    tags: ['UX', 'Tipografía', 'CRO', 'Legibilidad'],
    date: '2024-10-27',
    content: {
      es: {
        title: 'El Diseño Invisible: UX aplicado al Marketing de Contenidos',
        excerpt: 'Puedes tener el mejor copy del mundo, pero si tu altura de línea es mala y el contraste falla, el usuario no te leerá. El buen diseño editorial en web cierra ventas.',
        body: `
          <p class="text-xl text-slate-300 leading-relaxed mb-8">Muchos marketers creen que el "Diseño UX" solo aplica a aplicaciones móviles o tableros de SaaS. Error crítico. La experiencia de usuario en un artículo de blog es el factor decisivo entre un rebote inmediato y una lectura profunda de 5 minutos.</p>
          
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">La Tipografía como Herramienta de Conversión</h2>
          <p class="text-slate-400 mb-6">El buen diseño es invisible; no te das cuenta de que está ahí, simplemente sientes que leer es placentero. Reglas de oro para el contenido:</p>
          <ul class="list-disc list-inside text-slate-400 mb-6 space-y-2">
            <li><strong>Line-Height (Interlineado):</strong> Debe ser al menos 1.5x o 1.6x el tamaño de la fuente. Un texto apretado causa fatiga visual instantánea.</li>
            <li><strong>Ancho del contenedor (Line Length):</strong> El ojo humano se cansa si lee más de 70-80 caracteres por línea. Los blogs que ocupan el 100% del ancho del monitor están matando su retención.</li>
            <li><strong>Jerarquía (H2 y H3):</strong> Los usuarios de internet no leen, <em>escanean</em>. Tu estructura de encabezados debe poder contar la historia por sí sola.</li>
          </ul>
          
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">Contraste y Espacio Negativo</h2>
          <p class="text-slate-400 mb-6">En ExpertosMKD, utilizamos fondos oscuros con tipografías <code>slate-300</code> y <code>slate-400</code>. No usamos blanco puro (#FFFFFF) sobre negro puro (#000000) porque causa "efecto halo" visual y fatiga a los astigmáticos. Todo este esfuerzo de UX tiene un solo fin comercial: <strong>Que consumas nuestro contenido sin fricción, confíes en nuestra autoridad técnica, y te conviertas en un cliente.</strong></p>
        `
      },
      en: {
        title: 'Invisible Design: UX applied to Content Marketing',
        excerpt: 'You can have the best copy in the world, but if your line height is bad and contrast fails, users won\'t read you. Good web editorial design closes sales.',
        body: `
          <p class="text-xl text-slate-300 leading-relaxed mb-8">Many marketers believe that "UX Design" only applies to mobile apps or SaaS dashboards. Critical mistake. The user experience on a blog article is the deciding factor between an immediate bounce and a deep 5-minute read.</p>
          
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">Typography as a Conversion Tool</h2>
          <p class="text-slate-400 mb-6">Good design is invisible; you don't realize it's there, you just feel that reading is a pleasure. Golden rules for content:</p>
          <ul class="list-disc list-inside text-slate-400 mb-6 space-y-2">
            <li><strong>Line-Height:</strong> It must be at least 1.5x or 1.6x the font size. Tight text causes instant visual fatigue.</li>
            <li><strong>Container Width (Line Length):</strong> The human eye tires if it reads more than 70-80 characters per line. Blogs that span 100% of the monitor's width are killing their retention.</li>
            <li><strong>Hierarchy (H2 and H3):</strong> Internet users don't read, they <em>scan</em>. Your header structure must be able to tell the story on its own.</li>
          </ul>
          
          <h2 class="text-2xl font-bold text-white mb-4 mt-8">Contrast and Negative Space</h2>
          <p class="text-slate-400 mb-6">At ExpertosMKD, we use dark backgrounds with <code>slate-300</code> and <code>slate-400</code> typography. We do not use pure white (#FFFFFF) on pure black (#000000) because it causes a visual "halo effect" and fatigues astigmatics. All this UX effort has one single commercial goal: <strong>For you to consume our content without friction, trust our technical authority, and become a client.</strong></p>
        `
      }
    }
  }
]
