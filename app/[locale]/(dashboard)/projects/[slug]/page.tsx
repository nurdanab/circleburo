import CampitProject from "@/components/shared/projects/campit";
import CitixProject from "@/components/shared/projects/citix";
import DiveProject from "@/components/shared/projects/dive";
import GalereyaProject from "@/components/shared/projects/galereya";
import HomeBankProject from "@/components/shared/projects/homeBank";
import SanyProject from "@/components/shared/projects/sany";
import SenenProject from "@/components/shared/projects/senen";
import SteppeCoffeeProject from "@/components/shared/projects/steppe-coffee";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";

const PROJECT_COMPONENTS: Record<string, ComponentType> = {
  "steppe-coffee": SteppeCoffeeProject,
  galeriya: GalereyaProject,
  campit: CampitProject,
  senen: SenenProject,
  sany: SanyProject,
  dive: DiveProject,
  citix: CitixProject,
  "home-bank": HomeBankProject,
};

type ProjectSlug = keyof typeof PROJECT_COMPONENTS;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const ProjectComponent = PROJECT_COMPONENTS[slug as ProjectSlug];

  if (!ProjectComponent) {
    notFound();
  }

  return <ProjectComponent />;
}
