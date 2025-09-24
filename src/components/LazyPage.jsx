// src/components/LazyPage.jsx
import React, { Suspense, useState, useEffect } from 'react';
import { CircleLogoLoader } from './MinimalistLoader';
import ErrorBoundary from './ErrorBoundary';

const LazyPage = ({ component: _LazyComponent, fallback = <CircleLogoLoader /> }) => {
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    // Set timeout for loading
    const timeout = setTimeout(() => {
      setIsTimeout(true);
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timeout);
  }, []);

  const timeoutFallback = (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-4">
          <CircleLogoLoader />
        </div>
        <p className="text-yellow-400 mb-4">Загрузка занимает больше времени, чем обычно...</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
        >
          Перезагрузить страницу
        </button>
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <Suspense fallback={isTimeout ? timeoutFallback : fallback}>
        <LazyComponent />
      </Suspense>
    </ErrorBoundary>
  );
};

export default LazyPage;
