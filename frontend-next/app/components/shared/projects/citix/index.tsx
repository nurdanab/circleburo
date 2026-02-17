"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { getMediaUrl } from "@/app/lib/media";
import styles from "./citix.module.scss";

export default function CitixProject() {
  const t = useTranslations("citix");
  const tProjects = useTranslations("projects");

  return (
    <main className={styles.citixPage}>
      {/* SECTION 1 – HERO */}
      <section className={`${styles.section}`}>
        <div className={styles.heroInner}>
          <Image
            src={getMediaUrl("/projects-pages/citix/hero.png")}
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
          <video autoPlay muted loop playsInline className={styles.sectionBg}>
            <source
              src={getMediaUrl("/projects-pages/citix/section1.mp4")}
              type="video/mp4"
            />
          </video>
        </div>
      </section>

      <section className={styles.section3}>
        <div>
          <span>{tProjects("results")}</span>
          <p>{t("results")}</p>
        </div>

        <div>
          <video autoPlay muted loop playsInline className={styles.sectionBg}>
            <source
              src={getMediaUrl("/projects-pages/citix/section2.mp4")}
              type="video/mp4"
            />
          </video>
        </div>
      </section>
    </main>
  );
}
