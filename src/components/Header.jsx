// src/components/Header.jsx
import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OptimizedImage from './OptimizedImage';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import LanguageSwitcher from './LanguageSwitcher';
import { navigateToSection } from '../utils/navigation';
import { getMediaUrl } from '../utils/media';

// ОПТИМИЗАЦИЯ: Выносим статические стили в константы вне компонента
const HEADER_STYLE = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  width: '100%',
  zIndex: 9999,
  height: '64px',
  backgroundColor: 'rgba(246, 237, 206, 0.8)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  margin: 0,
  padding: 0,
  pointerEvents: 'auto',
};

const NAV_STYLE = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  maxWidth: '1920px',
  margin: '0 auto',
  height: '100%',
  padding: '0 1.5rem',
};

const LOGO_STYLE = {
  height: '1.8rem',
  width: 'auto',
  maxHeight: '1.8rem',
  maxWidth: '4rem',
  objectFit: 'contain'
};

const BUTTON_BASE_STYLE = {
  fontWeight: 400,
  fontSize: '1rem',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
};

const CONTACT_BUTTON_STYLE = {
  padding: '0.5rem 1.5rem',
  backgroundColor: '#E8574B',
  color: '#FFFFFF',
  fontWeight: 600,
  fontSize: '1rem',
  borderRadius: '50px',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const servicesDropdownRef = useRef(null);
  const headerRef = useRef(null);
  const isNavigatingToSection = useRef(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

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

  useEffect(() => {
    let scrollPosition = 0;

    if (isMenuOpen) {
      scrollPosition = window.scrollY;
      document.body.dataset.scrollPosition = String(scrollPosition);
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll';
    } else {
      const savedPosition = parseInt(document.body.dataset.scrollPosition || '0', 10);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      delete document.body.dataset.scrollPosition;

      // Восстанавливаем скролл только если НЕ навигируемся к секции
      if (!isNavigatingToSection.current) {
        requestAnimationFrame(() => {
          window.scrollTo(0, savedPosition);
        });
      } else {
        // Сбрасываем флаг после небольшой задержки
        setTimeout(() => {
          isNavigatingToSection.current = false;
        }, 300);
      }
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      if (document.body.dataset.scrollPosition) {
        delete document.body.dataset.scrollPosition;
      }
    };
  }, [isMenuOpen]);

  // ОПТИМИЗАЦИЯ: Мемоизируем функцию для навигации к секции на главной странице
  const scrollToSection = useCallback((sectionId) => {
    if (import.meta.env.DEV) {
      console.log('Header scrollToSection called:', { sectionId, currentPath: location.pathname });
    }

    // Устанавливаем флаг навигации к секции
    isNavigatingToSection.current = true;

    // Всегда переходим на главную страницу, затем скроллим к секции
    if (location.pathname !== '/') {
      // Если мы не на главной, переходим туда и скроллим к секции
      if (import.meta.env.DEV) {
        console.log('Navigating to home with scroll target:', sectionId);
      }
      navigate('/', { state: { scrollTo: sectionId } });
      setIsMenuOpen(false);
      setIsServicesOpen(false);
    } else {
      // Если уже на главной, закрываем меню и скроллим
      if (import.meta.env.DEV) {
        console.log('Already on home, scrolling to:', sectionId);
      }

      // Закрываем меню
      setIsMenuOpen(false);
      setIsServicesOpen(false);

      // Скроллим к секции после того как меню закроется
      setTimeout(() => {
        navigateToSection(navigate, location.pathname, '/', sectionId, {
          maxAttempts: 15,
          delay: 150,
          offset: 80 // Account for fixed header
        });
      }, 100);
    }
  }, [location.pathname, navigate]);

  // ОПТИМИЗАЦИЯ: Мемоизируем функцию для перехода на отдельные страницы проектов
  const navigateToProject = useCallback((projectPath) => {
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
  }, [navigate]);

  // ОПТИМИЗАЦИЯ: Мемоизируем массив serviceItems
  const serviceItems = useMemo(() => [
    { name: 'Semicircle', path: '/semicircle' },
    { name: 'Circle', path: '/circle' },
    { name: 'Cycle', path: '/cycle' },
  ], []); // Пустой массив зависимостей - массив никогда не меняется

  return (
    <header
      ref={headerRef}
      style={HEADER_STYLE}
    >
      <nav
        role="navigation"
        aria-label="Основная навигация"
        id="navigation"
        style={NAV_STYLE}
      >
        {/* Логотип */}
        <div style={{ flexShrink: 0 }}>
          <Link
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            aria-label="Circle Buro - На главную страницу"
          >
            <OptimizedImage
              src={getMediaUrl('img/logo-header.png')}
              alt="Circle Buro - Креативное агентство полного цикла в Алматы"
              width={60}
              height={27}
              priority={true}
              className="header-logo"
              style={LOGO_STYLE}
            />
          </Link>
        </div>

       
        {/* Переключатель языка и кнопка "Contact us" для десктопа */}
        <div className="hidden lg:flex items-center gap-4">
          <LanguageSwitcher />
          <button
            onClick={() => scrollToSection('contact')}
            style={CONTACT_BUTTON_STYLE}
          >
            {t('nav.contact')}
          </button>
        </div>

        {/* Переключатель языка и кнопка-гамбургер для мобильных устройств */}
        <div className="flex lg:hidden items-center gap-3">
          <LanguageSwitcher />
          <button
            onClick={toggleMenu}
            type="button"
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={isMenuOpen}
            style={{
              color: '#121112',
              fontSize: '1.5rem',
              padding: '0.5rem',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Мобильное меню */}
      {isMenuOpen && (
        <>
          <div
            onClick={toggleMenu}
            style={{
              position: 'fixed',
              top: '64px',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              zIndex: 9997,
              touchAction: 'none',
            }}
          />
          <div
            id="mobile-menu"
            className="lg:hidden"
            style={{
              position: 'fixed',
              top: '64px',
              left: 0,
              right: 0,
              zIndex: 9998,
              backgroundColor: 'rgba(246, 237, 206, 0.98)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              padding: '1rem',
              maxHeight: 'calc(100dvh - 64px)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Link
              to="/"
              onClick={() => {
                setIsMenuOpen(false);
                window.scrollTo(0, 0);
              }}
              style={{
                color: '#121112',
                fontSize: '1.1rem',
                fontWeight: 300,
                padding: '1rem',
                display: 'block',
                textAlign: 'center',
                borderBottom: '1px solid rgba(18, 17, 18, 0.1)',
                width: '100%',
              }}
            >
              {t('nav.home')}
            </Link>

            <button
              onClick={() => scrollToSection('services')}
              style={{
                ...BUTTON_BASE_STYLE,
                color: '#121112',
                fontSize: '1.1rem',
                fontWeight: 300,
                borderBottom: '1px solid rgba(18, 17, 18, 0.1)',
                width: '100%',
                padding: '1rem',
                textAlign: 'center',
              }}
            >
              {t('nav.services')}
            </button>

            {serviceItems.map((service) => (
              <button
                key={service.path}
                onClick={() => navigateToProject(service.path)}
                style={{
                  color: 'rgba(18, 17, 18, 0.7)',
                  fontSize: '0.95rem',
                  fontWeight: 300,
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid rgba(18, 17, 18, 0.1)',
                  cursor: 'pointer',
                  width: '100%',
                  padding: '0.875rem 1rem',
                  textAlign: 'center',
                }}
              >
                {service.name}
              </button>
            ))}

            <Link
              to="/about"
              onClick={() => {
                setIsMenuOpen(false);
                window.scrollTo(0, 0);
              }}
              style={{
                color: '#121112',
                fontSize: '1.1rem',
                fontWeight: 300,
                padding: '1rem',
                display: 'block',
                textAlign: 'center',
                borderBottom: '1px solid rgba(18, 17, 18, 0.1)',
                width: '100%',
              }}
            >
              {t('nav.about')}
            </Link>

            <button
              onClick={() => scrollToSection('projects')}
              style={{
                ...BUTTON_BASE_STYLE,
                color: '#121112',
                fontSize: '1.1rem',
                fontWeight: 300,
                borderBottom: '1px solid rgba(18, 17, 18, 0.1)',
                width: '100%',
                padding: '1rem',
                textAlign: 'center',
              }}
            >
              {t('nav.portfolio')}
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              style={{
                padding: '0.875rem 2rem',
                backgroundColor: '#E8574B',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: '50px',
                marginTop: '1.5rem',
                border: 'none',
                cursor: 'pointer',
                display: 'block',
              }}
            >
              {t('nav.contact')}
            </button>
          </div>
        </>
      )}
    </header>
  );
};

// Экспортируем без memo - Header использует внутренний state и должен ре-рендериться при изменениях
// React.memo блокирует все ре-рендеры, включая изменения state, что ломает isMenuOpen
export default Header;