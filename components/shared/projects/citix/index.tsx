import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getMediaUrl } from "@/lib/media";
import styles from "./citix.module.scss";

export default async function CitixProject() {
  const t = await getTranslations("projects");
  return (
    <div className={styles.citix}>
      {/* SECTION 1 – HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <Image
            src={getMediaUrl("/projects-pages/citix/hero.png")}
            alt="Citix hero"
            fill
            sizes="100vw"
            quality={80}
            priority
            className={styles.heroImage}
          />
        </div>
      </section>

      <div className={styles.sectionsWrapper}>
        {/* SECTION 2 – текст слева, видео справа */}
        <section className={styles.section2}>
          <div className={styles.section2Text}>
            <span>{t("citix.title")}</span>
            <p>{t("citix.description")}</p>
          </div>

          <div className={styles.section2video}>
            <video
              src={getMediaUrl("/projects-pages/citix/section1.mp4")}
              playsInline
              muted
              loop
              autoPlay
              preload="metadata"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </section>

        {/* SECTION 3 – видео слева, текст справа */}
        <section className={styles.section3}>
          <div className={styles.section3VideoWrap}>
            <video
              src={getMediaUrl("/projects-pages/citix/section2.mp4")}
              playsInline
              muted
              loop
              autoPlay
              preload="metadata"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div className={styles.section3Text}>
            <p>{t("citix.section3p1")}</p>
            <p>{t("citix.section3p2")}</p>
          </div>
        </section>

        {/* SECTION 4 – итоги слева, видео справа */}
        <section className={styles.section4}>
          <div className={styles.section4Text}>
            <span>{t("results")}</span>
            <p>{t("citix.resultsText")}</p>
          </div>
          <div className={styles.section4VideoWrap}>
            <video
              src={getMediaUrl("/projects-pages/citix/section3.mp4")}
              playsInline
              muted
              loop
              autoPlay
              preload="metadata"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
