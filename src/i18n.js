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
          },
          "circle": {
            "launchPr": {
              "title": "Запуск и PR",
              "item1": "Анализ рынка и конкурентов",
              "item2": "Ценности бренда",
              "item3": "Построение каналов и коммуникационная стратегия",
              "item4": "Разработка креативной концепции",
              "item5": "Планирование мероприятий",
              "item6": "Промоактивности: бартер, коллаборации, инфлюенсеры и спецпредложения",
              "item7": "Таргетированная реклама"
            },
            "socialMedia": {
              "title": "Оформление социальных сетей",
              "item1": "Пакет для Instagram и TikTok",
              "item2": "Посты (визуалы + подписи + адаптация сетки) - 10",
              "item3": "Reels (монтаж, обложки, заголовки) - 10",
              "item4": "Сторис - 30",
              "item5": "Полная настройка профиля для Instagram и TikTok",
              "item6": "*Другие платформы – по запросу"
            },
            "designGuidebook": {
              "title": "Дизайн + Гайдбук",
              "items": [
                { "service": "Логотип", "alterations": "3 изменения" },
                { "service": "Цветовая палитра, шрифты и паттерны", "alterations": "3 изменения" },
                { "service": "Упаковка, визитки, мерч", "alterations": "до 18 единиц" },
                { "service": "Презентация для инвесторов", "alterations": "до 15 страниц" },
                { "service": "2D-анимации", "alterations": "до 3" },
                { "service": "Руководство по использованию визуального стиля", "alterations": "книга на 30 страниц" },
                { "service": "Иллюстрации", "alterations": "до 15" },
                { "service": "Мини-сайт или лендинг (если включено в задачу)", "alterations": "1 страница" }
              ]
            },
            "totalPrice": {
              "title": "Общая стоимость",
              "days": "45",
              "daysLabel": "дней",
              "price": "1 380 000",
              "currency": "KZT"
            },
            "notes": {
              "note1": "✦ Мы не берём процент за печать, только оплата самой полиграфии.",
              "note2": "✦ На выбор две проверенные типографии: одна доступнее, другая дороже, но с премиум-качеством.",
              "note3": "✦ Все материалы (дизайны, фото, видео) должны быть согласованы с клиентом перед публикацией.",
              "note4": "✦ После согласования изменения можно вносить только в течение 2 календарных дней.",
              "note5": "✦ Четкие сроки подготовки контента устанавливаются заранее и согласуются обеими сторонами.",
              "note6": "✦ У нас включены 3 бесплатных раунда правок. Дополнительные за отдельную оплату."
            }
          },
          "cycle": {
            "socialMedia": {
              "title": "Социальные сети",
              "item1": "Посты для Instagram, TikTok (фото, видео) - 10",
              "item2": "Дизайн сторис - 30",
              "item3": "Полная настройка профиля"
            },
            "design": {
              "title": "Дизайн",
              "item1": "Посты и анимации для социальных сетей - 10",
              "item2": "Обновление печатной продукции - 10"
            },
            "digitalServices": {
              "title": "Digital-Услуги",
              "item1": "Идеи коллабораций на месяц (разработка концепции и дизайна) - до 4",
              "item2": "Таргетированная реклама",
              "item3": "Ежемесячный отчет (что сработало, реакция аудитории, рекомендации по дальнейшим действиям)",
              "item4": "Техническая поддержка и обновление сайта"
            },
            "totalPrice": {
              "title": "Общая стоимость",
              "period": "Ежемесячно",
              "price": "580 000 KZT",
              "discount": "Скидка при покупке пакета «CIRCLE» - 380 000 KZT"
            },
            "notes": {
              "note1": "✦ Мы не берём процент за печать, только оплата самой полиграфии",
              "note2": "✦ На выбор две проверенные типографии: одна доступнее, другая дороже, но с премиум-качеством.",
              "note3": "✦ Все материалы (дизайн, фото, видео) должны быть согласованы с клиентом перед публикацией.",
              "note4": "✦ После согласования изменения можно вносить только в течение 2 календарных дней.",
              "note5": "✦ Четкие сроки подготовки контента устанавливаются заранее и согласуются обеими сторонами.",
              "note6": "✦ Если необходимой услуги нет в списке, мы открыты для индивидуальных решений и новых форматов.",
              "note7": "✦ У нас включены 3 бесплатных раунда правок. Дополнительные за отдельную оплату."
            }
          },
          "semicircle": {
            "marketing": {
              "title": "Маркетинг",
              "item1": "Концепция и визуальное оформление партнёрства/ коллаборации",
              "item1Price": "80.000 KZT",
              "item2": "Поддержка мини-мероприятий: плакат, сторис, видео промо-видео, оформление рор-uр или welcome-зоны",
              "item2Price": "120.000 KZT",
              "item3": "Аудит и анализы",
              "item3Price": "100.000 KZT"
            },
            "smm": {
              "title": "SMM",
              "item1": "Контент-план для публикаций",
              "item2": "Оформление профиля: аватар, хайлайтсы, постеры",
              "item2Count": "10",
              "item3": "Съёмка Reels/TikTok (сценарий, съёмка, монтаж), ",
              "item3Sub": "оформление обложек для соцсетей, посты (Instagram, TikTok)",
              "item3Count": "12",
              "item4": "Адаптация визуала и текста под актуальные тренды или рекомендации",
              "item5": "Сторис",
              "item5Count": "20",
              "totalPrice": "250.000 KZT",
              "days": "19 дней"
            },
            "design": {
              "title": "Дизайн",
              "items": [
                { "service": "Гайдбук (логотип, шрифт, цветовая палитра, мерч и т.д.)", "pages": "20 страниц", "time": "30 дней", "price": "500.000 KZT" },
                { "service": "Презентация", "pages": "1 страница", "time": "1 час", "price": "5.900 KZT" },
                { "service": "Иллюстрация", "pages": "1", "time": "1-9 дней", "price": "9.900-25.000 KZT" },
                { "service": "Упаковка и брендированные материалы", "pages": "1", "time": "4-14 дней", "price": "10.000-30.000 KZT" },
                { "service": "2D-анимации", "pages": "1 секунда.", "time": "1 час", "price": "3.500-9.500 KZT" },
                { "service": "3D-анимации", "pages": "1 секунда.", "time": "1 час", "price": "8.500-21.500 KZT" },
                { "service": "Pop-up визуализация", "pages": "1", "time": "7 дней", "price": "35.500 KZT" },
                { "service": "Плакаты/баннеры", "pages": "1", "time": "2 дня", "price": "9.500 KZT" },
                { "service": "Дизайн для социальных сетей", "pages": "1", "time": "2 дня", "price": "3.500-9.500 KZT" },
                { "service": "Web-дизайн и и разработка сайта", "pages": "1", "time": "1 месяц", "price": "500.000 KZT" },
                { "service": "Дизайн интерьера и сопровождение", "pages": "1 m^2", "time": "4-14 дней", "price": "5.900-10.000 KZT" }
              ]
            },
            "production": {
              "title": "Production",
              "item1": "Видеопродакшн (обзор, промо, интервью)",
              "item1Count": "1",
              "item1Time": "1 час",
              "item1Price": "35.000 KZT",
              "item2": "Фотопродакшн (продуктовая, командная, лайфстайл-съёмка)",
              "item2Count": "1",
              "item2Time": "1 час",
              "item2Price": "20.000 KZT",
              "item3": "Индивидуальные запросы",
              "item3Price": "Индивидуально"
            },
            "notes": {
              "note1": "✦ Мы не берём процент за печать, только оплата самой полиграфии.",
              "note2": "✦ На выбор две проверенные типографии: одна доступнее, другая дороже, но с премиум-качеством.",
              "note3": "✦ Все материалы (дизайн, фото, видео) должны быть согласованы с клиентом перед публикацией.",
              "note4": "✦ После согласования изменения можно вносить только в течение 2 календарных дней.",
              "note5": "✦ Четкие сроки подготовки контента устанавливаются заранее и согласуются обеими сторонами.",
              "note6": "✦ Если необходимой услуги нет в списке, мы открыты для индивидуальных решений и новых форматов.",
              "note7": "✦ У нас включены 3 бесплатных раунда правок. Дополнительные за отдельную оплату."
            }
          },
          "aboutPage": {
            "subtitle": "ЦЕНТР",
            "subtitlebtn": "НАШЕГО КРУГА"
          },
          "notFound": {
            "title": "Страница не найдена",
            "description": "Извините, страница, которую вы ищете, не существует. Возможно, она была перемещена или удалена.",
            "goHome": "Вернуться на главную",
            "aboutUs": "О нас"
          },
          "employeeCards": {
            "title": "Наша команда",
            "subtitle": "Мы — это группа профессионалов с разнообразными навыками и общей страстью к своему делу."
          },
          "aboutUsGallery": {
            "placeholderCards": {
              "title1": "Из задач – в результат",
              "text1": "Превращаем задачи клиентов в работающие решения с измеримым эффектом. Формулируем цель, проектируем путь, запускаем и доводим до KPI — заявки, продажи, узнаваемость.",
              "title2": "Уникальный подход",
              "text2": "Каждый проект уникален — исследуем аудиторию и контекст, тестируем гипотезы, подбираем инструменты и формат, чтобы дать лучшее решение именно под вашу задачу.",
              "title3": "Команда под ключ",
              "text3": "Стратеги, дизайнеры и маркетологи работают как единая команда под управлением PM. Берём всю координацию на себя и отвечаем за результат от брифа до релиза.",
              "title4": "Только то, что работает",
              "text4": "Фокусируемся на инструментах, которые реально двигают метрики. Проводим A/B-тесты, считаем эффективность и масштабируем то, что приносит результат.",
              "title21": "Прозрачность и открытость",
              "text21": "Вы видите статус, сроки и показатели на каждом этапе. Еженедельные апдейты, доска задач и доступ к материалам — без сюрпризов и «чёрных ящиков».",
              "title22": "Эксперты в трендах и инновациях",
              "text22": "Отслеживаем тренды и аккуратно внедряем инновации: новые форматы, инструменты и AI-подходы — только там, где это усиливает ваши результаты.",
              "title31": "Без шаблонов",
              "text31": "Никаких универсальных решений. Учитываем тональность бренда, цели, аудиторию и канал — делаем персональный сценарий под вашу ситуацию.",
              "title32": "Ценим ваше время",
              "text32": "Работаем быстро и чётко: реалистичные дедлайны, SLA по ответам, чек-поинты и одна точка входа. Согласования проходят без затяжек.",
              "title33": "Партнёр в росте",
              "text33": "Мы строим не кампании, а рост: дорожная карта, гипотезы, воронка, юнит-экономика. Регулярные итерации и масштабирование работающих решений.",
              "title34": "Мы в проектах",
              "text34": "Глубоко вовлекаемся и держим высокую планку качества. Проактивно предлагаем улучшения и делаем так, чтобы это ощущалось в каждом проекте и результате."
            }
          },
          "casePage": {
            "hero": {
              "title": "STEPPE COFFEE",
              "subtitle": "Полный цикл создания бренда: от стратегии до реализации",
              "fullCycle": "Полный цикл",
              "scrollDown": "Прокрутите вниз"
            },
            "content": {
              "brandPositioning": {
                "title": "Позиционирование бренда",
                "description": "Мы составили уникальное торговое предложение, где Steppe Coffee не просто кофейня, а ",
                "fourthSpace": "четвертое пространство",
                "descriptionContinued": ", где рождаются смыслы, собирается креатив, кофе и культура."
              },
              "targetAudience": {
                "title": "Целевая аудитория",
                "description": "В ходе анализа целевой аудитории были выявлены основные сегменты потенциальных посетителей:",
                "professionals": {
                  "title": "Профессионалы",
                  "description": "ценящие удобное пространство для работы и встреч"
                },
                "creativeYouth": {
                  "title": "Творческая молодежь",
                  "description": "студенты, ищущие атмосферу для вдохновения"
                },
                "urbanResidents": {
                  "title": "Городские жители",
                  "description": "рассматривающие кофейню как место качественного отдыха"
                }
              },
              "competitiveAnalysis": {
                "title": "Конкурентный анализ",
                "description": "Провели сравнительный анализ прямых и косвенных конкурентов для определения уникальной позиции.",
                "directCompetitors": {
                  "title": "Прямые конкуренты",
                  "description": "локальные кофейни с авторским кофе и уютной атмосферой"
                },
                "indirectCompetitors": {
                  "title": "Косвенные конкуренты",
                  "description": "сетевые кофейни, рестораны с кофейным меню, коворкинги"
                }
              },
              "toneOfVoice": {
                "title": "Tone of Voice",
                "description": "Для бренда Steppe Coffee разработан tone of voice, отражающий ценности и характер заведения:",
                "friendly": {
                  "title": "Дружелюбный и вдохновляющий",
                  "description": "создает ощущение открытости и поддержки"
                },
                "modern": {
                  "title": "Современный, но с локальными акцентами",
                  "description": "сохраняет близость к культуре и идентичности города"
                },
                "informal": {
                  "title": "Неформальный, живой стиль",
                  "description": "помогает общаться с аудиторией на одном языке"
                }
              }
            },
            "marketing": {
              "title": "МАРКЕТИНГ",
              "socialMedia": {
                "title": "Социальные сети",
                "contentPlan": "Разработали контент-план для:",
                "profileSetup": "Настроили профили и проводим съемки для социальных сетей",
                "analytics": "Еженедельно отслеживаем статистику и улучшаем форматы"
              },
              "offlineActivities": {
                "title": "Offline активности",
                "partnerships": "Принимаем партнерские предложения",
                "community": "Устраиваем встречи с комьюнити",
                "events": "Разрабатываем мероприятия"
              }
            },
            "design": {
              "title": "ДИЗАЙН",
              "guidebook": {
                "title": "Гайдбук",
                "description": "Наша команда дизайнеров разработала:",
                "mascot": "Персонаж-маскот",
                "colors": "Фирменные цвета",
                "logo": "Логотип",
                "patterns": "Паттерны",
                "fonts": "Шрифты"
              },
              "menu": {
                "title": "Меню",
                "description": "Придерживаясь единого стиля, было создано новое оформление меню"
              },
              "decoration": {
                "title": "Оформление в кофейне",
                "description": "Для поддержания уюта наша команда создала печатную продукцию для нашего клиента:",
                "labels": "Этикетки",
                "flyers": "Флаеры",
                "cupDesign": "Оформление стаканчиков",
                "mockup": "Мокап"
              },
              "baristaManual": {
                "title": "Мануал для бариста",
                "description": "Для улучшения работы внутри кофейни был создан документ для обучения новых сотрудников (внутренняя обертка-обучение)"
              },
              "advertising": {
                "title": "Рекламный материал",
                "description": "Мы также разработали рекламные баннеры, лайтбоксы и брошюры"
              },
              "uniform": {
                "title": "Униформа",
                "description": "Также были разработана униформа для бариста"
              }
            },
            "webDevelopment": {
              "title": "ВЕБ РАЗРАБОТКА",
              "newDesign": {
                "title": "Новый дизайн для сайта",
                "description": "Разработан новый дизайн для веб сайта с адаптацией на разных устройствах"
              },
              "adminPanel": {
                "title": "Админ панель",
                "description": "Также разработана админ панель с автоматизацией заполнения в google таблицах"
              },
              "cms": {
                "title": "Система управления контентом",
                "description": "Разработана современная CMS для управления контентом с интуитивным интерфейсом"
              }
            }
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
          "aboutPage": {
            "subtitle": "CENTER",
            "subtitlebtn": "OF OUR CIRCLE"
          },
          "notFound": {
            "title": "Page Not Found",
            "description": "Sorry, the page you are looking for does not exist. It may have been moved or deleted.",
            "goHome": "Go Home",
            "aboutUs": "About Us"
          },
          "employeeCards": {
            "title": "Our Team",
            "subtitle": "We are a group of professionals with diverse skills and a shared passion for our work."
          },
          "aboutUsGallery": {
            "placeholderCards": {
              "title1": "From tasks to results",
              "text1": "We turn client tasks into working solutions with measurable impact. We formulate goals, design paths, launch and bring to KPIs — applications, sales, recognition.",
              "title2": "Unique approach",
              "text2": "Each project is unique — we research the audience and context, test hypotheses, select tools and format to give the best solution specifically for your task.",
              "title3": "Turnkey team",
              "text3": "Strategists, designers and marketers work as a unified team under PM management. We take all coordination upon ourselves and are responsible for the result from brief to release.",
              "title4": "Only what works",
              "text4": "We focus on tools that really move metrics. We conduct A/B tests, calculate efficiency and scale what brings results.",
              "title21": "Transparency and openness",
              "text21": "You see status, deadlines and indicators at each stage. Weekly updates, task board and access to materials — no surprises and 'black boxes'.",
              "title22": "Experts in trends and innovations",
              "text22": "We track trends and carefully implement innovations: new formats, tools and AI approaches — only where it strengthens your results.",
              "title31": "No templates",
              "text31": "No universal solutions. We consider brand tone, goals, audience and channel — we make a personal scenario for your situation.",
              "title32": "We value your time",
              "text32": "We work quickly and clearly: realistic deadlines, SLA for responses, checkpoints and one entry point. Approvals go without delays.",
              "title33": "Partner in growth",
              "text33": "We build not campaigns, but growth: roadmap, hypotheses, funnel, unit economics. Regular iterations and scaling of working solutions.",
              "title34": "We are in projects",
              "text34": "We get deeply involved and maintain high quality standards. We proactively suggest improvements and make sure it is felt in every project and result."
            }
          },
          "casePage": {
            "hero": {
              "title": "STEPPE COFFEE",
              "subtitle": "Full cycle of brand creation: from strategy to implementation",
              "fullCycle": "Full cycle",
              "scrollDown": "Scroll down"
            },
            "content": {
              "brandPositioning": {
                "title": "Brand positioning",
                "description": "We created a unique selling proposition where Steppe Coffee is not just a coffee shop, but a ",
                "fourthSpace": "fourth space",
                "descriptionContinued": " where meanings are born, creativity is gathered, coffee and culture."
              },
              "targetAudience": {
                "title": "Target audience",
                "description": "During the target audience analysis, the main segments of potential visitors were identified:",
                "professionals": {
                  "title": "Professionals",
                  "description": "valuing a convenient space for work and meetings"
                },
                "creativeYouth": {
                  "title": "Creative youth",
                  "description": "students looking for an atmosphere for inspiration"
                },
                "urbanResidents": {
                  "title": "Urban residents",
                  "description": "considering the coffee shop as a place for quality rest"
                }
              },
              "competitiveAnalysis": {
                "title": "Competitive analysis",
                "description": "We conducted a comparative analysis of direct and indirect competitors to determine a unique position.",
                "directCompetitors": {
                  "title": "Direct competitors",
                  "description": "local coffee shops with specialty coffee and cozy atmosphere"
                },
                "indirectCompetitors": {
                  "title": "Indirect competitors",
                  "description": "chain coffee shops, restaurants with coffee menu, coworking spaces"
                }
              },
              "toneOfVoice": {
                "title": "Tone of Voice",
                "description": "For the Steppe Coffee brand, a tone of voice has been developed that reflects the values and character of the establishment:",
                "friendly": {
                  "title": "Friendly and inspiring",
                  "description": "creates a sense of openness and support"
                },
                "modern": {
                  "title": "Modern, but with local accents",
                  "description": "maintains closeness to the culture and identity of the city"
                },
                "informal": {
                  "title": "Informal, lively style",
                  "description": "helps communicate with the audience in the same language"
                }
              }
            },
            "marketing": {
              "title": "MARKETING",
              "socialMedia": {
                "title": "Social Media",
                "contentPlan": "Developed content plan for:",
                "profileSetup": "Set up profiles and conduct shoots for social media",
                "analytics": "Weekly tracking of statistics and improving formats"
              },
              "offlineActivities": {
                "title": "Offline activities",
                "partnerships": "Accept partnership offers",
                "community": "Organize community meetings",
                "events": "Develop events"
              }
            },
            "design": {
              "title": "DESIGN",
              "guidebook": {
                "title": "Guidebook",
                "description": "Our design team developed:",
                "mascot": "Mascot character",
                "colors": "Brand colors",
                "logo": "Logo",
                "patterns": "Patterns",
                "fonts": "Fonts"
              },
              "menu": {
                "title": "Menu",
                "description": "Adhering to a unified style, a new menu design was created"
              },
              "decoration": {
                "title": "Coffee shop decoration",
                "description": "To maintain coziness, our team created printed products for our client:",
                "labels": "Labels",
                "flyers": "Flyers",
                "cupDesign": "Cup design",
                "mockup": "Mockup"
              },
              "baristaManual": {
                "title": "Barista manual",
                "description": "To improve work inside the coffee shop, a document was created for training new employees (internal wrapper-training)"
              },
              "advertising": {
                "title": "Advertising material",
                "description": "We also developed advertising banners, lightboxes and brochures"
              },
              "uniform": {
                "title": "Uniform",
                "description": "Uniform for baristas was also developed"
              }
            },
            "webDevelopment": {
              "title": "WEB DEVELOPMENT",
              "newDesign": {
                "title": "New website design",
                "description": "A new design for the website was developed with adaptation for different devices"
              },
              "adminPanel": {
                "title": "Admin panel",
                "description": "An admin panel was also developed with automation of filling in Google sheets"
              },
              "cms": {
                "title": "Content management system",
                "description": "A modern CMS for content management with an intuitive interface was developed"
              }
            }
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
            "title": "Бізбен хабарласыңыз",
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