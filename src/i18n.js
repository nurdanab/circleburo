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

    // Добавляем полные ресурсы как fallback для мгновенного отображения
    resources: {
      ru: {
        translation: {
          "home": "Главная",
          "about": "О нас",
          "services": "Услуги",
          "contact": "Контакты",
          "projects": {
            "subtitle": "Наши проекты",
            "title": "Креативный шоукейс",
            "before": "Как изменился дизайн",
            "process": "Процесс работы",
            "after": "Коллаж для кофейни"
          },
          "nav": {
            "home": "Главная",
            "services": "Услуги",
            "about": "О нас",
            "portfolio": "Портфолио",
            "contact": "Связаться с нами"
          },
          "whyUs": {
            "title": "ПРИНЦИПЫ РАБОТЫ",
            "reasons": {
              "qualityFirst": {
                "title": "Делаем под ключ",
                "description": "Берём всё на себя: от планирования и креатива до результата. Доводим проект до результата в короткие сроки и согласно бюджету."
              },
              "creativeSolutions": {
                "title": "Соблюдение дедлайнов",
                "description": "Вы всегда получаете проект вовремя: прозрачный план работы и обговоренные сроки реализации проекта."
              },
              "innovation": {
                "title": "Всё для клиента",
                "description": "Учитываем каждую деталь — аудит, смыслы, визуал, метрики — чтобы финальный эффект был заметен и команде, и вашим клиентам."
              }
            }
          },
          "footer": {
            "description": "Circle Creative Buro — креативное агентство Алматы, предоставляющее полный цикл маркетинговых и рекламных услуг для развития бизнеса.",
            "navigation": "Навигация",
            "services": "Услуги",
            "contact": "Контакты",
            "copyright": "© 2025 Circle. Все права защищены.",
            "privacyPolicy": "Политика конфиденциальности",
            "termsOfService": "Условия использования"
          }
        }
      },
      en: {
        translation: {
          "home": "Home",
          "about": "About",
          "services": "Services",
          "contact": "Contact",
          "projects": {
            "subtitle": "Our Projects",
            "title": "Creative Showcase",
            "before": "How the Design Changed",
            "process": "Work Process",
            "after": "Coffee Shop Collage"
          },
          "nav": {
            "home": "Home",
            "services": "Services",
            "about": "About",
            "portfolio": "Portfolio",
            "contact": "Contact Us"
          },
          "whyUs": {
            "title": "OUR PRINCIPLES",
            "reasons": {
              "qualityFirst": {
                "title": "Turnkey Solutions",
                "description": "We take care of everything: from planning and creativity to results. We complete projects on time and within budget."
              },
              "creativeSolutions": {
                "title": "Meeting Deadlines",
                "description": "You always get your project on time: transparent work plan and agreed implementation deadlines."
              },
              "innovation": {
                "title": "Everything for the Client",
                "description": "We consider every detail — audit, meanings, visuals, metrics — so that the final effect is noticeable to both the team and your clients."
              }
            }
          },
          "footer": {
            "description": "Circle Creative Buro — creative agency in Almaty providing a full cycle of marketing and advertising services for business development.",
            "navigation": "Navigation",
            "services": "Services",
            "contact": "Contacts",
            "copyright": "© 2025 Circle. All rights reserved.",
            "privacyPolicy": "Privacy Policy",
            "termsOfService": "Terms of Service"
          }
        }
      },
      kk: {
        translation: {
          "main": {
            "subtitle": "Алматыдағы креативті және маркетингтік агенттік — бизнестің дамуы үшін толық digital-қызметтер циклі"
          },
          "nav": {
            "home": "Басты бет",
            "services": "Қызметтер",
            "about": "Біз туралы",
            "portfolio": "Портфолио",
            "contact": "Байланысу"
          },
          "footer": {
            "description": "Circle Creative Buro — Алматыдағы креативті агенттік, бизнес дамуы үшін толық маркетингтік және жарнамалық қызметтер циклін ұсынады.",
            "navigation": "Навигация",
            "services": "Қызметтер",
            "contact": "Байланыстар",
            "copyright": "© 2025 Circle. Барлық құқықтар қорғалған.",
            "privacyPolicy": "Құпиялылық саясаты",
            "termsOfService": "Пайдалану шарттары"
          },
          "whyUs": {
            "title": "ЖҰМЫС ПРИНЦИПТЕРІ",
            "reasons": {
              "qualityFirst": {
                "title": "Толық дайын шешім",
                "description": "Барлығын өз мойнымызға аламыз: жоспарлаудан бастап креативке, нәтижеге дейін. Жобаны қысқа мерзімде және бюджетке сәйкес аяқтаймыз."
              },
              "creativeSolutions": {
                "title": "Дедлайнды сақтау",
                "description": "Сіз әрқашан жобаны уақытында аласыз: жұмыс жоспары айқын және келісілген мерзімдер сақталады."
              },
              "innovation": {
                "title": "Клиент үшін бәрі",
                "description": "Әрбір детальді ескереміз — аудит, мән-мағына, визуал, метрика — нәтижені сіздің командаңыз да, клиенттеріңіз де бірден байқайтындай."
              }
            }
          },
          "projects": {
            "subtitle": "Біздің жобалар",
            "title": "Креативті шоукейс",
            "before": "Дизайн қалай өзгерді",
            "process": "Жұмыс процесі",
            "after": "Кофеханаға арналған коллаж"
          }
        }
      }
    }
  })
  .catch(error => {
    console.error('i18n initialization failed:', error);
  });

export default i18n;