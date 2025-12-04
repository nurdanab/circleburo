// Performance optimization component
import { useEffect, useRef, useCallback } from 'react';

const PerformanceOptimizer = ({ children }) => {
  const idleCallbackRef = useRef(null);
  const observerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const isPageHiddenRef = useRef(false);

  // Throttle heavy operations when page is not visible
  const handleVisibilityChange = useCallback(() => {
    isPageHiddenRef.current = document.hidden;

    if (document.hidden) {
      // Page is hidden - reduce activity
      document.body.classList.add('page-hidden');

      // Pause animations that don't need to run in background
      const style = document.createElement('style');
      style.id = 'performance-optimization';
      style.textContent = `
        .page-hidden * {
          animation-play-state: paused !important;
        }
        .page-hidden .animate-pulse {
          animation: none !important;
        }
        .page-hidden .animate-spin {
          animation: none !important;
        }
      `;
      document.head.appendChild(style);
    } else {
      // Page is visible - resume normal activity
      document.body.classList.remove('page-hidden');
      const style = document.getElementById('performance-optimization');
      if (style) {
        document.head.removeChild(style);
      }
      lastActivityRef.current = Date.now();
    }
  }, []);

  // Detect user inactivity and optimize accordingly
  const handleUserActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  // Optimize animations based on device capabilities
  const optimizeForDevice = useCallback(() => {
    const deviceMemory = navigator.deviceMemory || 4; // Default to 4GB if not available
    const connectionType = navigator.connection?.effectiveType || '4g';
    const isLowEndDevice = deviceMemory < 4 || connectionType === 'slow-2g' || connectionType === '2g';

    if (isLowEndDevice) {
      document.body.classList.add('low-performance-device');

      // Add reduced animation styles for low-end devices
      const style = document.createElement('style');
      style.id = 'device-optimization';
      style.textContent = `
        .low-performance-device * {
          animation-duration: 0.2s !important;
          transition-duration: 0.2s !important;
        }
        .low-performance-device .complex-animation {
          animation: none !important;
        }
        .low-performance-device .blur-effect {
          backdrop-filter: none !important;
          filter: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Intersection Observer for lazy loading optimization
  const setupIntersectionObserver = useCallback(() => {
    if ('IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-viewport');
            } else {
              entry.target.classList.remove('in-viewport');
            }
          });
        },
        {
          rootMargin: '50px',
          threshold: 0.1
        }
      );

      // Observe all sections
      const sections = document.querySelectorAll('section, .lazy-section');
      sections.forEach(section => {
        observerRef.current.observe(section);
      });
    }
  }, []);

  // Check for memory pressure and optimize
  const optimizeMemoryUsage = useCallback(() => {
    if ('requestIdleCallback' in window) {
      idleCallbackRef.current = requestIdleCallback(() => {
        // Clean up unused DOM nodes
        const unusedElements = document.querySelectorAll('.hidden, .opacity-0:not(.transition)');
        unusedElements.forEach(el => {
          if (!el.getBoundingClientRect().height) {
            el.style.display = 'none';
          }
        });

        // Clean up completed animations
        const completedAnimations = document.querySelectorAll('[style*="animation"]:not(.animating)');
        completedAnimations.forEach(el => {
          el.style.animation = '';
        });

        // Schedule next optimization
        setTimeout(optimizeMemoryUsage, 30000); // Every 30 seconds
      });
    }
  }, []);

  // Activity monitoring
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Check for inactivity every 5 minutes
    const inactivityTimer = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivityRef.current;
      const fiveMinutes = 5 * 60 * 1000;

      if (timeSinceActivity > fiveMinutes && !isPageHiddenRef.current) {
        // User is inactive - reduce performance overhead
        document.body.classList.add('user-inactive');
      } else {
        document.body.classList.remove('user-inactive');
      }
    }, 30000); // Check every 30 seconds

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
      clearInterval(inactivityTimer);
    };
  }, [handleUserActivity]);

  // Main optimization setup
  useEffect(() => {
    // Setup visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Optimize for device capabilities
    optimizeForDevice();

    // Setup intersection observer
    setupIntersectionObserver();

    // Start memory optimization
    optimizeMemoryUsage();

    // Add performance CSS - БЕЗ GPU стилей которые создают stacking context
    const performanceStyles = document.createElement('style');
    performanceStyles.id = 'performance-styles';
    performanceStyles.textContent = `
      /* УДАЛЕНЫ GPU acceleration стили - они создают stacking context и блокируют header */
      /* .gpu-accelerated, .optimized-animation - УДАЛЕНЫ */

      /* Optimize scrolling */
      .smooth-scroll {
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
      }

      /* Reduce motion for users who prefer it */
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }

      /* Battery optimization - БЕЗ filter который создает stacking context */
      @media (prefers-reduced-motion: reduce), (prefers-color-scheme: dark) {
        .battery-optimized {
          opacity: 0.8;
        }
      }

      /* Inactive state optimizations */
      .user-inactive .animate-pulse,
      .user-inactive .animate-spin {
        animation-play-state: paused;
      }

      /* Hidden page optimizations */
      .page-hidden .expensive-animation {
        animation-play-state: paused;
      }
    `;
    document.head.appendChild(performanceStyles);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (idleCallbackRef.current) {
        cancelIdleCallback(idleCallbackRef.current);
      }

      // Clean up styles
      const styles = document.getElementById('performance-styles');
      if (styles) document.head.removeChild(styles);

      const deviceStyles = document.getElementById('device-optimization');
      if (deviceStyles) document.head.removeChild(deviceStyles);

      const perfStyles = document.getElementById('performance-optimization');
      if (perfStyles) document.head.removeChild(perfStyles);
    };
  }, [handleVisibilityChange, optimizeForDevice, setupIntersectionObserver, optimizeMemoryUsage]);

  return children;
};

export default PerformanceOptimizer;