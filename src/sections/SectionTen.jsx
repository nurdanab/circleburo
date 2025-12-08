import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const SectionTen = () => {
  const slides = [
    {
      number: "01",
      title: "MARKETING",
      color: "#F0CD4B",
      textColor: "#0E5A4D",
      items: [
        { name: "Concept/Visualisation", price: "250,000 KZT" },
        { name: "Mini events", price: "Individual pricing" },
        { name: "Audit and analysis", price: "250,000 KZT" }
      ]
    },
    {
      number: "02",
      title: "DESIGN",
      color: "#F25340",
      textColor: "#F0CD4B",
      items: [
        { name: "Mini guidebook", detail: "(6 pages)", price: "500,000 KZT" },
        { name: "Presentation", detail: "(1 page)", price: "10,000 KZT" },
        { name: "Packaging and branding", detail: "(1 pc.)", price: "Individual pricing" },
        { name: "2D Animation", detail: "(1 sec.)", price: "10,000 KZT" },
        { name: "3D Animation", detail: "(1 sec.)", price: "20,000 KZT" },
        { name: "3D visualisation of conceptualization", detail: "(1 sec.)", price: "35,000 KZT" },
        { name: "Posters, banners, illustrations", detail: "(1 pc.)", price: "20,000 KZT" },
        { name: "Design for social media", price: "10,000 KZT" }
      ]
    },
    {
      number: "03",
      title: "WEB DESIGN",
      color: "#F09FB2",
      textColor: "#49526F",
      items: [
        { name: "Website development (React)/Pro", price: "2,500,000-5,000,000 KZT" },
        { name: "Website development (Tilda)/Business", price: "1,000,000 KZT" },
        { name: "Site care", price: "150,000 KZT" }
      ]
    },
    {
      number: "04",
      title: "INTERIOR DESIGN",
      color: "#0E5A4D",
      textColor: "#F09FB2",
      items: [
        { name: "Interior design (1 m^2)", price: "30,000 KZT" },
        { name: "Interior design (1 m^2) turnkey", price: "50,000 KZT" }
      ]
    },
    {
      number: "05",
      title: "SMM",
      color: "#F6EDCE",
      textColor: "#F25340",
      items: [
        { name: "Content Plan", price: "Individual pricing" },
        { name: "Set-up profile", detail: "(10 pc.)", price: "Individual pricing" },
        { name: "Filming reels/tiktok", detail: "(12 pc.)", price: "Individual pricing" },
        { name: "Stories", detail: "(20 pc.)", price: "Individual pricing" },
        { name: "Target", price: "Individual pricing" }
      ]
    },
    {
      number: "06",
      title: "PRODUCTION",
      color: "#49526F",
      textColor: "#F0CD4B",
      items: [
        { name: "Video editing", detail: "(1pc.)", price: "100,000 KZT" },
        { name: "Videoproduction", detail: "(1 hr.)", price: "50,000 KZT" },
        { name: "Photoproduction", detail: "(1 hr.)", price: "35,000 KZT" }
      ]
    }
  ];

  const sectionRef = useRef(null);
  const slidesRef = useRef([]);
  const leftPanelRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0); // Ref для отслеживания актуального индекса в callback
  const [isMobile, setIsMobile] = useState(false);

  // Проверка мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useGSAP(() => {
    if (!sectionRef.current || slidesRef.current.length === 0) return;

    // Инициализация левой панели
    if (leftPanelRef.current) {
      gsap.set(leftPanelRef.current, {
        backgroundColor: slides[0].color
      });
    }

    // Инициализация слайдов
    slidesRef.current.forEach((slide, i) => {
      if (slide) {
        gsap.set(slide, {
          x: i === 0 ? "0%" : "100%",
          opacity: i === 0 ? 1 : 0,
          zIndex: i === 0 ? 2 : 1
        });
      }
    });

    // Создание ScrollTrigger с улучшенной логикой
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: () => `+=${window.innerHeight * (slides.length - 1) * 1.5}`,
      scrub: 1,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;
        // Улучшенный расчет индекса для плавной обратной прокрутки
        const rawIndex = progress * (slides.length - 1);
        // Ограничиваем index в пределах валидного диапазона
        const index = Math.max(0, Math.min(slides.length - 1, Math.round(rawIndex)));

        // Обновляем активный индекс только при изменении
        if (index !== activeIndexRef.current) {
          activeIndexRef.current = index;
          setActiveIndex(index);
        }

        // Анимация слайдов с учетом направления прокрутки
        slidesRef.current.forEach((slide, i) => {
          if (!slide) return;

          const distance = i - rawIndex;
          let x, opacity, zIndex;

          // Увеличенный порог для более стабильного отображения активного слайда
          if (Math.abs(distance) < 0.6) {
            // Текущий активный слайд
            x = "0%";
            opacity = 1;
            zIndex = 10;
          } else if (distance > 0) {
            // Слайды справа (будущие)
            x = "100%";
            opacity = 0;
            zIndex = 1;
          } else {
            // Слайды слева (прошлые) - ИСПРАВЛЕНИЕ для обратной прокрутки
            x = "-100%";
            opacity = 0;
            zIndex = 1;
          }

          // Применяем анимацию с плавным переходом
          gsap.to(slide, {
            x: x,
            opacity: opacity,
            zIndex: zIndex,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto"
          });
        });

        // Анимация левой панели (синхронизация цветов)
        if (leftPanelRef.current) {
          const currentColor = slides[index].color;
          const currentTextColor = slides[index].textColor;

          gsap.to(leftPanelRef.current, {
            backgroundColor: currentColor,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto"
          });
        }
      }
    });

    return () => {
      trigger.kill();
    };
  }, { scope: sectionRef, dependencies: [] });

  // Безопасный доступ к текущему слайду
  const currentSlide = slides[Math.max(0, Math.min(slides.length - 1, activeIndex))] || slides[0];

  // Стили для адаптивности
  const containerStyle = {
    height: '100vh',
    display: 'flex',
    overflow: 'hidden',
    fontFamily: "'Metrica', sans-serif",
    flexDirection: isMobile ? 'column' : 'row',
    position: 'relative'
  };

  const leftPanelStyle = {
    width: isMobile ? '100%' : '50%',
    height: isMobile ? '35%' : '100%',
    // backgroundColor управляется через GSAP для плавности
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: isMobile ? '24px 16px' : '60px',
    position: 'relative',
    zIndex: 5
  };

  const rightPanelStyle = {
    width: isMobile ? '100%' : '50%',
    height: isMobile ? '65%' : '100%',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 1
  };

  const decorCircleStyle1 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile ? '160px' : '400px',
    height: isMobile ? '160px' : '400px',
    borderRadius: '50%',
    border: `2px solid ${currentSlide.textColor}20`,
    pointerEvents: 'none',
    opacity: isMobile ? 0.5 : 1
  };

  const decorCircleStyle2 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile ? '120px' : '300px',
    height: isMobile ? '120px' : '300px',
    borderRadius: '50%',
    border: `2px solid ${currentSlide.textColor}15`,
    pointerEvents: 'none',
    opacity: isMobile ? 0.5 : 1
  };

  const numberStyle = {
    fontSize: isMobile ? '64px' : '160px',
    fontWeight: 'bold',
    color: currentSlide.textColor,
    lineHeight: '0.9',
    marginTop: isMobile ? '12px' : '40px',
    fontFamily: "'Lilita One', sans-serif",
    textShadow: `4px 4px 0 ${currentSlide.textColor}15`
  };

  const listStyle = {
    fontSize: isMobile ? '8px' : '11px',
    color: currentSlide.textColor,
    marginBottom: isMobile ? '6px' : '10px',
    letterSpacing: isMobile ? '1px' : '1.5px',
    lineHeight: '1.6',
    opacity: 0.7,
    fontWeight: '500'
  };

  return (
    <div ref={sectionRef} style={containerStyle}>
      {/* Левая панель */}
      <div ref={leftPanelRef} style={leftPanelStyle}>
        {/* Декоративные элементы */}
        <div style={decorCircleStyle1}/>
        <div style={decorCircleStyle2}/>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={listStyle}>
            01. MARKETING<br/>
            02. DESIGN<br/>
            03. WEB DESIGN<br/>
            04. INTERIOR DESIGN<br/>
            05. SMM<br/>
            06. PRODUCTION
          </div>
          <div style={numberStyle}>
            {currentSlide.number}
          </div>
        </div>

        <div style={{
          fontSize: isMobile ? '9px' : '11px',
          color: currentSlide.textColor,
          marginTop: 'auto',
          letterSpacing: '1.5px',
          opacity: 0.7,
          fontWeight: '500',
          position: 'relative',
          zIndex: 1
        }}>
          01. MARKETING<br/>
          {currentSlide.number}. {currentSlide.title}
        </div>
      </div>

      {/* Правая панель */}
      <div style={rightPanelStyle}>
        {slides.map((slide, index) => (
          <div
            key={index}
            ref={(el) => (slidesRef.current[index] = el)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: slide.textColor,
              padding: isMobile ? '24px 16px' : '80px 60px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              overflowY: 'auto',
              overflowX: 'hidden'
            }}
          >
            {/* Заголовок секции */}
            <div style={{ marginBottom: isMobile ? '20px' : '50px' }}>
              <div style={{
                fontSize: isMobile ? '24px' : '48px',
                fontWeight: 'bold',
                color: slide.color,
                fontFamily: "'Lilita One', sans-serif",
                letterSpacing: '-0.5px',
                marginBottom: isMobile ? '10px' : '15px'
              }}>
                {slide.title}
              </div>
              <div style={{
                width: isMobile ? '40px' : '80px',
                height: isMobile ? '2.5px' : '4px',
                backgroundColor: slide.color,
                borderRadius: '2px'
              }}/>
            </div>

            {/* Прайс-лист */}
            <div style={{ flex: 1 }}>
              {slide.items.map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: isMobile ? '14px' : '28px',
                  paddingBottom: isMobile ? '12px' : '20px',
                  borderBottom: `1.5px solid ${slide.color}25`,
                  gap: isMobile ? '12px' : '30px',
                  flexDirection: isMobile ? 'column' : 'row'
                }}>
                  <div style={{
                    color: slide.color,
                    flex: '1',
                    minWidth: 0
                  }}>
                    <div style={{
                      fontSize: isMobile ? '14px' : '20px',
                      fontWeight: '600',
                      marginBottom: '3px',
                      lineHeight: '1.3'
                    }}>
                      {item.name}
                    </div>
                    {item.detail && (
                      <div style={{
                        fontSize: isMobile ? '11px' : '14px',
                        opacity: '0.7',
                        fontWeight: '400'
                      }}>
                        {item.detail}
                      </div>
                    )}
                  </div>
                  <div style={{
                    fontSize: isMobile ? '12px' : '18px',
                    color: slide.color,
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    textAlign: 'right',
                    minWidth: 'fit-content',
                    padding: isMobile ? '3px 10px' : '6px 16px',
                    backgroundColor: `${slide.color}15`,
                    borderRadius: isMobile ? '4px' : '6px'
                  }}>
                    {item.price}
                  </div>
                </div>
              ))}
            </div>

            {/* Индикатор прогресса */}
            <div style={{
              display: 'flex',
              gap: isMobile ? '6px' : '8px',
              marginTop: isMobile ? '20px' : '40px',
              justifyContent: 'center'
            }}>
              {slides.map((_, i) => (
                <div key={i} style={{
                  width: i === index ? (isMobile ? '24px' : '32px') : (isMobile ? '6px' : '8px'),
                  height: isMobile ? '6px' : '8px',
                  backgroundColor: i === index ? slide.color : `${slide.color}30`,
                  borderRadius: '4px',
                  transition: 'all 0.3s ease'
                }}/>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionTen;
