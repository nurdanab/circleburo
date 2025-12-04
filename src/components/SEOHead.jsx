// src/components/SEOHead.jsx
import { Helmet } from '@dr.pogodin/react-helmet';
import { getMediaUrl } from '../utils/media';

const SEOHead = ({
  title,
  description,
  ogTitle,
  ogDescription,
  canonicalUrl,
  language = 'ru',
  ogImage = getMediaUrl("img/circle-fill.webp"),
  alternateUrls = [],
  structuredData = true,
  breadcrumbs = null,
  pageName = null,
  autoOptimize = true,
  robots = 'index, follow'
}) => {
  const baseUrl = 'https://circleburo.kz/';

  // Динамические ключевые слова
  const dynamicKeywords = 'креативное агентство алматы, рекламное агентство, маркетинговое агентство, digital маркетинг';

  return (
    <>
      <Helmet>
      {/* Основные мета-теги */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={`${robots}, max-image-preview:large, max-snippet:-1, max-video-preview:-1`} />
      <meta name="author" content="Circle Creative Buro" />
      <meta name="keywords" content={dynamicKeywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      
      {/* Дополнительные SEO мета-теги */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Circle Buro" />
      <meta name="application-name" content="Circle Buro" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Open Graph */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={`${baseUrl}${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Circle Creative Buro - Креативное агентство в Алматы" />
      <meta property="og:image:type" content="image/webp" />
      <meta property="og:locale" content={
        language === 'ru' ? 'ru_KZ' :
        language === 'kk' ? 'kk_KZ' : 'en_US'
      } />
      <meta property="og:site_name" content="Circle Creative Buro" />
      <meta property="og:updated_time" content={new Date().toISOString()} />
      
      {/* Open Graph для бизнеса */}
      <meta property="business:contact_data:street_address" content="ул. Сейфуллина, 458" />
      <meta property="business:contact_data:locality" content="Алматы" />
      <meta property="business:contact_data:region" content="Алматинская область" />
      <meta property="business:contact_data:postal_code" content="050000" />
      <meta property="business:contact_data:country_name" content="Казахстан" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={`${baseUrl}${ogImage}`} />
      <meta name="twitter:image:alt" content="Circle Creative Buro - Креативное агентство в Алматы" />
      <meta name="twitter:creator" content="@circleburo" />
      <meta name="twitter:site" content="@circleburo" />
      
      {/* Performance optimizations */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      
      {/* Google Fonts - Inter with font-display: swap */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      
      {/* Canonical и языковые альтернативы */}
      <link rel="canonical" href={canonicalUrl} />
      {alternateUrls.map(({ href, hreflang }) => (
        <link key={hreflang} rel="alternate" href={href} hreflang={hreflang} />
      ))}
      
      {/* PWA Manifest */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#000000" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Circle Buro" />
      
      {/* Favicon и иконки */}
      <link rel="icon" type="image/svg+xml" href={getMediaUrl("img/favicon.svg")} />
      <link rel="apple-touch-icon" sizes="180x180" href={getMediaUrl("img/apple-touch-icon.png")} />
      <link rel="icon" type="image/png" sizes="96x96" href={getMediaUrl("img/favicon-96x96.png")} />
      <link rel="icon" type="image/png" sizes="32x32" href={getMediaUrl("img/favicon-32x32.png")} />
      <link rel="icon" type="image/png" sizes="16x16" href={getMediaUrl("img/favicon-16x16.png")} />
      <link rel="icon" href={getMediaUrl("img/favicon.ico")} />

      <html lang={language} />
      
      {/* Дополнительные мета-теги для Казахстана */}
      <meta name="geo.region" content="KZ-75" />
      <meta name="geo.placename" content="Алматы" />
      <meta name="geo.position" content="43.238949;76.889709" />
      <meta name="ICBM" content="43.238949, 76.889709" />
    </Helmet>
    </>
  );
};

export default SEOHead;