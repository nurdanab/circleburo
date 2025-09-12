import React from 'react';
import { Helmet } from 'react-helmet-async';

const StructuredData = ({ type = 'organization', data = {} }) => {
  const baseUrl = 'https://circleburo.kz';
  
  const getOrganizationData = () => ({
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
    "image": `${baseUrl}/img/circle-fill.webp`,
    "telephone": "+7 (727) 000-00-00",
    "email": "info@circleburo.kz",
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
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Услуги креативного агентства",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Веб-разработка",
            "description": "Разработка современных веб-сайтов и приложений"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Графический дизайн",
            "description": "Создание визуального контента и брендинга"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Цифровой маркетинг",
            "description": "Продвижение в интернете и социальных сетях"
          }
        }
      ]
    },
    "foundingDate": "2020",
    "numberOfEmployees": "5-10",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "25"
    },
    "sameAs": [
      "https://instagram.com/circleburo",
      "https://facebook.com/circleburo"
    ]
  });

  const getPersonData = (person) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": person.name,
    "jobTitle": person.specialty,
    "email": person.email,
    "image": person.image,
    "worksFor": {
      "@type": "Organization",
      "name": "Circle Creative Buro"
    },
    "description": person.bio
  });

  const getServiceData = (service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.description,
    "provider": {
      "@type": "Organization",
      "name": "Circle Creative Buro",
      "url": baseUrl
    },
    "areaServed": {
      "@type": "City",
      "name": "Алматы"
    },
    "serviceType": service.subtitle
  });

  const getWebSiteData = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Circle Creative Buro",
    "url": baseUrl,
    "description": "Креативное агентство в Алматы",
    "publisher": {
      "@type": "Organization",
      "name": "Circle Creative Buro"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  });

  const getBreadcrumbData = (breadcrumbs) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${baseUrl}${crumb.url}`
    }))
  });

  let structuredData;
  
  switch (type) {
    case 'organization':
      structuredData = getOrganizationData();
      break;
    case 'person':
      structuredData = getPersonData(data);
      break;
    case 'service':
      structuredData = getServiceData(data);
      break;
    case 'website':
      structuredData = getWebSiteData();
      break;
    case 'breadcrumb':
      structuredData = getBreadcrumbData(data);
      break;
    default:
      structuredData = getOrganizationData();
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default StructuredData;