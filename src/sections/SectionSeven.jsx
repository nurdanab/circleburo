import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getMediaUrl } from "../utils/media";

// Регистрируем плагин ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const SectionSeven = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const timelineRef = useRef(null);
  const contentRef = useRef(null);

  const portfolioImages = useMemo(() =>
    Array.from({ length: 4 }, (_, i) => ({
      id: i + 1,
      src: getMediaUrl(`img/projects/id${i + 1}.png`),
      alt: `Portfolio ${i + 1}`,
    })), []
  );

  // Анимация появления секции при входе
  useGSAP(() => {
    if (!sectionRef.current || !contentRef.current) return;

    // Начальное состояние
    gsap.set(contentRef.current, { opacity: 0, y: 30 });

    // Анимация появления контента при прокрутке
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(contentRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => {
            // Обновляем ScrollTrigger после завершения анимации
            ScrollTrigger.refresh();
          }
        });
      },
    });

    // Обновляем ScrollTrigger после небольшой задержки для корректной работы с LazySection
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(refreshTimeout);
    };
  }, { scope: sectionRef });

  useGSAP(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const items = carousel.querySelectorAll(".portfolio-carousel-item");
    if (items.length === 0) return;

    const slideWidth = items[0].offsetWidth + 24;
    const totalSlides = portfolioImages.length;

    const tl = gsap.timeline({
      repeat: -1,
      paused: false
    });

    timelineRef.current = tl;

    portfolioImages.forEach((_, i) => {
      tl.to(carousel, {
        x: -(i * slideWidth),
        duration: 0.7,
        ease: "power2.inOut",
        onStart: () => {
          items.forEach((item, index) => {
            const actualIndex = index % totalSlides;
            const distance = Math.abs(actualIndex - i);

            // Увеличиваем текущую карточку И карточку через одну (distance 0 и 2)
            if (distance === 0 || distance === 2) {
              gsap.to(item, {
                scale: 1,
                duration: 0.6,
                overwrite: "auto"
              });
            } else if (distance === 1) {
              gsap.to(item, {
                scale: 0.9,
                duration: 0.6,
                overwrite: "auto"
              });
            }
          });
        },
      });
      tl.to({}, { duration: 1.5 });
    });

    tl.to(carousel, {
      x: 0,
      duration: 0.7,
      ease: "power2.inOut",
    });

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [portfolioImages]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden py-30 md:py-52 lg:py-64"
      style={{ backgroundColor: "#F6EDCE", position: "relative", zIndex: 5 }}
    >
      <div ref={contentRef} className="relative z-10 container mx-auto px-6 md:px-12 py-6 md:py-10 lg:py-14">
        <div className="portfolio-content text-center mb-10">
          <h1 className="portfolio-title text-[#F25340] text-3xl md:text-6xl font-bold mb-20" style={{ fontFamily: "Lilita One, sans-serif" }}>
            {t('sectionSeven.title')}
            <br />
            {t('sectionSeven.subtitle')}
          </h1>

          <p className="portfolio-subtitle text-gray-700 text-lg md:text-xl mb-32">
            {t('sectionSeven.description')}
          </p>
        </div>

        <div className="portfolio-carousel-wrapper overflow-hidden">
          <div ref={carouselRef} className="portfolio-carousel flex gap-6" style={{ willChange: 'transform' }}>
            {[...portfolioImages, ...portfolioImages].map((image, index) => (
              <div
                key={`portfolio-${index}`}
                className="portfolio-carousel-item flex-shrink-0 w-96 h-[28rem] overflow-hidden rounded-2xl"
                style={{ willChange: 'transform' }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="portfolio-carousel-image w-full h-full object-cover"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionSeven;
