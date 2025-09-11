// src/components/VideoHero.jsx
import React, { useRef, useEffect, useState, memo } from 'react';
import MediaLoader from './MediaLoader';

const VideoHero = memo(({ className = "" }) => {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Intersection Observer для lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Загружаем видео только когда оно видно + небольшая задержка
          const timer = setTimeout(() => {
            setShouldLoadVideo(true);
          }, 1000);
          
          return () => clearTimeout(timer);
        }
      },
      {
        rootMargin: '50px',
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
    <div className="w-[40rem] h-[40rem] flex items-center justify-center mx-auto">
      <MediaLoader size="large" variant="circle" />
    </div>
  );

  // Error fallback
  const ErrorFallback = () => (
    <div className="w-[40rem] h-[40rem] flex items-center justify-center mx-auto">
      <MediaLoader size="large" variant="bars" />
    </div>
  );

  if (hasError) {
    return <ErrorFallback />;
  }

  return (
    <div 
      data-video-hero
      className={`w-[40rem] h-[40rem] mx-auto flex items-center justify-center ${className}`}
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
        loading="lazy"
        poster="/img/hero-poster.webp"
        style={{
          filter: 'contrast(1.1) brightness(1.05)',
        }}
      >
        <source src="/videos/hero-animation.webm" type="video/webm" />
        <source src="/videos/hero-animation.mp4" type="video/mp4" />
        
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