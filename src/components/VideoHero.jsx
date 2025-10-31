// src/components/VideoHero.jsx
import React, { useRef, useEffect, useState, memo } from 'react';
import MediaLoader from './MediaLoader';

const VideoHero = memo(({ className = "" }) => {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // ОПТИМИЗАЦИЯ: Проверяем соединение синхронно для быстрого принятия решения
  const [connectionInfo] = useState(() => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const slowConnection = connection && (
      connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g' ||
      connection.saveData
    );
    return {
      isSlow: slowConnection,
      // ОПТИМИЗАЦИЯ: Определяем стратегию preload на основе соединения
      preloadStrategy: slowConnection ? 'none' : 'metadata'
    };
  });

  const [shouldLoadVideo, setShouldLoadVideo] = useState(!connectionInfo.isSlow);

  // ОПТИМИЗАЦИЯ: Проверка на очень медленное соединение убрана из useEffect
  // Теперь проверка происходит синхронно при инициализации
  useEffect(() => {
    // На очень медленном соединении показываем fallback
    if (connectionInfo.isSlow) {
      setHasError(true);
      setShouldLoadVideo(false);
    }
  }, [connectionInfo.isSlow]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoadVideo) return;

    if (import.meta.env.DEV) {
      console.log('VideoHero: Setting up video element');
    }

    const handleLoadedData = () => {
      // Плавное появление после загрузки первого кадра
      setTimeout(() => {
        setIsLoaded(true);
      }, 50); // Минимальная задержка для плавности

      if (import.meta.env.DEV) {
        console.log('VideoHero: Video loaded successfully');
      }
      // Ensure the video starts playing
      video.play().catch((err) => {
        if (import.meta.env.DEV) {
          console.log('VideoHero: Autoplay prevented:', err);
        }
      });
    };

    const handleError = (e) => {
      setHasError(true);
      if (import.meta.env.DEV) {
        console.error('VideoHero: Video error:', e);
      }
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
    <div className="w-full max-w-none sm:max-w-[60rem] lg:max-w-[70rem] xl:max-w-[80rem] 2xl:max-w-[100rem] h-[60vh] sm:h-[60rem] lg:h-[70rem] xl:h-[80rem] 2xl:h-[100rem] sm:w-[60rem] lg:w-[70rem] xl:w-[80rem] 2xl:w-[100rem] flex items-center justify-center mx-auto">
      <MediaLoader size="large" variant="circle" />
    </div>
  );

  // Error fallback
  const ErrorFallback = () => (
    <div className="w-full max-w-none sm:max-w-[60rem] lg:max-w-[70rem] xl:max-w-[80rem] 2xl:max-w-[100rem] h-[60vh] sm:h-[60rem] lg:h-[70rem] xl:h-[80rem] 2xl:h-[100rem] sm:w-[60rem] lg:w-[70rem] xl:w-[80rem] 2xl:w-[100rem] flex items-center justify-center mx-auto">
      <MediaLoader size="large" variant="bars" />
    </div>
  );

  if (hasError) {
    return <ErrorFallback />;
  }

  return (
    <div
      data-video-hero
      className={`w-full max-w-none sm:max-w-[60rem] lg:max-w-[70rem] xl:max-w-[80rem] 2xl:max-w-[100rem] h-[60vh] sm:h-[60rem] lg:h-[70rem] xl:h-[80rem] 2xl:h-[100rem] sm:w-[60rem] lg:w-[70rem] xl:w-[80rem] 2xl:w-[100rem] mx-auto flex items-center justify-center touch-manipulation ${className}`}
      style={{
        padding: 0,
        margin: 0,
        // FIXED: Резервируем пространство для предотвращения CLS
        aspectRatio: '1 / 1',
        minHeight: '60vh',
        // Фиксируем размер контейнера до загрузки
        containIntrinsicSize: '960px 960px'
      }}
    >
      {!isLoaded && <LoadingSkeleton />}

      {shouldLoadVideo && (
        <video
          ref={videoRef}
          className={`w-full h-full object-contain transition-opacity duration-700 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          // FIXED: Явно указываем размеры для резервирования пространства
          width="960"
          height="960"
          style={{
            filter: 'contrast(1.1) brightness(1.05)',
            WebkitTapHighlightColor: 'transparent',
            // Предотвращаем мигание
            position: isLoaded ? 'relative' : 'absolute',
            visibility: isLoaded ? 'visible' : 'hidden',
            // Центрирование видео на всех устройствах
            objectPosition: 'center center',
            // Убираем любые отступы
            margin: 0,
            padding: 0,
            display: 'block',
            // FIXED: Добавляем aspect-ratio для стабильности
            aspectRatio: '1 / 1'
          }}
        autoPlay
        loop
        muted
        playsInline
        preload={connectionInfo.preloadStrategy}
        poster="/img/circle-fill.webp"
        disablePictureInPicture
        disableRemotePlayback
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