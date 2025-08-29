// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
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

// Компонент для защиты маршрута
const ProtectedRoute = ({ children }) => {
  const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  if (!isAdminLoggedIn) {
    // Если пользователь не авторизован, перенаправляем на страницу входа
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppContent() {
  const location = useLocation();
  // Теперь нам нужно скрывать шапку и футер и на странице входа тоже
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
        
        {/* Новый маршрут для страницы входа */}
        <Route path="/login" element={<LoginPage />} />

        {/* Защищённый маршрут для админ-панели */}
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
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;