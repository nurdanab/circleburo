import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { safePlayVideo, safePauseVideo } from '../../utils/videoUtils';

const ProjectsSection = memo(() => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('steppe-coffee');

  // ОПТИМИЗАЦИЯ: Объединяем state для минимизации ре-рендеров
  const [videoState, setVideoState] = useState({
    loaded: new Set(),
    visible: new Set(),
    isMobile: false,
    playingOnMobile: new Set() // Видео, которые воспроизводятся на мобильных после клика
  });

  const videoRefs = useRef(new Map());
  const observerRef = useRef(null);
  const loadingQueueRef = useRef([]);
  const currentlyLoadingRef = useRef(0);
  const MAX_CONCURRENT_LOADS = 3;

  // Данные подсекций с переводами
  const subsections = [
    {
      id: 'steppe-coffee',
      title: {
        ru: 'Steppe Coffee ребрендинг',
        en: 'Steppe Coffee Rebranding',
        kk: 'Steppe Coffee ребрендинг'
      },
      projects: [
        { id: 1, color: '#FF6B6B', size: 'b', image: '/img/projects/case1.webp' }, // col1-row1
        { id: 2, color: '#4ECDC4', size: 'a', image: '/img/projects/3case.webp' }, // col1-row2
        { id: 3, color: '#45B7D1', size: 'a', image: '/img/projects/case4.webp' }, // col2-row1
        { id: 4, color: '#FFA07A', size: 'b', image: '/img/projects/case2.webp' }, // col2-row2
        { id: 5, color: '#98D8C8', size: 'c', image: '/img/projects/case5.webp' }  // col3-full
      ]
    },
    {
      id: 'motion',
      title: {
        ru: 'Моушн',
        en: 'Motion',
        kk: 'Моушн'
      },
      projects: [
        { id: 5, color: '#000000', size: 'b', video: '/img/projects/motion-2.webm' }, // col1-row1
        { id: 6, color: '#000000', size: 'a', video: '/img/projects/motion-3.webm' }, // col1-row2
        { id: 7, color: '#000000', size: 'a', video: '/img/projects/motion-1.webm' }, // col2-row1
        { id: 8, color: '#000000', size: 'b', video: '/img/projects/motion-4.webm' }, // col2-row2
        { id: 9, color: '#000000', size: 'c', video: '/img/projects/motion-5.webm' }  // col3-full
      ]
    },
    {
      id: 'design-works',
      title: {
        ru: 'Работы дизайнеров',
        en: 'Design Works',
        kk: 'Дизайнерлер жұмысы'
      },
      projects: [
        { id: 10, color: '#000000', size: 'b', image: '/img/projects/dw1.webp' }, // col1-row1
        { id: 11, color: '#000000', size: 'a', image: '/img/projects/dw2.webp' }, // col1-row2
        { id: 12, color: '#000000', size: 'a', image: '/img/projects/dw3.webp' }, // col2-row1
        { id: 13, color: '#000000', size: 'b', image: '/img/projects/dw4.webp' }, // col2-row2
        { id: 14, color: '#000000', size: 'c', image: '/img/projects/dw5.webp' }  // col3-full
      ]
    },
    {
      id: 'identity',
      title: {
        ru: 'Айдентика',
        en: 'Identity',
        kk: 'Айдентика'
      },
      projects: [
        { id: 15, color: '#000000', size: 'b', image: '/img/projects/id2.webp' }, // col1-row1
        { id: 16, color: '#000000', size: 'a', image: '/img/projects/id1.webp' }, // col1-row2
        { id: 17, color: '#000000', size: 'a', image: '/img/projects/id3.webp' }, // col2-row1
        { id: 18, color: '#000000', size: 'b', image: '/img/projects/id4.webp' }, // col2-row2
        { id: 19, color: '#000000', size: 'c', image: '/img/projects/id5.webp' }  // col3-full
      ]
    },
    {
      id: 'production',
      title: {
        ru: 'Продакшн',
        en: 'Production',
        kk: 'Продакшн'
      },
      projects: [
        { id: 20, color: '#000000', size: 'b', video: '/img/projects/prod1.webm' }, // col1-row1
        { id: 21, color: '#000000', size: 'a', video: '/img/projects/prod4.webm' }, // col1-row2
        { id: 22, color: '#000000', size: 'a', video: '/img/projects/prod2.webm' }, // col2-row1
        { id: 23, color: '#000000', size: 'b', video: '/img/projects/prod5.webm' }, // col2-row2
        { id: 24, color: '#000000', size: 'c', video: '/img/projects/prod3.webm' }  // col3-full
      ]
    }
  ];

  // ОПТИМИЗАЦИЯ: Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setVideoState(prev => ({ ...prev, isMobile: window.innerWidth < 768 }));
    };

    checkMobile();
    const resizeObserver = new ResizeObserver(checkMobile);
    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Инициализируем Intersection Observer для ленивой загрузки видео
  useEffect(() => {
    // Создаём новый observer с актуальным processLoadingQueue
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const videoId = entry.target.dataset.videoId;
          if (!videoId) return;

          if (entry.isIntersecting) {
            // Видео стало видимым - добавляем в очередь загрузки
            if (!loadingQueueRef.current.includes(videoId)) {
              loadingQueueRef.current.push(videoId);
              processLoadingQueue();
            }
          }
        });
      },
      {
        rootMargin: '100px', // Загружаем заранее
        threshold: 0.1
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [processLoadingQueue]);

  // Очистка видео при смене таба
  useEffect(() => {
    // Останавливаем все видео при смене таба
    videoRefs.current.forEach((videoEl) => {
      if (videoEl && !videoEl.paused) {
        safePauseVideo(videoEl, true);
      }
    });
  }, [activeTab]);

  // ОПТИМИЗАЦИЯ: Функция обработки очереди загрузки (макс 3 одновременно)
  const processLoadingQueue = useCallback(() => {
    while (
      currentlyLoadingRef.current < MAX_CONCURRENT_LOADS &&
      loadingQueueRef.current.length > 0
    ) {
      const videoId = loadingQueueRef.current.shift();
      const videoEl = videoRefs.current.get(videoId);

      if (!videoEl) {
        continue;
      }

      // Проверяем, не загружено ли уже
      if (videoEl.src && videoEl.src !== window.location.href) {
        currentlyLoadingRef.current--;
        continue;
      }

      currentlyLoadingRef.current++;

      // На мобильных не загружаем видео, только показываем placeholder
      if (videoState.isMobile) {
        setVideoState(prev => ({
          ...prev,
          visible: new Set([...prev.visible, videoId]),
          loaded: new Set([...prev.loaded, videoId])
        }));
        currentlyLoadingRef.current--;
        // Не вызываем рекурсивно, чтобы избежать бесконечного цикла
        setTimeout(() => processLoadingQueue(), 0);
        continue;
      }

      const handleCanPlay = () => {
        setVideoState(prev => ({
          ...prev,
          visible: new Set([...prev.visible, videoId]),
          loaded: new Set([...prev.loaded, videoId])
        }));
        currentlyLoadingRef.current--;
        // Загружаем следующее из очереди
        setTimeout(() => processLoadingQueue(), 50);
      };

      const handleError = () => {
        if (import.meta.env.DEV) {
          console.warn('Video failed to load:', videoId);
        }
        setVideoState(prev => ({
          ...prev,
          loaded: new Set([...prev.loaded, videoId])
        }));
        currentlyLoadingRef.current--;
        setTimeout(() => processLoadingQueue(), 50);
      };

      videoEl.addEventListener('canplay', handleCanPlay, { once: true });
      videoEl.addEventListener('error', handleError, { once: true });
      videoEl.preload = 'metadata';

      if (videoEl.dataset.src) {
        videoEl.src = videoEl.dataset.src;
        videoEl.load();
      }
    }
  }, [videoState.isMobile, MAX_CONCURRENT_LOADS]);

  // Наблюдаем за видео элементами при смене таба
  useEffect(() => {
    if (!observerRef.current) return;

    // Небольшая задержка, чтобы дать время DOM обновиться
    const timeoutId = setTimeout(() => {
      // Очищаем очередь и останавливаем текущие загрузки
      loadingQueueRef.current = [];
      currentlyLoadingRef.current = 0;

      // Подключаем observer к видео активного таба
      videoRefs.current.forEach((videoEl, videoId) => {
        if (!observerRef.current) return;

        if (videoId.startsWith(activeTab)) {
          // Наблюдаем за видео активного таба
          observerRef.current.observe(videoEl);
        } else {
          // Отключаем наблюдение за видео других табов
          observerRef.current.unobserve(videoEl);
        }
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [activeTab]);

  // Упрощенные обработчики для hover
  const handleVideoMouseEnter = useCallback((e, subsectionId) => {
    // На мобильных не запускаем видео при hover
    if (videoState.isMobile) return;

    if (subsectionId === 'motion' || subsectionId === 'production') {
      const video = e.currentTarget.querySelector('video');
      if (video) {
        safePlayVideo(video);
      }
    }
  }, [videoState.isMobile]);

  const handleVideoMouseLeave = useCallback((e, subsectionId) => {
    if (subsectionId === 'motion' || subsectionId === 'production') {
      const video = e.currentTarget.querySelector('video');
      if (video) {
        safePauseVideo(video, true);
      }
    }
  }, []);

  // НОВОЕ: Обработчик клика на poster для мобильных
  const handlePosterClick = useCallback((videoId, videoSrc) => {
    if (!videoState.isMobile) return;

    // Помечаем, что это видео должно воспроизводиться
    setVideoState(prev => ({
      ...prev,
      playingOnMobile: new Set([...prev.playingOnMobile, videoId])
    }));

    // Добавляем в очередь загрузки
    if (!loadingQueueRef.current.includes(videoId)) {
      loadingQueueRef.current.push(videoId);
      processLoadingQueue();
    }
  }, [videoState.isMobile, processLoadingQueue]);

  // НОВОЕ: Функция для получения пути к poster изображению
  const getPosterPath = useCallback((videoPath) => {
    if (!videoPath) return '';
    // Из /img/projects/motion-1.webm получаем motion-1
    const videoName = videoPath.split('/').pop().replace('.webm', '');
    // Пытаемся использовать WebP, fallback на JPG
    return `/img/projects/posters/${videoName}-poster.webp`;
  }, []);

  // НОВОЕ: Компонент для рендеринга видео или poster
  const renderVideoOrPoster = useCallback((subsection, index) => {
    const project = subsection.projects[index];
    const videoId = `${subsection.id}-${index}`;

    if (!project.video) return null;

    const isPlaying = videoState.playingOnMobile.has(videoId);
    const shouldShowPoster = videoState.isMobile && !isPlaying;

    if (shouldShowPoster) {
      // МОБИЛЬНЫЕ: Poster с кнопкой Play
      return (
        <div
          className="absolute inset-0 w-full h-full cursor-pointer group"
          onClick={() => handlePosterClick(videoId, project.video)}
        >
          <img
            src={getPosterPath(project.video)}
            alt={subsection.title[i18n.language] || subsection.title.en}
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              if (e.target.src.endsWith('.webp')) {
                e.target.src = e.target.src.replace('.webp', '.jpg');
              }
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-active:bg-black/40 transition-colors">
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-active:scale-95 transition-transform">
              <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>
      );
    }

    // ДЕСКТОП или ВОСПРОИЗВЕДЕНИЕ: Видео элемент
    return (
      <video
        ref={el => {
          if (el) {
            videoRefs.current.set(videoId, el);
            el.dataset.videoId = videoId;
          }
        }}
        data-src={project.video}
        loop
        muted
        playsInline
        autoPlay={isPlaying}
        preload="none"
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ease-out ${
          videoState.visible.has(videoId) ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          visibility: videoState.visible.has(videoId) ? 'visible' : 'hidden'
        }}
      />
    );
  }, [videoState, handlePosterClick, getPosterPath, i18n.language]);

  // Получаем размеры для элементов коллажа
  const getSizeClasses = (size) => {
    switch (size) {
      case 'a':
        return 'flex-[3]'; // размер "а" - 60% высоты (3 части из 5)
      case 'b':
        return 'flex-[2]'; // размер "б" - 40% высоты (2 части из 5)
      case 'c':
        return 'h-full'; // размер "с" - на всю высоту контейнера
      default:
        return 'flex-[2]';
    }
  };

  return (
    <section id="projects" className="bg-black text-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">

        {/* Заголовок секции */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm uppercase tracking-widest text-white/80 backdrop-blur-sm mb-4">
            {t('projects.subtitle')}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-white">
              {t('projects.title')}
            </span>
          </h1>
        </motion.div>

        {/* Табы */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {subsections.map((subsection) => (
              <button
                key={subsection.id}
                onClick={() => setActiveTab(subsection.id)}
                className={`relative px-6 py-3 text-lg md:text-xl font-semibold transition-all duration-300 ${
                  activeTab === subsection.id
                    ? 'text-white'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                {subsection.title[i18n.language] || subsection.title.en}

                {/* Подчеркивание для активной вкладки */}
                {activeTab === subsection.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                    layoutId="activeTab"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Контент активной вкладки */}
        <AnimatePresence mode="wait">
          {subsections
            .filter(subsection => subsection.id === activeTab)
            .map((subsection) => (
              <motion.div
                key={subsection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Коллаж - 3 колонки */}
                <div className="w-full aspect-[3/1] flex gap-[5px]">
                  {/* Первая колонка - 2 ряда */}
                  <div className="flex flex-col gap-[5px] flex-1">
                    <motion.div
                      className={`relative overflow-hidden ${getSizeClasses(subsection.projects[0].size)} w-full min-h-0`}
                      style={{ backgroundColor: subsection.projects[0].color }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.2,
                        delay: 0,
                        ease: "easeOut"
                      }}
                      onMouseEnter={(e) => handleVideoMouseEnter(e, subsection.id)}
                      onMouseLeave={(e) => handleVideoMouseLeave(e, subsection.id)}
                    >
                      {(subsection.id === 'steppe-coffee' || subsection.id === 'identity' || subsection.id === 'design-works') && subsection.projects[0].image && (
                        <img
                          src={subsection.projects[0].image}
                          alt={subsection.title[i18n.language] || subsection.title.en}
                          className="absolute inset-0 w-full h-full object-cover object-center"
                          loading="lazy"
                          decoding="async"
                          fetchPriority="low"
                        />
                      )}
                      {(subsection.id === 'motion' || subsection.id === 'production') && renderVideoOrPoster(subsection, 0)}
                    </motion.div>
                    <motion.div
                      className={`relative overflow-hidden ${getSizeClasses(subsection.projects[1].size)} w-full min-h-0`}
                      style={{ backgroundColor: subsection.projects[1].color }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.2,
                        delay: 0.03,
                        ease: "easeOut"
                      }}
                      onMouseEnter={(e) => handleVideoMouseEnter(e, subsection.id)}
                      onMouseLeave={(e) => handleVideoMouseLeave(e, subsection.id)}
                    >
                      {(subsection.id === 'steppe-coffee' || subsection.id === 'identity' || subsection.id === 'design-works') && subsection.projects[1].image && (
                        <img
                          src={subsection.projects[1].image}
                          alt={subsection.title[i18n.language] || subsection.title.en}
                          className="absolute inset-0 w-full h-full object-cover object-center"
                          loading="lazy"
                          decoding="async"
                          fetchPriority="low"
                        />
                      )}
                      {(subsection.id === 'motion' || subsection.id === 'production') && renderVideoOrPoster(subsection, 1)}
                    </motion.div>
                  </div>

                  {/* Вторая колонка - 2 ряда */}
                  <div className="flex flex-col gap-[5px] flex-1">
                    <motion.div
                      className={`relative overflow-hidden ${getSizeClasses(subsection.projects[2].size)} w-full min-h-0`}
                      style={{ backgroundColor: subsection.projects[2].color }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.2,
                        delay: 0.06,
                        ease: "easeOut"
                      }}
                      onMouseEnter={(e) => handleVideoMouseEnter(e, subsection.id)}
                      onMouseLeave={(e) => handleVideoMouseLeave(e, subsection.id)}
                    >
                      {(subsection.id === 'steppe-coffee' || subsection.id === 'identity' || subsection.id === 'design-works') && subsection.projects[2].image && (
                        <img
                          src={subsection.projects[2].image}
                          alt={subsection.title[i18n.language] || subsection.title.en}
                          className="absolute inset-0 w-full h-full object-cover object-center"
                          loading="lazy"
                          decoding="async"
                          fetchPriority="low"
                        />
                      )}
                      {(subsection.id === 'motion' || subsection.id === 'production') && renderVideoOrPoster(subsection, 2)}
                    </motion.div>
                    <motion.div
                      className={`relative overflow-hidden ${getSizeClasses(subsection.projects[3].size)} w-full min-h-0`}
                      style={{ backgroundColor: subsection.projects[3].color }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.2,
                        delay: 0.09,
                        ease: "easeOut"
                      }}
                      onMouseEnter={(e) => handleVideoMouseEnter(e, subsection.id)}
                      onMouseLeave={(e) => handleVideoMouseLeave(e, subsection.id)}
                    >
                      {(subsection.id === 'steppe-coffee' || subsection.id === 'identity' || subsection.id === 'design-works') && subsection.projects[3].image && (
                        <img
                          src={subsection.projects[3].image}
                          alt={subsection.title[i18n.language] || subsection.title.en}
                          className="absolute inset-0 w-full h-full object-cover object-center"
                          loading="lazy"
                          decoding="async"
                          fetchPriority="low"
                        />
                      )}
                      {(subsection.id === 'motion' || subsection.id === 'production') && renderVideoOrPoster(subsection, 3)}
                    </motion.div>
                  </div>

                  {/* Третья колонка - 1 ряд на всю высоту */}
                  <div className="flex flex-col flex-1">
                    <motion.div
                      className={`relative overflow-hidden ${getSizeClasses(subsection.projects[4].size)} w-full min-h-0`}
                      style={{ backgroundColor: subsection.projects[4].color }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.2,
                        delay: 0.12,
                        ease: "easeOut"
                      }}
                      onMouseEnter={(e) => handleVideoMouseEnter(e, subsection.id)}
                      onMouseLeave={(e) => handleVideoMouseLeave(e, subsection.id)}
                    >
                      {(subsection.id === 'steppe-coffee' || subsection.id === 'identity' || subsection.id === 'design-works') && subsection.projects[4].image && (
                        <img
                          src={subsection.projects[4].image}
                          alt={subsection.title[i18n.language] || subsection.title.en}
                          className="absolute inset-0 w-full h-full object-cover object-center"
                          loading="lazy"
                          decoding="async"
                          fetchPriority="low"
                        />
                      )}
                      {(subsection.id === 'motion' || subsection.id === 'production') && renderVideoOrPoster(subsection, 4)}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </section>
  );
});

ProjectsSection.displayName = 'ProjectsSection';

export default ProjectsSection;