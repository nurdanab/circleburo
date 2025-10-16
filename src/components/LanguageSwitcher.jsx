import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown } from 'react-icons/fa';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const currentLanguage = i18n.language || 'en';

  // Закрыть dropdown при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const languages = [
    { code: 'en', name: 'EN', fullName: 'English' },
    { code: 'ru', name: 'RU', fullName: 'Русский' },
    { code: 'kk', name: 'KK', fullName: 'Қазақша' },
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1"
        style={{
          color: 'rgba(255, 255, 255, 0.8)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: 300,
        }}
        type="button"
      >
        <span>{currentLang?.name || 'EN'}</span>
        <FaChevronDown
          style={{
            width: '0.75rem',
            height: '0.75rem',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '0.25rem',
            backgroundColor: '#000000',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '0.5rem',
            minWidth: '120px',
            zIndex: 2000,
          }}
        >
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                color: currentLanguage === language.code ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                backgroundColor: currentLanguage === language.code ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 300,
              }}
              type="button"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{language.name}</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{language.fullName}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;