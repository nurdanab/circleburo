// src/pages/HomePage.jsx
import React, { useEffect, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import useSEO from '../hooks/useSEO';
import HeroSection from '../components/sections/HeroSection';
import LazySection from '../components/LazySection';

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
    // Проверяем, есть ли state с scrollTo при переходе с другой страницы
    if (location.state?.scrollTo) {
      const timeout = setTimeout(() => {
        const sectionId = location.state.scrollTo;
        console.log('Trying to scroll to:', sectionId);
        const element = document.getElementById(sectionId);
        console.log('Found element:', element);
        if (element) {
          // Дополнительная задержка для полной загрузки страницы
          setTimeout(() => {
            console.log('Scrolling to element:', element);
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 200);
        } else {
          console.error('Element not found with ID:', sectionId);
        }
      }, 300);
      
      // Очищаем state после использования
      window.history.replaceState({}, document.title);
      
      return () => clearTimeout(timeout);
    }
  }, [location.state]);

  return (
    <>
      {seoData && <SEOHead {...seoData} />}
      <HeroSection />
      
      <LazySection>
        <Suspense fallback={<div style={{ height: '200px' }} />}>
          <WhyUsSection />
        </Suspense>
      </LazySection>
      
      <LazySection>
        <Suspense fallback={<div style={{ height: '200px' }} />}>
          <ServicesSection />
        </Suspense>
      </LazySection>
      
      <LazySection>
        <Suspense fallback={<div style={{ height: '200px' }} />}>
          <AboutUsSection />
        </Suspense>
      </LazySection>
      
      <LazySection>
        <Suspense fallback={<div style={{ height: '200px' }} />}>
          <ProjectsSection />
        </Suspense>
      </LazySection>
      
      <LazySection>
        <Suspense fallback={<div style={{ height: '200px' }} />}>
          <InteractiveSection />
        </Suspense>
      </LazySection>
      
      <LazySection>
        <Suspense fallback={<div style={{ height: '200px' }} />}>
          <ContactFormSection />
        </Suspense>
      </LazySection>
    </>
  );
}

export default HomePage;