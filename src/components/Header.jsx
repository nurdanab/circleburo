import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LanguageDropdown from './LanguageDropdown'; 

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const location = useLocation();

  // ✅ добавил t сюда:
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('.burger')
      ) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [mobileMenuOpen]);

  const isHome = location.pathname === '/';
  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <img src="/img/Header-logo.png" alt="Circle Logo" />
        </div>

        <button
          className={`burger ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(prev => !prev)}
          aria-label="Toggle navigation"
        >
          <span></span><span></span>
        </button>

        <nav className="nav desktop-nav">
          {isHome ? (
            <>
              <a href="#home-section" className="nav-link">{t('nav.home')}</a>
              <a href="#services" className="nav-link">{t('nav.services')}</a>
              <a href="#about" className="nav-link">{t('nav.about')}</a>
              <a href="#portfolio" className="nav-link">{t('nav.portfolio')}</a>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link">{t('nav.home')}</Link>
              <Link to="/" state={{ scrollTo: 'services' }} className="nav-link">{t('nav.services')}</Link>
              <Link to="/" state={{ scrollTo: 'about' }} className="nav-link">{t('nav.about')}</Link>
              <Link to="/" state={{ scrollTo: 'portfolio' }} className="nav-link">{t('nav.portfolio')}</Link>
            </>
          )}
        </nav>

        <div className="desktop-lang">
          <LanguageDropdown />
        </div>

        <div className="contact-wrapper">
          {isHome ? (
            <a href="#form" className="contact-btn nav-link">{t('nav.contact')}</a>
          ) : (
            <Link to="/" state={{ scrollTo: 'form' }} className="contact-btn nav-link">{t('nav.contact')}</Link>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="nav mobile-nav" ref={mobileMenuRef}>
          {isHome ? (
            <>
              <a href="#home-section" onClick={() => setMobileMenuOpen(false)} className="nav-link">{t('nav.home')}</a>
              <a href="#services" onClick={() => setMobileMenuOpen(false)} className="nav-link">{t('nav.services')}</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="nav-link">{t('nav.about')}</a>
              <a href="#portfolio" onClick={() => setMobileMenuOpen(false)} className="nav-link">{t('nav.portfolio')}</a>
            </>
          ) : (
            <>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="nav-link">{t('nav.home')}</Link>
              <Link to="/" state={{ scrollTo: 'services' }} onClick={() => setMobileMenuOpen(false)} className="nav-link">{t('nav.services')}</Link>
              <Link to="/" state={{ scrollTo: 'about' }} onClick={() => setMobileMenuOpen(false)} className="nav-link">{t('nav.about')}</Link>
              <Link to="/" state={{ scrollTo: 'portfolio' }} onClick={() => setMobileMenuOpen(false)} className="nav-link">{t('nav.portfolio')}</Link>
            </>
          )}

          <div className="mobile-lang" style={{ marginTop: '20px' }}>
            <LanguageDropdown />
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;