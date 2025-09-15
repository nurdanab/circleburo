// src/main.jsx
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';

import App from './App';
import './index.css';
import './i18n';

// Import web vitals for performance monitoring
import { reportWebVitals, observePerformance } from './components/WebVitals';
import { optimizeResourceLoading, loadNonCriticalResources } from './utils/resourceHints';

// Start performance optimizations
if (typeof window !== 'undefined') {
  try {
    // Critical resource optimization
    optimizeResourceLoading(window.location.pathname);
    
    // Start performance monitoring
    reportWebVitals();
    observePerformance();
    
    // Register Service Worker only in production
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
            
            // Проверяем обновления
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Новый SW установлен, можно обновить страницу
                  if (confirm('Доступно обновление сайта. Обновить сейчас?')) {
                    window.location.reload();
                  }
                }
              });
            });
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
    
    // Load non-critical resources
    loadNonCriticalResources();
  } catch (error) {
    console.error('Error in main.jsx initialization:', error);
    // Continue with app initialization even if optimizations fail
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);