"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { getMediaUrl } from "@/lib/media";
import styles from "./Package.module.scss";

const PACKAGE_KEYS = [
  {
    id: 1,
    titleKey: "base" as const,
    price: "1 500 000 тнг",
    durationKey: "duration45" as const,
    image: "/services/1.png",
    serviceCount: 5,
  },
  {
    id: 2,
    titleKey: "branding360" as const,
    price: "3 000 000 тнг",
    durationKey: "duration45" as const,
    image: "/services/2.png",
    serviceCount: 6,
  },
  {
    id: 3,
    titleKey: "bridge" as const,
    price: "2 000 000 тнг",
    durationKey: "duration23" as const,
    image: "/services/3.png",
    serviceCount: 4,
  },
  {
    id: 4,
    titleKey: "circle" as const,
    price: "5 000 000 тнг",
    durationKey: "duration45" as const,
    image: "/services/4.png",
    serviceCount: 7,
  },
  {
    id: 5,
    titleKey: "consulting" as const,
    price: "",
    durationKey: null,
    image: "/services/5.png",
    serviceCount: 7,
    isIndividual: true,
  },
] as const;

export default function Package() {
  const t = useTranslations("services");
  const tPackages = useTranslations("services.packages");
  const tContent = useTranslations("packageContent");

  return (
    <section className={styles.packages}>
      <Image
        src={getMediaUrl("/services/bg2.png")}
        alt=""
        fill
        sizes="100vw"
        quality={75}
        className={styles.bgImage}
      />
      <div className={styles.container}>
        <h1 className={styles.mainTitle}>{t("packagesTitle")}</h1>

        <div className={styles.packagesList}>
          {PACKAGE_KEYS.map((pkg) => {
            const isReversed = pkg.id % 2 === 0;
            const title = tPackages(pkg.titleKey);
            const duration = pkg.durationKey
              ? tPackages(pkg.durationKey)
              : null;
            const price = pkg.price === "" ? t("individualPrice") : pkg.price;

            return (
              <div
                key={pkg.id}
                className={`${styles.packageCard} ${isReversed ? styles.reversed : ""}`}
              >
                <div className={styles.textBlock}>
                  <h2 className={styles.packageTitle}>{title}</h2>
                  <div className={styles.servicesList}>
                    {Array.from({ length: pkg.serviceCount }).map((_, idx) => (
                      <div key={idx} className={styles.serviceItem}>
                        <span className={styles.serviceNum}>
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <div className={styles.serviceInfo}>
                          <h3 className={styles.serviceTitle}>
                            {tContent(`${pkg.titleKey}.s${idx}Title`)}
                          </h3>
                          <p className={styles.serviceDesc}>
                            {tContent(`${pkg.titleKey}.s${idx}Desc`)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.imageBlock}>
                  <Image
                    src={getMediaUrl(pkg.image)}
                    alt={title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    quality={75}
                    className={styles.packageImage}
                  />
                  <div className={styles.priceBlock}>
                    <div className={styles.priceInfo}>
                      <span className={styles.price}>{price}</span>
                      {duration && (
                        <span className={styles.duration}>{duration}</span>
                      )}
                    </div>
                    <button className={styles.consultBtn}>
                      {t("consultBtn")}
                    </button>
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
