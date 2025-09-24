// CSS optimization utilities
export class CSSOptimizer {
  constructor() {
    this.usedSelectors = new Set();
    this.criticalCSS = '';
    this.nonCriticalCSS = '';
    this.isInitialized = false;
  }

  // Initialize CSS optimization
  async initialize() {
    if (this.isInitialized || typeof window === 'undefined') return;

    this.analyzeCSSUsage();
    this.setupDeferredCSSLoading();
    this.optimizeFonts();
    this.isInitialized = true;
  }

  // Analyze which CSS is actually being used
  analyzeCSSUsage() {
    const allElements = document.querySelectorAll('*');
    const usedClasses = new Set();

    allElements.forEach(element => {
      element.classList.forEach(className => {
        usedClasses.add(className);
      });

      // Also track data attributes and IDs that might be styled
      Array.from(element.attributes).forEach(attr => {
        if (attr.name.startsWith('data-') || attr.name === 'id') {
          usedClasses.add(attr.value);
        }
      });
    });

    this.usedSelectors = usedClasses;
    return Array.from(usedClasses);
  }

  // Extract critical CSS (above the fold)
  extractCriticalCSS() {
    const criticalElements = [];

    // Get elements in viewport
    const viewportHeight = window.innerHeight;
    const elements = document.querySelectorAll('*');

    elements.forEach(element => {
      const rect = element.getBoundingClientRect();

      // Element is in critical viewport (above the fold + 100px buffer)
      if (rect.top <= viewportHeight + 100) {
        criticalElements.push(element);

        // Add classes to critical CSS
        element.classList.forEach(className => {
          this.usedSelectors.add(`critical-${className}`);
        });
      }
    });

    return criticalElements;
  }

  // Defer non-critical CSS loading
  setupDeferredCSSLoading() {
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');

    stylesheets.forEach((link, index) => {
      // Don't defer critical CSS
      if (link.href.includes('critical') || index === 0) {
        return;
      }

      // Create deferred loading for non-critical CSS
      const deferredLink = link.cloneNode();
      deferredLink.rel = 'preload';
      deferredLink.as = 'style';
      deferredLink.onload = () => {
        deferredLink.rel = 'stylesheet';
      };

      link.parentNode.insertBefore(deferredLink, link);
      link.remove();
    });
  }

  // Optimize font loading
  optimizeFonts() {
    // Add font-display: swap to all fonts
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-display: swap;
      }

      /* Preload critical fonts */
      .font-preload {
        font-display: swap;
      }

