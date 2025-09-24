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

    // Temporarily disable Service Worker completely
    // TODO: Re-enable after fixing clone() errors
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
          registration.unregister();
          console.log('🔧 SW unregistered:', registration);
        }
      });
      // Clear all SW cache
      if ('caches' in window) {
        caches.keys().then(function(names) {
          for (let name of names) {
            caches.delete(name);
            console.log('🗑️ SW cache cleared:', name);
          }
        });
      }
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