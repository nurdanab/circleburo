import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';


function LanguageDropdown() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const currentLang = i18n.language.toUpperCase();

  const toggleDropdown = () => setOpen(!open);

  const selectLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="lang-dropdown" ref={dropdownRef}>
      <button className="lang-button" onClick={toggleDropdown}>
        {currentLang} ▾
      </button>
      {open && (
        <ul className="lang-options">
          <li onClick={() => selectLanguage('en')}>EN</li>
          <li onClick={() => selectLanguage('ru')}>RU</li>
        </ul>
      )}
    </div>
  );
}

export default LanguageDropdown;