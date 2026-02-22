import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getMediaUrl } from "@/lib/media";
import styles from "./galereya.module.scss";

export default async function Galereya() {
  const t = await getTranslations("projects");
  return (
    <>
      {/* SECTION 1 – HERO */}
      <section className={styles.section}>
        <div className={styles.heroInner}>
          <Image
            src={getMediaUrl("/projects-pages/galereya/hero1.png")}
            alt="Galereya hero"
            fill
            sizes="100vw"
            quality={80}
            priority
          />
        </div>
      </section>

      <div className={styles.sectionsWrapper}>
        {/* SECTION 2 */}
        <section className={styles.section2}>
          <div className={styles.section2Text}>
            <span>{t("galereya.title")}</span>
            <p>{t("galereya.description")}</p>
          </div>
          <div className={styles.section2ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/galereya/section1.png")}
              alt="Galereya"
              width={600}
              height={980}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        {/* SECTION 3 */}
        <section className={styles.section3}>
          <div className={styles.section3VideoWrapper}>
            <video
              src={getMediaUrl("/projects-pages/galereya/section2.mp4")}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>
          <div className={styles.section3Text}>
            <p>{t("galereya.section3p1")}</p>
            <p>{t("galereya.section3p2")}</p>
          </div>
        </section>

        {/* SECTION 4 */}
        <section className={styles.section4}>
          <Image
            src={getMediaUrl("/projects-pages/galereya/Component3.png")}
            alt="Galereya"
            width={1440}
            height={700}
            style={{ width: "100%", height: "auto" }}
          />
        </section>

        <section className={styles.section5}>
          <p>{t("galereya.section5")}</p>
        </section>

        {/* SECTION 5 */}
        <section className={styles.section6}>
          <div className={styles.section6ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/galereya/section4_1.png")}
              alt="Galereya"
              width={350}
              height={675}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className={styles.section6ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/galereya/section4_2.png")}
              alt="Galereya"
              width={350}
              height={675}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className={styles.section6ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/galereya/section4_3.png")}
              alt="Galereya"
              width={350}
              height={675}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className={styles.section6ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/galereya/section4_4.png")}
              alt="Galereya"
              width={350}
              height={675}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        {/* SECTION 6 */}
        <section className={styles.section7}>
          <p>{t("galereya.section7")}</p>
        </section>

        <section className={styles.section8}>
          <Image
            src={getMediaUrl("/projects-pages/galereya/section5.png")}
            alt="Galereya"
            width={1440}
            height={660}
            style={{ width: "100%", height: "auto" }}
          />
        </section>

        {/* SECTION 8 */}
        <section className={styles.section9}>
          <div className={styles.section9Text}>
            <span>{t("results")}</span>
            <p>{t("galereya.resultsText")}</p>
          </div>
          <div className={styles.section9ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/galereya/section6.png")}
              alt="Galereya"
              width={630}
              height={870}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>
      </div>
    </>
  );
}
