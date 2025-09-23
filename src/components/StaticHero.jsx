// src/components/StaticHero.jsx - Статический Hero для быстрого LCP
import React from 'react';
import { useTranslation } from 'react-i18next';

const StaticHero = () => {
  const { t } = useTranslation();

  return (
    <section className="static-hero">
      {/* Статический градиент фон для LCP */}
      <div className="static-hero-bg"></div>

      {/* Критический контент для LCP */}
      <div className="static-hero-content">
        <h1 id="main-content">{t('hero.title')}</h1>
        <p>{t('hero.subtitle')}</p>

        {/* CTA кнопка */}
        <button
          onClick={() => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
              contactSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          aria-label={t('hero.cta')}
        >
          {t('hero.cta')}
        </button>
      </div>

      {/* Простые статические элементы для визуального интереса */}
      <div style={{
        position: 'absolute',
        top: '5rem',
        left: '5rem',
        width: '0.5rem',
        height: '0.5rem',
        backgroundColor: 'white',
        borderRadius: '50%',
        opacity: 0.6
      }}></div>
      <div style={{
        position: 'absolute',
        top: '10rem',
        right: '8rem',
        width: '0.25rem',
        height: '0.25rem',
        backgroundColor: 'white',
        borderRadius: '50%',
        opacity: 0.4
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '8rem',
        left: '10rem',
        width: '0.375rem',
        height: '0.375rem',
        backgroundColor: 'white',
        borderRadius: '50%',
        opacity: 0.5
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '5rem',
        right: '5rem',
        width: '0.25rem',
        height: '0.25rem',
        backgroundColor: 'white',
        borderRadius: '50%',
        opacity: 0.3
      }}></div>
    </section>
  );
};

export default StaticHero;