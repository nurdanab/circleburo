import "tailwindcss";
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import gsap from 'gsap';

function NotFoundPage() {
  const { t } = useTranslation();

  // Refs для GSAP анимаций
  const containerRef = useRef(null);
  const textContentRef = useRef(null);
  const number404Ref = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonsRef = useRef(null);
  const circlesContainerRef = useRef(null);
  const circle1Ref = useRef(null);
  const circle2Ref = useRef(null);
  const circle3Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Создаем timeline для последовательной анимации
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Анимация содержимого с задержкой
      tl.from(number404Ref.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
      })
      .from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
      }, "-=0.5")
      .from(descriptionRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
      }, "-=0.5")
      .from(buttonsRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
      }, "-=0.5")
      .from(circlesContainerRef.current, {
        opacity: 0,
        duration: 0.8,
      }, "-=0.6");

      // Бесконечная анимация для кругов
      if (circle1Ref.current) {
        gsap.to(circle1Ref.current, {
          y: -20,
          rotation: 360,
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      if (circle2Ref.current) {
        gsap.to(circle2Ref.current, {
          y: -15,
          rotation: -360,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 2,
        });
      }

      if (circle3Ref.current) {
        gsap.to(circle3Ref.current, {
          y: -10,
          rotation: 360,
          duration: 10,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 4,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <SEOHead
        title={t('notFound.title')}
        description={t('notFound.description')}
        robots="noindex, nofollow"
      />
      <div
        ref={containerRef}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-900 to-stone-950 px-4 py-8"
      >
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl w-full items-center">
          <div ref={textContentRef} className="text-center lg:text-left">
            <div
              ref={number404Ref}
              className="text-8xl md:text-9xl font-black text-stone-600 bg-clip-text mb-4"
            >
              404
            </div>
            <h1
              ref={titleRef}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              {t('notFound.title')}
            </h1>
            <p
              ref={descriptionRef}
              className="text-lg text-gray-100 mb-8 max-w-md mx-auto lg:mx-0"
            >
              {t('notFound.description')}
            </p>
            <div
              ref={buttonsRef}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/"
                className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-stone-200 to-stone-300 text-black font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-out"
              >
                {t('notFound.goHome')}
              </Link>
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-stone-200 text-white font-semibold rounded-lg hover:bg-stone-800 hover:text-white transform hover:-translate-y-1 transition-all duration-300 ease-out"
              >
                {t('notFound.contactUs', 'Связаться с нами')}
              </a>
            </div>
          </div>

          <div
            ref={circlesContainerRef}
            className="flex items-center justify-center relative"
          >
            <div className="relative w-80 h-80">
              <div
                ref={circle1Ref}
                className="absolute w-32 h-32 bg-gradient-to-r from-stone-500 to-stone-400 rounded-full opacity-70 top-0 right-0"
              />
              <div
                ref={circle2Ref}
                className="absolute w-20 h-20 bg-gradient-to-r from-stone-200 to-stone-300 rounded-full opacity-70 bottom-10 left-10"
              />
              <div
                ref={circle3Ref}
                className="absolute w-16 h-16 bg-gradient-to-r from-stone-100 to-stone-200 rounded-full opacity-70 top-16 left-5"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotFoundPage;
