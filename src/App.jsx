// src/App.jsx
import React, { useEffect, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { shouldDisableHeavyAnimations } from './utils/networkDetection';

// Enhanced lazy loading with retry mechanism
const componentCache = new Map();

const createLazyComponent = (importFn, name) => {
  if (!componentCache.has(name)) {
    componentCache.set(name, importFn);
  }

  const cachedImport = componentCache.get(name);

  return lazy(() =>
    cachedImport().catch(() => {
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

// Lazy load страниц
const HomePage = createLazyComponent(() => import('./pages/HomePage'), 'HomePage');
const AdminPage = createLazyComponent(() => import('./pages/AdminPage'), 'AdminPage');
const NotFoundPage = createLazyComponent(() => import('./pages/NotFoundPage'), 'NotFoundPage');

// Lazy load компонентов
const Header = createLazyComponent(() => import('./components/Header'), 'Header');
const Footer = createLazyComponent(() => import('./components/Footer'), 'Footer');

// Импортируем необходимые компоненты напрямую
import LazyPage from './components/LazyPage';
import PerformanceMeta from './components/PerformanceMeta';
import AccessibilityHelper from './components/AccessibilityHelper';
import ErrorBoundary from './components/ErrorBoundary';
import PerformanceOptimizer from './components/PerformanceOptimizer';
import ScrollToTop from './components/ScrollToTop';

const PrerenderManager = createLazyComponent(() => import('./components/PrerenderManager'), 'PrerenderManager');

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

    // Мобильная оптимизация
    const checkIsMobile = window.innerWidth < 768;
    setIsMobileState(checkIsMobile);
    if (checkIsMobile) {
      document.body.classList.add('is-mobile');

      // iOS Safari viewport height fix
      let ticking = false;
      const updateVh = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const vh = window.visualViewport ? window.visualViewport.height * 0.01 : window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            ticking = false;
          });
          ticking = true;
        }
      };

      updateVh();

      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', updateVh);
      }
      window.addEventListener('resize', updateVh);
      window.addEventListener('orientationchange', updateVh);

      return () => {
        if (window.visualViewport) {
          window.visualViewport.removeEventListener('resize', updateVh);
        }
        window.removeEventListener('resize', updateVh);
        window.removeEventListener('orientationchange', updateVh);
      };
    }

    if (import.meta.env.DEV && shouldDisable) {
      console.log('Heavy animations disabled due to slow connection');
    }
  }, []);

  useEffect(() => {
    // Load and execute analytics dynamically
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

  return (
    <ErrorBoundary>
      <Header />

      <PerformanceOptimizer>
        <ScrollToTop />
        <PrerenderManager />
        <PerformanceMeta />
        <AccessibilityHelper />

        <Routes>
          {/* Russian routes (default) */}
          <Route path="/" element={<LazyPage component={HomePage} />} />

          {/* English routes */}
          <Route path="/en" element={<LazyPage component={HomePage} />} />

          {/* Kazakh routes */}
          <Route path="/kk" element={<LazyPage component={HomePage} />} />

          {/* Admin page */}
          <Route path="/admin" element={<LazyPage component={AdminPage} />} />

          {/* 404 page */}
          <Route path="*" element={<LazyPage component={NotFoundPage} />} />
        </Routes>

        <Footer />
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

    // Управление scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Обработка событий popstate
    const handlePopState = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
