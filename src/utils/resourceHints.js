// Resource hints utility for performance optimization

export const preloadCriticalResources = () => {
  const criticalResources = [
    // Critical images
    { href: '/img/hero-poster.webp', as: 'image' },
    { href: '/img/circle-fill.webp', as: 'image' },
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    if (resource.type) link.type = resource.type;
    if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
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
  // This would be where critical CSS is inlined
  // For now, we ensure Tailwind's critical styles are loaded first
  const style = document.createElement('style');
  style.innerHTML = `
    /* Critical CSS for initial render */
    html { font-family: system-ui, -apple-system, sans-serif; }
    body { margin: 0; background: #fff; }
    .loading-screen { 
      position: fixed; 
      inset: 0; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      background: #fff; 
      z-index: 9999; 
    }
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
  // Load non-critical resources after initial render
  requestIdleCallback(() => {
    // Analytics
    import('../analytics.js').then(({ initGA }) => {
      initGA();
    });
    
    // Other non-critical scripts
  }, { timeout: 5000 });
};