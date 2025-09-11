// src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import OptimizedImage from './OptimizedImage';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const servicesDropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Закрыть dropdown при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target)) {
        setIsServicesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Функция для навигации к секции на главной странице
  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      // Если не на главной странице, перейти на главную с якорем
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      // Если уже на главной странице, просто скролл
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setIsMenuOpen(false);
    setIsServicesOpen(false);
  };

  // Функция для перехода на отдельные страницы проектов
  const navigateToProject = (projectPath) => {
    navigate(projectPath);
    // Прокрутка к началу страницы
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
    setIsServicesOpen(false);
    setIsMenuOpen(false);
  };

  const serviceItems = [
    { name: 'Semicircle', path: '/semicircle' },
    { name: 'Circle', path: '/circle' },
    { name: 'Cycle', path: '/cycle' },
  ];

  return (
    <motion.header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 50,
        padding: '1.5rem 3rem',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1920px',
        margin: '0 auto',
      }}>
        {/* Логотип */}
        <div style={{ flexShrink: 0 }}>
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img src="/img/logo-header.png" alt="Circle Buro" style={{ height: '2.5rem' }} />
          </Link>
        </div>

        {/* Навигационные ссылки для десктопа */}
        <div className="hidden lg:flex" style={{
          flex: 1,
          justifyContent: 'center',
          gap: '2rem',
          alignItems: 'center',
        }}>
          {/* Главная */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              color: '#ffffff',
              fontWeight: 400,
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              textShadow: location.pathname === '/' ? '0 0 8px rgba(255, 255, 255, 0.8)' : 'none',
            }}
            className="hover:text-shadow"
          >
            {t('nav.home')}
          </Link>

          {/* Услуги с Dropdown */}
          <div className="relative" ref={servicesDropdownRef}>
            <button
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              style={{
                color: '#ffffff',
                fontWeight: 400,
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              className="hover:text-shadow"
            >
              {t('nav.services')}
              <FaChevronDown 
                className={`w-3 h-3 transition-transform duration-200 ${
                  isServicesOpen ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>

            {/* Services Dropdown Menu */}
            {isServicesOpen && (
              <div 
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/90 backdrop-blur-md rounded-lg shadow-lg border border-white/10 overflow-hidden"
                style={{
                  minWidth: '160px',
                  zIndex: 1000,
                }}
              >
                <button
                  onClick={() => scrollToSection('services')}
                  className="w-full text-left px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors duration-150"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  {t('nav.services')}
                </button>
                <div className="border-t border-white/10"></div>
                {serviceItems.map((service) => (
                  <button
                    key={service.path}
                    onClick={() => navigateToProject(service.path)}
                    className="w-full text-left px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors duration-150"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                  >
                    {service.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* О нас */}
          <Link
            to="/about"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              color: '#ffffff',
              fontWeight: 400,
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              textShadow: location.pathname === '/about' ? '0 0 8px rgba(255, 255, 255, 0.8)' : 'none',
            }}
            className="hover:text-shadow"
          >
            {t('nav.about')}
          </Link>

          {/* Портфолио */}
          <button
            onClick={() => scrollToSection('projects')}
            style={{
              color: '#ffffff',
              fontWeight: 400,
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            className="hover:text-shadow"
          >
            {t('nav.portfolio')}
          </button>
        </div>
        
        <LanguageSwitcher />
        
        {/* Кнопка "Contact us" для десктопа */}
        <div className="hidden lg:flex" style={{
          alignItems: 'center',
        }}>
          <button
            onClick={() => scrollToSection('contact')}
            style={{
              margin: '0rem 1.4rem',
              padding: '0.5rem 1.4rem',
              backgroundColor: '#FFFFFF',
              color: '#282729',
              fontWeight: 400,
              fontSize: '1rem',
              borderRadius: '9999px',
              transition: 'transform 0.25s ease',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {t('nav.contact')}
          </button>
        </div>

        {/* Кнопка-гамбургер для мобильных устройств */}
        <div className="lg:hidden" style={{
          alignItems: 'center',
          gap: '1rem',
        }}>
          <button onClick={toggleMenu} style={{
            color: '#FFFFFF',
            fontSize: '1.5rem',
          }}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Выпадающее меню для мобильных устройств */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '1rem',
              gap: '1rem',
            }}
          >
            {/* Главная */}
            <Link
              to="/"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                toggleMenu();
              }}
              style={{
                color: '#FFFFFF',
                fontSize: '1rem',
                fontWeight: 300,
                transition: 'all 0.3s ease',
              }}
            >
              {t('nav.home')}
            </Link>

            <button
              onClick={() => {
                scrollToSection('services');
                toggleMenu();
              }}
              style={{
                color: '#FFFFFF',
                fontSize: '1rem',
                fontWeight: 300,
                transition: 'all 0.3s ease',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {t('nav.services')}
            </button>

            {/* Проекты услуг */}
            {serviceItems.map((service) => (
              <button
                key={service.path}
                onClick={() => {
                  navigateToProject(service.path);
                  toggleMenu();
                }}
                style={{
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  fontWeight: 300,
                  transition: 'all 0.3s ease',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  paddingLeft: '1rem',
                  opacity: 0.8,
                }}
              >
                {service.name}
              </button>
            ))}

            {/* О нас */}
            <Link
              to="/about"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                toggleMenu();
              }}
              style={{
                color: '#FFFFFF',
                fontSize: '1rem',
                fontWeight: 300,
                transition: 'all 0.3s ease',
              }}
            >
              {t('nav.about')}
            </Link>

            {/* Портфолио */}
            <button
              onClick={() => scrollToSection('projects')}
              style={{
                color: '#FFFFFF',
                fontSize: '1rem',
                fontWeight: 300,
                transition: 'all 0.3s ease',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {t('nav.portfolio')}
            </button>

            {/* Контакты */}
            <button
              onClick={() => scrollToSection('contact')}
              style={{
                padding: '0.5rem 1.2rem',
                backgroundColor: '#FFFFFF',
                color: '#282729',
                fontWeight: 400,
                fontSize: '1rem',
                borderRadius: '9999px',
                marginTop: '1rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {t('nav.contact')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;