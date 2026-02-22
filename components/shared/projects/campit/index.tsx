import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getMediaUrl } from "@/lib/media";
import styles from "./campit.module.scss";

export default async function Campit() {
  const t = await getTranslations("projects");
  return (
    <div className={styles.campit}>
      {/* SECTION 1 – HERO */}
      <section className={`${styles.section}`}>
        <div className={styles.heroInner}>
          <Image
            src={getMediaUrl("/projects-pages/campit/hero.png")}
            alt="Campit hero"
            fill
            sizes="100vw"
            quality={80}
            priority
            className={styles.sectionBg}
          />
        </div>
      </section>

      <div className={styles.sectionsWrapper}>
        {/* SECTION 2 */}
        <section className={styles.section2}>
          <div className={styles.section2Text}>
            <span>{t("campit.title")}</span>
            <p>{t("campit.description")}</p>
          </div>
          <div className={styles.section2VideoWrap}>
            <video
              src={getMediaUrl("/projects-pages/campit/section1.mp4")}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>
        </section>

        {/* SECTION 3 */}
        <section className={styles.section3}>
          <div className={styles.section3VideoWrap}>
            <video
              src={getMediaUrl("/projects-pages/campit/section2.mp4")}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>
          <div className={styles.section3Text}>
            <div className={styles.section3TextBlock}>
              {t("campit.section3p1")}
            </div>
            <div className={styles.section3TextBlock}>
              {t("campit.section3p2")}
            </div>
          </div>
        </section>

        {/* SECTION 4 */}
        <section className={styles.section4}>
          <div className={styles.section4Text}>
            {t("campit.section4")}
          </div>
          <div className={styles.section4ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/campit/section3.png")}
              alt="Campit"
              width={800}
              height={600}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        {/* SECTION 5 */}
        <section className={styles.section5}>
          <div className={styles.section5ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/campit/section4.png")}
              alt="Campit"
              width={600}
              height={900}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        {/* SECTION 6 */}
        <section className={styles.section6}>
          <span>{t("results")}</span>
          <p>{t("campit.resultsText")}</p>
        </section>
      </div>
    </div>
  );
}
