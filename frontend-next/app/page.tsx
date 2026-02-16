import Benefits from "@/app/components/shared/home/benefitsSection/Benefits";
import Contact from "@/app/components/shared/home/contactSection/Contact";
import Hero from "@/app/components/shared/home/heroSection/Hero";
import Manifest from "@/app/components/shared/home/manifestSection/Manifest";
import Project from "@/app/components/shared/home/projectsSection/Project";
import Services from "@/app/components/shared/home/servicesSection/Services";
import ShowCase from "@/app/components/shared/home/showCaseSection/ShowCase";

export default function Home() {
  return (
    <>
      <Hero />
      <Manifest />
      <Project />
      <Benefits />
      <ShowCase />
      <Services />
      <Contact />
    </>
  );
}
