// src/pages/HomePage.jsx
import React, { Suspense } from 'react';
import SEOHead from '../components/SEOHead';
import useSEO from '../hooks/useSEO';
import LazySection from '../components/LazySection';

// Lazy load новых секций для оптимизации
const FirstSection = React.lazy(() => import('../sections/FirstSection'));
const SecondSection = React.lazy(() => import('../sections/SecondSection'));
const FourthSection = React.lazy(() => import('../sections/FourthSection'));
const SectionFive = React.lazy(() => import('../sections/SectionFive'));
const SectionSix = React.lazy(() => import('../sections/SectionSix'));
const SectionSeven = React.lazy(() => import('../sections/SectionSeven'));
const SectionEight = React.lazy(() => import('../sections/SectionEight'));
const SectionEightB = React.lazy(() => import('../sections/SectionEightB'));
const SectionEightC = React.lazy(() => import('../sections/SectionEightC'));
const SectionNine = React.lazy(() => import('../sections/SectionNine'));
const SectionTen = React.lazy(() => import('../sections/SectionTen'));
const SectionEleven = React.lazy(() => import('../sections/SectionEleven'));
const SectionTwelve = React.lazy(() => import('../sections/SectionTwelve'));

function HomePage() {
  const seoData = useSEO('home');

  return (
    <main role="main" aria-label="Основное содержимое страницы">
      {seoData && <SEOHead {...seoData} pageName="home" autoOptimize={true} />}

      {/* FirstSection - видео с пинингом */}
      <LazySection>
        <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-label="Загрузка секции" />}>
          <FirstSection />
        </Suspense>
      </LazySection>

      {/* SecondSection - анимированный текст */}
      <LazySection>
        <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-label="Загрузка секции" />}>
          <SecondSection />
        </Suspense>
      </LazySection>

      {/* FourthSection */}
      <LazySection animate={false} priority={true}>
        <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-label="Загрузка секции" />}>
          <FourthSection />
        </Suspense>
      </LazySection>

      {/* SectionFive */}
      <LazySection>
        <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-label="Загрузка секции" />}>
          <SectionFive />
        </Suspense>
      </LazySection>

      {/* SectionSix */}
      <LazySection>
        <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-label="Загрузка секции" />}>
          <SectionSix />
        </Suspense>
      </LazySection>

      {/* SectionSeven */}
      <LazySection animate={false}>
        <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-label="Загрузка секции" />}>
          <SectionSeven />
        </Suspense>
      </LazySection>

      {/* SectionEight - Архитектура (arc-video1.mp4) */}
      <LazySection animate={false}>
        <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-label="Загрузка секции" />}>
          <SectionEight />
        </Suspense>
      </LazySection>

     
      <LazySection animate={false}>
        <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-label="Загрузка секции" />}>
          <SectionEightB />
        </Suspense>
      </LazySection>

      <LazySection animate={false}>
        <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-label="Загрузка секции" />}>
          <SectionEightC />
        </Suspense>
      </LazySection>

      {/* SectionNine */}
      <LazySection>
        <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-label="Загрузка секции" />}>
          <SectionNine />
        </Suspense>
      </LazySection>

      {/* SectionTen */}
      <LazySection>
        <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-label="Загрузка секции" />}>
          <SectionTen />
        </Suspense>
      </LazySection>

      {/* SectionEleven - Before/After toggle */}
      <LazySection>
        <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-label="Загрузка секции" />}>
          <SectionEleven />
        </Suspense>
      </LazySection>

      {/* SectionTwelve */}
      <LazySection priority={true} rootMargin="200px">
        <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-label="Загрузка секции" />}>
          <SectionTwelve />
        </Suspense>
      </LazySection>
    </main>
  );
}

export default HomePage;
