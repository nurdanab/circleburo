import Benefits from "@/components/shared/home/benefitsSection/Benefits";
import Contact from "@/components/shared/home/contactSection/Contact";
import Hero from "@/components/shared/home/heroSection/Hero";
import Manifest from "@/components/shared/home/manifestSection/Manifest";
import Project from "@/components/shared/home/projectsSection/Project";
import Services from "@/components/shared/home/servicesSection/Services";
import ShowCase from "@/components/shared/home/showCaseSection/ShowCase";
import { setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

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
