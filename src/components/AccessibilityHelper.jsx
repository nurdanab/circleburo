import React, { useEffect, useState } from 'react';

const AccessibilityHelper = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check for saved preferences
    const savedContrast = localStorage.getItem('highContrast') === 'true';
    const savedFontSize = parseFloat(localStorage.getItem('fontSize') || '1');
    
    setHighContrast(savedContrast);
    setFontSize(savedFontSize);
    
    // Apply saved settings
    if (savedContrast) {
      document.body.classList.add('high-contrast');
    }
    document.documentElement.style.fontSize = `${savedFontSize}rem`;
  }, []);

  useEffect(() => {
    // Listen for keyboard navigation
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        setIsVisible(!isVisible);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  const toggleHighContrast = () => {
    const newContrast = !highContrast;
    setHighContrast(newContrast);
    localStorage.setItem('highContrast', newContrast.toString());
    
    if (newContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };

  const changeFontSize = (delta) => {
    const newSize = Math.max(0.8, Math.min(1.4, fontSize + delta));
    setFontSize(newSize);
    localStorage.setItem('fontSize', newSize.toString());
    document.documentElement.style.fontSize = `${newSize}rem`;
  };

  const resetSettings = () => {
    setHighContrast(false);
    setFontSize(1);
    localStorage.removeItem('highContrast');
    localStorage.removeItem('fontSize');
    document.body.classList.remove('high-contrast');
    document.documentElement.style.fontSize = '1rem';
  };

  if (!isVisible) {
    return (
      <button
        className="sr-only focus:not-sr-only fixed top-4 left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => setIsVisible(true)}
        aria-label="Show accessibility settings (Alt + A)"
        aria-describedby="accessibility-hint"
      >
        Accessibility Settings
        <span id="accessibility-hint" className="sr-only">
          Click to open accessibility settings panel to improve site perception
        </span>
      </button>
    );
  }

  return (
    <>
      <style jsx>{`
        .high-contrast {
          filter: contrast(150%) brightness(1.2);
        }
        .high-contrast img,
        .high-contrast video {
          filter: contrast(120%);
        }
        .accessibility-panel {
          position: fixed;
          top: 20px;
          right: 20px;
          background: white;
          border: 2px solid #000;
          border-radius: 8px;
          padding: 16px;
          z-index: 10000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          min-width: 250px;
        }
        .accessibility-button {
          background: #0066cc;
          color: white;
          border: none;
          padding: 8px 12px;
          margin: 4px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        .accessibility-button:hover,
        .accessibility-button:focus {
          background: #0052a3;
          outline: 2px solid #004080;
        }
        .font-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 8px 0;
        }
      `}</style>

      <div 
        className="accessibility-panel" 
        role="dialog" 
        aria-labelledby="accessibility-title"
        aria-describedby="accessibility-description"
        aria-modal="true"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 id="accessibility-title" className="font-semibold text-lg">
            Accessibility Settings
          </h3>
          <p id="accessibility-description" className="sr-only">
            Accessibility settings panel to improve site perception
          </p>
          <button
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            onClick={() => setIsVisible(false)}
            aria-label="Close panel"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <button
              className="accessibility-button w-full"
              onClick={toggleHighContrast}
              aria-pressed={highContrast}
              aria-describedby="contrast-description"
            >
              {highContrast ? 'Disable' : 'Enable'} high contrast
            </button>
            <p id="contrast-description" className="sr-only">
              {highContrast ? 'Высокий контраст включен' : 'Включить высокий контраст для лучшей читаемости'}
            </p>
          </div>

          <div className="font-controls" role="group" aria-labelledby="font-size-label">
            <span id="font-size-label" className="text-sm">Размер текста:</span>
            <button
              className="accessibility-button"
              onClick={() => changeFontSize(-0.1)}
              aria-label="Уменьшить размер текста"
              disabled={fontSize <= 0.8}
            >
              А-
            </button>
            <span className="text-sm px-2" aria-live="polite" aria-atomic="true">
              {Math.round(fontSize * 100)}%
            </span>
            <button
              className="accessibility-button"
              onClick={() => changeFontSize(0.1)}
              aria-label="Увеличить размер текста"
              disabled={fontSize >= 1.4}
            >
              А+
            </button>
          </div>

          <div>
            <button
              className="accessibility-button w-full"
              onClick={resetSettings}
            >
              Сбросить настройки
            </button>
          </div>

          <div className="text-xs text-gray-600 mt-4">
            <p>Горячие клавиши:</p>
            <p>Alt + A - показать/скрыть панель</p>
            <p>Tab - навигация по элементам</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccessibilityHelper;