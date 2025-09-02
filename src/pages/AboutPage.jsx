// src/pages/AboutPage.jsx
import React from 'react';
import SEOHead from '../components/SEOHead';
import useSEO from '../hooks/useSEO';
import AboutSection from '../components/sectionsAboutPage/AboutSection';
import EmployeeCards from '../components/sectionsAboutPage/EmployeeCards';
import AboutSectionGallery from '../components/sectionsAboutPage/AboutSectionGallery';


function AboutPage() {
  const seoData = useSEO('about'); 
  return (
    <>
    {seoData && <SEOHead {...seoData} />}
      <AboutSection />
      <EmployeeCards />
      <AboutSectionGallery /> 
    </>
  );
}

export default AboutPage;