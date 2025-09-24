// Advanced performance optimization utilities
class PerformanceOptimizer {
  constructor() {
    this.observers = new Map();
    this.isInitialized = false;
    this.performanceMetrics = {};
    this.optimizationSettings = {
      enableImageOptimization: true,
      enableCodeSplitting: true,
      enableResourceHints: true,
      enableServiceWorker: true,
      maxBundleSize: 100 * 1024, // 100KB
      maxImageSize: 500 * 1024,  // 500KB
      criticalResourceTimeout: 3000 // 3s
    };
  }

  // Initialize all performance optimizations
  async initialize() {
    if (this.isInitialized || typeof window === 'undefined') return;

    try {
      // Start monitoring immediately
      this.startPerformanceMonitoring();

      // Initialize optimizations
      await Promise.all([
        this.optimizeResourceLoading(),
        this.optimizeFontLoading(),
        this.setupIntersectionObservers(),
        this.optimizeScrollPerformance(),
        this.setupErrorBoundaries()
      ]);

      // Setup cleanup on page unload
      this.setupCleanup();

      this.isInitialized = true;
      console.log('🚀 Performance optimizer initialized');
    } catch (error) {
      console.error('Failed to initialize performance optimizer:', error);
    }
  }

  // Monitor Core Web Vitals and other metrics
  startPerformanceMonitoring() {
    if (!('PerformanceObserver' in window)) return;

    // Monitor LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        this.performanceMetrics.lcp = entry.startTime;
        if (entry.startTime > 2500) {
          this.optimizeLCP();
        }
      });
    });

    // Monitor FID (First Input Delay)
    const fidObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        this.performanceMetrics.fid = entry.processingStart - entry.startTime;
        if (entry.processingStart - entry.startTime > 100) {
          this.optimizeFID();
        }
      });
    });

    // Monitor CLS (Cumulative Layout Shift)
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      list.getEntries().forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.performanceMetrics.cls = clsValue;

      if (clsValue > 0.1) {
        this.optimizeCLS();
      }
    });

    // Monitor resource loading
    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        this.analyzeResourcePerformance(entry);
      });
    });

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      fidObserver.observe({ entryTypes: ['first-input'] });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      resourceObserver.observe({ entryTypes: ['resource'] });

      this.observers.set('lcp', lcpObserver);
      this.observers.set('fid', fidObserver);
      this.observers.set('cls', clsObserver);
      this.observers.set('resource', resourceObserver);
    } catch (error) {
      console.warn('Some performance observers not supported:', error);
    }
  }

  // Optimize LCP (Largest Contentful Paint)
  optimizeLCP() {
    // Preload LCP element if it's an image
    const lcpElements = document.querySelectorAll('img, video, [style*="background-image"]');
    lcpElements.forEach(element => {
      if (this.isInViewport(element)) {
        this.preloadResource(element);
      }
    });

    // Optimize critical resources
    this.prioritizeCriticalResources();
  }

  // Optimize FID (First Input Delay)
  optimizeFID() {
    // Break up long tasks
    this.optimizeLongTasks();

    // Defer non-critical JavaScript
    this.deferNonCriticalJS();

    // Use requestIdleCallback for non-urgent work
    this.scheduleNonUrgentWork();
  }

  // Optimize CLS (Cumulative Layout Shift)
  optimizeCLS() {
    // Add dimensions to images without them
    const imagesWithoutDimensions = document.querySelectorAll('img:not([width]):not([height])');
    imagesWithoutDimensions.forEach(img => {
      // Try to get dimensions from natural size or set defaults
      if (img.naturalWidth && img.naturalHeight) {
        img.width = img.naturalWidth;
        img.height = img.naturalHeight;
      } else {
        img.style.aspectRatio = '16/9'; // Default aspect ratio
      }
    });

    // Reserve space for dynamic content
    this.reserveSpaceForDynamicContent();

    // Fix font swapping issues
    this.optimizeFontSwapping();
  }

  // Analyze resource performance
  analyzeResourcePerformance(entry) {
    const { name, duration, transferSize, initiatorType } = entry;

    // Flag slow resources
    if (duration > 1000) {
      console.warn(`Slow resource detected: ${name} (${Math.round(duration)}ms)`);

      if (initiatorType === 'img' && transferSize > this.optimizationSettings.maxImageSize) {
        this.optimizeImage(name);
      }
    }

    // Track resource sizes
    if (transferSize > this.optimizationSettings.maxBundleSize && initiatorType === 'script') {
      console.warn(`Large JavaScript bundle: ${name} (${Math.round(transferSize / 1024)}KB)`);
      this.suggestCodeSplitting(name);
    }
  }

  // Optimize resource loading
  async optimizeResourceLoading() {
    // Preconnect to critical domains
    const criticalDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://www.googletagmanager.com'
    ];

    criticalDomains.forEach(domain => {
      this.addPreconnect(domain);
    });

    // DNS prefetch for less critical domains
    const prefetchDomains = [
      '//www.google-analytics.com',
      '//connect.facebook.net'
    ];

    prefetchDomains.forEach(domain => {
      this.addDNSPrefetch(domain);
    });

    // Preload critical resources
    await this.preloadCriticalResources();
  }

  // Preload critical resources
  async preloadCriticalResources() {
    const criticalResources = [
      { href: '/fonts/Montserrat-Regular.woff2', as: 'font', type: 'font/woff2' },
      { href: '/img/logo-header.webp', as: 'image' }
    ];

    criticalResources.forEach(resource => {
      this.addPreload(resource);
    });
  }

  // Add preconnect link
  addPreconnect(href) {
    if (document.querySelector(`link[rel="preconnect"][href="${href}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }

  // Add DNS prefetch link
  addDNSPrefetch(href) {
    if (document.querySelector(`link[rel="dns-prefetch"][href="${href}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = href;
    document.head.appendChild(link);
  }

  // Add preload link
  addPreload({ href, as, type, media }) {
    if (document.querySelector(`link[rel="preload"][href="${href}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;

    if (type) link.type = type;
    if (media) link.media = media;
    if (as === 'font') link.crossOrigin = 'anonymous';

    document.head.appendChild(link);
  }

  // Optimize font loading
  optimizeFontLoading() {
    // Add font-display: swap to improve FCP
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-display: swap;
      }

      /* Fallback fonts */
      .font-montserrat {
        font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
    `;
    document.head.appendChild(style);

    // Load fonts with Font Loading API
    if ('fonts' in document) {
      const fontPromises = [
        new FontFace('Montserrat', 'url(/fonts/Montserrat-Regular.woff2)', { weight: '400' }),
        new FontFace('Montserrat', 'url(/fonts/Montserrat-Bold.woff2)', { weight: '700' })
      ];

      Promise.all(fontPromises.map(font => font.load())).then(fonts => {
        fonts.forEach(font => document.fonts.add(font));
      }).catch(error => {
        console.warn('Font loading failed:', error);
      });
    }
  }

  // Setup intersection observers for lazy loading
  setupIntersectionObservers() {
    // Lazy load images
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImage(img);
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });

    // Lazy load components
    const componentObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const component = entry.target;
          this.loadComponent(component);
          componentObserver.unobserve(component);
        }
      });
    }, { rootMargin: '100px' });

    this.observers.set('images', imageObserver);
    this.observers.set('components', componentObserver);

    // Observe elements
    document.querySelectorAll('[data-lazy]').forEach(img => imageObserver.observe(img));
    document.querySelectorAll('[data-lazy-component]').forEach(component => componentObserver.observe(component));
  }

  // Load image with optimization
  loadImage(img) {
    const src = img.dataset.lazy || img.dataset.src;
    if (!src) return;

    // Create optimized image URL based on device capabilities
    const optimizedSrc = this.getOptimizedImageUrl(src);

    img.src = optimizedSrc;
    img.classList.add('loaded');
    img.removeAttribute('data-lazy');
  }

  // Get optimized image URL
  getOptimizedImageUrl(src) {
    const _devicePixelRatio = window.devicePixelRatio || 1;
    const connection = navigator.connection;

    let _quality = 85;
    if (connection && connection.effectiveType === '2g') {
      _quality = 60;
    } else if (connection && connection.effectiveType === '3g') {
      _quality = 70;
    }

    // This would integrate with your image optimization service
    return src; // Placeholder - implement actual optimization logic
  }

  // Optimize scroll performance
  optimizeScrollPerformance() {
    let isScrolling = false;

    const optimizeScroll = () => {
      if (!isScrolling) {
        requestAnimationFrame(() => {
          // Passive scroll optimizations
          this.updateVisibleElements();
          isScrolling = false;
        });
        isScrolling = true;
      }
    };

    // Use passive listeners for better performance
    document.addEventListener('scroll', optimizeScroll, { passive: true });
    window.addEventListener('resize', optimizeScroll, { passive: true });
  }

  // Update visible elements during scroll
  updateVisibleElements() {
    // Pause animations for off-screen elements
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(element => {
      if (!this.isInViewport(element)) {
        element.style.animationPlayState = 'paused';
      } else {
        element.style.animationPlayState = 'running';
      }
    });
  }

  // Check if element is in viewport
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  }

  // Optimize long tasks
  optimizeLongTasks() {
    // Break up long-running operations
    const scheduler = (callback) => {
      if ('scheduler' in window && 'postTask' in window.scheduler) {
        return window.scheduler.postTask(callback, { priority: 'user-blocking' });
      } else if ('requestIdleCallback' in window) {
        return requestIdleCallback(callback);
      } else {
        return setTimeout(callback, 0);
      }
    };

    // Yield to main thread periodically
    window.yieldToMain = function*() {
      while (true) {
        yield new Promise(resolve => scheduler(resolve));
      }
    };
  }

  // Setup error boundaries for performance
  setupErrorBoundaries() {
    window.addEventListener('error', (event) => {
      console.error('Performance-related error:', event.error);
      // Could report to analytics
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      // Could report to analytics
    });
  }

  // Get performance report
  getPerformanceReport() {
    return {
      ...this.performanceMetrics,
      timestamp: Date.now(),
      navigation: performance.getEntriesByType('navigation')[0],
      resources: performance.getEntriesByType('resource'),
      memory: 'memory' in performance ? performance.memory : null
    };
  }

  // Cleanup on page unload
  setupCleanup() {
    const cleanup = () => {
      // Disconnect all observers
      this.observers.forEach(observer => {
        if (observer && typeof observer.disconnect === 'function') {
          observer.disconnect();
        }
      });

      // Clear any scheduled work
      if (this.scheduledWork) {
        this.scheduledWork.forEach(id => {
          if (typeof id === 'number') {
            clearTimeout(id);
            clearInterval(id);
          }
        });
      }
    };

    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('pagehide', cleanup);
  }

  // Preload resource
  preloadResource(element) {
    if (element.tagName === 'IMG') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = element.src || element.dataset.src;
      document.head.appendChild(link);
    }
  }

  // Priority critical resources
  prioritizeCriticalResources() {
    const criticalElements = document.querySelectorAll('[data-critical]');
    criticalElements.forEach(element => {
      if (element.tagName === 'IMG') {
        element.loading = 'eager';
        element.fetchPriority = 'high';
      }
    });
  }

  // Defer non-critical JavaScript
  deferNonCriticalJS() {
    const scripts = document.querySelectorAll('script[data-defer]');
    scripts.forEach(script => {
      script.defer = true;
    });
  }

  // Schedule non-urgent work
  scheduleNonUrgentWork() {
    const nonUrgentTasks = [];

    // Add your non-urgent tasks here
    nonUrgentTasks.forEach(task => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(task, { timeout: 5000 });
      } else {
        setTimeout(task, 0);
      }
    });
  }

  // Reserve space for dynamic content
  reserveSpaceForDynamicContent() {
    const dynamicElements = document.querySelectorAll('[data-dynamic]');
    dynamicElements.forEach(element => {
      if (!element.style.minHeight) {
        element.style.minHeight = '100px'; // Default reservation
      }
    });
  }

  // Optimize font swapping
  optimizeFontSwapping() {
    // Add font loading class to body
    document.body.classList.add('fonts-loading');

    // Remove class when fonts are loaded
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        document.body.classList.remove('fonts-loading');
        document.body.classList.add('fonts-loaded');
      });
    }
  }

  // Load component lazily
  loadComponent(component) {
    const componentName = component.dataset.lazyComponent;
    // Implement dynamic component loading logic here
    console.log(`Loading component: ${componentName}`);
  }

  // Suggest code splitting for large bundles
  suggestCodeSplitting(bundleName) {
    console.warn(`Consider code splitting for: ${bundleName}`);
    // Could implement automatic code splitting suggestions
  }

  // Optimize image
  optimizeImage(imageSrc) {
    console.warn(`Consider optimizing image: ${imageSrc}`);
    // Could implement automatic image optimization
  }
}

// Create and export singleton
export const performanceOptimizer = new PerformanceOptimizer();

// Auto-initialize on DOM ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => performanceOptimizer.initialize());
  } else {
    performanceOptimizer.initialize();
  }
}

// React hook for performance optimization
export function usePerformanceOptimization() {
  if (typeof window === 'undefined') return {};

  // Initialize without React dependency to avoid context issues
  performanceOptimizer.initialize();

  return {
    getReport: () => performanceOptimizer.getPerformanceReport(),
    optimizeLCP: () => performanceOptimizer.optimizeLCP(),
    optimizeFID: () => performanceOptimizer.optimizeFID(),
    optimizeCLS: () => performanceOptimizer.optimizeCLS()
  };
}