// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from '@dr.pogodin/react-helmet';

import App from './App';
import './index.css';
import './i18n';

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
}

// Register Service Worker for offline support and caching
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        if (import.meta.env.DEV) {
          console.log('SW registered:', registration);
        }
      })
      .catch((error) => {
        if (import.meta.env.DEV) {
          console.log('SW registration failed:', error);
        }
      });
  });
}