// src/App.jsx
import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { initGA, logPageView } from './analytics';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CasePage = lazy(() => import('./pages/CasePage'));
const Circle = lazy(() => import('./pages/Circle'));
const Cycle = lazy(() => import('./pages/Cycle'));
const Semicircle = lazy(() => import('./pages/Semicircle'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

import Header from './components/Header';
import Footer from './components/Footer';
import SplashCursor from './components/SplashCursor';
import LazyPage from './components/LazyPage';
import PerformanceMeta from './components/PerformanceMeta';

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