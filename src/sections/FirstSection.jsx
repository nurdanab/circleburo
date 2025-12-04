import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import StyledCard from "../components/common/StyledCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VideoPinSection from "../components/common/VideoPinSection";
import { useTranslation } from "react-i18next";
import { useBreakpoint } from "../utils/breakpoints";

gsap.registerPlugin(ScrollTrigger);

const FirstSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const title1Ref = useRef(null);
  const title2Ref = useRef(null);
  const title3Ref = useRef(null);
  const title4Ref = useRef(null);

  // Унифицированное определение размера экрана
  const { isMobile, isTablet } = useBreakpoint();

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Создаем контекст для изоляции анимаций
    const ctx = gsap.context(() => {
      const cards = [title1Ref, title2Ref, title3Ref, title4Ref];
      const validCards = cards.filter(ref => ref.current);

      if (validCards.length === 0) return;

      // Анимация появления карточек
      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: isMobile ? "top 80%" : "top 60%",
          end: isMobile ? "top 40%" : "top top",
          scrub: isMobile ? 1 : 1.5,
          toggleActions: "play none none reverse",
        },
      });

      validCards.forEach((cardRef, index) => {
        const delay = index * 0.2;
        revealTl.to(cardRef.current, {
          duration: 1,
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "back.out(1.2)",
        }, delay);
      });
    }, sectionRef);

    // Cleanup при размонтировании
    return () => ctx.revert();
  }, [isMobile, isTablet]);

  return (
    <section
      ref={sectionRef}
      className="benefit-section"
      style={{ backgroundColor: "#F6EDCE" }}
    >
      <div className={`container mx-auto relative z-10 ${isMobile ? 'pt-16 pb-8' : isTablet ? 'pt-20 pb-10' : 'pt-24 pb-12'}`}>
        <div className="flex flex-col items-center justify-center">
          <div className="cards-container relative">
            <div ref={title1Ref} className="card-wrapper card-1">
              <StyledCard
                title={t('firstSection.title1', 'ADVERTISING AGENCY')}
                bgColor="#F4E4A6"
                textColor="#E8574B"
                rotation={-8}
                className="fs-card-1"
              />
            </div>
            <div ref={title2Ref} className="card-wrapper card-2">
              <StyledCard
                title={t('firstSection.title2', 'CREATIVITY')}
                bgColor="#4A5073"
                textColor="#F5B4C4"
                rotation={-15}
                className="fs-card-2"
              />
            </div>
            <div ref={title3Ref} className="card-wrapper card-3">
              <StyledCard
                title={t('firstSection.title3', 'WITHOUT EDGES')}
                bgColor="#2C4F4A"
                textColor="#F4E4A6"
                rotation={10}
                className="fs-card-3"
              />
            </div>
            <div ref={title4Ref} className="card-wrapper card-4">
              <StyledCard
                title="CIRCLE"
                bgColor="#E8574B"
                textColor="#F6EDCE"
                rotation={-3}
                className="fs-card-4"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative overlay-box">
        <VideoPinSection />
      </div>
    </section>
  );
};

export default FirstSection;
