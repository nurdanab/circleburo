// src/components/VideoHero.jsx
import React, { useRef, useEffect, useState, memo } from 'react';
import MediaLoader from './MediaLoader';

const VideoHero = memo(({ className = "" }) => {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  // Intersection Observer для lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Проверяем connection speed
          const connection = navigator.connection;
          const slowConnection = connection && (
            connection.effectiveType === 'slow-2g' || 
            connection.effectiveType === '2g' ||
            connection.saveData
          );
          
          // Загружаем видео с задержкой в зависимости от соединения
          const delay = slowConnection ? 2000 : 500;
          const timer = setTimeout(() => {
            setShouldLoadVideo(true);
          }, delay);
          
          return () => clearTimeout(timer);
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    const videoContainer = document.querySelector('[data-video-hero]');
    if (videoContainer) {
      observer.observe(videoContainer);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoadVideo) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      // Ensure the video starts playing
      video.play().catch(() => {});
    };

    const handleError = () => {
      setHasError(true);
      // Video failed to load, fallback will be shown
    };

    const handleCanPlay = () => {
      // Additional check for smooth playback
      if (video.readyState >= 3) {
        video.play().catch(() => {});
      }
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);

    // Load video only when needed
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [shouldLoadVideo]);

  // Fallback loading skeleton
  const LoadingSkeleton = () => (
    <div className="w-full max-w-none sm:max-w-[60rem] lg:max-w-[70rem] xl:max-w-[80rem] 2xl:max-w-[100rem] h-[95vh] sm:h-[60rem] lg:h-[70rem] xl:h-[80rem] 2xl:h-[100rem] sm:w-[60rem] lg:w-[70rem] xl:w-[80rem] 2xl:w-[100rem] flex items-center justify-center mx-auto px-1 sm:px-0">
      <MediaLoader size="large" variant="circle" />
    </div>
  );

  // Error fallback
  const ErrorFallback = () => (
    <div className="w-full max-w-none sm:max-w-[60rem] lg:max-w-[70rem] xl:max-w-[80rem] 2xl:max-w-[100rem] h-[95vh] sm:h-[60rem] lg:h-[70rem] xl:h-[80rem] 2xl:h-[100rem] sm:w-[60rem] lg:w-[70rem] xl:w-[80rem] 2xl:w-[100rem] flex items-center justify-center mx-auto px-1 sm:px-0">
      <MediaLoader size="large" variant="bars" />
    </div>
  );

  if (hasError) {
    return <ErrorFallback />;
  }

  return (
    <div 
      data-video-hero
      className={`w-full max-w-none sm:max-w-[60rem] lg:max-w-[70rem] xl:max-w-[80rem] 2xl:max-w-[100rem] h-[95vh] sm:h-[60rem] lg:h-[70rem] xl:h-[80rem] 2xl:h-[100rem] sm:w-[60rem] lg:w-[70rem] xl:w-[80rem] 2xl:w-[100rem] mx-auto flex items-center justify-center px-1 sm:px-0 ${className}`}
    >
      {!isLoaded && <LoadingSkeleton />}
      
      {shouldLoadVideo && (
        <video
          ref={videoRef}
          className={`w-full h-full object-contain transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0 absolute'
          }`}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        poster="/img/hero-poster.webp"
        style={{
          filter: 'contrast(1.1) brightness(1.05)'
        }}
      >
        <source src="/videos/circle-optimized.mp4" type="video/mp4" />
        
        {/* Fallback for browsers that don't support video */}
          <div className="w-full h-full flex items-center justify-center">
            <ErrorFallback />
          </div>
        </video>
      )}
    </div>
  );
});

VideoHero.displayName = 'VideoHero';

export default VideoHero;