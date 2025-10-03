// src/utils/prefetch.js

/**
 * Mobile-optimized route prefetching utility
 * Prefetches routes intelligently based on device and network conditions
 */

import { getConnectionInfo } from './networkDetection';

/**
 * Prefetch a route with mobile optimization
 * @param {string} route - Route to prefetch
 * @param {Object} options - Prefetch options
 */
export const prefetchRoute = (route, options = {}) => {
  const {
    priority = 'low',
    delay = 0,
    condition = () => true
  } = options;

  // Check if we should prefetch based on network conditions
  const { slow, saveData } = getConnectionInfo();
  const isMobile = window.innerWidth < 768;

  // Don't prefetch on slow connections or when data saver is on
  if (slow || saveData) {
    return;
  }

  // On mobile, only prefetch if idle
  if (isMobile && priority === 'low') {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        if (condition()) {
          performPrefetch(route, delay);
        }
      }, { timeout: 2000 });
    }
    return;
  }

  // On desktop or high priority, prefetch after delay
  if (delay > 0) {
    setTimeout(() => {
      if (condition()) {
        performPrefetch(route, 0);
      }
    }, delay);
  } else {
    if (condition()) {
      performPrefetch(route, 0);
    }
  }
};

/**
 * Perform the actual prefetch
 * @param {string} route - Route to prefetch
 * @param {number} delay - Delay before prefetch
 */
const performPrefetch = (route, delay = 0) => {
  const execute = () => {
    // Use link[rel=prefetch] for better browser support
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    link.as = 'document';
    document.head.appendChild(link);
  };

  if (delay > 0) {
    setTimeout(execute, delay);
  } else {
    execute();
  }
};

/**
 * Prefetch multiple routes with smart prioritization
 * @param {Array} routes - Array of route objects with priority
 */
export const prefetchRoutes = (routes) => {
  const { slow, saveData } = getConnectionInfo();
  const isMobile = window.innerWidth < 768;

  // Don't prefetch on slow mobile connections
  if (isMobile && (slow || saveData)) {
    return;
  }

  // Sort by priority
  const sortedRoutes = routes.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority || 'low'] - priorityOrder[b.priority || 'low'];
  });

  // Prefetch with delays between each
  sortedRoutes.forEach((route, index) => {
    const delay = isMobile ? index * 1000 : index * 500; // Longer delays on mobile
    prefetchRoute(route.path, {
      priority: route.priority || 'low',
      delay,
      condition: route.condition
    });
  });
};

/**
 * Prefetch on hover with debounce for mobile
 * @param {string} route - Route to prefetch
 */
export const prefetchOnHover = (route) => {
  let timeoutId;
  const isMobile = window.innerWidth < 768;

  return {
    onMouseEnter: () => {
      if (isMobile) return; // Don't prefetch on hover for mobile

      timeoutId = setTimeout(() => {
        prefetchRoute(route, { priority: 'medium' });
      }, 100);
    },
    onMouseLeave: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  };
};

/**
 * Prefetch visible links in viewport
 */
export const prefetchVisibleLinks = () => {
  const { slow, saveData } = getConnectionInfo();
  const isMobile = window.innerWidth < 768;

  // More conservative on mobile
  if (slow || saveData || (isMobile && document.visibilityState !== 'visible')) {
    return;
  }

  const links = document.querySelectorAll('a[href^="/"]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const href = entry.target.getAttribute('href');
          if (href && !href.includes('#')) {
            prefetchRoute(href, {
              priority: 'low',
              delay: isMobile ? 500 : 100
            });
          }
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: isMobile ? '50px' : '100px', // Smaller margin on mobile
      threshold: 0.1
    }
  );

  links.forEach((link) => observer.observe(link));
};

/**
 * Preload critical resources for a route
 * @param {Object} resources - Resources to preload
 */
export const preloadResources = (resources = {}) => {
  const { images = [], scripts = [], styles = [] } = resources;
  const { slow, saveData } = getConnectionInfo();
  const isMobile = window.innerWidth < 768;

  // Don't preload on slow connections
  if (slow || saveData) {
    return;
  }

  // Preload images
  images.forEach((src, index) => {
    if (isMobile && index > 2) return; // Limit preloads on mobile

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.fetchPriority = index === 0 ? 'high' : 'low';
    document.head.appendChild(link);
  });

  // Preload scripts
  scripts.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = src;
    document.head.appendChild(link);
  });

  // Preload styles
  styles.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = src;
    document.head.appendChild(link);
  });
};
