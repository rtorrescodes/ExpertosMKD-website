// main.js - Expertos MKD Web Interactivity & Localization

let currentLanguage = 'es';

document.addEventListener('DOMContentLoaded', () => {
  // First, initialize translations
  initLanguage();
  
  // Initialize other website components
  initHeroSlider();
  initScrollReveal();
  initLeadForm();
  initCalendlyModal();
  initWhatsAppBadge();
  initMobileMenu();
});

/* ==========================================
   0. MULTILENGUAJE (i18n) LOGIC
   ========================================== */
function initLanguage() {
  let lang = localStorage.getItem('expertosmkd_lang');
  
  // If not in storage, auto-detect browser language
  if (!lang) {
    const browserLang = navigator.language || navigator.userLanguage;
    lang = (browserLang && browserLang.toLowerCase().startsWith('en')) ? 'en' : 'es';
  }
  
  // Apply language
  setLanguage(lang);

  // Bind switcher click events
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetLang = btn.getAttribute('data-lang');
      setLanguage(targetLang);
    });
  });
}

function setLanguage(lang) {
  if (!window.translations || !window.translations[lang]) return;
  currentLanguage = lang;
  localStorage.setItem('expertosmkd_lang', lang);

  // Translate all tags with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = window.translations[lang][key];
    if (translation !== undefined) {
      // Check if translation contains HTML (like class/b/br tags)
      if (translation.includes('<') || el.classList.contains('i18n-html')) {
        el.innerHTML = translation;
      } else {
        el.textContent = translation;
      }
    }
  });

  // Translate all input placeholders with data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const translation = window.translations[lang][key];
    if (translation !== undefined) {
      el.placeholder = translation;
    }
  });

  // Toggle active class on flag buttons (desktop & mobile)
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const btnLang = btn.getAttribute('data-lang');
    if (btnLang === lang) {
      btn.classList.add('border-cyan-400', 'text-cyan-400', 'bg-cyan-500/10');
      btn.classList.remove('border-white/10', 'text-slate-400', 'bg-transparent');
    } else {
      btn.classList.remove('border-cyan-400', 'text-cyan-400', 'bg-cyan-500/10');
      btn.classList.add('border-white/10', 'text-slate-400', 'bg-transparent');
    }
  });

  // Dynamic Metadata updates
  const metaDesc = document.querySelector('meta[name="description"]');
  if (lang === 'en') {
    document.title = "Expertos MKD | Growth Marketing & Digital Engineering Agency";
    if (metaDesc) metaDesc.setAttribute('content', "Premium next-generation digital agency based in Los Cabos, Mexico with global reach. We scale your business with high-performance software engineering, scientific growth marketing, sales automation, and Looker Studio dashboards.");
  } else {
    document.title = "Expertos MKD | Agencia de Growth Marketing & Ingeniería Digital";
    if (metaDesc) metaDesc.setAttribute('content', "Agencia digital premium de nueva generación con sede en Los Cabos, México y alcance global. Escalamos tu negocio con ingeniería de software de alto rendimiento, growth marketing científico, automatización de ventas (Sales Ops) e inteligencia de negocio (Data & Analytics).");
  }

  // Update dynamic elements
  updateWhatsAppTooltip();
}

function updateWhatsAppTooltip() {
  const tooltip = document.getElementById('whatsapp-tooltip-text');
  if (tooltip && window.translations[currentLanguage]) {
    tooltip.textContent = window.translations[currentLanguage]['wa_tooltip'];
  }
}

