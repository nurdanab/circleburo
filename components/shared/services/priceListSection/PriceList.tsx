"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { getMediaUrl } from "@/lib/media";
import styles from "./PriceList.module.scss";

const priceDataStructure = [
  {
    categoryKey: "marketing" as const,
    showIndividualPrice: false,
    services: [
      { nameKey: "concept" as const, price: "250 000" },
      { nameKey: "miniEvents" as const, price: "individual" },
      { nameKey: "audit" as const, price: "250 000" },
    ],
  },
  {
    categoryKey: "design" as const,
    showIndividualPrice: false,
    services: [
      { nameKey: "miniguide" as const, price: "500 000" },
      { nameKey: "presentation" as const, price: "10 000" },
      { nameKey: "packaging" as const, price: "individual" },
      { nameKey: "animation2d" as const, price: "10 000" },
      { nameKey: "animation3d" as const, price: "20 000" },
      { nameKey: "visual3d" as const, price: "35 000" },
      { nameKey: "posters" as const, price: "20 000" },
      { nameKey: "smmDesign" as const, price: "10 000" },
      { nameKey: "websiteReact" as const, price: "2,500,000-5,000,000" },
      { nameKey: "websiteTilda" as const, price: "1 000 000" },
      { nameKey: "support" as const, price: "150 000" },
      { nameKey: "interiorPerSqm" as const, price: "30 000" },
      { nameKey: "interiorTurnkey" as const, price: "50 000" },
    ],
  },
  {
    categoryKey: "smm" as const,
    showIndividualPrice: true,
    services: [
      { nameKey: "contentPlan" as const, price: "" },
      { nameKey: "profile" as const, price: "" },
      { nameKey: "reels" as const, price: "" },
      { nameKey: "stories" as const, price: "" },
      { nameKey: "targeting" as const, price: "" },
    ],
  },
  {
    categoryKey: "production" as const,
    showIndividualPrice: false,
    services: [
      { nameKey: "videoEdit" as const, price: "100 000" },
      { nameKey: "videoProd" as const, price: "50 000" },
      { nameKey: "photo" as const, price: "35 000" },
    ],
  },
];

export default function PriceList() {
  const t = useTranslations("services");
  const tCategories = useTranslations("services.categories");
  const tPriceList = useTranslations("services.priceList");

  return (
    <section className={styles.priceList}>
      <Image
        src={getMediaUrl("/services/bg1.png")}
        alt=""
        fill
        sizes="100vw"
        quality={75}
        className={styles.bgImage}
      />
      <div className={styles.container}>
        <h1 className={styles.mainTitle}>{t("pricesTitle")}</h1>

        <div className={styles.categories}>
          {priceDataStructure.map((category, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.categoryTitle}>
                  {tCategories(category.categoryKey)}
                </h2>
                {category.showIndividualPrice && (
                  <span className={styles.individualNote}>
                    {t("individualPrice")}
                  </span>
                )}
              </div>
              <ul className={styles.servicesList}>
                {category.services.map((service, serviceIdx) => (
                  <li key={serviceIdx} className={styles.serviceItem}>
                    <span className={styles.serviceName}>
                      {tPriceList(
                        `${category.categoryKey}.${service.nameKey}` as "marketing.concept"
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
