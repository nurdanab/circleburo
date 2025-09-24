#!/usr/bin/env node
/* eslint-env node */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Пути и настройки
const DIST_PATH = path.resolve(__dirname, '../dist');
const INDEX_HTML_PATH = path.join(DIST_PATH, 'index.html');

// Роуты для prerendering
const ROUTES = [
  { path: '/', title: 'CIRCLE BURO — креативное и маркетинговое агентство в Алматы | Полный цикл', description: 'Креатив, брендинг, стратегия и SMM под ключ. Помогаем брендам в Алматы выделяться, расти и масштабироваться за счёт сильной идеи и системного маркетинга.' },
  { path: '/about', title: 'О компании CIRCLE BURO — опытная команда маркетологов и дизайнеров', description: 'Мы — рекламное агентство полного цикла из Алматы. Соединяем стратегию, данные и креатив, чтобы создавать бренды и кампании, которые работают.' },
  { path: '/circle', title: 'Услуга CIRCLE — комплексное продвижение и ребрендинг под ключ', description: 'Полный цикл: исследование, стратегия, брендинг, дизайн, контент и запуск. Для компаний, которым нужен сильный рывок на рынке Алматы.' },
  { path: '/semicircle', title: 'Услуга SEMICIRCLE — гибкий пакет: только нужные маркетинговые услуги', description: 'Конструктор услуг: стратегия, дизайн, креатив, SMM или продакшн — выбирайте то, что даст быстрый результат для вашего бизнеса в Алматы.' },
  { path: '/cycle', title: 'Услуга CYCLE — непрерывное развитие бренда и SMM-сопровождение', description: 'Долгосрочное партнёрство: ежемесячная стратегия, контент, дизайн, производство и аналитика для стабильного роста в Алматы.' },
  { path: '/project', title: 'Кейс: полный ребрендинг Steppe Coffee (Алматы) — CIRCLE BURO', description: 'Редизайн айдентики и визуальной системы, тональность бренда и контент для Steppe Coffee в Алматы. Результат: узнаваемость и рост показателей.' },
  // English routes
  { path: '/en', title: 'CIRCLE BURO — Creative & Marketing Agency in Almaty | Full-Cycle', description: 'Brand strategy, creative, design, and SMM from A to Z. We help brands in Almaty stand out, grow, and scale through clear strategy and strong ideas.' },
  { path: '/en/about', title: 'About CIRCLE BURO — experienced team of marketers and designers', description: 'We\'re a full-cycle advertising agency from Almaty. We blend strategy, data, and creativity to build brands and campaigns that perform.' },
  { path: '/en/circle', title: 'CIRCLE Service — end-to-end brand promotion & rebranding', description: 'Full cycle: research, strategy, branding, design, content, and launch. Ideal for companies seeking a step-change in Almaty.' },
  { path: '/en/semicircle', title: 'SEMICIRCLE Service — flexible package: only what you need', description: 'Modular services: strategy, design, creative, SMM, or production — pick what drives quick results for your business in Almaty.' },
  { path: '/en/cycle', title: 'CYCLE Service — ongoing brand development & SMM support', description: 'Long-term partnership: monthly strategy, content, design, production, and analytics for steady growth in Almaty.' },
  { path: '/en/project', title: 'Case Study: Steppe Coffee Rebranding (Almaty) — CIRCLE BURO', description: 'Identity redesign, brand voice, and content system for Steppe Coffee in Almaty. Outcomes: distinct look, clearer messaging, and growth.' }
];

// Базовые keywords для SEO
const BASE_KEYWORDS = 'креативное агентство алматы, рекламное агентство, маркетинговое агентство, digital маркетинг, брендинг алматы, SMM агентство';

