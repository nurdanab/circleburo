import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals';

function getConnectionSpeed() {
  return 'connection' in navigator &&
    'effectiveType' in navigator.connection
    ? navigator.connection.effectiveType
    : '';
}

function sendToAnalytics(metric, options) {
  const page = Object.assign(
    {
      path: window.location.pathname,
      referrer: document.referrer,
      connection: getConnectionSpeed(),
    },
    options
  );

  const body = {
    dsn: import.meta.env.VITE_VERCEL_ANALYTICS_ID || 'development',
    id: metric.id,
    page: page.path,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: page.connection,
  };

  if (import.meta.env.DEV) {
    console.log('[Web Vitals]', metric.name, Math.round(metric.value), 'ms', body);
  }

  // Send to analytics if configured
  if (import.meta.env.PROD && body.dsn && body.dsn !== 'development') {
    const blob = new Blob([new URLSearchParams(body).toString()], {
      type: 'application/x-www-form-urlencoded',
    });
    
    if (navigator.sendBeacon) {
      navigator.sendBeacon(vitalsUrl, blob);
    } else {
      fetch(vitalsUrl, {
        body: blob,
        method: 'POST',
        credentials: 'omit',
        keepalive: true,
      }).catch(() => {});
    }
  }
  
  // Also send to Google Analytics 4
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
}

export function reportWebVitals() {
  try {
    // Core Web Vitals
    onCLS(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
    
    // New metric - INP replaces FID
    if (onINP) {
      onINP(sendToAnalytics);
    }
    
  } catch (err) {
    console.error('Error reporting web vitals:', err);
  }
}

// Performance observer for additional metrics
export function observePerformance() {
  if ('PerformanceObserver' in window) {
    // Long tasks observer
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.log('[Long Task]', entry.duration, 'ms');
          }
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch (err) {
      console.warn('Long task observer not supported:', err);
    }

    // Layout shift observer
    try {
      const layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput && entry.value > 0.1) {
            console.log('[Layout Shift]', entry.value, entry.sources);
          }
        }
      });
      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (err) {
      console.warn('Layout shift observer not supported:', err);
    }
  }
}