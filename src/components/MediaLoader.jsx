import React from 'react';

const MediaLoader = ({ 
  className = '', 
  size = 'default', 
  variant = 'circle',
  showBackground = false 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const CircleLoader = () => (
    <div className="relative">
      <div className={`${sizeClasses[size]} border-2 border-gray-200 rounded-full animate-spin`}>
        <div className={`absolute top-0 left-0 ${sizeClasses[size]} border-2 border-transparent border-t-black rounded-full animate-spin`}></div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-1 h-1 bg-gray-800 rounded-full animate-pulse"></div>
      </div>
    </div>
  );

  const BarsLoader = () => (
    <div className="flex space-x-0.5">
      {[0, 150, 300, 450, 600].map((delay, index) => (
        <div 
          key={index}
          className={`w-0.5 ${size === 'small' ? 'h-4' : size === 'large' ? 'h-12' : 'h-8'} ${
            index === 0 || index === 4 ? 'bg-black' : index === 1 || index === 3 ? 'bg-gray-600' : 'bg-gray-400'
          } animate-pulse`}
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );

  const DotsLoader = () => (
    <div className="flex space-x-1">
      {[0, 200, 400].map((delay, index) => (
        <div 
          key={index}
          className={`${size === 'small' ? 'w-1.5 h-1.5' : size === 'large' ? 'w-3 h-3' : 'w-2 h-2'} ${
            index === 0 ? 'bg-black' : index === 1 ? 'bg-gray-600' : 'bg-gray-400'
          } rounded-full animate-bounce`}
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'bars':
        return <BarsLoader />;
      case 'dots':
        return <DotsLoader />;
      default:
        return <CircleLoader />;
    }
  };

  return (
    <div className={`flex items-center justify-center ${showBackground ? 'bg-gray-50' : ''} ${className}`}>
      {renderLoader()}
    </div>
  );
};

export default MediaLoader;