async function prerender() {
  try {
    console.log('🚀 Starting prerendering process...');

    // Проверяем существование dist папки
    if (!fs.existsSync(DIST_PATH)) {
      console.error('❌ Dist folder not found. Run `npm run build` first.');
      process.exit(1);
    }

    // Читаем основной index.html
    if (!fs.existsSync(INDEX_HTML_PATH)) {
      console.error('❌ index.html not found in dist folder.');
      process.exit(1);
    }

    const indexTemplate = fs.readFileSync(INDEX_HTML_PATH, 'utf8');
    console.log('✅ Template loaded');

    // Создаем prerendered версии для каждого маршрута
    for (const route of ROUTES) {
      const routePath = route.path === '/' ? '' : route.path;
      const outputDir = path.join(DIST_PATH, routePath);

      // Создаем директорию если нужно
      if (routePath && !fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Генерируем HTML с правильными meta-тегами
      const htmlContent = generatePrerenderedHTML(indexTemplate, route);

      // Пишем файл
      const outputPath = path.join(outputDir, 'index.html');
      fs.writeFileSync(outputPath, htmlContent);

      console.log(`✅ Generated: ${route.path} -> ${outputPath}`);
    }

    console.log('🎉 Prerendering completed successfully!');

  } catch (error) {
    console.error('❌ Prerendering failed:', error);
    process.exit(1);
  }
}

function generatePrerenderedHTML(template, route) {
  const currentDate = new Date().toISOString();
  const baseUrl = 'https://circleburo.kz';
  const canonicalUrl = `${baseUrl}${route.path}`;

  // Определяем язык
  const isEnglish = route.path.startsWith('/en');
  const language = isEnglish ? 'en' : 'ru';
  const locale = isEnglish ? 'en_US' : 'ru_KZ';

  // Генерируем Open Graph image URL
  const ogImage = `${baseUrl}/img/circle-fill.webp`;

  // Создаем структурированные данные
  const structuredData = generateStructuredData(route, baseUrl);

  // Заменяем meta-теги в шаблоне
  let html = template;

  // Основные meta-теги
  html = html.replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*"/, `$1${route.description}"`);
  html = html.replace(/(<meta name="keywords" content=")[^"]*"/, `$1${BASE_KEYWORDS}"`);

  // Open Graph
  html = html.replace(/(<meta property="og:title" content=")[^"]*"/, `$1${route.title}"`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*"/, `$1${route.description}"`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*"/, `$1${canonicalUrl}"`);
  html = html.replace(/(<meta property="og:image" content=")[^"]*"/, `$1${ogImage}"`);
  html = html.replace(/(<meta property="og:locale" content=")[^"]*"/, `$1${locale}"`);
  html = html.replace(/(<meta property="og:updated_time" content=")[^"]*"/, `$1${currentDate}"`);

  // Twitter Cards
  html = html.replace(/(<meta name="twitter:title" content=")[^"]*"/, `$1${route.title}"`);
  html = html.replace(/(<meta name="twitter:description" content=")[^"]*"/, `$1${route.description}"`);
  html = html.replace(/(<meta name="twitter:image" content=")[^"]*"/, `$1${ogImage}"`);

  // Canonical URL
  html = html.replace(/(<link rel="canonical" href=")[^"]*"/, `$1${canonicalUrl}"`);

  // HTML lang attribute
  html = html.replace(/<html lang="[^"]*"/, `<html lang="${language}"`);

  // Добавляем структурированные данные перед закрывающим head тегом
  html = html.replace('</head>', `${structuredData}\n</head>`);

  // Добавляем базовый контент для SEO (в noscript, чтобы не мешать React)
  const seoContent = generateSEOContent(route, language);
  html = html.replace('<!-- SEO fallback контент до загрузки React -->', seoContent);

  return html;
}

function generateStructuredData(route, baseUrl) {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Circle Creative Buro",
    "alternateName": "Circle Buro",
    "description": "Креативное агентство в Алматы. Веб-разработка, дизайн, маркетинг и SMM услуги.",
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/img/circle-fill.webp`,
      "width": 300,
      "height": 300
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "ул. Сейфуллина, 458",
      "addressLocality": "Алматы",
      "addressRegion": "Алматинская область",
      "postalCode": "050000",
      "addressCountry": "KZ"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "43.238949",
      "longitude": "76.889709"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Алматы"
      },
      {
        "@type": "Country",
        "name": "Казахстан"
      }
    ]
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Circle Creative Buro",
    "url": baseUrl,
    "description": "Креативное агентство в Алматы",
    "publisher": {
      "@type": "Organization",
      "name": "Circle Creative Buro"
    },
    "inLanguage": ["ru", "en"]
  };

  return `
    <script type="application/ld+json">
      ${JSON.stringify(organizationData)}
    </script>
    <script type="application/ld+json">
      ${JSON.stringify(websiteData)}
    </script>
  `;
}

function generateSEOContent(route, _language) {
  const isHome = route.path === '/' || route.path === '/en';

  if (isHome) {
    return `
      <h1>CIRCLE BURO — креативное агентство в Алматы</h1>
      <p>Креатив, брендинг, стратегия и SMM под ключ. Помогаем брендам выделяться, расти и масштабироваться.</p>
      <nav>
        <a href="/about">О нас</a>
        <a href="/circle">Circle</a>
        <a href="/semicircle">Semicircle</a>
        <a href="/cycle">Cycle</a>
        <a href="/project">Проекты</a>
      </nav>
    `;
  }

  return `
    <h1>${route.title}</h1>
    <p>${route.description}</p>
    <nav>
      <a href="/">Главная</a>
      <a href="/about">О нас</a>
      <a href="/circle">Circle</a>
      <a href="/semicircle">Semicircle</a>
      <a href="/cycle">Cycle</a>
      <a href="/project">Проекты</a>
    </nav>
  `;
}

// Запускаем prerendering
prerender();