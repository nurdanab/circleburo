// src/components/LazyPage.jsx
import React, { Suspense } from 'react';

// Loading component with fixed dimensions to prevent CLS
const PageLoader = () => (
  <div className="min-h-screen w-full flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg">Loading page...</p>
    </div>
  </div>
);

const LazyPage = ({ component: Component, fallback = <PageLoader /> }) => {
  return (
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  );
};

export default LazyPage;
