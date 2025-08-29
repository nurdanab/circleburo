import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en', // запасной язык
    
    // Отладка (можно отключить в продакшене)
    debug: false,
    
    // Настройки детектора языка
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    // Настройки загрузки переводов
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    
    // Интерполяция
    interpolation: {
      escapeValue: false, // React уже безопасен от XSS
    },
    
    // Настройки React
    react: {
      useSuspense: false, // отключаем Suspense для простоты
    },
    
    // Доступные языки
    supportedLngs: ['en', 'ru'],
    
    // Настройки пространств имен
    ns: ['translation'],
    defaultNS: 'translation',
  });

export default i18n;