/* ==========================================
   1. HERO SLIDER
   ========================================== */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');
  let currentSlide = 0;
  let sliderInterval;
  const slideDuration = 5000; // 5 seconds

  if (slides.length === 0) return;

  function showSlide(index) {
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    slides.forEach((slide, idx) => {
      if (idx === currentSlide) {
        slide.classList.remove('opacity-0', 'pointer-events-none');
        slide.classList.add('opacity-100');
        
        // Trigger animations for slide contents
        const animatedTexts = slide.querySelectorAll('.slide-animate');
        animatedTexts.forEach(el => {
          el.classList.remove('translate-y-8', 'opacity-0');
          el.classList.add('translate-y-0', 'opacity-100');
        });
      } else {
        slide.classList.remove('opacity-100');
        slide.classList.add('opacity-0', 'pointer-events-none');
        
        // Reset animations
        const animatedTexts = slide.querySelectorAll('.slide-animate');
        animatedTexts.forEach(el => {
          el.classList.remove('translate-y-0', 'opacity-100');
          el.classList.add('translate-y-8', 'opacity-0');
        });
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.classList.add('bg-cyan-400', 'w-8');
        dot.classList.remove('bg-white/30', 'w-2');
      } else {
        dot.classList.remove('bg-cyan-400', 'w-8');
        dot.classList.add('bg-white/30', 'w-2');
      }
    });
  }

  function startAutoplay() {
    stopAutoplay();
    sliderInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, slideDuration);
  }

  function stopAutoplay() {
    if (sliderInterval) clearInterval(sliderInterval);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentSlide - 1);
      startAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentSlide + 1);
      startAutoplay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      startAutoplay();
    });
  });

  showSlide(0);
  startAutoplay();
}

/* ==========================================
   2. SCROLL REVEAL (IntersectionObserver)
   ========================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-element');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }
}

/* ==========================================
   3. LEAD CAPTURE FORM HANDLING
   ========================================== */
function initLeadForm() {
  const form = document.getElementById('lead-capture-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('lead-name').value.trim();
    const email = document.getElementById('lead-email').value.trim();
    const company = document.getElementById('lead-company').value.trim();
    const challenge = document.getElementById('lead-challenge').value;

    if (!name || !email || !company || !challenge) {
      alert(currentLanguage === 'en' ? 'Please fill out all fields.' : 'Por favor, completa todos los campos.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    const processingText = window.translations[currentLanguage]['form_processing'];

    // Loading State
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      ${processingText}
    `;

    // Simulate API Call
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      // Show success modal
      showSuccessModal(name);
      form.reset();
    }, 2000);
  });
}

function showSuccessModal(clientName) {
  const trans = window.translations[currentLanguage];
  const formattedTitle = trans['success_title'].replace('{name}', clientName);
  
  const modalHtml = `
    <div id="success-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300">
      <div class="glass-panel max-w-md w-full rounded-2xl p-8 border border-white/10 shadow-2xl transform transition-transform duration-300 scale-95 opacity-0" id="success-modal-content">
        <div class="w-16 h-16 bg-gradient-to-tr from-cyan-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/20">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-heading font-bold text-center text-white mb-2">${formattedTitle}</h3>
        <p class="text-slate-300 text-center text-sm mb-6 leading-relaxed">
          ${trans['success_desc']}
        </p>
        <div class="space-y-3">
          <button id="modal-close-btn" class="w-full py-3 bg-white/10 hover:bg-white/15 text-white font-medium rounded-lg transition text-center block text-sm border border-white/5">
            ${trans['success_close']}
          </button>
          <a href="#" id="modal-calendly-btn" class="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-medium rounded-lg transition text-center block text-sm shadow-md shadow-cyan-500/10">
            ${trans['success_calendly']}
          </a>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  
  const modal = document.getElementById('success-modal');
  const content = document.getElementById('success-modal-content');

  setTimeout(() => {
    content.classList.remove('scale-95', 'opacity-0');
    content.classList.add('scale-100', 'opacity-100');
  }, 50);

  const closeBtn = document.getElementById('modal-close-btn');
  const calendlyBtn = document.getElementById('modal-calendly-btn');

  function closeModal() {
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      modal.remove();
    }, 300);
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  calendlyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal();
    openCalendlyScheduler();
  });
}

/* ==========================================
   4. CALENDLY SCHEDULER MODAL
   ========================================== */
function initCalendlyModal() {
  const triggerBtns = document.querySelectorAll('.open-calendly-trigger');
  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCalendlyScheduler();
    });
  });
}

