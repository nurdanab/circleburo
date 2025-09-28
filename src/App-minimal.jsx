// Минимальная версия App для диагностики
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

function MinimalApp() {
  console.log('🚀 MinimalApp component rendering...');

  return (
    <div style={{ padding: '2rem', backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      <h1>Minimal App - Testing</h1>
      <p>If you see this, React is working correctly.</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
}

function App() {
  console.log('🚀 App wrapper rendering...');

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <MinimalApp />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;