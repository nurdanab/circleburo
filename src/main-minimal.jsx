// Минимальная версия main.jsx для диагностики
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from '@dr.pogodin/react-helmet';

console.log('🚀 Starting minimal app...');

// Простой компонент для тестирования
function TestApp() {
  console.log('🚀 TestApp rendering...');

  return (
    <div style={{ padding: '2rem', backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      <h1>Test App</h1>
      <p>If you see this, the basic setup is working.</p>
      <p>React version: {React.version}</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
}

const root = document.getElementById('root');

console.log('🚀 Root element:', root);

if (root) {
  ReactDOM.createRoot(root).render(
    <StrictMode>
      <HelmetProvider>
        <TestApp />
      </HelmetProvider>
    </StrictMode>
  );
} else {
  console.error('❌ Root element not found!');
}