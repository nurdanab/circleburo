import { useRef, useMemo, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
import { getGSAPConfig } from "../utils/devicePerformance";
import { getMediaUrl } from '../utils/media';

const SectionSix = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const textListRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Определяем тип устройства
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Получаем настройки производительности
  const gsapConfig = useMemo(() => getGSAPConfig(), []);

  // Тексты для каждого этапа анимации
  const textStages = [
    { mainKey: "sectionSix.stages.design.main", subKey: "sectionSix.stages.design.sub" },
    { mainKey: "sectionSix.stages.graphics.main", subKey: "sectionSix.stages.graphics.sub" },
    { mainKey: "sectionSix.stages.illustration.main", subKey: "sectionSix.stages.illustration.sub" },
    { mainKey: "sectionSix.stages.motion.main", subKey: "sectionSix.stages.motion.sub" },
  ];

  // Все изображения
  const allImages = [
    getMediaUrl("img/design/1d.png"),
    getMediaUrl("img/design/2d.png"),
    getMediaUrl("img/design/3d.png"),
    getMediaUrl("img/design/4d.png"),
    getMediaUrl("img/design/5d.png"),
    getMediaUrl("img/design/6d.png"),
    getMediaUrl("img/design/7d.png"),
    getMediaUrl("img/design/8d.png"),
    getMediaUrl("img/design/9d.png"),
    getMediaUrl("img/design/10d.png"),
    getMediaUrl("img/design/11d.png"),
    getMediaUrl("img/design/12d.png"),
    getMediaUrl("img/design/13d.png"),
    getMediaUrl("img/design/14d.png"),
    getMediaUrl("img/design/15d.png"),
    getMediaUrl("img/design/16d.jpeg"),
    getMediaUrl("img/design/17d.png"),
    getMediaUrl("img/design/18d.png"),
    getMediaUrl("img/design/19d.png"),
    getMediaUrl("img/design/20d.png"),
    getMediaUrl("img/design/21d.png"),
    getMediaUrl("img/design/22d.png"),
  ];

  // Адаптивные позиции для разных устройств
  const getPositions = useMemo(() => {
    // Мобильные устройства (< 768px) - 2 колонки
    const mobilePositions = [
      { top: "3%", left: "3%", size: "40vw" },
      { top: "3%", right: "5%", size: "40vw" },
      { top: "18%", left: "7%", size: "20vw" },
      { top: "3%", right: "20%", size: "40vw" },
      { top: "33%", left: "5%", size: "40vw" },
      { top: "33%", right: "5%", size: "40vw" },
      { top: "48%", left: "5%", size: "40vw" },
      { top: "48%", right: "5%", size: "40vw" },
      { top: "63%", left: "5%", size: "40vw" },
      { top: "63%", right: "5%", size: "40vw" },
      { top: "78%", left: "5%", size: "40vw" },
      { top: "78%", right: "5%", size: "40vw" },
      { top: "93%", left: "5%", size: "40vw" },
      { top: "93%", right: "5%", size: "40vw" },
      { top: "108%", left: "5%", size: "40vw" },
      { top: "108%", right: "5%", size: "40vw" },
      { top: "123%", left: "5%", size: "40vw" },
      { top: "123%", right: "5%", size: "40vw" },
      { top: "138%", left: "5%", size: "40vw" },
      { top: "138%", right: "5%", size: "40vw" },
      { top: "153%", left: "5%", size: "40vw" },
      { top: "153%", right: "5%", size: "40vw" },
    ];

    // Планшеты (768px - 1024px)
    const tabletPositions = [
      { top: "2%", left: "4%", size: "200px" },
      { top: "2%", right: "4%", size: "200px" },
      { top: "12%", left: "8%", size: "220px" },
      { top: "12%", right: "8%", size: "220px" },
      { top: "24%", left: "3%", size: "210px" },
      { top: "24%", right: "3%", size: "210px" },
      { top: "36%", left: "10%", size: "230px" },
      { top: "36%", right: "10%", size: "230px" },
      { top: "50%", left: "5%", size: "205px" },
      { top: "50%", right: "5%", size: "205px" },
      { top: "62%", left: "12%", size: "215px" },
      { top: "62%", right: "12%", size: "215px" },
      { top: "75%", left: "4%", size: "225px" },
      { top: "75%", right: "4%", size: "225px" },
      { top: "88%", left: "9%", size: "210px" },
      { top: "88%", right: "9%", size: "210px" },
      { top: "102%", left: "6%", size: "220px" },
      { top: "102%", right: "6%", size: "220px" },
      { top: "116%", left: "11%", size: "205px" },
      { top: "116%", right: "11%", size: "205px" },
      { top: "130%", left: "5%", size: "215px" },
      { top: "130%", right: "5%", size: "215px" },
    ];

    // Десктопы (> 1024px)
    const desktopPositions = [
      { top: "2%", left: "2%", size: "280px" },
      { top: "8%", right: "15%", size: "260px" },
      { top: "15%", left: "20%", size: "250px" },
      { top: "20%", right: "1%", size: "270px" },
      { top: "45%", left: "1%", size: "320px" },
      { top: "35%", right: "15%", size: "290px" },
      { top: "58%", left: "20%", size: "310px" },
      { top: "58%", right: "1%", size: "275px" },
      { top: "70%", left: "1%", size: "205px" },
      { top: "78%", right: "15%", size: "340px" },
      { top: "80%", left: "17%", size: "265px" },
      { top: "100%", right: "3%", size: "285px" },
      { top: "100%", left: "18%", size: "275px" },
      { top: "122%", right: "16%", size: "275px" },
      { top: "100%", left: "4%", size: "320px" },
      { top: "135%", right: "1%", size: "200px" },
      { top: "168%", left: "10%", size: "315px" },
      { top: "160%", right: "6%", size: "200px" },
      { top: "190%", left: "6%", size: "295px" },
      { top: "170%", right: "20%", size: "275px" },
      { top: "100%", left: "14%", size: "285px" },
      { top: "228%", right: "9%", size: "300px" },
    ];

    if (isMobile) return mobilePositions;
    if (isTablet) return tabletPositions;
    return desktopPositions;
  }, [isMobile, isTablet]);

  // Ограничиваем количество изображений на основе производительности и устройства
  const images = useMemo(() => {
    // На мобильных показываем меньше изображений для производительности
    let maxImages = gsapConfig.maxImages;
    if (isMobile) {
      maxImages = Math.min(16, maxImages); // максимум 16 на мобильных
    } else if (isTablet) {
      maxImages = Math.min(20, maxImages); // максимум 20 на планшетах
    }
    return allImages.slice(0, maxImages);
  }, [gsapConfig.maxImages, isMobile, isTablet]);

  useGSAP(() => {
    // Упрощаем анимации на слабых устройствах
    if (!gsapConfig.shouldPin) {
      return;
    }

    // Адаптивная длина скролла в зависимости от устройства
    const scrollLength = isMobile ? '200%' : isTablet ? '250%' : '300%';

    // Создаем timeline для всей секции
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${scrollLength}`,
        pin: gsapConfig.shouldPin,
        pinSpacing: true,
        scrub: gsapConfig.scrubValue,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onLeave: () => {
          // Плавное исчезновение при выходе из секции
          gsap.to(sectionRef.current, {
            opacity: 1,
            duration: 0.3,
          });
        },
        onEnterBack: () => {
          // Плавное появление при возврате
          gsap.to(sectionRef.current, {
            opacity: 1,
            duration: 0.3,
          });
        },
      },
    });

    // Вертикальная прокрутка текстового списка
    tl.fromTo(
      textListRef.current,
      {
        y: 0,
      },
      {
        y: "-75%", // прокручиваем на 75% (100% / 4 элемента * 3 перехода)
        ease: "power1.inOut",
        duration: 1,
      },
      0
    );

    // Анимация фотографий при скролле
    const imageElements = sectionRef.current.querySelectorAll(".gallery-image");

    imageElements.forEach((img, index) => {
      const position = getPositions[index];
      const isLeft = position.left !== undefined;

      // Плавное появление с задержкой для каскадного эффекта
      tl.fromTo(
        img,
        {
          opacity: 0,
          scale: 0.8,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
        },
        index * 0.02
      );

      // Адаптивное расстояние прокрутки в зависимости от устройства
      const baseDistance = isMobile ? 300 : isTablet ? 450 : 600;
      const scrollDistance = baseDistance + (index * (isMobile ? 8 : 15));
      const startY = isLeft ? -scrollDistance : scrollDistance;

      tl.fromTo(
        img,
        {
          y: startY,
        },
        {
          y: -startY,
          ease: "none",
          duration: 0.8,
        },
        0
      );
    });

    // Добавляем плавное затухание в конце
    tl.to(
      sectionRef.current,
      {
        opacity: 0.95,
        duration: 0.2,
        ease: "power1.out",
      },
      0.85 // начинаем ближе к концу timeline
    );

    // Cleanup
    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();
      // Восстанавливаем opacity при размонтировании
      gsap.set(sectionRef.current, { opacity: 1 });
    };
  }, { scope: sectionRef, dependencies: [isMobile, isTablet, getPositions] });

  // Мобильная версия - простая горизонтальная галерея
  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full"
        style={{
          backgroundColor: "#F6EDCE",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "2rem 0",
        }}
      >
        {/* Заголовок */}
        <div className="text-center px-4 mb-6">
          <h2
            className="font-bold"
            style={{
              fontFamily: "Lilita One, sans-serif",
              color: "#49526F",
              fontSize: "2.5rem",
              lineHeight: 1.2,
            }}
          >
            {t('sectionSix.stages.design.main')}
          </h2>
          <p
            className="mt-2"
            style={{
              fontFamily: "'Gentium Plus', Georgia, serif",
              color: "#49526F",
              opacity: 0.7,
              fontSize: "0.875rem",
            }}
          >
            {t('sectionSix.stages.design.sub')}
          </p>
        </div>

        {/* Горизонтальная прокрутка фотографий */}
        <div
          className="w-full"
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x mandatory",
            display: "flex",
            gap: "1rem",
            padding: "0 1rem",
          }}
        >
          {allImages.map((img, index) => (
            <div
              key={index}
              style={{
                flex: "0 0 85vw",
                scrollSnapAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={img}
                alt={`${t('sectionSix.imageAlt')} ${index + 1}`}
                loading="lazy"
                decoding="async"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "70vh",
                  objectFit: "contain",
                  borderRadius: "12px",
                  boxShadow: "0 5px 20px rgba(39, 62, 143, 0.15)",
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Десктопная версия - сложная анимация с GSAP
  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: "#F6EDCE",
        minHeight: "100vh",
        position: "relative",
        zIndex: 0,
      }}
    >
      {/* Текстовые блоки - вертикальная прокрутка при скролле */}
      <div
        className="absolute top-0 left-0 w-full h-screen flex items-center justify-center"
        style={{ zIndex: 10, pointerEvents: "none" }}
      >
        <div
          className="text-center px-4 sm:px-6"
          style={{
            overflow: "hidden",
            height: isMobile ? "140px" : isTablet ? "180px" : "220px",
          }}
        >
          <div ref={textListRef}>
            {textStages.map((stage, index) => (
              <div
                key={index}
                className="text-item"
                style={{
                  height: isMobile ? "140px" : isTablet ? "180px" : "220px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <h1
                  className="font-bold"
                  style={{
                    fontFamily: "Lilita One, sans-serif",
                    color: "#49526F",
                    lineHeight: 1,
                    textShadow: "0 0 40px rgba(236, 227, 218, 0.8)",
                    fontSize: isMobile ? "2.5rem" : isTablet ? "4rem" : "6rem",
                  }}
                >
                  {t(stage.mainKey)}
                </h1>
                <p
                  className="mt-2 sm:mt-3"
                  style={{
                    fontFamily: "'Gentium Plus', Georgia, serif",
                    color: "#49526F",
                    opacity: 0.7,
                    fontSize: isMobile ? "0.875rem" : isTablet ? "1.125rem" : "1.5rem",
                  }}
                >
                  {t(stage.subKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Галерея фотографий - прокручивается */}
      <div
        className="absolute top-0 left-0 w-full h-screen"
        style={{
          zIndex: 1
        }}
      >
        {images.map((img, index) => (
          <div
            key={index}
            className="gallery-image absolute"
            style={{
              ...getPositions[index],
              width: getPositions[index].size,
              height: getPositions[index].size,
            }}
          >
            <img
              src={img}
              alt={`${t('sectionSix.imageAlt')} ${index + 1}`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover rounded-lg shadow-2xl"
              style={{
                boxShadow: isMobile
                  ? "0 5px 20px rgba(39, 62, 143, 0.15)"
                  : "0 10px 40px rgba(39, 62, 143, 0.2)",
              }}
              onError={(e) => {
                e.target.style.display = 'none'; // Скрываем изображение при ошибке загрузки
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SectionSix;
