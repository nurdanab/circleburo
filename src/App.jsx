// Безопасная версия App.jsx с пошаговой загрузкой
import React, { useEffect, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

console.log('🚀 App-safe loading...');

// Простой компонент загрузки
const SimpleLoader = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#000',
    color: '#fff',
    fontSize: '1.2rem'
  }}>
    <div>Загрузка...</div>
  </div>
);

// Безопасная ленивая загрузка с обработкой ошибок
const safeLazy = (importFn, componentName) => {
  return React.lazy(() =>
    importFn().catch(err => {
      console.error(`Failed to load ${componentName}:`, err);
      // Возвращаем fallback компонент
      return {
        default: () => (
          <div style={{
            padding: '2rem',
            backgroundColor: '#000',
            color: '#fff',
            minHeight: '100vh'
          }}>
            <h1>Ошибка загрузки: {componentName}</h1>
            <p>Компонент не может быть загружен.</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '1rem 2rem',
                backgroundColor: '#333',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Перезагрузить страницу
            </button>
          </div>
        )
      };
    })
  );
};

// Безопасная загрузка страниц
const HomePage = safeLazy(() => import('./pages/HomePage'), 'HomePage');
const AboutPage = safeLazy(() => import('./pages/AboutPage'), 'AboutPage');
const CasePage = safeLazy(() => import('./pages/CasePage'), 'CasePage');
const Circle = safeLazy(() => import('./pages/Circle'), 'Circle');
const Cycle = safeLazy(() => import('./pages/Cycle'), 'Cycle');
const Semicircle = safeLazy(() => import('./pages/Semicircle'), 'Semicircle');
const NotFoundPage = safeLazy(() => import('./pages/NotFoundPage'), 'NotFoundPage');

// Безопасная загрузка компонентов
const Header = safeLazy(() => import('./components/Header'), 'Header');
const Footer = safeLazy(() => import('./components/Footer'), 'Footer');

function AppContent() {
  const location = useLocation();
  const [componentsLoaded, setComponentsLoaded] = useState(false);

  useEffect(() => {
    console.log('🚀 AppContent location changed:', location.pathname);

    // Постепенная загрузка компонентов
    const timer = setTimeout(() => {
      setComponentsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [location]);

  const isAdminRoute = location.pathname === '/admin' || location.pathname === '/login';

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh' }}>
      {!isAdminRoute && componentsLoaded && (
        <Suspense fallback={<div style={{ height: '80px', backgroundColor: '#000' }} />}>
          <Header />
        </Suspense>
      )}

      <Suspense fallback={<SimpleLoader />}>
        <Routes>
          {/* Russian routes (default) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/project" element={<CasePage />} />
          <Route path="/circle" element={<Circle />} />
          <Route path="/cycle" element={<Cycle />} />
          <Route path="/semicircle" element={<Semicircle />} />

          {/* English routes */}
          <Route path="/en" element={<HomePage />} />
          <Route path="/en/about" element={<AboutPage />} />
          <Route path="/en/project" element={<CasePage />} />
          <Route path="/en/circle" element={<Circle />} />
          <Route path="/en/cycle" element={<Cycle />} />
          <Route path="/en/semicircle" element={<Semicircle />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      {!isAdminRoute && componentsLoaded && (
        <Suspense fallback={<div style={{ height: '200px', backgroundColor: '#000' }} />}>
          <Footer />
        </Suspense>
      )}
    </div>
  );
}

function App() {
  console.log('🚀 Safe App rendering...');

  useEffect(() => {
    console.log('✅ Safe App mounted successfully');
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;