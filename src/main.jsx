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

            // Принудительно проверяем обновления
            registration.update();

            // Проверяем обновления
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Новый SW установлен, принудительно обновляем
                  console.log('New SW installed, reloading page');
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload(true); // hard reload
                }
              });
            });

            // Слушаем сообщения от SW
            navigator.serviceWorker.addEventListener('message', (event) => {
              if (event.data?.type === 'SW_UPDATED') {
                console.log('SW updated to version:', event.data.version);
                // Принудительно обновляем страницу
                window.location.reload(true);
              }
            });

            // Периодически проверяем обновления SW (каждые 30 секунд)
            setInterval(() => {
              registration.update();
            }, 30000);
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