      /* Optimize web fonts */
      .font-fallback {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
    `;
    document.head.appendChild(style);

    // Preload critical fonts
    this.preloadCriticalFonts();
  }

  // Preload fonts that are used above the fold
  preloadCriticalFonts() {
    const criticalFonts = [
      '/fonts/Montserrat-Regular.woff2',
      '/fonts/Montserrat-Bold.woff2'
    ];

    criticalFonts.forEach(fontUrl => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = fontUrl;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  // Remove unused CSS
  async removeUnusedCSS() {
    if (typeof window === 'undefined') return;

    const stylesheets = Array.from(document.styleSheets);
    const usedRules = [];

    for (const stylesheet of stylesheets) {
      try {
        const rules = Array.from(stylesheet.cssRules || []);

        for (const rule of rules) {
          if (this.isRuleUsed(rule)) {
            usedRules.push(rule.cssText);
          }
        }
      } catch (e) {
        // Handle CORS errors for external stylesheets
        console.warn('Cannot access stylesheet:', stylesheet.href, e);
      }
    }

    return usedRules.join('\n');
  }

  // Check if a CSS rule is being used
  isRuleUsed(rule) {
    if (!rule.selectorText) return true; // Keep @media, @keyframes, etc.

    try {
      // Check if any elements match this selector
      const elements = document.querySelectorAll(rule.selectorText);
      return elements.length > 0;
    } catch {
      // Invalid selector, keep it to be safe
      return true;
    }
  }

  // Generate critical CSS inline
  generateInlineCriticalCSS() {
    const criticalStyles = `
      /* Critical CSS - Inlined for faster rendering */
      html, body {
        margin: 0;
        padding: 0;
        background-color: #000000;
        font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
        font-display: swap;
      }

      /* Header styles */
      .header-critical {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 50;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
      }

      /* Hero section */
      .hero-critical {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }

      /* Loading states */
      .loading-critical {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255,255,255,.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s ease-in-out infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* Prevent layout shifts */
      .img-placeholder {
        background: rgba(255,255,255,0.1);
        min-height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* Performance optimizations */
      .gpu-layer {
        transform: translateZ(0);
        will-change: transform;
      }

      .contain-layout {
        contain: layout style paint;
      }
    `;

    return criticalStyles;
  }

  // Optimize animations for performance
  optimizeAnimations() {
    const style = document.createElement('style');
    style.id = 'animation-optimizations';
    style.textContent = `
      /* Respect user preferences */
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }

      /* Optimize GPU layers */
      .will-change-transform {
        will-change: transform;
      }

      .will-change-opacity {
        will-change: opacity;
      }

      /* Only add will-change when animating */
      .animating {
        will-change: transform, opacity;
      }

      /* Remove will-change when animation completes */
      .animation-complete {
        will-change: auto;
      }

      /* Optimize common animations */
      .fade-in {
        opacity: 0;
        animation: fadeIn 0.3s ease-out forwards;
      }

      @keyframes fadeIn {
        to { opacity: 1; }
      }

      .slide-up {
        transform: translateY(20px);
        opacity: 0;
        animation: slideUp 0.4s ease-out forwards;
      }

      @keyframes slideUp {
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      /* Performance hints for complex animations */
      .complex-animation {
        contain: layout style paint;
        isolation: isolate;
      }
    `;

    document.head.appendChild(style);
  }

  // Monitor CSS performance
  monitorCSSPerformance() {
    if (typeof window === 'undefined' || !window.PerformanceObserver) return;

    // Monitor resource loading
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.initiatorType === 'css' || entry.name.includes('.css')) {
          console.log('CSS Performance:', {
            name: entry.name,
            loadTime: entry.loadEnd - entry.loadStart,
            size: entry.transferSize,
            cached: entry.transferSize === 0
          });
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });

    // Monitor layout shifts caused by CSS
    const layoutObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.value > 0.1) {
          console.warn('Layout shift detected:', {
            value: entry.value,
            time: entry.startTime,
            sources: entry.sources
          });
        }
      });
    });

    layoutObserver.observe({ entryTypes: ['layout-shift'] });
  }

  // Clean up unused styles
  cleanup() {
    // Remove optimization styles when component unmounts
    const optimizationStyles = document.getElementById('animation-optimizations');
    if (optimizationStyles) {
      document.head.removeChild(optimizationStyles);
    }

    // Clean up will-change properties
    document.querySelectorAll('[style*="will-change"]').forEach(element => {
      element.style.willChange = 'auto';
    });
  }
}

// Create singleton instance
export const cssOptimizer = new CSSOptimizer();

// Initialize on DOM ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => cssOptimizer.initialize());
  } else {
    cssOptimizer.initialize();
  }
}

// React hook for CSS optimization
export function useCSSOptimization(options = {}) {
  if (typeof window === 'undefined') return {};

  const { enableMonitoring = false, optimizeAnimations = true } = options;

  // Initialize CSS optimizer (non-React approach)
  if (typeof cssOptimizer !== 'undefined') {
    cssOptimizer.initialize();

    if (optimizeAnimations) {
      cssOptimizer.optimizeAnimations();
    }

    if (enableMonitoring) {
      cssOptimizer.monitorCSSPerformance();
    }
  }

  return {
    analyzeCSSUsage: () => cssOptimizer.analyzeCSSUsage(),
    extractCriticalCSS: () => cssOptimizer.extractCriticalCSS(),
    removeUnusedCSS: () => cssOptimizer.removeUnusedCSS()
  };
}