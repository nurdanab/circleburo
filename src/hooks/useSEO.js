// src/hooks/useSEO.js
import { useTranslation } from 'react-i18next';

// SEO данные для всех страниц
const seoData = {
  ru: {
    home: {
      title:
        "CIRCLE BURO — креативное и маркетинговое агентство в Алматы | Полный цикл",
      description:
        "Креатив, брендинг, стратегия и SMM под ключ. Помогаем брендам в Алматы выделяться, расти и масштабироваться за счёт сильной идеи и системного маркетинга.",
      ogTitle:
        "CIRCLE BURO — креативное бюро полного цикла в Алматы",
      ogDescription:
        "Стратегия, брендинг, дизайн, продакшн и SMM. Полный цикл услуг для роста бизнеса.",
      url: 
        "/"
    },
    about: {
      title:
        "О компании CIRCLE BURO — опытная команда маркетологов и дизайнеров",
      description:
        "Мы — рекламное агентство полного цикла из Алматы. Соединяем стратегию, данные и креатив, чтобы создавать бренды и кампании, которые работают.",
      ogTitle:
        "О CIRCLE BURO — креативное бюро полного цикла",
      ogDescription:
        "Команда стратегов, дизайнеров и продакшна. Делаем бренды заметными и эффективными.",
      url: "/about"
    },
    circle: {
      title:
        "Услуга CIRCLE — комплексное продвижение и ребрендинг под ключ",
      description:
        "Полный цикл: исследование, стратегия, брендинг, дизайн, контент и запуск. Для компаний, которым нужен сильный рывок на рынке Алматы.",
      ogTitle:
        "CIRCLE — полный цикл работ: от стратегии до запуска",
      ogDescription:
        "Аналитика, платформа бренда, визуальная система, коммуникации и рост.",
      url: "/circle"
    },
    semicircle: {
      title:
        "Услуга SEMICIRCLE — гибкий пакет: только нужные маркетинговые услуги",
      description:
        "Конструктор услуг: стратегия, дизайн, креатив, SMM или продакшн — выбирайте то, что даст быстрый результат для вашего бизнеса в Алматы.",
      ogTitle:
        "SEMICIRCLE — гибкие решения под задачи бизнеса",
      ogDescription:
        "Выбирайте модули: исследование, креатив, дизайн, контент, медиа.",
      url: "/semicircle"
    },
    cycle: {
      title:
        "Услуга CYCLE — непрерывное развитие бренда и SMM-сопровождение",
      description:
        "Долгосрочное партнёрство: ежемесячная стратегия, контент, дизайн, производство и аналитика для стабильного роста в Алматы.",
      ogTitle:
        "CYCLE — постоянное сопровождение маркетинга и дизайна",
      ogDescription:
        "Команда на стороне бренда: план, контент, оптимизация и отчётность.",
      url: "/cycle"
    },
    case: {
      title:
        "Кейс: полный ребрендинг Steppe Coffee (Алматы) — CIRCLE BURO",
      description:
        "Редизайн айдентики и визуальной системы, тональность бренда и контент для Steppe Coffee в Алматы. Результат: узнаваемость и рост показателей.",
      ogTitle:
        "Кейс CIRCLE BURO: ребрендинг Steppe Coffee в Алматы",
      ogDescription:
        "Айдентика, упаковка, коммуникации и запуск. Полный цикл работ.",
      url: "/case"
    }
  },
  en: {
    home: {
      title:
        "CIRCLE BURO — Creative & Marketing Agency in Almaty | Full-Cycle",
      description:
        "Brand strategy, creative, design, and SMM from A to Z. We help brands in Almaty stand out, grow, and scale through clear strategy and strong ideas.",
      ogTitle:
        "CIRCLE BURO — full-cycle creative bureau in Almaty",
      ogDescription:
        "Strategy, branding, design, production, and SMM — everything for growth.",
      url: "/en"
    },
    about: {
      title:
        "About CIRCLE BURO — experienced team of marketers and designers",
      description:
        "We’re a full-cycle advertising agency from Almaty. We blend strategy, data, and creativity to build brands and campaigns that perform.",
      ogTitle:
        "About CIRCLE BURO — full-cycle creative bureau",
      ogDescription:
        "Strategists, designers, and production under one roof. We make brands distinctive and effective.",
      url: "/en/about"
    },
    circle: {
      title:
        "CIRCLE Service — end-to-end brand promotion & rebranding",
      description:
        "Full cycle: research, strategy, branding, design, content, and launch. Ideal for companies seeking a step-change in Almaty.",
      ogTitle:
        "CIRCLE — full pipeline from strategy to launch",
      ogDescription:
        "Brand platform, visual system, communications, content, and growth.",
      url: "/en/circle"
    },
    semicircle: {
      title:
        "SEMICIRCLE Service — flexible package: only what you need",
      description:
        "Modular services: strategy, design, creative, SMM, or production — pick what drives quick results for your business in Almaty.",
      ogTitle:
        "SEMICIRCLE — agile solutions for business tasks",
      ogDescription:
        "Choose modules: research, creative, design, content, media.",
      url: "/en/semicircle"
    },
    cycle: {
      title:
        "CYCLE Service — ongoing brand development & SMM support",
      description:
        "Long-term partnership: monthly strategy, content, design, production, and analytics for steady growth in Almaty.",
      ogTitle:
        "CYCLE — continuous marketing and design support",
      ogDescription:
        "An embedded team: planning, content, optimization, and reporting.",
      url: "/en/cycle"
    },
    case: {
      title:
        "Case Study: Steppe Coffee Rebranding (Almaty) — CIRCLE BURO",
      description:
        "Identity redesign, brand voice, and content system for Steppe Coffee in Almaty. Outcomes: distinct look, clearer messaging, and growth.",
      ogTitle:
        "CIRCLE BURO Case Study — Steppe Coffee Rebranding",
      ogDescription:
        "End-to-end work: strategy, visual identity, packaging, and launch.",
      url: "/en/case"
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