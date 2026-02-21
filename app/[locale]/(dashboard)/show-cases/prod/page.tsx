import ProdBlocks from "@/components/shared/showCases/prod/prodBlocks/prodBlocks";
import ProdHero from "@/components/shared/showCases/prod/prodHero/prodHero";
import { setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function ProdPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ProdHero />
      <ProdBlocks />
    </>
  );
}
