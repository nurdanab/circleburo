// src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import OptimizedImage from './OptimizedImage';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import LanguageSwitcher from './LanguageSwitcher';
import { navigateToSection } from '../utils/navigation';

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const location = useLocation();
  const navigate = useNavigate();
  const servicesDropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Отслеживание размера экрана
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setIsMobile(width < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Вычисляем gap на основе размера экрана
  const getNavigationGap = () => {
    if (screenWidth < 1200) return '1rem';
    if (screenWidth < 1400) return '1.5rem';
    return '2rem';
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
    console.log('Header scrollToSection called:', { sectionId, currentPath: location.pathname });

    // Всегда переходим на главную страницу, затем скроллим к секции
    if (location.pathname !== '/') {
      // Если мы не на главной, переходим туда и скроллим к секции
      console.log('Navigating to home with scroll target:', sectionId);
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      // Если уже на главной, просто скроллим
      console.log('Already on home, scrolling to:', sectionId);
      navigateToSection(navigate, location.pathname, '/', sectionId, {
        maxAttempts: 15,
        delay: 150,
        offset: 80 // Account for fixed header
      });
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
      <nav
        role="navigation"
        aria-label="Основная навигация"
        id="navigation"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1920px',
          margin: '0 auto',
        }}
      >
        {/* Логотип */}
        <div style={{ flexShrink: 0 }}>
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Circle Buro - На главную страницу"
          >
            <OptimizedImage
              src="/img/logo-header.png"
              alt="Circle Buro - Креативное агентство полного цикла в Алматы"
              width={60}
              height={27}
              priority={true}
              formats={['original']}
              className="header-logo"
              style={{
                height: '1.8rem',
                width: 'auto',
                maxHeight: '1.8rem',
                maxWidth: '4rem',
                objectFit: 'contain'
              }}
            />
          </Link>
        </div>

        {/* Навигационные ссылки для десктопа */}
        <div style={{
          flex: 1,
          justifyContent: 'center',
          gap: getNavigationGap(),
          alignItems: 'center',
          display: !isMobile ? 'flex' : 'none',
          minWidth: 0
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

        {/* Переключатель языка и кнопка "Contact us" для десктопа */}
        <div style={{
          alignItems: 'center',
          gap: '1rem',
          display: !isMobile ? 'flex' : 'none'
        }}>
          <LanguageSwitcher />
          <button
            onClick={() => scrollToSection('contact')}
            className="btn-dark-theme"
            style={{
              margin: '0rem 1.4rem',
              padding: '0.5rem 1.4rem',
              backgroundColor: '#FFFFFF',
              color: '#282729',
              fontWeight: 600,
              fontSize: '1rem',
              borderRadius: '9999px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
            }}
          >
            {t('nav.contact')}
          </button>
        </div>

        {/* Переключатель языка и кнопка-гамбургер для мобильных устройств */}
        <div style={{
          display: isMobile ? 'flex' : 'none',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <LanguageSwitcher />
          <button
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Закрыть меню навигации" : "Открыть меню навигации"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            style={{
              color: '#FFFFFF',
              fontSize: '1.5rem',
            }}
          >
            {isMenuOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Выпадающее меню для мобильных устройств */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden"
            role="menu"
            aria-label="Мобильное меню навигации"
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
              className="btn-dark-theme"
              style={{
                padding: '0.5rem 1.2rem',
                backgroundColor: '#FFFFFF',
                color: '#282729',
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: '9999px',
                marginTop: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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