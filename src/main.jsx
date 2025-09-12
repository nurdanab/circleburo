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
  // Critical resource optimization
  optimizeResourceLoading(window.location.pathname);
  
  // Start performance monitoring
  reportWebVitals();
  observePerformance();
  
  // Load non-critical resources
  loadNonCriticalResources();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);