// src/main.jsx
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from '@dr.pogodin/react-helmet';

import App from './App';
import './index.css';
import './i18n';

console.log('🚀 Starting application...');

const root = document.getElementById('root');

console.log('🚀 Root element found:', !!root);

if (root) {
  try {
    ReactDOM.createRoot(root).render(
      <StrictMode>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </StrictMode>
    );
    console.log('✅ App rendered successfully');
  } catch (error) {
    console.error('❌ Error rendering app:', error);
    // Fallback rendering
    ReactDOM.createRoot(root).render(
      <div style={{
        padding: '2rem',
        backgroundColor: '#000',
        color: '#fff',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1>🚨 Ошибка загрузки</h1>
        <p>Произошла ошибка при инициализации приложения.</p>
        <p>Ошибка: {error.message}</p>
      </div>
    );
  }
} else {
  console.error('❌ Root element not found!');
}