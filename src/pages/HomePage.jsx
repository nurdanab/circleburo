// src/pages/HomePage.jsx
import React from 'react';
import SEOHead from '../components/SEOHead';
import useSEO from '../hooks/useSEO';
import HeroSection from '../components/sections/HeroSection';
import WhyUsSection from '../components/sections/WhyUsSection';
import ServicesSection from '../components/sections/ServicesSection';
import AboutUsSection from '../components/sections/AboutUsSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import InteractiveSection from '../components/sections/InteractiveSection';
import ContactFormSection from '../components/sections/ContactFormSection';


function HomePage() {
  const seoData = useSEO('home');
  return (
    <>
      {seoData && <SEOHead {...seoData} />}
      <HeroSection />
      <WhyUsSection />
      <ServicesSection />
      <AboutUsSection /> 
      <ProjectsSection />
      <InteractiveSection />
      <ContactFormSection />
    </>
  );
}

export default HomePage;