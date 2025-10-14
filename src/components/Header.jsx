// src/components/Header.jsx
import React, { useState, useEffect, useRef, memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import OptimizedImage from './OptimizedImage';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import LanguageSwitcher from './LanguageSwitcher';
import { navigateToSection } from '../utils/navigation';

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const servicesDropdownRef = useRef(null);

  const toggleMenu = () => {
    console.log('Toggle menu clicked, current state:', isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  // ОПТИМИЗАЦИЯ: Убрали isMobile и screenWidth state - используем CSS media queries
  // Это убирает постоянные re-renders при resize

  // Закрыть dropdown при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target)) {
        setIsServicesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Предотвращаем скролл при открытом мобильном меню
  useEffect(() => {
    if (isMenuOpen) {
      // Сохраняем текущую позицию скролла
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.body.setAttribute('data-scroll-y', scrollY.toString());
    } else {
      // Восстанавливаем скролл
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      const scrollY = document.body.getAttribute('data-scroll-y');
      document.body.removeAttribute('data-scroll-y');
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0'));
      }
    }

    return () => {
      // Cleanup при размонтировании
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.removeAttribute('data-scroll-y');
    };
  }, [isMenuOpen]);

  // Функция для навигации к секции на главной странице
  const scrollToSection = (sectionId) => {
    if (import.meta.env.DEV) {
      console.log('Header scrollToSection called:', { sectionId, currentPath: location.pathname });
    }

    // Всегда переходим на главную страницу, затем скроллим к секции
    if (location.pathname !== '/') {
      // Если мы не на главной, переходим туда и скроллим к секции
      if (import.meta.env.DEV) {
        console.log('Navigating to home with scroll target:', sectionId);
      }
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      // Если уже на главной, просто скроллим
      if (import.meta.env.DEV) {
        console.log('Already on home, scrolling to:', sectionId);
      }
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
    setIsServicesOpen(false);
    setIsMenuOpen(false);
    navigate(projectPath);
    // Принудительная прокрутка вверх сразу и с задержкой для надежности
    window.scrollTo(0, 0);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  const serviceItems = [
    { name: 'Semicircle', path: '/semicircle' },
    { name: 'Circle', path: '/circle' },
    { name: 'Cycle', path: '/cycle' },
  ];

  return (
    <header
      className="header-animate"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1050,
        padding: '1.5rem 3rem',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(8px)',
        willChange: 'auto',
      }}
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
          position: 'relative',
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
        <div className="hidden lg:flex flex-1 justify-center gap-4 xl:gap-8 items-center min-w-0">
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
        <div className="hidden lg:flex items-center gap-4">
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
        <div className="flex lg:hidden items-center gap-4" style={{ position: 'relative', zIndex: 1100 }}>
          <LanguageSwitcher />
          <button
            onClick={toggleMenu}
            type="button"
            aria-label={isMenuOpen ? "Закрыть меню навигации" : "Открыть меню навигации"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            className="mobile-burger-button"
            style={{
              color: '#FFFFFF',
              fontSize: '1.5rem',
              padding: '0.5rem',
              minWidth: '48px',
              minHeight: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              cursor: 'pointer',
              position: 'relative',
              zIndex: 1100,
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              pointerEvents: 'auto',
            }}
          >
            {isMenuOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Оверлей для закрытия меню при клике вне области */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <div
              className="mobile-menu-overlay"
              onClick={toggleMenu}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                zIndex: 1040,
              }}
            />
            <div
              id="mobile-menu"
              className="lg:hidden mobile-menu-animate"
              role="menu"
              aria-label="Мобильное меню навигации"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '1rem',
                gap: '0.5rem',
                position: 'fixed',
                top: '5rem',
                left: 0,
                right: 0,
                zIndex: 1045,
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                padding: '1rem',
                maxHeight: 'calc(100vh - 6rem)',
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
              }}
            >
            {/* Главная */}
            <Link
              to="/"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsMenuOpen(false);
              }}
              style={{
                color: '#FFFFFF',
                fontSize: '1rem',
                fontWeight: 300,
                width: '100%',
                textAlign: 'center',
                padding: '0.75rem 1rem',
                display: 'block',
              }}
            >
              {t('nav.home')}
            </Link>

            <button
              onClick={() => {
                scrollToSection('services');
              }}
              style={{
                color: '#FFFFFF',
                fontSize: '1rem',
                fontWeight: 300,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'center',
                padding: '0.75rem 1rem',
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
                }}
                style={{
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  fontWeight: 300,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  opacity: 0.8,
                  width: '100%',
                  textAlign: 'center',
                  padding: '0.75rem 1rem',
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
                setIsMenuOpen(false);
              }}
              style={{
                color: '#FFFFFF',
                fontSize: '1rem',
                fontWeight: 300,
                width: '100%',
                textAlign: 'center',
                padding: '0.75rem 1rem',
                display: 'block',
              }}
            >
              {t('nav.about')}
            </Link>

            {/* Портфолио */}
            <button
              onClick={() => {
                scrollToSection('projects');
              }}
              style={{
                color: '#FFFFFF',
                fontSize: '1rem',
                fontWeight: 300,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'center',
                padding: '0.75rem 1rem',
              }}
            >
              {t('nav.portfolio')}
            </button>

            {/* Контакты */}
            <button
              onClick={() => {
                scrollToSection('contact');
              }}
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
              }}
            >
              {t('nav.contact')}
            </button>
          </div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default memo(Header);