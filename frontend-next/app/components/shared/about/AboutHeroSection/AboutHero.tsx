"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./AboutHero.module.scss";
import { getMediaUrl } from "@/app/lib/media";

export default function AboutHero() {
  const t = useTranslations("aboutPage");

  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <Image
          src={getMediaUrl("/about/about-hero.png")}
          alt={t("heroAlt")}
          fill
          className={styles.heroImage}
          priority
        />
        <div className={styles.content}>
          <h1 className={styles.title}>
            <span className={styles.titleLight}>{t("heroTitlePart1")}</span>
            <span className={styles.titleAccent}>{t("heroTitlePart2")}</span>
          </h1>
          <p className={styles.description}>
            {t("heroDescription").split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < t("heroDescription").split("\n").length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
