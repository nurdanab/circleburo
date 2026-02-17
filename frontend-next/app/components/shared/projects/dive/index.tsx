"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import ChartDive from "@/app/components/ui/chart-dive/ChartDive";
import { getMediaUrl } from "@/app/lib/media";
import styles from "./dive.module.scss";

export default function DiveProject() {
  const t = useTranslations("dive");
  const tProjects = useTranslations("projects");

  return (
    <main className={styles.steppeCoffeePage}>
      {/* SECTION 1 – HERO */}
      <section className={`${styles.section}`}>
        <div className={styles.heroInner}>
          <Image
            src={getMediaUrl("/projects-pages/dive/hero.png")}
            alt={t("title")}
            fill
            className={styles.sectionBg}
            priority
          />
        </div>
      </section>

      <section className={styles.section2}>
        <div>
          <div>
            <span>{t("title")}</span>
            <p>{t("description1")}</p>
          </div>
          <div>
            <p>{t("description2")}</p>
          </div>
        </div>
        <video autoPlay muted loop playsInline className={styles.sectionBg}>
          <source
            src={getMediaUrl("/projects-pages/dive/section1.mp4")}
            type="video/mp4"
          />
        </video>
      </section>

      <section className={styles.section3}>
        <div>
          <Image
            src={getMediaUrl("/projects-pages/dive/section2/slide1.png")}
            alt={`${t("title")} slide 1`}
            fill
            className={styles.sectionBg}
          />
        </div>
        <div>
          <Image
            src={getMediaUrl("/projects-pages/dive/section2/slide2.png")}
            alt={`${t("title")} slide 2`}
            fill
            className={styles.sectionBg}
          />
        </div>
        <div>
          <Image
            src={getMediaUrl("/projects-pages/dive/section2/slide3.png")}
            alt={`${t("title")} slide 3`}
            fill
            className={styles.sectionBg}
          />
        </div>
        <div>
          <Image
            src={getMediaUrl("/projects-pages/dive/section2/slide4.png")}
            alt={`${t("title")} slide 4`}
            fill
            className={styles.sectionBg}
          />
        </div>
        <div>
          <Image
            src={getMediaUrl("/projects-pages/dive/section2/slide5.png")}
            alt={`${t("title")} slide 5`}
            fill
            className={styles.sectionBg}
          />
        </div>
      </section>

      <section className={styles.section4}>
        <Image
          src={getMediaUrl("/projects-pages/dive/section3.png")}
          alt={t("title")}
          fill
          className={styles.sectionBg}
        />
        <div>
          <p>{t("description3")}</p>
          <p>{t("description4")}</p>
        </div>
      </section>

      <section className={styles.section5}>
        <p>{t("description4")}</p>
        <ChartDive
          title={t("views")}
          period={t("period")}
          total={12029}
          subLabel={`56,4% ${t("fromAds")}`}
          percentMain={88.8}
          percentSubscribers={11.2}
          labelMain={t("nonSubscribers")}
          labelSubscribers={t("subscribers")}
        />
      </section>

      <section className={styles.section6}>
        <Image
          src={getMediaUrl("/projects-pages/dive/section2/slide6.png")}
          alt={t("title")}
          fill
          className={styles.sectionBg}
        />
      </section>
      <section className={styles.section7}>
        <span>{tProjects("results")}</span>
        <p>{t("results")}</p>
      </section>
    </main>
  );
}
