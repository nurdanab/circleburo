import WebBlocks from "@/components/shared/showCases/web/WebBlocksSection/WebBlocks";
import WebHero from "@/components/shared/showCases/web/WebHeroSection/WebHero";
import { setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function WebPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <WebHero />
      <WebBlocks />
    </>
  );
}
