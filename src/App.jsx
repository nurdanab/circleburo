// src/App.jsx
import React, { useEffect, Suspense, lazy } from 'react';
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
const AdminPage = createLazyComponent(() => import('./pages/AdminPage'), 'AdminPage');
const LoginPage = createLazyComponent(() => import('./pages/LoginPage'), 'LoginPage');
const NotFoundPage = createLazyComponent(() => import('./pages/NotFoundPage'), 'NotFoundPage');

import Header from './components/Header';
import Footer from './components/Footer';
import SplashCursor from './components/SplashCursor';
import LazyPage from './components/LazyPage';
import PerformanceMeta from './components/PerformanceMeta';
import AccessibilityHelper from './components/AccessibilityHelper';
import ErrorBoundary from './components/ErrorBoundary';
import PerformanceOptimizer from './components/PerformanceOptimizer';
import PrerenderManager from './components/PrerenderManager';

const ProtectedRoute = ({ children }) => {
  const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  if (!isAdminLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    // Load and execute analytics dynamically for better performance
    import('./analytics.js').then(({ logPageView }) => {
      logPageView();
    }).catch(err => console.error('Failed to load analytics:', err));
  }, [location]);

  // Handle scroll to section from navigation state - logic moved to HomePage.jsx

  const isAdminRoute = location.pathname === '/admin' || location.pathname === '/login';

  return (
    <ErrorBoundary>
      <PerformanceOptimizer>
        <PrerenderManager />
        <PerformanceMeta />
        <SplashCursor />
        <AccessibilityHelper />
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
              <LazyPage component={AdminPage} />
            }
          />

          <Route path="*" element={<LazyPage component={NotFoundPage} />} />
        </Routes>
        {!isAdminRoute && <Footer />}
      </PerformanceOptimizer>
    </ErrorBoundary>
  );
}

function App() {
  useEffect(() => {
    // Load and initialize analytics asynchronously
    import('./analytics.js').then(({ initGA }) => {
      initGA();
    }).catch(err => console.error('Failed to initialize analytics:', err));
  }, []);

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;