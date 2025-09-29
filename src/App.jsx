// src/App.jsx
import React, { useEffect, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
// Analytics will be loaded dynamically for better performance

// Enhanced lazy loading with retry mechanism
const createLazyComponent = (importFn, name) => {
  return lazy(() =>
    importFn().catch(err => {
      console.error(`Failed to load ${name}, retrying...`, err);
      // Clear any potential cache and retry once
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          importFn()
            .then(resolve)
            .catch(retryErr => {
              console.error(`Failed to load ${name} after retry:`, retryErr);
              reject(retryErr);
            });
        }, 500);
      });
    })
  );
};

const HomePage = createLazyComponent(() => import('./pages/HomePage'), 'HomePage');
const AboutPage = createLazyComponent(() => import('./pages/AboutPage'), 'AboutPage');
const CasePage = createLazyComponent(() => import('./pages/CasePage'), 'CasePage');
const Circle = createLazyComponent(() => import('./pages/Circle'), 'Circle');
const Cycle = createLazyComponent(() => import('./pages/Cycle'), 'Cycle');
const Semicircle = createLazyComponent(() => import('./pages/Semicircle'), 'Semicircle');
import AdminPage from './pages/AdminPage';
const LoginPage = createLazyComponent(() => import('./pages/LoginPage'), 'LoginPage');
const NotFoundPage = createLazyComponent(() => import('./pages/NotFoundPage'), 'NotFoundPage');

import Header from './components/Header';
import Footer from './components/Footer';
import LazyPage from './components/LazyPage';
import ErrorBoundary from './components/ErrorBoundary';

// Defer non-critical helpers to reduce initial JS and main-thread work
const SplashCursor = lazy(() => import('./components/SplashCursor'));
const PerformanceMeta = lazy(() => import('./components/PerformanceMeta'));
const AccessibilityHelper = lazy(() => import('./components/AccessibilityHelper'));
const PerformanceOptimizer = lazy(() => import('./components/PerformanceOptimizer'));
const PrerenderManager = lazy(() => import('./components/PrerenderManager'));

const ProtectedRoute = ({ children }) => {
  const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  if (!isAdminLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppContent() {
  const location = useLocation();
  const [showEnhancements, setShowEnhancements] = useState(false);

  useEffect(() => {
    // Load and execute analytics dynamically for better performance
    import('./analytics.js').then(({ logPageView }) => {
      if (typeof logPageView === 'function') {
        logPageView();
      }
    }).catch(err => {
      console.warn('Analytics not available:', err.message);
      // Не прерываем работу приложения из-за аналитики
    });
  }, [location]);

  useEffect(() => {
    // Defer mounting non-critical helpers until after first paint/idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => setShowEnhancements(true));
    } else {
      setTimeout(() => setShowEnhancements(true), 0);
    }
  }, []);

  // Handle scroll to section from navigation state - logic moved to HomePage.jsx

  const isAdminRoute = location.pathname === '/admin' || location.pathname === '/login';

  return (
    <ErrorBoundary>
      <React.Suspense fallback={null}>
        {showEnhancements && (
          <PerformanceOptimizer>
            <PrerenderManager />
            <PerformanceMeta />
            <SplashCursor />
            <AccessibilityHelper />
          </PerformanceOptimizer>
        )}
      </React.Suspense>
        {!isAdminRoute && <Header />}
        <Routes>
        {/* Russian routes (default) */}
        <Route path="/" element={<LazyPage component={HomePage} />} />
        <Route path="/about" element={<LazyPage component={AboutPage} />} />
        <Route path="/project" element={<LazyPage component={CasePage} />} />
        <Route path="/circle" element={<LazyPage component={Circle} />} />
        <Route path="/cycle" element={<LazyPage component={Cycle} />} />
        <Route path="/semicircle" element={<LazyPage component={Semicircle} />} />

        {/* English routes */}
        <Route path="/en" element={<LazyPage component={HomePage} />} />
        <Route path="/en/about" element={<LazyPage component={AboutPage} />} />
        <Route path="/en/project" element={<LazyPage component={CasePage} />} />
        <Route path="/en/circle" element={<LazyPage component={Circle} />} />
        <Route path="/en/cycle" element={<LazyPage component={Cycle} />} />
        <Route path="/en/semicircle" element={<LazyPage component={Semicircle} />} />

        {/* Admin routes */}
        <Route path="/login" element={<LazyPage component={LoginPage} />} />
        <Route
          path="/admin"
          element={
            <AdminPage />
          }
        />

        <Route path="*" element={<LazyPage component={NotFoundPage} />} />
        </Routes>
        {!isAdminRoute && <Footer />}
      
    </ErrorBoundary>
  );
}

function App() {
  useEffect(() => {
    // Load and initialize analytics asynchronously
    import('./analytics.js').then(({ initGA }) => {
      if (typeof initGA === 'function') {
        initGA();
      }
    }).catch(err => {
      console.warn('Analytics initialization failed:', err.message);
      // Не прерываем работу приложения из-за аналитики
    });
  }, []);

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;