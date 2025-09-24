// src/hooks/useSEO.js
import { useTranslation } from 'react-i18next';

// SEO данные для всех страниц
const seoData = {
  ru: {
    home: {
      title:
        "CIRCLE BURO — креативное бюро в Алматы | Рекламное агенство полного цикла",
      description:
        "Помогаем брендам выделяться, расти и масштабироваться за счёт креативных идей, стильного дизайна и системного маркетинга.",
      ogTitle:
        "CIRCLE BURO — креативное бюро полного цикла в Алматы",
      ogDescription:
        "Стратегия, брендинг, дизайн, продакшн и SMM  – полный цикл услуг для роста бизнеса, стартапа или ребрендинга.",
      url: "/"
    },
    about: {
      title:
        "О компании CIRCLE BURO — опытная команда маркетологов, дизайнеров, веб-разработчиков и архитектуры малых форм.",
      description:
        "Мы — рекламное агентство полного цикла из Алматы. Соединяем стратегию, данные и креатив, чтобы создавать бренды и кампании, которые работают.",
      ogTitle:
        "О CIRCLE BURO — креативное бюро полного цикла",
      ogDescription:
        "Команда стратегов, дизайнеров и продакшна. Делаем бренды заметными и уникальными.",
      url: "/about"
    },
    circle: {
      title:
        "Услуга CIRCLE — комплексное продвижение и ребрендинг под ключ",
      description:
        "Полный цикл под ключ: собираем решение на данных и гипотезах, проверяем на реальных метриках и выводим бренд на заметный рывок на рынке Алматы.",
      ogTitle:
        "CIRCLE — полный цикл работ: от стратегии до запуска",
      ogDescription:
        "Аналитика задаёт ориентиры, платформа бренда фиксирует позиционирование, визуальный язык обеспечивает узнаваемость, а коммуникации соединяют бренд с аудиторией.",
      url: "/circle"
    },
    semicircle: {
      title:
        "Услуга SEMICIRCLE — гибкий пакет: только нужные услуги и инструменты для эффективной работы.",
      description:
        "Конструктор услуг — это гибкая сборка под ваши цели: стратегия задаёт курс, дизайн и креатив повышают узнаваемость, SMM даёт трафик и вовлечение, продакшн обеспечивает качество контента.",
      ogTitle:
        "SEMICIRCLE — гибкие решения под задачи бизнеса",
      ogDescription:
        "Подключаем только необходимые блоки, запускаем быстро и расширяем, когда видим эффект по метрикам.",
      url: "/semicircle"
    },
    cycle: {
      title:
        "Услуга CYCLE — непрерывное развитие бренда и SMM-сопровождение",
      description:
        "Долгосрочное партнёрство: ежемесячная стратегия, контент, дизайн, производство и аналитика для стабильного роста на рынке Алматы.",
      ogTitle:
        "CYCLE — ежемесячное сопровождение: стратегия, дизайн, контент, трафик.",
      ogDescription:
        "Команда на стороне бренда — это полный цикл без лишнего контроля с вашей стороны: формируем ежемесячный план и контент-сетку, производим материалы, запускаем и оптимизируем кампании, тестируем гипотезы и фиксируем прогресс в прозрачных отчётах и дашбордах.",
      url: "/cycle"
    },
    case: {
      title:
        "Кейс: полный ребрендинг Steppe Coffee (Алматы) — CIRCLE BURO",
      description:
        "Редизайн айдентики и визуальной системы, тон бренда и контент для Steppe Coffee в Алматы — рост узнаваемости и ключевых метрик.",
      ogTitle:
        "Кейс CIRCLE BURO: ребрендинг Steppe Coffee в Алматы",
      ogDescription:
        "Единый визуальный язык, упаковка и коммуникации для Steppe Coffee. Провели запуск и оптимизацию. Результат — заметный рост видимости и вовлечённости в Алматы.",
      url: "/case"
    }
  },
  en: {
    home: {
      title:
        "CIRCLE BURO - creative buro in Almaty | Full-cycle advertising agency",
      description:
        "We help brands stand out, grow and scale through creative ideas, stylish design and systematic marketing.",
      ogTitle:
        "CIRCLE BURO - full-cycle creative buro in Almaty",
      ogDescription:
        "Strategy, branding, design, production and SMM - full cycle of services for business growth, startup or rebranding.",
      url: "/en"
    },
    about: {
      title:
        "About CIRCLE BURO company - experienced team of marketers, designers, web developers and small form architecture.",
      description:
        "We are a full-cycle advertising agency from Almaty. We combine strategy, data and creativity to create brands and campaigns that work.",
      ogTitle:
        "About CIRCLE BURO - full-cycle creative bureau",
      ogDescription:
        "Team of strategists, designers and production specialists. We make brands noticeable and unique.",
      url: "/en/about"
    },
    circle: {
      title:
        "CIRCLE Service - comprehensive promotion and turnkey rebranding",
      description:
        "Full turnkey cycle: we build solutions based on data and hypotheses, test with real metrics and bring the brand to a noticeable breakthrough in the Almaty market.",
      ogTitle:
        "CIRCLE - full cycle of work: from strategy to launch",
      ogDescription:
        "Analytics sets benchmarks, brand platform fixes positioning, visual language ensures recognition, and communications connect the brand with the audience.",
      url: "/en/circle"
    },
    semicircle: {
      title:
        "SEMICIRCLE Service - flexible package: only necessary services and tools for effective work.",
      description:
        "Service constructor - flexible assembly for your goals: strategy sets the course, design and creativity increase recognition, SMM provides traffic and engagement, production ensures content quality.",
      ogTitle:
        "SEMICIRCLE - flexible solutions for business tasks",
      ogDescription:
        "We connect only necessary blocks, launch quickly and expand when we see effect by metrics.",
      url: "/en/semicircle"
    },
    cycle: {
      title:
        "CYCLE Service - continuous brand development and SMM support",
      description:
        "Long-term partnership: monthly strategy, content, design, production and analytics for stable growth in the Almaty market.",
      ogTitle:
        "CYCLE - monthly support: strategy, design, content, traffic.",
      ogDescription:
        "Team on the brand's side - this is a full cycle without unnecessary control on your part: we form monthly plan and content grid, produce materials, launch and optimize campaigns, test hypotheses and record progress in transparent reports and dashboards.",
      url: "/en/cycle"
    },
    case: {
      title:
        "Case: complete rebranding of Steppe Coffee (Almaty) - CIRCLE BURO",
      description:
        "Identity and visual system redesign, brand tone and content for Steppe Coffee in Almaty - growth in recognition and key metrics.",
      ogTitle:
        "CIRCLE BURO Case: Steppe Coffee rebranding in Almaty",
      ogDescription:
        "Unified visual language, packaging and communications for Steppe Coffee. We conducted launch and optimization. Result - noticeable growth in visibility and engagement in Almaty.",
      url: "/en/case"
    }
  },
  kk: {
    home: {
      title:
        "Circle BURO — Алматыдағы креативті бюро / толық циклді жарнама агенттігі",
      description:
        "Біз брендтерге шығармашылық идеялар, стильді дизайн және жүйелік маркетинг арқылы ерекшеленуге, өсуге және масштабтауға көмектесеміз.",
      ogTitle:
        "Circle BURO — Алматыдағы толық циклді креативті бюро",
      ogDescription:
        "Стратегия, брендинг, дизайн, өндіріс және SMM-Бизнестің, стартаптың немесе ребрендингтің өсуіне арналған қызметтердің толық циклі.",
      url: "/kk"
    },
    about: {
      title:
        "CIRCLE BURO компаниясы туралы-маркетологтардың, дизайнерлердің, веб-әзірлеушілердің және шағын пішінді архитектураның тәжірибелі тобы.",
      description:
        "Біз Алматыдағы толық циклді жарнама агенттігіміз. Жұмыс істейтін брендтер мен науқандарды құру үшін стратегияны, деректерді және шығармашылықты біріктіреміз.",
      ogTitle:
        "Circle BURO -толық циклді шығармашылық бюро",
      ogDescription:
        "Стратегтер, дизайнерлер және өндіріс тобы. Біз брендтерді көрнекті және ерекше етеміз.",
      url: "/kk/about"
    },
    circle: {
      title:
        "CIRCLE қызметі-кешенді жылжыту және кілтті ребрендинг",
      description:
        "Толық цикл кілті: деректер мен гипотезалар бойынша шешім жинаймыз, нақты метрикаларды тексереміз және брендті Алматы нарығында елеулі серпіліске шығарамыз.",
      ogTitle:
        "CIRCLE — толық жұмыс циклі: стратегиядан іске қосуға дейін",
      ogDescription:
        "Аналитика бағдарларды белгілейді, бренд платформасы позицияны түсіреді, визуалды тіл тануды қамтамасыз етеді және коммуникациялар брендті аудиториямен байланыстырады.",
      url: "/kk/circle"
    },
    semicircle: {
      title:
        "SEMICIRCLE қызметі-икемді пакет: тек тиімді жұмыс істеу үшін қажетті қызметтер мен құралдар.",
      description:
        "Қызмет конструкторы-бұл сіздің мақсаттарыңызға икемді құрастыру: стратегия курсты, дизайнды және шығармашылықты анықтайды, хабардарлықты арттырады, SMM трафик пен қатысуды қамтамасыз етеді, өндіріс мазмұнның сапасын қамтамасыз етеді.",
      ogTitle:
        "SEMICIRCLE — бизнес міндеттеріне икемді шешімдер",
      ogDescription:
        "Біз тек қажетті блоктарды қосамыз, жылдам іске қосамыз және әсерді метрика бойынша көргенде кеңейтеміз.",
      url: "/kk/semicircle"
    },
    cycle: {
      title:
        "CYCLE қызметі - брендтің үздіксіз дамуы және SMM-сүйемелдеу",
      description:
        "Ұзақ мерзімді әріптестік: Алматы нарығында тұрақты өсу үшін ай сайынғы стратегия, контент, дизайн, өндіріс және талдау.",
      ogTitle:
        "Цикл-ай сайынғы сүйемелдеу: стратегия, дизайн, мазмұн, трафик.",
      ogDescription:
        "Бренд жағындағы Команда-бұл сіздің бақылауыңыздан тыс толық цикл: ай сайынғы жоспар мен мазмұн торын құру, материалдар шығару, науқандарды бастау және оңтайландыру, гипотезаларды сынау және прогресті ашық есептер мен бақылау тақталарына түсіру.",
      url: "/kk/cycle"
    },
    case: {
      title:
        "Кейс: Steppe Coffee (Алматы) толық ребрендингі — circle BURO",
      description:
        "Алматыда Steppe Coffee үшін сәйкестік пен визуалды жүйені қайта құру, брендтің үні мен мазмұны-танымалдылық пен негізгі көрсеткіштердің өсуі.",
      ogTitle:
        "Circle BURO кейсі: Алматыдағы Steppe Coffee ребрендингі",
      ogDescription:
        "Steppe Coffee үшін бірыңғай визуалды тіл, орау және байланыс. Іске қосу және оңтайландыру жүргізілді. Нәтижесі-Алматыда көріну мен қатысудың айтарлықтай өсуі.",
      url: "/kk/case"
    }
  }
};

