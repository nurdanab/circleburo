import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ru',

    debug: false,

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
      // Добавляем обработку ошибок загрузки
      requestOptions: {
        cache: 'default'
      }
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },

    supportedLngs: ['en', 'ru', 'kk'],

    ns: ['translation'],
    defaultNS: 'translation',

    // Добавляем ресурсы как fallback
    resources: {
      ru: {
        translation: {
          "home": "Главная",
          "about": "О нас",
          "services": "Услуги",
          "contact": "Контакты"
        }
      },
      en: {
        translation: {
          "home": "Home",
          "about": "About",
          "services": "Services",
          "contact": "Contact"
        }
      }
    }
  })
  .catch(error => {
    console.error('i18n initialization failed:', error);
  });

export default i18n;