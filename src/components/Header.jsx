// src/components/Header.jsx
import React, { useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OptimizedImage from './OptimizedImage';
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
  height: '72px',
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
  height: '2.25rem',
  width: 'auto',
  maxHeight: '2.25rem',
  maxWidth: '5.5rem',
  objectFit: 'contain',
  display: 'block'
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
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef(null);

  // Функция для навигации к секции на главной странице
  const scrollToSection = useCallback((sectionId) => {
    if (import.meta.env.DEV) {
      console.log('Header scrollToSection called:', { sectionId, currentPath: location.pathname });
    }

    // Если мы не на главной, переходим туда и скроллим к секции
    if (location.pathname !== '/') {
      if (import.meta.env.DEV) {
        console.log('Navigating to home with scroll target:', sectionId);
      }
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      // Если уже на главной, скроллим к секции
      if (import.meta.env.DEV) {
        console.log('Already on home, scrolling to:', sectionId);
      }

      navigateToSection(navigate, location.pathname, '/', sectionId, {
        maxAttempts: 15,
        delay: 150,
        offset: 80 // Account for fixed header
      });
    }
  }, [location.pathname, navigate]);

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
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <Link
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            aria-label="Circle Buro - На главную страницу"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <OptimizedImage
              src={getMediaUrl('img/logo-header.png')}
              alt="Circle Buro - Креативное агентство полного цикла в Алматы"
              width={70}
              height={26}
              priority={true}
              className="header-logo"
              style={LOGO_STYLE}
            />
          </Link>
        </div>

        {/* Переключатель языка и кнопка "Contact us" */}
        <div className="flex items-center gap-3 md:gap-4">
          <LanguageSwitcher />
          <button
            onClick={() => scrollToSection('contact')}
            style={CONTACT_BUTTON_STYLE}
          >
            {t('nav.contact')}
          </button>
        </div>
      </nav>
    </header>
  );
};

// Экспортируем без memo - Header использует внутренний state и должен ре-рендериться при изменениях
// React.memo блокирует все ре-рендеры, включая изменения state, что ломает isMenuOpen
export default Header;