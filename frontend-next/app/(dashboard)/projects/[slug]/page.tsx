import type { ComponentType } from "react";
import { notFound } from "next/navigation";

import GalereyaProject from "@/app/components/shared/projects/galereya";
import CampitProject from "@/app/components/shared/projects/campit";
import SteppeCoffeeProject from "@/app/components/shared/projects/steppe-coffee";
import SenenProject from "@/app/components/shared/projects/senen";
import SanyProject from "@/app/components/shared/projects/sany";
import DiveProject from "@/app/components/shared/projects/dive";
import CitixProject from "@/app/components/shared/projects/citix";
import HomeBankProject from "@/app/components/shared/projects/homeBank";

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

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const ProjectComponent = PROJECT_COMPONENTS[slug as ProjectSlug];

  if (!ProjectComponent) {
    notFound();
  }

  return <ProjectComponent />;
}
