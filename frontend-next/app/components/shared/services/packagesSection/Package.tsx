"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import styles from "./Package.module.scss";
import { getMediaUrl } from "@/app/lib/media";

export default function Package() {
  const t = useTranslations("servicesPage");

  const packagesData = [
    {
      id: 1,
      title: t("packages.productBase.title"),
      price: t("packages.productBase.price"),
      duration: `${t("term")} ${t("packages.productBase.duration")} ${t("workingDays")}`,
      image: "/services/package-1.png",
      services: [
        {
          num: "01",
          title: t("packages.productBase.services.s1title"),
          desc: t("packages.productBase.services.s1desc"),
        },
        {
          num: "02",
          title: t("packages.productBase.services.s2title"),
          desc: t("packages.productBase.services.s2desc"),
        },
        {
          num: "03",
          title: t("packages.productBase.services.s3title"),
          desc: t("packages.productBase.services.s3desc"),
        },
        {
          num: "04",
          title: t("packages.productBase.services.s4title"),
          desc: t("packages.productBase.services.s4desc"),
        },
        {
          num: "05",
          title: t("packages.productBase.services.s5title"),
          desc: t("packages.productBase.services.s5desc"),
        },
      ],
    },
    {
      id: 2,
      title: t("packages.branding360.title"),
      price: t("packages.branding360.price"),
      duration: `${t("term")} ${t("packages.branding360.duration")} ${t("workingDays")}`,
      image: "/services/package-2.png",
      services: [
        {
          num: "01",
          title: t("packages.branding360.services.s1title"),
          desc: t("packages.branding360.services.s1desc"),
        },
        {
          num: "02",
          title: t("packages.branding360.services.s2title"),
          desc: t("packages.branding360.services.s2desc"),
        },
        {
          num: "03",
          title: t("packages.branding360.services.s3title"),
          desc: t("packages.branding360.services.s3desc"),
        },
        {
          num: "04",
          title: t("packages.branding360.services.s4title"),
          desc: t("packages.branding360.services.s4desc"),
        },
        {
          num: "05",
          title: t("packages.branding360.services.s5title"),
          desc: t("packages.branding360.services.s5desc"),
        },
        {
          num: "06",
          title: t("packages.branding360.services.s6title"),
          desc: t("packages.branding360.services.s6desc"),
        },
      ],
    },
    {
      id: 3,
      title: t("packages.marketBridge.title"),
      price: t("packages.marketBridge.price"),
      duration: `${t("term")} ${t("packages.marketBridge.duration")} ${t("workingDays")}`,
      image: "/services/package-3.png",
      services: [
        {
          num: "01",
          title: t("packages.marketBridge.services.s1title"),
          desc: t("packages.marketBridge.services.s1desc"),
        },
        {
          num: "02",
          title: t("packages.marketBridge.services.s2title"),
          desc: t("packages.marketBridge.services.s2desc"),
        },
        {
          num: "03",
          title: t("packages.marketBridge.services.s3title"),
          desc: t("packages.marketBridge.services.s3desc"),
        },
        {
          num: "04",
          title: t("packages.marketBridge.services.s4title"),
          desc: t("packages.marketBridge.services.s4desc"),
        },
      ],
    },
    {
      id: 4,
      title: t("packages.circlePackage.title"),
      price: t("packages.circlePackage.price"),
      duration: `${t("term")} ${t("packages.circlePackage.duration")} ${t("workingDays")}`,
      image: "/services/package-4.png",
      services: [
        {
          num: "01",
          title: t("packages.circlePackage.services.s1title"),
          desc: t("packages.circlePackage.services.s1desc"),
        },
        {
          num: "02",
          title: t("packages.circlePackage.services.s2title"),
          desc: t("packages.circlePackage.services.s2desc"),
        },
        {
          num: "03",
          title: t("packages.circlePackage.services.s3title"),
          desc: t("packages.circlePackage.services.s3desc"),
        },
        {
          num: "04",
          title: t("packages.circlePackage.services.s4title"),
          desc: t("packages.circlePackage.services.s4desc"),
        },
        {
          num: "05",
          title: t("packages.circlePackage.services.s5title"),
          desc: t("packages.circlePackage.services.s5desc"),
        },
        {
          num: "06",
          title: t("packages.circlePackage.services.s6title"),
          desc: t("packages.circlePackage.services.s6desc"),
        },
        {
          num: "07",
          title: t("packages.circlePackage.services.s7title"),
          desc: t("packages.circlePackage.services.s7desc"),
        },
      ],
    },
    {
      id: 5,
      title: t("packages.creativeConsulting.title"),
      price: t("packages.creativeConsulting.price"),
      isIndividual: true,
      image: "/services/package-5.png",
      services: [
        {
          num: "01",
          title: t("packages.creativeConsulting.services.s1title"),
          desc: t("packages.creativeConsulting.services.s1desc"),
        },
        {
          num: "02",
          title: t("packages.creativeConsulting.services.s2title"),
          desc: t("packages.creativeConsulting.services.s2desc"),
        },
        {
          num: "03",
          title: t("packages.creativeConsulting.services.s3title"),
          desc: t("packages.creativeConsulting.services.s3desc"),
        },
        {
          num: "04",
          title: t("packages.creativeConsulting.services.s4title"),
          desc: t("packages.creativeConsulting.services.s4desc"),
        },
        {
          num: "05",
          title: t("packages.creativeConsulting.services.s5title"),
          desc: t("packages.creativeConsulting.services.s5desc"),
        },
        {
          num: "06",
          title: t("packages.creativeConsulting.services.s6title"),
          desc: t("packages.creativeConsulting.services.s6desc"),
        },
        {
          num: "07",
          title: t("packages.creativeConsulting.services.s7title"),
          desc: t("packages.creativeConsulting.services.s7desc"),
        },
      ],
    },
  ];

  return (
    <section className={styles.packages}>
      <Image
        src={getMediaUrl("/services/package-bg.png")}
        alt=""
        fill
        className={styles.bgImage}
      />
      <div className={styles.container}>
        <h1 className={styles.mainTitle}>{t("packagesTitle")}</h1>

        <div className={styles.packagesList}>
          {packagesData.map((pkg) => {
            const isReversed = pkg.id % 2 === 0;

            return (
              <div
                key={pkg.id}
                className={`${styles.packageCard} ${isReversed ? styles.reversed : ""}`}
              >
                <div className={styles.textBlock}>
                  <h2 className={styles.packageTitle}>{pkg.title}</h2>
                  <div className={styles.servicesList}>
                    {pkg.services.map((service, idx) => (
                      <div key={idx} className={styles.serviceItem}>
                        <span className={styles.serviceNum}>{service.num}</span>
                        <div className={styles.serviceInfo}>
                          <h3 className={styles.serviceTitle}>{service.title}</h3>
                          <p className={styles.serviceDesc}>{service.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.imageBlock}>
                  <Image
                    src={getMediaUrl(pkg.image)}
                    alt={pkg.title}
                    fill
                    className={styles.packageImage}
                  />
                  <div className={styles.priceBlock}>
                    <div className={styles.priceInfo}>
                      <span className={styles.price}>{pkg.price}</span>
                      {pkg.duration && (
                        <span className={styles.duration}>{pkg.duration}</span>
                      )}
                    </div>
                    <Link href="/contact" className={styles.consultBtn}>
                      {t("bookConsultation")}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
