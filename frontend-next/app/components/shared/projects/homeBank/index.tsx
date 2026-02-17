"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import InterierSlider from "@/app/components/shared/showCases/interier/interierBlocks/InterierSlider";

import { getMediaUrl } from "@/app/lib/media";
import styles from "./homeBank.module.scss";

export default function HomeBankProject() {
  const t = useTranslations("homeBank");
  const tProjects = useTranslations("projects");

  return (
    <main className={styles.steppeCoffeePage}>
      {/* SECTION 1 – HERO */}
      <section className={`${styles.section}`}>
        <div className={styles.heroInner}>
          <Image
            src={getMediaUrl("/projects-pages/homeBank/hero.png")}
            alt={t("title")}
            fill
            className={styles.sectionBg}
            priority
          />
        </div>
      </section>

      <section className={styles.section2}>
        <div>
          <Image
            src={getMediaUrl("/projects-pages/homeBank/section1.png")}
            alt={t("title")}
            fill
            className={styles.sectionBg}
          />
        </div>
        <div>
          <span>{t("title")}</span>
          <p>{t("description1")}</p>
        </div>
      </section>

      <section className={styles.section3}>
        <div>
          <Image
            src={getMediaUrl("/projects-pages/homeBank/section2_1.png")}
            alt={t("title")}
            fill
            className={styles.sectionBg}
          />
        </div>
        <div>
          <Image
            src={getMediaUrl("/projects-pages/homeBank/section2_2.png")}
            alt={t("title")}
            fill
            className={styles.sectionBg}
          />
        </div>
      </section>

      <section className={styles.section4}>
        <div>
          <p>{t("description2")}</p>
        </div>
        <div>
          <Image
            src={getMediaUrl("/projects-pages/homeBank/section3.png")}
            alt={t("title")}
            fill
            className={styles.sectionBg}
          />
        </div>
      </section>

      <section className={styles.section5}>
        <div>
          <Image
            src={getMediaUrl("/projects-pages/homeBank/section4.png")}
            alt={t("title")}
            fill
            className={styles.sectionBg}
          />
        </div>
        <div>
          <p>{t("description3")}</p>
        </div>
      </section>

      <section className={styles.section6}>
        <div>
          <p>{t("description4")}</p>
        </div>
        <div>
          <Image
            src={getMediaUrl("/projects-pages/homeBank/section5.png")}
            alt={t("title")}
            fill
            className={styles.sectionBg}
          />
        </div>
      </section>
      <section className={styles.section7}>
        <div>
          <Image
            src={getMediaUrl("/projects-pages/homeBank/section6.png")}
            alt={t("title")}
            fill
            className={styles.sectionBg}
          />
        </div>
        <div>
          <p>{t("description5")}</p>
        </div>
      </section>
      <section className={styles.section8}>
        <div>
          <p>{t("description6")}</p>
        </div>
        <div>
          <Image
            src={getMediaUrl("/projects-pages/homeBank/section7.png")}
            alt={t("title")}
            fill
            className={styles.sectionBg}
          />
        </div>
      </section>
      <section className={styles.section9}>
        <InterierSlider />
      </section>
      <section className={styles.section10}>
        <div>
          <Image
            src={getMediaUrl("/projects-pages/homeBank/section9_1.png")}
            alt={t("title")}
            fill
            className={styles.sectionBg}
          />
        </div>
        <div>
          <Image
            src={getMediaUrl("/projects-pages/homeBank/section9_2.png")}
            alt={t("title")}
            fill
            className={styles.sectionBg}
          />
        </div>
      </section>

      <section className={styles.section11}>
        <span>{tProjects("results")}</span>
        <p>{t("results")}</p>
      </section>
    </main>
  );
}
