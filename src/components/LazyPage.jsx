// src/components/LazyPage.jsx
import React, { Suspense } from 'react';
import { CircleLogoLoader } from './MinimalistLoader';

const LazyPage = ({ component: Component, fallback = <CircleLogoLoader /> }) => {
  return (
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  );
};

export default LazyPage;
