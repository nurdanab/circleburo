// src/App.jsx
import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { initGA, logPageView } from './analytics';

// Lazy load pages with retry mechanism for better reliability
const createLazyComponent = (importFn, name) => {
  return lazy(() => 
    importFn().catch(err => {
      console.error(`Failed to load ${name}, retrying...`, err);
      return importFn();
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
    logPageView();
  }, [location]);

  const isAdminRoute = location.pathname === '/admin' || location.pathname === '/login';

  return (
    <>
      <PerformanceMeta />
      <SplashCursor />
      <AccessibilityHelper />
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<LazyPage component={HomePage} />} />
        <Route path="/about" element={<LazyPage component={AboutPage} />} />
        <Route path="/project" element={<LazyPage component={CasePage} />} />
        <Route path="/circle" element={<LazyPage component={Circle} />} />
        <Route path="/cycle" element={<LazyPage component={Cycle} />} />
        <Route path="/semicircle" element={<LazyPage component={Semicircle} />} /> 
        
        <Route path="/login" element={<LazyPage component={LoginPage} />} />

        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <LazyPage component={AdminPage} />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<LazyPage component={NotFoundPage} />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  useEffect(() => {
    initGA();
  }, []);

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;