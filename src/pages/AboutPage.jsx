// src/pages/AboutPage.jsx
import React from 'react';
import SEOHead from '../components/SEOHead';
import useSEO from '../hooks/useSEO';
import AboutSection from '../components/sectionsAboutPage/AboutSection';
import AboutSectionGallery from '../components/sectionsAboutPage/AboutSectionGallery';
import AnimatedEmployeeCards from '../components/sectionsAboutPage/EmployeeCards';


function AboutPage() {
  const seoData = useSEO('about'); 
  return (
    <>
    {seoData && <SEOHead {...seoData} />}
      <AboutSection />
      <AnimatedEmployeeCards />
      <AboutSectionGallery />
    </>
  );
}

export default AboutPage;