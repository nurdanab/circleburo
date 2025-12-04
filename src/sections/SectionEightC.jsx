import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
import { getMediaUrl } from '../utils/media';

gsap.registerPlugin(ScrollTrigger);

const SectionEightC = () => {
  const { t } = useTranslation();
  const videoSrc = getMediaUrl("videos/arc-video3.mp4");
  const index = 0;

  // Рефы для секции
  const sectionRef = useRef(null);
  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);
  const titleRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useGSAP(() => {
    if (!sectionRef.current || !videoContainerRef.current || !titleRef.current) return;

    const endScale = isMobile ? 0.85 : isTablet ? 0.75 : 0.65;
    const borderRadius = isMobile ? "16px" : isTablet ? "24px" : "32px";
    const scrubValue = 1;

    // Устанавливаем начальное состояние для videoContainer
    gsap.set(videoContainerRef.current, {
      scale: 1,
      borderRadius: "0px",
    });

    // Устанавливаем начальное состояние для title
    gsap.set(titleRef.current, {
      opacity: 1,
    });

    // Загружаем видео и обновляем ScrollTrigger
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.addEventListener('loadedmetadata', () => {
        ScrollTrigger.refresh();
      }, { once: true });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: scrubValue,
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: index,
        markers: false,
        onEnter: () => {
          if (videoRef.current) {
            videoRef.current.play().catch(() => {});
          }
        },
        onEnterBack: () => {
          if (videoRef.current) {
            videoRef.current.play().catch(() => {});
          }
        },
        onLeave: () => {
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
          }
        },
        onLeaveBack: () => {
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
          }
        },
      },
    });

    // Видео начинается на весь экран (scale: 1) и плавно уменьшается
    tl.to(
      videoContainerRef.current,
      {
        scale: endScale,
        borderRadius: borderRadius,
        ease: "none",
      },
      0
    );

    // Заголовок исчезает плавно
    tl.to(
      titleRef.current,
      {
        opacity: 0,
        ease: "none",
      },
      "<"
    );

    // Обновляем ScrollTrigger после небольшой задержки для корректной работы с LazySection
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(refreshTimeout);
      if (tl) tl.kill();
    };
  }, [isMobile, isTablet, index, videoSrc]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{
        backgroundColor: "#F6EDCE",
        willChange: "transform",
        zIndex: 2 + index,
      }}
    >
      <div
        ref={videoContainerRef}
        className="relative w-full h-full flex items-center justify-center"
        style={{
          transformOrigin: "center center",
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden"
        }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={videoSrc}
          loop
          muted
          playsInline
          preload="metadata"
          disablePictureInPicture
          disableRemotePlayback
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden"
          }}
        />

        <div
          ref={titleRef}
          className="relative z-10 text-center text-white px-6"
        >
          <h2
            className="text-3xl md:text-7xl lg:text-8xl font-bold"
            style={{ fontFamily: "Lilita One, sans-serif" }}
          >
            GALERIYA
          </h2>
        </div>
      </div>
    </section>
  );
};

export default SectionEightC;