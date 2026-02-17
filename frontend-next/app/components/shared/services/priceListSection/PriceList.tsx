"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./PriceList.module.scss";
import { getMediaUrl } from "@/app/lib/media";

export default function PriceList() {
  const t = useTranslations("servicesPage");

  const priceData = [
    {
      category: t("categories.marketing"),
      services: [
        { name: t("marketingServices.concept"), price: "250 000" },
        { name: t("marketingServices.miniEvents"), price: t("individualPrice") },
        { name: t("marketingServices.audit"), price: "250 000" },
      ],
    },
    {
      category: t("categories.design"),
      services: [
        { name: t("designServices.miniGuidebook"), price: "500 000" },
        { name: t("designServices.presentation"), price: "10 000" },
        { name: t("designServices.packaging"), price: t("individualPrice") },
        { name: t("designServices.animation2d"), price: "10 000" },
        { name: t("designServices.animation3d"), price: "20 000" },
        { name: t("designServices.visualization3d"), price: "35 000" },
        { name: t("designServices.posters"), price: "20 000" },
        { name: t("designServices.socialDesign"), price: "10 000" },
        { name: t("designServices.websiteReact"), price: "2,500,000-5,000,000" },
        { name: t("designServices.websiteTilda"), price: "1 000 000" },
        { name: t("designServices.websiteSupport"), price: "150 000" },
        { name: t("designServices.interiorDesign"), price: "30 000" },
        { name: t("designServices.interiorTurnkey"), price: "50 000" },
      ],
    },
    {
      category: t("categories.smm"),
      showIndividualPrice: true,
      services: [
        { name: t("smmServices.contentPlan"), price: "" },
        { name: t("smmServices.profileDesign"), price: "" },
        { name: t("smmServices.reels"), price: "" },
        { name: t("smmServices.stories"), price: "" },
        { name: t("smmServices.targetedAds"), price: "" },
      ],
    },
    {
      category: t("categories.production"),
      services: [
        { name: t("productionServices.videoEditing"), price: "100 000" },
        { name: t("productionServices.videoProduction"), price: "50 000" },
        { name: t("productionServices.photoShooting"), price: "35 000" },
      ],
    },
  ];

  return (
    <section className={styles.priceList}>
      <Image
        src={getMediaUrl("/services/priceList-bg.png")}
        alt=""
        fill
        className={styles.bgImage}
      />
      <div className={styles.container}>
        <h1 className={styles.mainTitle}>{t("priceListTitle")}</h1>

        <div className={styles.categories}>
          {priceData.map((category, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.categoryTitle}>{category.category}</h2>
                {category.showIndividualPrice && (
                  <span className={styles.individualNote}>{t("individualPrice")}</span>
                )}
              </div>
              <ul className={styles.servicesList}>
                {category.services.map((service, serviceIdx) => (
                  <li key={serviceIdx} className={styles.serviceItem}>
                    <span className={styles.serviceName}>{service.name}</span>
                    <span className={styles.dots}></span>
                    {service.price && (
                      <span className={styles.servicePrice}>{service.price}</span>
                    )}
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
