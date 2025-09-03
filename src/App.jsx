// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { initGA, logPageView } from './analytics';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CasePage from './pages/CasePage';
import Circle from './pages/Circle';
import Cycle from './pages/Cycle';
import Semicircle from './pages/Semicircle';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';

import Header from './components/Header';
import Footer from './components/Footer';
import SplashCursor from './components/SplashCursor';

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
      <SplashCursor />
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/project" element={<CasePage />} />
        <Route path="/circle" element={<Circle />} />
        <Route path="/cycle" element={<Cycle />} />
        <Route path="/semicircle" element={<Semicircle />} /> 
        
        <Route path="/login" element={<LoginPage />} />

        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminPage />
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