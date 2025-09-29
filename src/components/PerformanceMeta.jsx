// src/components/PerformanceMeta.jsx
import React from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';

const PerformanceMeta = () => {
  return (
    <Helmet>
      {/* Avoid duplicate preloads already present in index.html */}

      {/* DNS prefetch for external resources */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      
      {/* Resource hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      
      {/* Performance meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta name="theme-color" content="#000000" />
      
      {/* Performance optimizations */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="format-detection" content="telephone=no" />
      

    </Helmet>
  );
};

export default PerformanceMeta;
