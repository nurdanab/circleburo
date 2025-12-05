import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { isMobileDevice } from "../utils/breakpoints";

gsap.registerPlugin(ScrollTrigger);

const SecondSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Определяем мобильное устройство при монтировании
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Используем состояние isMobile
    const shouldUseSplitText = !isMobile;

    // Создаем изолированный контекст для всех анимаций
    const ctx = gsap.context(() => {
      // КРИТИЧНО: Устанавливаем отрицательный marginTop для наложения поверх FirstSection
      gsap.set(sectionRef.current, {
        marginTop: isMobile ? "-100vh" : "-140vh",
      });

      if (!shouldUseSplitText) return;

      // Split текстов для каждой части
      const aboutPeople1Split = new SplitType(".testimonials-section-text .about-people-1", {
        types: "words",
      });
      const aboutPeople2Split = new SplitType(".testimonials-section-text .about-people-2", {
        types: "words",
      });
      const aboutPeople3Split = new SplitType(".testimonials-section-text .about-people-3", {
        types: "words",
      });
      const storyTextSplit = new SplitType(".testimonials-section-text .story-text", {
        types: "words",
      });

      // Анимация первой части - от #C3E2DC к #0E5A4D
      gsap.to(aboutPeople1Split.words, {
        color: "#0E5A4D",
        stagger: 0.3,
        scrollTrigger: {
          trigger: ".testimonials-section-text .about-people-text",
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      });

      // Анимация второй части - от #FFBCB4 к #F25340
      gsap.to(aboutPeople2Split.words, {
        color: "#F25340",
        stagger: 0.3,
        scrollTrigger: {
          trigger: ".testimonials-section-text .about-people-text",
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      });

      // Анимация третьей части - от #C1CCED к #49526F
      gsap.to(aboutPeople3Split.words, {
        color: "#49526F",
        stagger: 0.3,
        scrollTrigger: {
          trigger: ".testimonials-section-text .about-people-text",
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      });

      // Анимация текста "история"
      gsap.to(storyTextSplit.words, {
        color: "#121112",
        stagger: 0.3,
        scrollTrigger: {
          trigger: ".testimonials-section-text .story-text",
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      });

      // Cleanup для SplitType при размонтировании
      return () => {
        aboutPeople1Split.revert();
        aboutPeople2Split.revert();
        aboutPeople3Split.revert();
        storyTextSplit.revert();
      };
    }, sectionRef);

    // Cleanup всего контекста при размонтировании
    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      className="testimonials-section-text relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#F6EDCE" }}
    >
      <div className="container mx-auto flex items-center justify-center py-28 relative">
        <div className="w-full h-full">
          {/* Текст "О людях" */}
          <div className="flex items-center justify-center">
            <h2
              className="about-people-text text-4xl md:text-5xl lg:text-6xl font-bold text-center leading-relaxed px-4 max-w-7xl"
              style={{ fontFamily: 'Lilita One, sans-serif', textTransform: "uppercase" }}
            >
              <span className="about-people-1 block" style={{ color: isMobile ? "#0E5A4D" : "#C3E2DC", fontFamily: "'Lilita One', cursive" }}>
                {t('secondSection.aboutPeople1', 'Circle - это про людей.')}
              </span>
              <span className="about-people-2 block" style={{ color: isMobile ? "#F25340" : "#FFBCB4", fontFamily: "'Lilita One', cursive" }}>
                {t('secondSection.aboutPeople2', 'Людей, которые умеют создавать.')}
              </span>
              <span className="about-people-3 block" style={{ color: isMobile ? "#49526F" : "#C1CCED", fontFamily: "'Lilita One', cursive" }}>
                {t('secondSection.aboutPeople3', 'Чувствовать. Видеть дальше.')}
              </span>
            </h2>
          </div>

          {/* Текст "История" */}
          <div className="flex items-center justify-center mt-12 md:mt-20">
            <div className="max-w-3xl px-10">
              <p
                className="story-text text-center text-lg md:text-xl lg:text-2xl leading-relaxed"
                style={{ fontFamily: "Metrika, sans-serif", color: isMobile ? "#121112" : "#999" }}
              >
                {t('secondSection.storyText', 'Всё начиналось с небольшой кофейни, где начал раскрываться потенциал людей. Пять людей собирали хаос в единый ритм. Разные люди, но одинаково горящие и каждый добавил в круг свою точку. Точки начали соединяться. Дизайн. Маркетинг. Стратегия. Смысл. Драйв.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecondSection;
