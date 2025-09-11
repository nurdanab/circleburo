import React from 'react';

const MinimalistLoader = ({ background = 'none' }) => {
  const backgroundClass = background === 'dark' ? 'bg-gray-900' : '';
  
  return (
    <div className={`min-h-screen w-full flex items-center justify-center ${backgroundClass}`}>
      <div className="relative">
        {/* Main spinning circle */}
        <div className="w-12 h-12 border-2 border-gray-200 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-12 h-12 border-2 border-transparent border-t-black rounded-full animate-spin"></div>
        </div>
        
        {/* Inner pulsing dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-2 h-2 bg-gray-800 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

// Elegant Circle Logo Loader with black background
export const CircleLogoLoader = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <div className="relative flex flex-col items-center">
        {/* Outer rotating ring */}
        <div className="relative w-32 h-32 mb-6">
          <div className="absolute inset-0 border-2 border-gray-700 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-transparent border-t-white border-r-white rounded-full animate-spin"></div>
          
          {/* Inner geometric pattern */}
          <div className="absolute inset-4 border border-gray-600 rounded-full animate-pulse"></div>
          <div className="absolute inset-8 border border-gray-500 rounded-full animate-ping"></div>
          
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>
        
        {/* Circle logo text */}
        <div className="text-white text-4xl font-bold tracking-wider">
          CIRCLE
        </div>
      </div>
    </div>
  );
};

// Alternative design - geometric bars
export const GeometricLoader = ({ background = 'none' }) => {
  const backgroundClass = background === 'dark' ? 'bg-gray-900' : '';
  
  return (
    <div className={`min-h-screen w-full flex items-center justify-center ${backgroundClass}`}>
      <div className="flex space-x-1">
        <div className="w-1 h-8 bg-black animate-pulse" style={{animationDelay: '0ms'}}></div>
        <div className="w-1 h-8 bg-gray-600 animate-pulse" style={{animationDelay: '150ms'}}></div>
        <div className="w-1 h-8 bg-gray-400 animate-pulse" style={{animationDelay: '300ms'}}></div>
        <div className="w-1 h-8 bg-gray-600 animate-pulse" style={{animationDelay: '450ms'}}></div>
        <div className="w-1 h-8 bg-black animate-pulse" style={{animationDelay: '600ms'}}></div>
      </div>
    </div>
  );
};

// Alternative design - rotating squares
export const SquareLoader = ({ background = 'none' }) => {
  const backgroundClass = background === 'dark' ? 'bg-gray-900' : '';
  
  return (
    <div className={`min-h-screen w-full flex items-center justify-center ${backgroundClass}`}>
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 w-10 h-10 border-2 border-gray-300 rotate-45 animate-spin"></div>
        <div className="absolute inset-1 w-8 h-8 bg-black rotate-45 animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
      </div>
    </div>
  );
};

export default MinimalistLoader;