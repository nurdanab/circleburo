import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useTranslation } from "react-i18next";
import { getMediaUrl } from '../utils/media';

const SectionFive = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const videoRefs = useRef([]);
  const initializedRefs = useRef(new Set());
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Массив видео (пока все одинаковые)
  const videos = [
    { id: 1, src: getMediaUrl("videos/prod1.mp4"), title: "Production 1" },
    { id: 2, src: getMediaUrl("videos/production2.mp4"), title: "Production 2" },
    { id: 3, src: getMediaUrl("videos/production3.mp4"), title: "Production 3" },
  ];

  // Проверка размера экрана
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Автоматическое воспроизведение текущего видео
  useEffect(() => {
    const video = videoRefs.current[currentVideo];

    if (video) {
      // Проверяем, достаточно ли данных для воспроизведения
      const attemptPlay = () => {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      };

      // Если видео уже загружено, воспроизводим сразу
      if (video.readyState >= 3) {
        attemptPlay();
      } else {
        // Иначе ждем, когда будет достаточно данных
        video.addEventListener('loadeddata', attemptPlay, { once: true });
      }
    }
  }, [currentVideo]);

  // Автоматическое переключение на следующее видео
  useEffect(() => {
    const video = videoRefs.current[currentVideo];
    if (!video) return;

    const handleEnded = () => {
      // Автоматически переключаемся на следующее видео
      const nextIndex = currentVideo < videos.length - 1 ? currentVideo + 1 : 0;
      const currentVideoEl = videoRefs.current[currentVideo];
      const nextVideoEl = videoRefs.current[nextIndex];

      if (currentVideoEl) {
        currentVideoEl.pause();
        currentVideoEl.currentTime = 0;
      }

      gsap.to(currentVideoEl, {
        opacity: 0,
        duration: 0.4,
        onComplete: () => {
          setCurrentVideo(nextIndex);
          gsap.fromTo(
            nextVideoEl,
            { opacity: 0 },
            { opacity: 1, duration: 0.4 }
          );
        },
      });
    };

    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentVideo, videos.length]);

  // Анимация появления секции
  useGSAP(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      }
    );
  }, { scope: sectionRef });

  // Переключение видео с анимацией
  const switchVideo = (newIndex) => {
    const currentVideoEl = videoRefs.current[currentVideo];
    const nextVideoEl = videoRefs.current[newIndex];

    if (currentVideoEl) {
      currentVideoEl.pause();
      currentVideoEl.currentTime = 0;
    }

    // Анимация перехода
    gsap.to(currentVideoEl, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        setCurrentVideo(newIndex);
        gsap.fromTo(
          nextVideoEl,
          { opacity: 0 },
          { opacity: 1, duration: 0.4 }
        );
      },
    });
  };

  const handlePrevious = () => {
    const newIndex = currentVideo > 0 ? currentVideo - 1 : videos.length - 1;
    switchVideo(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentVideo < videos.length - 1 ? currentVideo + 1 : 0;
    switchVideo(newIndex);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: "#000000" }}
    >
      {/* Видео контейнеры */}
      <div className="absolute inset-0 z-0">
        {videos.map((video, index) => (
          <video
            key={video.id}
            ref={(el) => {
              videoRefs.current[index] = el;
              // Устанавливаем начальную opacity через GSAP только один раз
              if (el && !initializedRefs.current.has(index)) {
                gsap.set(el, { opacity: index === 0 ? 1 : 0 });
                initializedRefs.current.add(index);
              }
            }}
            className="absolute inset-0 w-full h-full object-cover"
            src={video.src}
            autoPlay={index === 0}
            playsInline
            muted
            loop={false}
            preload="auto"
            style={{
              pointerEvents: index === currentVideo ? "auto" : "none",
            }}
          />
        ))}
      </div>

      {/* Контролы - только стрелки навигации */}
      <div className="absolute inset-0 z-20 flex items-center justify-between px-6 md:px-12">
        {/* Кнопка назад */}
        <button
          onClick={handlePrevious}
          className="group w-12 h-12 md:w-16 md:h-16 bg-white bg-opacity-10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-300 hover:scale-110"
          aria-label="Previous video"
        >
          <svg
            width={isMobile ? "24" : "32"}
            height={isMobile ? "24" : "32"}
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:scale-110 transition-transform"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Кнопка вперед */}
        <button
          onClick={handleNext}
          className="group w-12 h-12 md:w-16 md:h-16 bg-white bg-opacity-10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-300 hover:scale-110"
          aria-label="Next video"
        >
          <svg
            width={isMobile ? "24" : "32"}
            height={isMobile ? "24" : "32"}
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:scale-110 transition-transform"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default SectionFive;
