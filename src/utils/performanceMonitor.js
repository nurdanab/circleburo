// Performance monitoring utilities
import { useEffect } from 'react';
class PerformanceMonitor {
  constructor() {
    this.observers = new Map();
    this.timers = new Map();
    this.thresholds = {
      fps: 50, // Below 50 FPS is considered poor
      memory: 50 * 1024 * 1024, // 50MB threshold
      renderTime: 16 // 16ms for 60fps
    };
  }

  // Monitor FPS
  startFPSMonitoring(callback) {
    let frames = 0;
    let lastTime = performance.now();

    const tick = (currentTime) => {
      frames++;

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        callback({ fps, timestamp: currentTime });

        // Auto-throttle animations if FPS is too low
        if (fps < this.thresholds.fps) {
          this.throttleAnimations();
        }

        frames = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  // Monitor memory usage
  startMemoryMonitoring(callback) {
    if ('memory' in performance) {
      const monitor = () => {
        const memory = performance.memory;
        const usage = {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
          timestamp: performance.now()
        };

        callback(usage);

        // Trigger garbage collection if memory usage is high
        if (usage.used > this.thresholds.memory) {
          this.requestGarbageCollection();
        }
      };

      // Monitor every 5 seconds
      const interval = setInterval(monitor, 5000);
      return () => clearInterval(interval);
    }

    return () => {}; // No-op if memory API not available
  }

  // Throttle animations for better performance
  throttleAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.1s !important;
        animation-delay: 0s !important;
        transition-duration: 0.1s !important;
        transition-delay: 0s !important;
      }
      .reduce-motion {
        animation: none !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(style);

    // Remove throttling after 10 seconds
    setTimeout(() => {
      document.head.removeChild(style);
    }, 10000);
  }

  // Request garbage collection (if available)
  requestGarbageCollection() {
    if (window.gc && typeof window.gc === 'function') {
      try {
        window.gc();
      } catch (e) {
        console.warn('Garbage collection failed:', e);
      }
    }
  }

  // Observe Largest Contentful Paint
  observeLCP(callback) {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        callback(lastEntry.startTime);
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('lcp', observer);
    }
  }

  // Observe Cumulative Layout Shift
  observeCLS(callback) {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            callback(clsValue);
          }
        }
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('cls', observer);
    }
  }

  // Cleanup all observers
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
  }

  // Get performance metrics
  getMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0];
    return {
      domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
      loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
      firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
      firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
      memory: performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      } : null
    };
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export const usePerformanceMonitor = (options = {}) => {
  const {
    enableFPS = false,
    enableMemory = false,
    enableLCP = false,
    enableCLS = false
  } = options;

  useEffect(() => {
    const cleanup = [];

    if (enableFPS) {
      performanceMonitor.startFPSMonitoring((data) => {
        console.log('FPS:', data.fps);
      });
    }

    if (enableMemory) {
      const memoryCleanup = performanceMonitor.startMemoryMonitoring((usage) => {
        console.log('Memory usage:', Math.round(usage.used / 1024 / 1024), 'MB');
      });
      cleanup.push(memoryCleanup);
    }

    if (enableLCP) {
      performanceMonitor.observeLCP((lcp) => {
        console.log('LCP:', lcp);
      });
    }

    if (enableCLS) {
      performanceMonitor.observeCLS((cls) => {
        console.log('CLS:', cls);
      });
    }

    return () => {
      cleanup.forEach(fn => fn());
      performanceMonitor.cleanup();
    };
  }, [enableFPS, enableMemory, enableLCP, enableCLS]);

  return performanceMonitor.getMetrics();
};

export default performanceMonitor;