function openCalendlyScheduler() {
  if (document.getElementById('calendly-modal')) return;

  const trans = window.translations[currentLanguage];

  const modalHtml = `
    <div id="calendly-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md transition-opacity duration-300">
      <div class="glass-panel w-full max-w-4xl h-[85vh] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden transform transition-transform duration-300 scale-95 opacity-0" id="calendly-modal-content">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-slate-950/60">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></span>
            <h3 class="text-lg font-heading font-bold text-white">${trans['calendly_modal_title']}</h3>
          </div>
          <button id="close-calendly-modal" class="text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-white/5">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <!-- Modal Body (Iframe) -->
        <div class="flex-grow bg-slate-900 relative">
          <!-- Loading screen -->
          <div id="iframe-loader" class="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10">
            <svg class="animate-spin h-10 w-10 text-cyan-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-xs text-slate-400 tracking-widest uppercase">${trans['calendly_modal_loading']}</span>
          </div>
          <iframe 
            src="https://calendly.com/expertosmkd-demo/15min?embed_domain=expertosmkd.com&embed_type=Inline&locale=${currentLanguage}" 
            width="100%" 
            height="100%" 
            frameborder="0"
            id="calendly-iframe"
            class="opacity-0 transition-opacity duration-300"
          ></iframe>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const modal = document.getElementById('calendly-modal');
  const content = document.getElementById('calendly-modal-content');
  const iframe = document.getElementById('calendly-iframe');
  const loader = document.getElementById('iframe-loader');

  setTimeout(() => {
    content.classList.remove('scale-95', 'opacity-0');
    content.classList.add('scale-100', 'opacity-100');
  }, 50);

  iframe.addEventListener('load', () => {
    loader.classList.add('opacity-0');
    setTimeout(() => loader.remove(), 300);
    iframe.classList.remove('opacity-0');
    iframe.classList.add('opacity-100');
  });

  // Fallback if loading fails/timeout
  setTimeout(() => {
    if (document.getElementById('iframe-loader')) {
      loader.innerHTML = `
        <p class="text-sm text-slate-300 text-center px-6 mb-4">${trans['calendly_modal_fallback']}</p>
        <a href="https://wa.me/5215500000000?text=Hola,%20quiero%20agendar%20mi%20auditoria" target="_blank" class="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-semibold transition">
          ${trans['calendly_modal_wa']}
        </a>
      `;
    }
  }, 6000);

  function closeCalendly() {
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      modal.remove();
    }, 300);
  }

  document.getElementById('close-calendly-modal').addEventListener('click', closeCalendly);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeCalendly();
  });
}

/* ==========================================
   5. WHATSAPP FLOATING BADGE & INTERACTION
   ========================================== */
function initWhatsAppBadge() {
  const waContainer = document.getElementById('whatsapp-container');
  const waTooltip = document.getElementById('whatsapp-tooltip');
  
  if (!waContainer || !waTooltip) return;

  // Show WhatsApp container after 3 seconds
  setTimeout(() => {
    waContainer.classList.remove('translate-y-24', 'opacity-0');
    waContainer.classList.add('translate-y-0', 'opacity-100');
    
    // Show tooltip 1.5 seconds later
    setTimeout(() => {
      waTooltip.classList.remove('opacity-0', 'scale-90');
      waTooltip.classList.add('opacity-100', 'scale-100');
      
      // Auto-hide tooltip after 8 seconds
      setTimeout(() => {
        waTooltip.classList.remove('opacity-100', 'scale-100');
        waTooltip.classList.add('opacity-0', 'scale-90');
      }, 8000);
    }, 1500);

  }, 3000);

  waContainer.querySelector('a').addEventListener('mouseenter', () => {
    waTooltip.classList.remove('opacity-0', 'scale-90');
    waTooltip.classList.add('opacity-100', 'scale-100');
  });
}

/* ==========================================
   6. MOBILE NAVIGATION MENU
   ========================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = mobileMenu.classList.contains('active');
    
    if (isExpanded) {
      mobileMenu.classList.remove('active', 'opacity-100', 'translate-y-0');
      mobileMenu.classList.add('opacity-0', '-translate-y-4', 'pointer-events-none');
      toggleBtn.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      `;
    } else {
      mobileMenu.classList.remove('opacity-0', '-translate-y-4', 'pointer-events-none');
      mobileMenu.classList.add('active', 'opacity-100', 'translate-y-0');
      toggleBtn.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      `;
    }
  });

  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active', 'opacity-100', 'translate-y-0');
      mobileMenu.classList.add('opacity-0', '-translate-y-4', 'pointer-events-none');
      toggleBtn.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      `;
    });
  });
}
