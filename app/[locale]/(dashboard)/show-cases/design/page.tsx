import DesignBlocks from "@/components/shared/showCases/design/DesignBlocksSection/DesignBlocks";
import DesignHero from "@/components/shared/showCases/design/DesignHeroSection/DesignHero";
import { setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function DesignPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <DesignHero />
      <DesignBlocks />
    </>
  );
}
