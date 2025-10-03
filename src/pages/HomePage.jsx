// src/pages/HomePage.jsx
import React, { useEffect, Suspense, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import useSEO from '../hooks/useSEO';
import StaticHero from '../components/StaticHero';

// Lazy load анимированный Hero для лучшего LCP
const HeroSection = React.lazy(() => import('../components/sections/HeroSection'));
import LazySection from '../components/LazySection';
import { scrollToElement } from '../utils/navigation';

// Lazy load non-critical sections
// const WhyUsSection = React.lazy(() => import('../components/sections/WhyUsSection'));
const ServicesSection = React.lazy(() => import('../components/sections/ServicesSection'));
const AboutUsSection = React.lazy(() => import('../components/sections/AboutUsSection'));
const ProjectsSection = React.lazy(() => import('../components/sections/ProjectsSection'));
const InteractiveSection = React.lazy(() => import('../components/sections/InteractiveSection'));
const ContactFormSection = React.lazy(() => import('../components/sections/ContactFormSection'));


function HomePage() {
  const seoData = useSEO('home');
  const location = useLocation();
  const [showAnimatedHero, setShowAnimatedHero] = useState(false);

  // Переключаемся на анимированный Hero после первого рендера для улучшения LCP
  useEffect(() => {
    const handleLoadAnimatedHero = () => {
      setShowAnimatedHero(true);
    };

    window.addEventListener('loadAnimatedHero', handleLoadAnimatedHero);

    // Fallback: переключаемся через 100ms если событие не сработало
    const timer = setTimeout(() => {
      setShowAnimatedHero(true);
    }, 100);

    return () => {
      window.removeEventListener('loadAnimatedHero', handleLoadAnimatedHero);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    // Проверяем, есть ли state с scrollTo или sessionStorage
    const stateScrollTo = location.state?.scrollTo;
    const sessionScrollTo = sessionStorage.getItem('scrollToSection');
    const sectionId = stateScrollTo || sessionScrollTo;

    if (sectionId) {
      // Принудительно загружаем все секции для скролла
      const preloadAndScroll = async () => {
        try {
          // Предзагружаем секции в зависимости от target
          if (sectionId === 'services') {
            await import('../components/sections/ServicesSection');
          } else if (sectionId === 'projects') {
            await import('../components/sections/ProjectsSection');
          } else if (sectionId === 'contact') {
            await import('../components/sections/ContactFormSection');
          }

          // Даем время для рендера
          setTimeout(() => {
            scrollToElement(sectionId, {
              maxAttempts: 50,
              delay: 200,
              offset: 80,
              behavior: 'smooth'
            });

            // Очищаем sessionStorage после использования
            sessionStorage.removeItem('scrollToSection');
          }, 1500);

        } catch (error) {
          console.error('Failed to preload section:', error);
        }
      };

      preloadAndScroll();

      // Очищаем state после использования
      if (stateScrollTo) {
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, location.pathname]); // Добавляем pathname в зависимости

  return (
    <main role="main" aria-label="Основное содержимое страницы">
      {seoData && <SEOHead {...seoData} pageName="home" autoOptimize={true} />}
      {/* Показываем статический Hero для быстрого LCP, затем заменяем анимированным */}
      {!showAnimatedHero ? (
        <StaticHero />
      ) : (
        <Suspense fallback={<StaticHero />}>
          <HeroSection />
        </Suspense>
      )}

      {/* Загружаем анимированный Hero после первого рендера */}
      {!showAnimatedHero && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Загружаем анимированный Hero после LCP
              setTimeout(() => {
                if (window.React) {
                  const event = new CustomEvent('loadAnimatedHero');
                  window.dispatchEvent(event);
                }
              }, 100);
            `
          }}
        />
      )}
      
      {/* Временно убрана секция "Почему мы" */}
      {/* <LazySection>
        <Suspense fallback={<div style={{ height: '200px' }} aria-label="Загрузка секции" />}>
          <WhyUsSection />
        </Suspense>
      </LazySection> */}
      
      <LazySection>
        <Suspense fallback={<div style={{ height: '200px' }} aria-label="Загрузка секции" />}>
          <ProjectsSection />
        </Suspense>
      </LazySection>

      <LazySection>
        <Suspense fallback={<div style={{ height: '200px' }} aria-label="Загрузка секции" />}>
          <AboutUsSection />
        </Suspense>
      </LazySection>

      <LazySection>
        <Suspense fallback={<div style={{ height: '200px' }} aria-label="Загрузка секции" />}>
          <ServicesSection />
        </Suspense>
      </LazySection>
      
      <LazySection>
        <Suspense fallback={<div style={{ height: '200px' }} aria-label="Загрузка секции" />}>
          <InteractiveSection />
        </Suspense>
      </LazySection>
      
      <LazySection priority={true} rootMargin="200px">
        <Suspense fallback={<div style={{ height: '200px' }} aria-label="Загрузка секции" />}>
          <ContactFormSection />
        </Suspense>
      </LazySection>
    </main>
  );
}

export default HomePage;