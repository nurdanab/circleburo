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
          "main": {
            "subtitle": "Креативное и маркетинговое агентство в Алматы — полный цикл digital-услуг для роста бизнеса"
          },
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
          "quiz": {
            "headline": "Найдите свой идеальный пакет услуг",
            "subheadline": "Позвольте нам помочь вам найти решение, которое идеально подходит для ваших целей и задач",
            "start_screen": {
              "title": "Готовы найти свой идеальный пакет услуг?",
              "description": "Ответьте на несколько простых вопросов, и мы порекомендуем идеальное решение для вас",
              "button": "Начать"
            },
            "questions": {
              "1": "Имеется ли у вас действующий бизнес?",
              "2": "У вас есть фирменный стиль или айдентика?",
              "3": "Интересует ли вас ежемесячная подписка?",
              "4": "Ведёт ли ваша команда социальные сети?",
              "5": "Ограничиваете ли вы себя в бюджете?"
            },
            "options": {
              "yes": "Да",
              "no": "Нет"
            },
            "progress": {
              "question": "Вопрос {{step}}"
            },
            "results": {
              "semi_circle": {
                "subtitle": "РАЗОВОЕ РЕШЕНИЕ",
                "description": "Разовые визуальные и цифровые решения для конкретной задачи. Идеально подходит для малого бизнеса, мероприятий, кампаний."
              },
              "circle": {
                "subtitle": "ПОЛНЫЙ ПАКЕТ",
                "description": "Комплексное решение для фирменного стиля и присутствия бренда. Идеально для растущего бизнеса и стартапов."
              },
              "cycle": {
                "subtitle": "ЕЖЕМЕСЯЧНОЕ СОПРОВОЖДЕНИЕ",
                "description": "Ежемесячная подписка на визуальную и контентную поддержку. Идеально для брендов, которые хотят делегировать задачи по маркетингу и дизайну."
              }
            },
            "result_screen": {
              "title": "Идеально! Мы рекомендуем {{result}}",
              "button_start": "Начать",
              "button_restart": "Пройти тест заново"
            }
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
          },
          "contactForm": {
            "title": "Свяжитесь с нами",
            "subtitle": "Запишитесь на консультацию к нашему эксперту",
            "selectDateTime": "Выберите дату и время",
            "yourInformation": "Ваша информация",
            "fullName": "Полное имя",
            "fullNamePlaceholder": "Введите свое имя",
            "phoneNumber": "Номер телефона",
            "selectedSlot": "Выбранный слот:",
            "bookConsultation": "Записаться на консультацию",
            "submitting": "Отправка...",
            "bookingConfirmed": "Бронирование подтверждено!",
            "requestSent": "Запрос успешно отправлен!",
            "receivedBooking": "Мы получили ваш запрос на бронирование для:",
            "managerContact": "Наш менеджер свяжется с вами в ближайшее время",
            "meetingConfirmed": "Ваша встреча подтверждена!",
            "bookAnotherSlot": "Забронировать другой слот",
            "availableDates": "Доступные даты:",
            "availableTimes": "Доступные сроки:",
            "noAvailableSlots": "Нет доступных временных интервалов",
            "chooseAnotherDate": "Пожалуйста, выберите другую дату",
            "loadingSlots": "Загрузка доступных слотов...",
            "errors": {
              "invalidName": "Пожалуйста, введите действительное имя",
              "invalidPhone": "Пожалуйста, введите действительный номер телефона",
              "noDateOrTime": "Пожалуйста, выберите дату и время",
              "slotUnavailable": "Выбранное время больше недоступно",
              "submissionError": "При подаче заявки произошла ошибка"
            },
            "legend": {
              "selected": "Выбран",
              "available": "Доступно",
              "unavailable": "Недоступно"
            }
          },
          "calendar": {
            "january": "Январь", "february": "Февраль", "march": "Март", "april": "Апрель",
            "may": "Май", "june": "Июнь", "july": "Июль", "august": "Август",
            "september": "Сентябрь", "october": "Октябрь", "november": "Ноябрь", "december": "Декабрь",
            "sun": "Вс", "mon": "Пн", "tue": "Вт", "wed": "Ср", "thu": "Чт", "fri": "Пт", "sat": "Сб"
          },
          "services": {
            "title": "НАШИ УСЛУГИ",
            "semicircle": {
              "title": "Semi Circle",
              "subtitle": "ОДНА ЗАДАЧА",
              "description": "Одноразовые визуальные и цифровые решения для конкретной задачи. Идеально подходит для малого бизнеса, мероприятий, кампаний."
            },
            "circle": {
              "title": "Circle",
              "subtitle": "ПОЛНЫЙ ПАКЕТ",
              "description": "Комплексное решение для создания фирменного стиля и узнаваемости бренда. Идеально подходит для растущего бизнеса и стартапов."
            },
            "cycle": {
              "title": "Cycle",
              "subtitle": "ЕЖЕМЕСЯЧНАЯ ПОДПИСКА",
              "description": "Ежемесячная подписка на визуальную и контентную поддержку. Идеально подходит для брендов, которые хотят делегировать маркетинговые и дизайнерские задачи."
            }
          },
          "aboutUs": {
            "title": "Из идеи в реальность",
            "subtitle": "О нас",
            "creative": "Из идеи",
            "vision": "в реальность",
            "paragraph1": "Circle Creative Buro — креативное бюро, на рынке с июня 2025 года. Мы превращаем бизнес-задачи в сильные идеи и упаковываем их в понятные продукты и коммуникации.",
            "paragraph2": "Наша задача — сделать так, чтобы ваш бренд работал заметно и эффективно: уникальность читалась с первого контакта, а преимущества были очевидны среди аналогов.",
            "button": "Узнать больше о Circle"
          }
        }
      },
      en: {
        translation: {
          "main": {
            "subtitle": "Creative and marketing agency in Almaty — full cycle of digital services for business growth"
          },
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
          "quiz": {
            "headline": "Find Your Perfect Service",
            "subheadline": "Let us guide you to the service that perfectly matches your needs and goals",
            "start_screen": {
              "title": "Ready to discover your ideal service?",
              "description": "Answer a few simple questions and we'll recommend the perfect solution for you",
              "button": "Start Quiz"
            },
            "questions": {
              "1": "Do you have an existing business?",
              "2": "Do you have a corporate style or identity?",
              "3": "Are you interested in a monthly subscription?",
              "4": "Does your team manage social media?",
              "5": "Do you have a budget constraint?"
            },
            "options": {
              "yes": "Yes",
              "no": "No"
            },
            "progress": {
              "question": "Question {{step}}"
            },
            "results": {
              "semi_circle": {
                "subtitle": "ONE-TIME SOLUTION",
                "description": "One-time visual and digital solutions for specific tasks. Perfect for small businesses, events, campaigns."
              },
              "circle": {
                "subtitle": "FULL PACKAGE",
                "description": "Comprehensive solution for brand identity and presence. Perfect for growing businesses and startups."
              },
              "cycle": {
                "subtitle": "MONTHLY SUPPORT",
                "description": "Monthly subscription for visual and content support. Perfect for brands that want to delegate marketing and design tasks."
              }
            },
            "result_screen": {
              "title": "Perfect! We recommend {{result}}",
              "button_start": "Get Started",
              "button_restart": "Take Quiz Again"
            }
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
          },
          "contactForm": {
            "title": "Contact Us",
            "subtitle": "Book a consultation with our expert",
            "selectDateTime": "Select Date and Time",
            "yourInformation": "Your Information",
            "fullName": "Full Name",
            "fullNamePlaceholder": "Enter your name",
            "phoneNumber": "Phone Number",
            "selectedSlot": "Selected Slot:",
            "bookConsultation": "Book Consultation",
            "submitting": "Submitting...",
            "bookingConfirmed": "Booking Confirmed!",
            "requestSent": "Request successfully sent!",
            "receivedBooking": "We received your booking request for:",
            "managerContact": "Our manager will contact you shortly",
            "meetingConfirmed": "Your meeting is confirmed!",
            "bookAnotherSlot": "Book Another Slot",
            "availableDates": "Available Dates:",
            "availableTimes": "Available Times:",
            "noAvailableSlots": "No available time slots",
            "chooseAnotherDate": "Please choose another date",
            "loadingSlots": "Loading available slots...",
            "errors": {
              "invalidName": "Please enter a valid name",
              "invalidPhone": "Please enter a valid phone number",
              "noDateOrTime": "Please select date and time",
              "slotUnavailable": "Selected time is no longer available",
              "submissionError": "An error occurred while submitting"
            },
            "legend": {
              "selected": "Selected",
              "available": "Available",
              "unavailable": "Unavailable"
            }
          },
          "calendar": {
            "january": "January", "february": "February", "march": "March", "april": "April",
            "may": "May", "june": "June", "july": "July", "august": "August",
            "september": "September", "october": "October", "november": "November", "december": "December",
            "sun": "Sun", "mon": "Mon", "tue": "Tue", "wed": "Wed", "thu": "Thu", "fri": "Fri", "sat": "Sat"
          },
          "services": {
            "title": "OUR SERVICES",
            "semicircle": {
              "title": "Semi Circle",
              "subtitle": "ONE TASK",
              "description": "One-time visual and digital solutions for specific tasks. Perfect for small businesses, events, campaigns."
            },
            "circle": {
              "title": "Circle",
              "subtitle": "FULL PACKAGE",
              "description": "Comprehensive solution for creating brand identity and recognition. Perfect for growing businesses and startups."
            },
            "cycle": {
              "title": "Cycle",
              "subtitle": "MONTHLY SUBSCRIPTION",
              "description": "Monthly subscription for visual and content support. Perfect for brands that want to delegate marketing and design tasks."
            }
          },
          "aboutUs": {
            "title": "From idea to reality",
            "subtitle": "About us",
            "creative": "From idea",
            "vision": "to reality",
            "paragraph1": "Circle Creative Buro — creative bureau, in the market since June 2025. We turn business tasks into strong ideas and package them into understandable products and communications.",
            "paragraph2": "Our task is to make your brand work noticeably and effectively: uniqueness is read from the first contact, and advantages are obvious among analogues.",
            "button": "Learn more about Circle"
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
          },
          "quiz": {
            "headline": "Өзіңіздің мінсіз қызмет пакетін табыңыз",
            "subheadline": "Біз сізге мақсаттарыңызға сәйкес шешімді табуға көмектесейік",
            "start_screen": {
              "title": "Мінсіз қызмет пакетін табуға дайынсыз ба?",
              "description": "Бірнеше қарапайым сұраққа жауап беріңіз, біз сізге идеалды шешімді ұсынамыз",
              "button": "Бастау"
            },
            "questions": {
              "1": "Сізде жұмыс істеп тұрған бизнес бар ма?",
              "2": "Сізде фирмалық стиль немесе айдентика бар ма?",
              "3": "Сізді ай сайынғы жазылым қызықтыра ма?",
              "4": "Сіздің команда әлеуметтік желілер жүргізе ме?",
              "5": "Сіз өз бюджетіңізді шектейсіз бе?"
            },
            "options": {
              "yes": "Иә",
              "no": "Жоқ"
            },
            "progress": {
              "question": "{{step}} сұрақ"
            },
            "results": {
              "semi_circle": {
                "subtitle": "БІР РЕТТІК ШЕШІМ",
                "description": "Нақты тапсырмалар үшін бір реттік көрнекі және цифрлық шешімдер. Шағын бизнес, іс-шаралар, науқандар үшін мінсіз."
              },
              "circle": {
                "subtitle": "ТОЛЫҚ ПАКЕТ",
                "description": "Бренд айдентикасы мен қатысуы үшін кешенді шешім. Өсіп келе жатқан бизнес пен стартаптар үшін мінсіз."
              },
              "cycle": {
                "subtitle": "АЙЛЫҚ ҚОЛДАУ",
                "description": "Көрнекі және мазмұнды қолдауға айлық жазылым. Маркетинг пен дизайн тапсырмаларын басқаларға тапсырғысы келетін брендтер үшін мінсіз."
              }
            },
            "result_screen": {
              "title": "Керемет! Біз {{result}} ұсынамыз",
              "button_start": "Бастау",
              "button_restart": "Тестті қайтадан өту"
            }
          },
          "contactForm": {
            "title": "Біз бен хабарласыңыз",
            "subtitle": "Біздің маманнан кеңес алу үшін жазылыңыз",
            "selectDateTime": "Күн мен уақытты таңдаңыз",
            "yourInformation": "Сіздің мәліметтеріңіз",
            "fullName": "Толық аты",
            "fullNamePlaceholder": "Атыңызды енгізіңіз",
            "phoneNumber": "Телефон нөмірі",
            "selectedSlot": "Таңдалған уақыт:",
            "bookConsultation": "Кеңеске жазылу",
            "submitting": "Жіберілуде...",
            "bookingConfirmed": "Брондау расталды!",
            "requestSent": "Сұрау сәтті жіберілді!",
            "receivedBooking": "Біз сіздің брондау сұрауыңызды алдық:",
            "managerContact": "Біздің менеджер жақын арада сізбен хабарласады",
            "meetingConfirmed": "Сіздің кездесуіңіз расталды!",
            "bookAnotherSlot": "Басқа уақыт броньдау",
            "availableDates": "Қолжетімді күндер:",
            "availableTimes": "Қолжетімді уақыттар:",
            "noAvailableSlots": "Қолжетімді уақыт интервалдары жоқ",
            "chooseAnotherDate": "Басқа күнді таңдаңыз",
            "loadingSlots": "Қолжетімді слоттар жүктелуде...",
            "errors": {
              "invalidName": "Жарамды атты енгізіңіз",
              "invalidPhone": "Жарамды телефон нөмірін енгізіңіз",
              "noDateOrTime": "Күн мен уақытты таңдаңыз",
              "slotUnavailable": "Таңдалған уақыт енді қолжетімді емес",
              "submissionError": "Жіберу кезінде қате орын алды"
            },
            "legend": {
              "selected": "Таңдалған",
              "available": "Қолжетімді",
              "unavailable": "Қолжетімді емес"
            }
          },
          "calendar": {
            "january": "Қаңтар", "february": "Ақпан", "march": "Наурыз", "april": "Сәуір",
            "may": "Мамыр", "june": "Маусым", "july": "Шілде", "august": "Тамыз",
            "september": "Қыркүйек", "october": "Қазан", "november": "Қараша", "december": "Желтоқсан",
            "sun": "Жс", "mon": "Дс", "tue": "Сс", "wed": "Ср", "thu": "Бс", "fri": "Жм", "sat": "Сб"
          },
          "services": {
            "title": "БІЗДІҢ ҚЫЗМЕТТЕР",
            "semicircle": {
              "title": "Semi Circle",
              "subtitle": "БІР ТАПСЫРМА",
              "description": "Нақты тапсырмалар үшін бір реттік көрнекі және цифрлық шешімдер. Шағын бизнес, іс-шаралар, науқандар үшін мінсіз."
            },
            "circle": {
              "title": "Circle",
              "subtitle": "ТОЛЫҚ ПАКЕТ",
              "description": "Бренд идентичности мен танылуын жасау үшін кешенді шешім. Өсіп келе жатқан бизнес пен стартаптар үшін мінсіз."
            },
            "cycle": {
              "title": "Cycle",
              "subtitle": "АЙЛЫҚ ЖАЗЫЛЫМ",
              "description": "Көрнекі және мазмұнды қолдауға айлық жазылым. Маркетинг пен дизайн тапсырмаларын басқаларға тапсырғысы келетін брендтер үшін мінсіз."
            }
          },
          "aboutUs": {
            "title": "Идеядан нақтылыққа дейін",
            "subtitle": "Біз туралы",
            "creative": "Идеядан",
            "vision": "нақтылыққа дейін",
            "paragraph1": "Circle Creative Buro — 2025 жылдың маусымынан бастап нарықта жұмыс істеп келе жатқан креативті бюро. Біз бизнес тапсырмаларын күшті идеяларға айналдырамыз және оларды түсінікті өнімдер мен коммуникацияларға орамдаймыз.",
            "paragraph2": "Біздің міндетіміз — сіздің брендіңіз айқын және тиімді жұмыс істеуін қамтамасыз ету: бірегейлік алғашқы контактыдан бастап оқылуы және аналогтар арасында артықшылықтар айқын болуы.",
            "button": "Circle туралы көбірек білу"
          }
        }
      }
    }
  })
  .catch(error => {
    console.error('i18n initialization failed:', error);
  });

export default i18n;