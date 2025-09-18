// src/pages/HomePage.jsx
import React, { useEffect, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import useSEO from '../hooks/useSEO';
import HeroSection from '../components/sections/HeroSection';
import LazySection from '../components/LazySection';
import { scrollToElement } from '../utils/navigation';

// Lazy load non-critical sections
const WhyUsSection = React.lazy(() => import('../components/sections/WhyUsSection'));
const ServicesSection = React.lazy(() => import('../components/sections/ServicesSection'));
const AboutUsSection = React.lazy(() => import('../components/sections/AboutUsSection'));
const ProjectsSection = React.lazy(() => import('../components/sections/ProjectsSection'));
const InteractiveSection = React.lazy(() => import('../components/sections/InteractiveSection'));
const ContactFormSection = React.lazy(() => import('../components/sections/ContactFormSection'));


function HomePage() {
  const seoData = useSEO('home');
  const location = useLocation();

  useEffect(() => {
    // Проверяем, есть ли state с scrollTo или sessionStorage
    const stateScrollTo = location.state?.scrollTo;
    const sessionScrollTo = sessionStorage.getItem('scrollToSection');
    const sectionId = stateScrollTo || sessionScrollTo;

    if (sectionId) {
      if (import.meta.env.DEV) {
        console.log('HomePage: Trying to scroll to section:', sectionId);
        console.log('Source:', stateScrollTo ? 'location.state' : 'sessionStorage');
      }

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
            if (import.meta.env.DEV) {
              console.log('HomePage: Starting scroll attempt for:', sectionId);
            }
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
    <main>
      {seoData && <SEOHead {...seoData} pageName="home" autoOptimize={true} />}
      <HeroSection />
      
      <LazySection>
        <Suspense fallback={<div style={{ height: '200px' }} aria-label="Загрузка секции" />}>
          <WhyUsSection />
        </Suspense>
      </LazySection>
      
      <LazySection>
        <Suspense fallback={<div style={{ height: '200px' }} aria-label="Загрузка секции" />}>
          <ServicesSection />
        </Suspense>
      </LazySection>
      
      <LazySection>
        <Suspense fallback={<div style={{ height: '200px' }} aria-label="Загрузка секции" />}>
          <AboutUsSection />
        </Suspense>
      </LazySection>
      
      <LazySection>
        <Suspense fallback={<div style={{ height: '200px' }} aria-label="Загрузка секции" />}>
          <ProjectsSection />
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