// src/hooks/useSEO.js
import { useTranslation } from 'react-i18next';

// SEO данные для всех страниц
const seoData = {
  ru: {
    home: {
      title: "CIRCLE BURO | Рекламное агентство в городе Алматы | Маркетинговое агентство полного цикла",
      description: "Создаём и работает с брэндами под ключ: от стратегии до креатива. Помогаем брендам быть заметными и расти.",
      ogTitle: "Circle Creative Buro — креативное бюро полного цикла",
      ogDescription: "Маркетинг, креативный дизайн, брендинг и SMM – полный цикл услуг для роста вашей компании.",
      url: "/"
    },
    about: {
      title: "О компании Circle – опытная команда маркетологов и дизайнеров",
      description: "Мы – рекламное агентство полного цикла, которое разрабатывает стратегии, креатив и продвижение для брендов и компаний любого масштаба под ключ.",
      ogTitle: "Circle Creative Buro — рекламное агентство полного цикла",
      ogDescription: "Маркетинг, креативный дизайн, брендинг и SMM – полный цикл услуг для роста вашей компании.",
      url: "/about"
    },
    circle: {
      title: "Circle – комплексное продвижение бренда или ребрендинг от агентства Circle",
      description: "Полный цикл работ: анализ, стратегия, креатив и реализация для вашего бизнеса.",
      ogTitle: "Circle Creative Buro — рекламное агентство полного цикла",
      ogDescription: "Маркетинг, креативный дизайн, брендинг и SMM – полный цикл услуг для роста вашей компании.",
      url: "/circle"
    },
    semicircle: {
      title: "Semicircle – гибкие решения для вашего бизнеса",
      description: "Частичный пакет услуг: только то, что нужно именно вам, без лишних затрат.",
      ogTitle: "Circle Creative Buro — рекламное агентство полного цикла",
      ogDescription: "Маркетинг, креативный дизайн, брендинг и SMM – полный цикл услуг для роста вашей компании.",
      url: "/semicircle"
    },
    cycle: {
      title: "Cycle — непрерывное развитие вашего бренда вместе с Circle",
      description: "Постоянное сопровождение: маркетинг, дизайн, SMM и поддержка для долгосрочного роста.",
      ogTitle: "Circle Creative Buro — рекламное агентство полного цикла",
      ogDescription: "Маркетинг, креативный дизайн, брендинг и SMM – полный цикл услуг для роста вашей компании.",
      url: "/cycle"
    },
    project: {
      title: "Кейсы и проекты Circle | Портфолио рекламного агентства",
      description: "Успешные проекты и кейсы от рекламного агентства Circle в Алматы. Примеры работ по брендингу, дизайну и маркетингу.",
      ogTitle: "Circle Creative Buro — рекламное агентство полного цикла",
      ogDescription: "Маркетинг, креативный дизайн, брендинг и SMM – полный цикл услуг для роста вашей компании.",
      url: "/project"
    }
  },
  en: {
    home: {
      title: "Circle Advertising Agency in Almaty | Full-Cycle Creative Agency",
      description: "We create and manage brands from A to Z: from strategy to creative. Helping brands stand out and grow.",
      ogTitle: "Circle Creative Buro — full-cycle advertising agency",
      ogDescription: "Marketing, creative design, branding, and SMM — a complete set of services to grow your business.",
      url: "/en"
    },
    about: {
      title: "About Circle – an experienced team of marketers and designers",
      description: "We are a full-cycle advertising agency that develops strategies, creativity, and brand promotion for companies of any scale.",
      ogTitle: "Circle Creative Buro — full-cycle advertising agency",
      ogDescription: "Marketing, creative design, branding, and SMM — a complete set of services to grow your business.",
      url: "/en/about"
    },
    circle: {
      title: "Circle – comprehensive brand promotion or rebranding by Circle Agency",
      description: "A full cycle of work: analysis, strategy, creativity, and implementation for your business.",
      ogTitle: "Circle Creative Buro — full-cycle advertising agency",
      ogDescription: "Marketing, creative design, branding, and SMM — a complete set of services to grow your business.",
      url: "/en/circle"
    },
    semicircle: {
      title: "Semicircle – flexible solutions for your business",
      description: "A partial service package: only what you really need, without extra costs.",
      ogTitle: "Circle Creative Buro — full-cycle advertising agency",
      ogDescription: "Marketing, creative design, branding, and SMM — a complete set of services to grow your business.",
      url: "/en/semicircle"
    },
    cycle: {
      title: "Cycle – continuous brand development with Circle",
      description: "Ongoing support: marketing, design, SMM, and long-term brand growth.",
      ogTitle: "Circle Creative Buro — full-cycle advertising agency",
      ogDescription: "Marketing, creative design, branding, and SMM — a complete set of services to grow your business.",
      url: "/en/cycle"
    },
    project: {
      title: "Circle Cases and Projects | Advertising Agency Portfolio",
      description: "Successful projects and cases from Circle advertising agency in Almaty. Examples of branding, design and marketing work.",
      ogTitle: "Circle Creative Buro — full-cycle advertising agency",
      ogDescription: "Marketing, creative design, branding, and SMM — a complete set of services to grow your business.",
      url: "/en/project"
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