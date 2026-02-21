import InterierHero from "@/components/shared/showCases/interier/InterierHero/InterierHero";
import InterierSlider from "@/components/shared/showCases/interier/interierBlocks/InterierSlider";
import { setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function InterierPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <InterierHero />
      <InterierSlider />
    </>
  );
}
