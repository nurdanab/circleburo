import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { safePlayVideo, safePauseVideo } from '../../utils/videoUtils';

const ProjectsSection = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('steppe-coffee');
  const [loadedVideos, setLoadedVideos] = useState(new Set());
  const [visibleVideos, setVisibleVideos] = useState(new Set()); // Новое состояние для видимости
  const videoRefs = useRef(new Map());

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

  // Агрессивная загрузка видео - начинаем загружать при смене вкладки
  useEffect(() => {
    const observers = new Map();

    // Сразу помечаем все видео текущей вкладки как загружаемые
    const currentTabVideos = new Set();
    subsections.find(s => s.id === activeTab)?.projects.forEach((_, index) => {
      currentTabVideos.add(`${activeTab}-${index}`);
    });

    setLoadedVideos(prev => new Set([...prev, ...currentTabVideos]));

    videoRefs.current.forEach((videoEl, videoId) => {
      if (!videoEl || !videoId.startsWith(activeTab)) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Плавное появление видео
            setTimeout(() => {
              setVisibleVideos(prev => new Set([...prev, videoId]));
            }, 100);

            // Загружаем видео
            if (videoEl.paused && videoEl.readyState < 2) {
              videoEl.load();
            }
            observer.disconnect();
          }
        },
        {
          rootMargin: '200px', // Увеличенный margin для раннего старта
          threshold: 0.01
        }
      );

      observer.observe(videoEl);
      observers.set(videoId, observer);
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [activeTab, subsections]);

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
                      className={`relative overflow-hidden ${(subsection.id === 'motion' || subsection.id === 'production') ? '' : 'cursor-pointer'} ${getSizeClasses(subsection.projects[0].size)} w-full min-h-0`}
                      style={{ backgroundColor: subsection.projects[0].color, willChange: 'opacity' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: 0,
                        ease: "easeOut"
                      }}
                      onMouseEnter={(e) => {
                        if (subsection.id === 'motion' || subsection.id === 'production') {
                          const video = e.currentTarget.querySelector('video');
                          safePlayVideo(video);
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (subsection.id === 'motion' || subsection.id === 'production') {
                          const video = e.currentTarget.querySelector('video');
                          safePauseVideo(video, true);
                        }
                      }}
                    >
                      {(subsection.id === 'steppe-coffee' || subsection.id === 'identity' || subsection.id === 'design-works') && subsection.projects[0].image && (
                        <img
                          src={subsection.projects[0].image}
                          alt={subsection.title[i18n.language] || subsection.title.en}
                          className="absolute inset-0 w-full h-full object-cover object-center"
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                      {(subsection.id === 'motion' || subsection.id === 'production') && subsection.projects[0].video && (
                        <video
                          ref={el => {
                            if (el) videoRefs.current.set(`${subsection.id}-0`, el);
                          }}
                          {...(loadedVideos.has(`${subsection.id}-0`) && { src: subsection.projects[0].video })}
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-out ${
                            visibleVideos.has(`${subsection.id}-0`) ? 'opacity-100' : 'opacity-0'
                          }`}
                          style={{
                            visibility: visibleVideos.has(`${subsection.id}-0`) ? 'visible' : 'hidden'
                          }}
                        />
                      )}
                      {subsection.id === 'steppe-coffee' && (
                        <Link to="/case" className="absolute inset-0 z-10" />
                      )}
                    </motion.div>
                    <motion.div
                      className={`relative overflow-hidden ${(subsection.id === 'motion' || subsection.id === 'production') ? '' : 'cursor-pointer'} ${getSizeClasses(subsection.projects[1].size)} w-full min-h-0`}
                      style={{ backgroundColor: subsection.projects[1].color, willChange: 'opacity' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.05,
                        ease: "easeOut"
                      }}
                      onMouseEnter={(e) => {
                        if (subsection.id === 'motion' || subsection.id === 'production') {
                          const video = e.currentTarget.querySelector('video');
                          safePlayVideo(video);
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (subsection.id === 'motion' || subsection.id === 'production') {
                          const video = e.currentTarget.querySelector('video');
                          safePauseVideo(video, true);
                        }
                      }}
                    >
                      {(subsection.id === 'steppe-coffee' || subsection.id === 'identity' || subsection.id === 'design-works') && subsection.projects[1].image && (
                        <img
                          src={subsection.projects[1].image}
                          alt={subsection.title[i18n.language] || subsection.title.en}
                          className="absolute inset-0 w-full h-full object-cover object-center"
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                      {(subsection.id === 'motion' || subsection.id === 'production') && subsection.projects[1].video && (
                        <video
                          ref={el => {
                            if (el) videoRefs.current.set(`${subsection.id}-1`, el);
                          }}
                          {...(loadedVideos.has(`${subsection.id}-1`) && { src: subsection.projects[1].video })}
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-out ${
                            visibleVideos.has(`${subsection.id}-1`) ? 'opacity-100' : 'opacity-0'
                          }`}
                          style={{
                            visibility: visibleVideos.has(`${subsection.id}-1`) ? 'visible' : 'hidden'
                          }}
                        />
                      )}
                      {subsection.id === 'steppe-coffee' && (
                        <Link to="/case" className="absolute inset-0 z-10" />
                      )}
                    </motion.div>
                  </div>

                  {/* Вторая колонка - 2 ряда */}
                  <div className="flex flex-col gap-[5px] flex-1">
                    <motion.div
                      className={`relative overflow-hidden ${(subsection.id === 'motion' || subsection.id === 'production') ? '' : 'cursor-pointer'} ${getSizeClasses(subsection.projects[2].size)} w-full min-h-0`}
                      style={{ backgroundColor: subsection.projects[2].color, willChange: 'opacity' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.1,
                        ease: "easeOut"
                      }}
                      onMouseEnter={(e) => {
                        if (subsection.id === 'motion' || subsection.id === 'production') {
                          const video = e.currentTarget.querySelector('video');
                          safePlayVideo(video);
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (subsection.id === 'motion' || subsection.id === 'production') {
                          const video = e.currentTarget.querySelector('video');
                          safePauseVideo(video, true);
                        }
                      }}
                    >
                      {(subsection.id === 'steppe-coffee' || subsection.id === 'identity' || subsection.id === 'design-works') && subsection.projects[2].image && (
                        <img
                          src={subsection.projects[2].image}
                          alt={subsection.title[i18n.language] || subsection.title.en}
                          className="absolute inset-0 w-full h-full object-cover object-center"
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                      {(subsection.id === 'motion' || subsection.id === 'production') && subsection.projects[2].video && (
                        <video
                          ref={el => {
                            if (el) videoRefs.current.set(`${subsection.id}-2`, el);
                          }}
                          {...(loadedVideos.has(`${subsection.id}-2`) && { src: subsection.projects[2].video })}
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-out ${
                            visibleVideos.has(`${subsection.id}-2`) ? 'opacity-100' : 'opacity-0'
                          }`}
                          style={{
                            visibility: visibleVideos.has(`${subsection.id}-2`) ? 'visible' : 'hidden'
                          }}
                        />
                      )}
                      {subsection.id === 'steppe-coffee' && (
                        <Link to="/case" className="absolute inset-0 z-10" />
                      )}
                    </motion.div>
                    <motion.div
                      className={`relative overflow-hidden ${(subsection.id === 'motion' || subsection.id === 'production') ? '' : 'cursor-pointer'} ${getSizeClasses(subsection.projects[3].size)} w-full min-h-0`}
                      style={{ backgroundColor: subsection.projects[3].color, willChange: 'opacity' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.15,
                        ease: "easeOut"
                      }}
                      onMouseEnter={(e) => {
                        if (subsection.id === 'motion' || subsection.id === 'production') {
                          const video = e.currentTarget.querySelector('video');
                          safePlayVideo(video);
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (subsection.id === 'motion' || subsection.id === 'production') {
                          const video = e.currentTarget.querySelector('video');
                          safePauseVideo(video, true);
                        }
                      }}
                    >
                      {(subsection.id === 'steppe-coffee' || subsection.id === 'identity' || subsection.id === 'design-works') && subsection.projects[3].image && (
                        <img
                          src={subsection.projects[3].image}
                          alt={subsection.title[i18n.language] || subsection.title.en}
                          className="absolute inset-0 w-full h-full object-cover object-center"
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                      {(subsection.id === 'motion' || subsection.id === 'production') && subsection.projects[3].video && (
                        <video
                          ref={el => {
                            if (el) videoRefs.current.set(`${subsection.id}-3`, el);
                          }}
                          {...(loadedVideos.has(`${subsection.id}-3`) && { src: subsection.projects[3].video })}
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-out ${
                            visibleVideos.has(`${subsection.id}-3`) ? 'opacity-100' : 'opacity-0'
                          }`}
                          style={{
                            visibility: visibleVideos.has(`${subsection.id}-3`) ? 'visible' : 'hidden'
                          }}
                        />
                      )}
                      {subsection.id === 'steppe-coffee' && (
                        <Link to="/case" className="absolute inset-0 z-10" />
                      )}
                    </motion.div>
                  </div>

                  {/* Третья колонка - 1 ряд на всю высоту */}
                  <div className="flex flex-col flex-1">
                    <motion.div
                      className={`relative overflow-hidden ${(subsection.id === 'motion' || subsection.id === 'production') ? '' : 'cursor-pointer'} ${getSizeClasses(subsection.projects[4].size)} w-full min-h-0`}
                      style={{ backgroundColor: subsection.projects[4].color, willChange: 'opacity' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.2,
                        ease: "easeOut"
                      }}
                      onMouseEnter={(e) => {
                        if (subsection.id === 'motion' || subsection.id === 'production') {
                          const video = e.currentTarget.querySelector('video');
                          safePlayVideo(video);
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (subsection.id === 'motion' || subsection.id === 'production') {
                          const video = e.currentTarget.querySelector('video');
                          safePauseVideo(video, true);
                        }
                      }}
                    >
                      {(subsection.id === 'steppe-coffee' || subsection.id === 'identity' || subsection.id === 'design-works') && subsection.projects[4].image && (
                        <img
                          src={subsection.projects[4].image}
                          alt={subsection.title[i18n.language] || subsection.title.en}
                          className="absolute inset-0 w-full h-full object-cover object-center"
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                      {(subsection.id === 'motion' || subsection.id === 'production') && subsection.projects[4].video && (
                        <video
                          ref={el => {
                            if (el) videoRefs.current.set(`${subsection.id}-4`, el);
                          }}
                          {...(loadedVideos.has(`${subsection.id}-4`) && { src: subsection.projects[4].video })}
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-out ${
                            visibleVideos.has(`${subsection.id}-4`) ? 'opacity-100' : 'opacity-0'
                          }`}
                          style={{
                            visibility: visibleVideos.has(`${subsection.id}-4`) ? 'visible' : 'hidden'
                          }}
                        />
                      )}
                      {subsection.id === 'steppe-coffee' && (
                        <Link to="/case" className="absolute inset-0 z-10" />
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProjectsSection;