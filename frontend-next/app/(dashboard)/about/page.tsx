import type { Metadata } from "next";
import AboutHero from "@/app/components/shared/about/AboutHeroSection/AboutHero";
import Mission from "@/app/components/shared/about/MissionSection/Mission";
import History from "@/app/components/shared/about/HistorySection/History";
import BrandMark from "@/app/components/shared/about/BrandMarkSection/BrandMark";

export const metadata: Metadata = {
  title: "О нас",
  description:
    "CIRCLE — креативное агентство, которое раскрывает потенциал брендов через дизайн и маркетинг.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Mission />
      <History />
      <BrandMark />
    </>
  );
}