const useSEO = (pageKey, baseUrl = 'https://circleburo.kz') => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  
  const data = seoData[currentLanguage]?.[pageKey];
  if (!data) return null;
  
  // Создаем alternate URLs для мультиязычности
  const alternateUrls = [];
  
  // Добавляем русскую версию
  if (seoData.ru[pageKey]) {
    alternateUrls.push({
      href: `${baseUrl}${seoData.ru[pageKey].url}`,
      hreflang: 'ru'
    });
  }
  
  // Добавляем английскую версию
  if (seoData.en[pageKey]) {
    alternateUrls.push({
      href: `${baseUrl}${seoData.en[pageKey].url}`,
      hreflang: 'en'
    });
  }

  // Добавляем казахскую версию
  if (seoData.kk[pageKey]) {
    alternateUrls.push({
      href: `${baseUrl}${seoData.kk[pageKey].url}`,
      hreflang: 'kk'
    });
  }
  
  // Добавляем x-default для главной страницы
  if (pageKey === 'home') {
    alternateUrls.push({
      href: `${baseUrl}/`,
      hreflang: 'x-default'
    });
  }
  
  return {
    ...data,
    canonicalUrl: `${baseUrl}${data.url}`,
    language: currentLanguage,
    alternateUrls
  };
};

export default useSEO;