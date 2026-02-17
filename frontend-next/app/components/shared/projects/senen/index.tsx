"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { getMediaUrl } from "@/app/lib/media";
import styles from "./senen.module.scss";

export default function SenenProject() {
  const t = useTranslations("senen");
  const tProjects = useTranslations("projects");

  return (
    <main className={styles.senenPage}>
      {/* SECTION 1 – HERO */}
      <section className={`${styles.section}`}>
        <div className={styles.heroInner}>
          <Image
            src={getMediaUrl("/projects-pages/senen/hero.png")}
            alt={t("title")}
            fill
            className={styles.sectionBg}
            priority
          />
        </div>
      </section>

      <section className={styles.section2}>
        <div>
          <span>{t("title")}</span>
          <p>{t("description1")}</p>
        </div>
        <div>
          <Image
            src={getMediaUrl("/projects-pages/senen/section1.png")}
            alt={t("title")}
            fill
            className={styles.sectionBg}
          />
        </div>
      </section>

      <section className={styles.section3}>
        <Image
          src={getMediaUrl("/projects-pages/senen/section2.png")}
          alt={t("title")}
          fill
          className={styles.sectionBg}
        />
      </section>

      <section className={styles.section4}>
        <p>{t("description1")}</p>
        <p>{t("description2")}</p>
      </section>

      <section className={styles.section5}>
        <div>
          <Image
            src={getMediaUrl("/projects-pages/senen/section3.png")}
            alt={t("title")}
            fill
            className={styles.sectionBg}
          />
        </div>
        <p>{t("description3")}</p>
      </section>

      <section className={styles.section6}>
        <div>
          <Image
            src={getMediaUrl("/projects-pages/senen/section4.png")}
            alt={t("title")}
            fill
            className={styles.sectionBg}
          />
        </div>
      </section>

      <section className={styles.section7}>
        <span>{tProjects("results")}</span>
        <p>{t("results")}</p>
      </section>
    </main>
  );
}
