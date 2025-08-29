// src/components/SEOHead.jsx
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ 
  title, 
  description, 
  ogTitle, 
  ogDescription, 
  canonicalUrl,
  language = 'ru',
  ogImage = '/img/circle-logo.png',
  alternateUrls = []
}) => {
  const baseUrl = 'https://circleburo.kz/'; 
  
  return (
    <Helmet>
      {/* Основные мета-теги */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      
      {/* Open Graph */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={`${baseUrl}${ogImage}`} />
      <meta property="og:locale" content={language === 'ru' ? 'ru_KZ' : 'en_US'} />
      <meta property="og:site_name" content="Circle Creative Buro" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={`${baseUrl}${ogImage}`} />
      
      {/* Canonical и языковые альтернативы */}
      <link rel="canonical" href={canonicalUrl} />
      {alternateUrls.map(({ href, hreflang }) => (
        <link key={hreflang} rel="alternate" href={href} hrefLang={hreflang} />
      ))}
      
      
      {/* Favicon и иконки */}
      <link rel="icon" type="image/png" sizes="32x32" href="/img/circle-logo.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/img/circle-logo.png" />
      <link rel="apple-touch-icon" href="/img/circle-logo.png" />
      <meta name="theme-color" content="#000000" />
      
      {/* Язык документа */}
      <html lang={language} />
      
      {/* Дополнительные мета-теги для Казахстана */}
      <meta name="geo.region" content="KZ-75" />
      <meta name="geo.placename" content="Алматы" />
      <meta name="geo.position" content="43.238949;76.889709" />
      <meta name="ICBM" content="43.238949, 76.889709" />
    </Helmet>
  );
};

export default SEOHead;