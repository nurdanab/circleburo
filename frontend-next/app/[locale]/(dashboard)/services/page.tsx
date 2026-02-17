import type { Metadata } from "next";
import PriceList from "@/app/components/shared/services/priceListSection/PriceList";
import Package from "@/app/components/shared/services/packagesSection/Package";

export const metadata: Metadata = {
  title: "Услуги",
  description:
    "Брендинг, визуальная идентичность, веб-дизайн, контент и другие услуги креативного агентства CIRCLE.",
};

export default function ServicesPage() {
  return (
    <>
      <PriceList />
      <Package />
    </>
  );
}
