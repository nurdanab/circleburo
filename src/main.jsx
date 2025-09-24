// src/main.jsx
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';

import App from './App';
import './index.css';
import './i18n';

// Simplified initialization to avoid context issues

// Start basic optimizations
if (typeof window !== 'undefined') {
  try {
    // Basic performance monitoring only
    import('./components/WebVitals').then(({ reportWebVitals }) => {
      reportWebVitals();
    }).catch(console.warn);

    // Force unregister Service Worker in development
    if ('serviceWorker' in navigator && import.meta.env.DEV) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
          registration.unregister();
          console.log('🔧 SW unregistered for development:', registration);
        }
      });
      // Also clear existing SW cache
      if ('caches' in window) {
        caches.keys().then(function(names) {
          for (let name of names) {
            caches.delete(name);
            console.log('🗑️ SW cache cleared:', name);
          }
        });
      }
    }

    // Enable Service Worker for production with performance optimizations
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ SW registered:', registration.scope);

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, notify user
                console.log('🔄 New content available');
                // Could show update notification to user
              }
            });
          });
        })
        .catch((error) => {
          console.error('❌ SW registration failed:', error);
        });
    }
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