import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ProjectsSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);
  const videosRef = useRef(new Map());
  const [MotionDiv, setMotionDiv] = useState(() => 'div');
  const [isMobile, setIsMobile] = useState(false);

  // Перемещаем projectsData наверх
  const projectsData = [
    {
      id: 1,
      media: '/img/projects/case1.webp',
      mediaType: 'image',
      title: t('projects.before'),
      link: '/project'
    },
    {
      id: 2,
      media: '/img/projects/case2.mp4',
      mediaType: 'video',
      title: t('projects.process'),
      link: '/project'
    },
    {
      id: 3,
      media: '/img/projects/3case.webp',
      mediaType: 'image',
      title: t('projects.after'),
      link: '/project'
    },
  ];

  useEffect(() => {
    // Lazy-load framer-motion when section is near viewport
    const loadMotion = () => {
      import('framer-motion')
        .then(mod => {
          if (mod && mod.motion && mod.motion.div) {
            setMotionDiv(() => mod.motion.div);
          }
        })
        .catch(() => {
          setMotionDiv(() => 'div');
        });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadMotion();
          observer.disconnect();
        }
      });
    }, { rootMargin: '400px' });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    } else {
      // Fallback: idle
      if ('requestIdleCallback' in window) {
        requestIdleCallback(loadMotion);
      } else {
        setTimeout(loadMotion, 0);
      }
    }

    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const updateMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateMobile();
    window.addEventListener('resize', updateMobile);

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
      if (!sectionRef.current || !cardsRef.current) return;

      const section = sectionRef.current;
      const cards = cardsRef.current;
      const rect = section.getBoundingClientRect();

      // Вычисляем прогресс скролла через секцию (от 0 до 1)
      const sectionTop = rect.top;
      const totalScrollDistance = window.innerHeight * 1; // 200vh - 100vh = 100vh

      // Определяем прогресс скролла
      let progress = 0;
      if (sectionTop <= 0 && sectionTop >= -totalScrollDistance) {
        progress = Math.abs(sectionTop) / totalScrollDistance;
      } else if (sectionTop < -totalScrollDistance) {
        progress = 1;
      }

      // Вычисляем максимальное расстояние для горизонтального скролла
      const cardWidth = isMobile ? 300 + 24 : 400 + 32; // ширина карточки + gap
      const totalCardsWidth = cardWidth * projectsData.length;
      const containerWidth = window.innerWidth - (isMobile ? 32 : 64); // minus padding
      const maxTranslateX = Math.max(0, totalCardsWidth - containerWidth);

      // Применяем плавную трансформацию с easing
      const easeProgress = progress * progress * (3.0 - 2.0 * progress); // smooth step function
      const translateX = -easeProgress * maxTranslateX;
      cards.style.transform = `translateX(${translateX}px)`;
      cards.style.transition = 'transform 0.1s ease-out';
      ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Инициализация

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateMobile);
    };
  }, [isMobile, projectsData.length]);

  // Lazy control video playback with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (!(video instanceof HTMLVideoElement)) return;
        if (entry.isIntersecting) {
          // Attempt play; ignore errors on autoplay policies
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.25 });

    videosRef.current.forEach((videoEl) => {
      if (videoEl) observer.observe(videoEl);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative">
      {/* Wrapper с оптимизированной высотой для контроля скролла */}
      <div className="h-[200vh] relative">
        <section
          ref={sectionRef}
          id="projects"
          className="sticky top-0 h-screen bg-black text-white flex items-center overflow-hidden"
        >
      <div className="w-full px-4 md:px-8">
        {/* Заголовок */}
        <MotionDiv
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
        </MotionDiv>

        {/* Контейнер для горизонтальной прокрутки карточек */}
        <div className="relative w-full overflow-hidden">
          <div
            ref={cardsRef}
            className="flex gap-6 md:gap-8"
            style={{ width: 'max-content' }}
          >
          {projectsData.map((project, index) => (
            <MotionDiv
              key={project.id}
              className="group relative aspect-[3/2] rounded-2xl overflow-hidden flex-shrink-0"
              style={{
                width: isMobile ? '300px' : '400px',
                height: isMobile ? '200px' : '267px'
              }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: "easeOut"
              }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{
                scale: 1.03,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              {/* Медиа контент */}
              {project.mediaType === 'video' ? (
                <video
                  ref={(el) => { if (el) videosRef.current.set(project.id, el); }}
                  src={project.media}
                  preload="none"
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              ) : (
                <img
                  src={project.media}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  loading="lazy"
                  decoding="async"
                  fetchpriority="low"
                  width={isMobile ? 300 : 400}
                  height={isMobile ? 200 : 267}
                />
              )}

              {/* Overlay градиент */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

              {/* Контент поверх медиа */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {project.title}
                </h3>
                <div className="w-12 h-1 bg-white rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>

              {/* Ссылка */}
              <Link to={project.link} className="absolute inset-0 z-10" />
            </MotionDiv>
          ))}
          </div>
        </div>
      </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectsSection;