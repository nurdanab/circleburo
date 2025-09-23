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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
        className="flex items-center gap-1 px-2 py-1 text-white/70 hover:text-white transition-colors duration-200 text-sm font-light"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <span>{currentLang?.name || 'EN'}</span>
        <FaChevronDown 
          className={`w-3 h-3 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute top-full right-0 mt-1 bg-black/90 backdrop-blur-md rounded-lg shadow-lg border border-white/10 overflow-hidden"
          style={{
            minWidth: '120px',
            zIndex: 1000,
          }}
        >
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors duration-150 ${
                currentLanguage === language.code
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
              style={{
                background: currentLanguage === language.code ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-light">{language.name}</span>
                <span className="text-xs opacity-60">{language.fullName}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;