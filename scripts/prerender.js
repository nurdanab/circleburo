#!/usr/bin/env node

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
  { path: '/', title: 'CIRCLE BURO — креативное бюро в Алматы | Рекламное агенство полного цикла', description: 'Помогаем брендам выделяться, расти и масштабироваться за счёт креативных идей, стильного дизайна и системного маркетинга.' },
  { path: '/about', title: 'О компании CIRCLE BURO — опытная команда маркетологов, дизайнеров, веб-разработчиков и архитектуры малых форм.', description: 'Мы — рекламное агентство полного цикла из Алматы. Соединяем стратегию, данные и креатив, чтобы создавать бренды и кампании, которые работают.' },
  { path: '/circle', title: 'Услуга CIRCLE — комплексное продвижение и ребрендинг под ключ', description: 'Полный цикл под ключ: собираем решение на данных и гипотезах, проверяем на реальных метриках и выводим бренд на заметный рывок на рынке Алматы.' },
  { path: '/semicircle', title: 'Услуга SEMICIRCLE — гибкий пакет: только нужные услуги и инструменты для эффективной работы.', description: 'Конструктор услуг — это гибкая сборка под ваши цели: стратегия задаёт курс, дизайн и креатив повышают узнаваемость, SMM даёт трафик и вовлечение, продакшн обеспечивает качество контента.' },
  { path: '/cycle', title: 'Услуга CYCLE — непрерывное развитие бренда и SMM-сопровождение', description: 'Долгосрочное партнёрство: ежемесячная стратегия, контент, дизайн, производство и аналитика для стабильного роста на рынке Алматы.' },
  { path: '/project', title: 'Кейс: полный ребрендинг Steppe Coffee (Алматы) — CIRCLE BURO', description: 'Редизайн айдентики и визуальной системы, тон бренда и контент для Steppe Coffee в Алматы — рост узнаваемости и ключевых метрик.' },
  // English routes
  { path: '/en', title: 'CIRCLE BURO - creative buro in Almaty | Full-cycle advertising agency', description: 'We help brands stand out, grow and scale through creative ideas, stylish design and systematic marketing.' },
  { path: '/en/about', title: 'About CIRCLE BURO company - experienced team of marketers, designers, web developers and small form architecture.', description: 'We are a full-cycle advertising agency from Almaty. We combine strategy, data and creativity to create brands and campaigns that work.' },
  { path: '/en/circle', title: 'CIRCLE Service - comprehensive promotion and turnkey rebranding', description: 'Full turnkey cycle: we build solutions based on data and hypotheses, test with real metrics and bring the brand to a noticeable breakthrough in the Almaty market.' },
  { path: '/en/semicircle', title: 'SEMICIRCLE Service - flexible package: only necessary services and tools for effective work.', description: 'Service constructor - flexible assembly for your goals: strategy sets the course, design and creativity increase recognition, SMM provides traffic and engagement, production ensures content quality.' },
  { path: '/en/cycle', title: 'CYCLE Service - continuous brand development and SMM support', description: 'Long-term partnership: monthly strategy, content, design, production and analytics for stable growth in the Almaty market.' },
  { path: '/en/project', title: 'Case: complete rebranding of Steppe Coffee (Almaty) - CIRCLE BURO', description: 'Identity and visual system redesign, brand tone and content for Steppe Coffee in Almaty - growth in recognition and key metrics.' }
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

  // Добавляем базовый контент для SEO только в noscript (чтобы не мешать React)
  const seoContent = generateSEOContent(route, language);
  // Заменяем контент только внутри noscript тега
  html = html.replace(/(<noscript>.*?<!-- SEO fallback контент до загрузки React -->.*?<\/noscript>)/s,
    `<noscript><main style="color: white; padding: 2rem; text-align: center; font-family: Arial, sans-serif;">${seoContent}</main></noscript>`);

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

function generateSEOContent(route, language) {
  const isHome = route.path === '/' || route.path === '/en';
  const isEnglish = route.path.startsWith('/en');

  if (isHome) {
    if (isEnglish) {
      return `
        <h1>CIRCLE BURO - creative buro in Almaty</h1>
        <p>We help brands stand out, grow and scale through creative ideas, stylish design and systematic marketing.</p>
        <nav>
          <a href="/en/about">About</a>
          <a href="/en/circle">Circle</a>
          <a href="/en/semicircle">Semicircle</a>
          <a href="/en/cycle">Cycle</a>
          <a href="/en/project">Projects</a>
        </nav>
      `;
    } else {
      return `
        <h1>CIRCLE BURO — креативное бюро в Алматы</h1>
        <p>Помогаем брендам выделяться, расти и масштабироваться за счёт креативных идей, стильного дизайна и системного маркетинга.</p>
        <nav>
          <a href="/about">О нас</a>
          <a href="/circle">Circle</a>
          <a href="/semicircle">Semicircle</a>
          <a href="/cycle">Cycle</a>
          <a href="/project">Проекты</a>
        </nav>
      `;
    }
  }

  const homeLink = isEnglish ? '/en' : '/';
  const navLinks = isEnglish ? {
    home: { href: '/en', text: 'Home' },
    about: { href: '/en/about', text: 'About' },
    circle: { href: '/en/circle', text: 'Circle' },
    semicircle: { href: '/en/semicircle', text: 'Semicircle' },
    cycle: { href: '/en/cycle', text: 'Cycle' },
    project: { href: '/en/project', text: 'Projects' }
  } : {
    home: { href: '/', text: 'Главная' },
    about: { href: '/about', text: 'О нас' },
    circle: { href: '/circle', text: 'Circle' },
    semicircle: { href: '/semicircle', text: 'Semicircle' },
    cycle: { href: '/cycle', text: 'Cycle' },
    project: { href: '/project', text: 'Проекты' }
  };

  return `
    <h1>${route.title}</h1>
    <p>${route.description}</p>
    <nav>
      <a href="${navLinks.home.href}">${navLinks.home.text}</a>
      <a href="${navLinks.about.href}">${navLinks.about.text}</a>
      <a href="${navLinks.circle.href}">${navLinks.circle.text}</a>
      <a href="${navLinks.semicircle.href}">${navLinks.semicircle.text}</a>
      <a href="${navLinks.cycle.href}">${navLinks.cycle.text}</a>
      <a href="${navLinks.project.href}">${navLinks.project.text}</a>
    </nav>
  `;
}

// Запускаем prerendering
prerender();