// src/App.jsx
import React, { useEffect, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { shouldDisableHeavyAnimations } from './utils/networkDetection';
// Analytics will be loaded dynamically for better performance

// Enhanced lazy loading with retry mechanism and intelligent prefetch
const componentCache = new Map();

const createLazyComponent = (importFn, name, priority = 'low') => {
  // Cache the import promise to avoid duplicate requests
  if (!componentCache.has(name)) {
    componentCache.set(name, importFn);
  }

  const cachedImport = componentCache.get(name);

  return lazy(() =>
    cachedImport().catch(() => {
      // Clear cache and retry once
      componentCache.delete(name);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          importFn()
            .then(resolve)
            .catch(reject);
        }, 500);
      });
    })
  );
};

// Intelligent prefetch based on route priority and connection speed
const prefetchComponent = (importFn, name) => {
  if (componentCache.has(name)) return;

  // Check connection before prefetching
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const slowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' || connection.saveData);

  if (slowConnection) return;

  // Prefetch during idle time
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      componentCache.set(name, importFn);
      importFn().catch(() => componentCache.delete(name));
    }, { timeout: 2000 });
  } else {
    setTimeout(() => {
      componentCache.set(name, importFn);
      importFn().catch(() => componentCache.delete(name));
    }, 1000);
  }
};

const HomePage = createLazyComponent(() => import('./pages/HomePage'), 'HomePage');
const AboutPage = createLazyComponent(() => import('./pages/AboutPage'), 'AboutPage');
const Circle = createLazyComponent(() => import('./pages/Circle'), 'Circle');
const Cycle = createLazyComponent(() => import('./pages/Cycle'), 'Cycle');
const Semicircle = createLazyComponent(() => import('./pages/Semicircle'), 'Semicircle');
const AdminPage = createLazyComponent(() => import('./pages/AdminPage'), 'AdminPage');
const LoginPage = createLazyComponent(() => import('./pages/LoginPage'), 'LoginPage');
const NotFoundPage = createLazyComponent(() => import('./pages/NotFoundPage'), 'NotFoundPage');

const Header = createLazyComponent(() => import('./components/Header'), 'Header');
const Footer = createLazyComponent(() => import('./components/Footer'), 'Footer');
const SplashCursor = createLazyComponent(() => import('./components/SplashCursor'), 'SplashCursor');
import LazyPage from './components/LazyPage';
import PerformanceMeta from './components/PerformanceMeta';
import AccessibilityHelper from './components/AccessibilityHelper';
import ErrorBoundary from './components/ErrorBoundary';
import PerformanceOptimizer from './components/PerformanceOptimizer';
import ScrollToTop from './components/ScrollToTop';
const PrerenderManager = createLazyComponent(() => import('./components/PrerenderManager'), 'PrerenderManager');

const ProtectedRoute = ({ children }) => {
  const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  if (!isAdminLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppContent() {
  const location = useLocation();
  const [disableAnimations, setDisableAnimations] = useState(false);
  const [isMobile, setIsMobileState] = useState(false);

  useEffect(() => {
    // Определяем, нужно ли отключить тяжелые анимации
    const shouldDisable = shouldDisableHeavyAnimations();
    setDisableAnimations(shouldDisable);

    // Добавляем класс в body для глобального управления анимациями
    if (shouldDisable) {
      document.body.classList.add('reduce-animations');
    } else {
      document.body.classList.remove('reduce-animations');
    }

    // Мобильная оптимизация - добавляем класс для мобильных устройств
    const checkIsMobile = window.innerWidth < 768;
    setIsMobileState(checkIsMobile);
    if (checkIsMobile) {
      document.body.classList.add('is-mobile');
      // Мобильные оптимизации
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);

      // Обработка изменения ориентации и resize
      const updateVh = () => {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
      };
      window.addEventListener('resize', updateVh);
      window.addEventListener('orientationchange', updateVh);

      return () => {
        window.removeEventListener('resize', updateVh);
        window.removeEventListener('orientationchange', updateVh);
      };
    }

    if (import.meta.env.DEV && shouldDisable) {
      console.log('Heavy animations disabled due to slow connection');
    }

    // Intelligent prefetching of high-priority pages
    // Prefetch AboutPage and common pages after initial load - ТОЛЬКО на десктопе с хорошим соединением
    if (!shouldDisable && !checkIsMobile) {
      setTimeout(() => {
        prefetchComponent(() => import('./pages/AboutPage'), 'AboutPage');
        prefetchComponent(() => import('./components/Footer'), 'Footer');
      }, 5000); // Еще больше увеличен timeout для лучшего FID и TTI
    }
  }, []);

  useEffect(() => {
    // Load and execute analytics dynamically for better performance
    // Откладываем загрузку аналитики на медленных соединениях и мобильных
    const loadDelay = disableAnimations ? 10000 : (isMobile ? 3000 : 1000);

    const timeout = setTimeout(() => {
      import('./analytics.js').then(({ logPageView }) => {
        if (typeof logPageView === 'function') {
          logPageView();
        }
      }).catch(() => {});
    }, loadDelay);

    return () => clearTimeout(timeout);
  }, [location, disableAnimations]);

  // Handle scroll to section from navigation state - logic moved to HomePage.jsx

  const isAdminRoute = location.pathname === '/admin' || location.pathname === '/login';

  return (
    <ErrorBoundary>
      <PerformanceOptimizer>
        <ScrollToTop />
        <PrerenderManager />
        <PerformanceMeta />
        {/* SplashCursor отключен для оптимизации - тяжелый WebGL */}
        {/* {!disableAnimations && !isMobile && <SplashCursor />} */}
        <AccessibilityHelper />
        {!isAdminRoute && <Header />}
        <Routes>
        {/* Russian routes (default) */}
        <Route path="/" element={<LazyPage component={HomePage} />} />
        <Route path="/about" element={<LazyPage component={AboutPage} />} />
        <Route path="/circle" element={<LazyPage component={Circle} />} />
        <Route path="/cycle" element={<LazyPage component={Cycle} />} />
        <Route path="/semicircle" element={<LazyPage component={Semicircle} />} />

        {/* English routes */}
        <Route path="/en" element={<LazyPage component={HomePage} />} />
        <Route path="/en/about" element={<LazyPage component={AboutPage} />} />
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
      </PerformanceOptimizer>
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
    }).catch(() => {});
  }, []);

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;