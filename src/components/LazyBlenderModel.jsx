// src/components/LazyBlenderModel.jsx
import React, { Suspense, lazy } from 'react';

// Lazy load the heavy 3D model component
const BlenderModel = lazy(() => import('./BlenderModel'));

// Loading fallback with fixed dimensions to prevent CLS
const ModelSkeleton = () => (
  <div 
    className="w-[40rem] h-[40rem] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center mx-auto"
  >
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-400 text-sm">Loading 3D Model...</p>
    </div>
  </div>
 );

const LazyBlenderModel = ({ className = "" }) => {
  return (
    <div className={`w-[40rem] h-[40rem] mx-auto flex items-center justify-center ${className}`}> {/* Контейнер с центрированием модели */}
      <Suspense fallback={<ModelSkeleton />}>
        <BlenderModel />
      </Suspense>
    </div>
  );
};

export default LazyBlenderModel;
