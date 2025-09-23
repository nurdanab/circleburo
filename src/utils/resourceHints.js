// Resource hints utility for performance optimization

export const preloadCriticalResources = () => {
  // Ограничиваем только критическими для LCP
  const criticalResources = [
    // Только лого для header - критические для LCP
    { href: '/img/logo-header.png', as: 'image', fetchpriority: 'high' },
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    if (resource.type) link.type = resource.type;
    if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
    if (resource.fetchpriority) link.fetchPriority = resource.fetchpriority;
    document.head.appendChild(link);
  });
};

export const prefetchNextPageResources = (pathname) => {
  const routePreloadMap = {
    '/': ['/about', '/project'],
    '/about': ['/project', '/'],
    '/project': ['/circle', '/cycle', '/semicircle'],
  };

  const prefetchRoutes = routePreloadMap[pathname];
  if (!prefetchRoutes) return;

  prefetchRoutes.forEach(route => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
  });
};

export const preconnectToExternalDomains = () => {
  const domains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com'
  ];

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

export const addCriticalCSS = () => {
  // Минимальный критический CSS для быстрого LCP
  const style = document.createElement('style');
  style.innerHTML = `
    /* Критический CSS для первоначального рендера */
    *{box-sizing:border-box}html{font-family:system-ui,-apple-system,sans-serif;line-height:1.4}body{margin:0;background:#000;color:#fff;overflow-x:hidden}
    /* Критические стили для LCP элемента */
    .hero-lcp{position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#000}
    .hero-title{font-size:clamp(8rem,20vw,24rem);font-weight:900;line-height:0.8;color:#fff;text-align:center;letter-spacing:0.05em}
    .loading-spinner{width:40px;height:40px;border:3px solid rgba(255,255,255,0.1);border-top:3px solid #fff;border-radius:50%;animation:spin 1s linear infinite}
    @keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
  `;
  document.head.appendChild(style);
};

export const optimizeResourceLoading = (pathname) => {
  // Run optimizations
  preconnectToExternalDomains();
  preloadCriticalResources();
  addCriticalCSS();
  
  // Prefetch likely next pages
  setTimeout(() => {
    prefetchNextPageResources(pathname);
  }, 1000);
};

export const loadNonCriticalResources = () => {
  // Загружаем некритические ресурсы после LCP
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Лази лоадинг аналитики
      import('../analytics.js').then(({ initGA }) => {
        initGA();
      }).catch(err => {
        console.warn('Failed to load analytics:', err);
      });

      // Лази лоадинг анимаций
      const animationElements = document.querySelectorAll('[data-animate="lazy"]');
      if (animationElements.length > 0) {
        Promise.all([
          import('framer-motion'),
          import('gsap')
        ]).then(() => {
          // Анимации загружены
          document.body.classList.add('animations-loaded');
        }).catch(err => {
          console.warn('Failed to load animations:', err);
        });
      }

      // Предзагрузка второстепенных изображений
      const secondaryImages = [
        '/img/circle-fill.webp',
        '/img/hero-poster.webp'
      ];
      secondaryImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = src;
        link.as = 'image';
        document.head.appendChild(link);
      });
    }, { timeout: 3000 });
  } else {
    // Fallback для старых браузеров
    setTimeout(() => {
      import('../analytics.js').then(({ initGA }) => {
        initGA();
      }).catch(err => {
        console.warn('Failed to load analytics:', err);
      });
    }, 1500);
  }
};