import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getMediaUrl } from "@/lib/media";
import styles from "./senen.module.scss";

export default async function SenenProject() {
  const t = await getTranslations("projects");
  return (
    <>
      {/* SECTION 1 – HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <Image
            src={getMediaUrl("/projects-pages/senen/hero.png")}
            alt="Senen hero"
            fill
            sizes="100vw"
            quality={80}
            className={styles.heroImage}
          />
        </div>
      </section>

      <div className={styles.sectionsWrapper}>
        {/* SECTION 2 – текст слева, изображение справа */}
        <section className={styles.section2}>
          <div className={styles.section2Text}>
            <span>{t("senen.title")}</span>
            <p>{t("senen.description")}</p>
          </div>
          <div className={styles.section2ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/senen/section1.png")}
              alt="Senen подарочные боксы"
              width={600}
              height={800}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        {/* SECTION 3 – полноширинное изображение */}
        <section className={styles.section3}>
          <div className={styles.section3ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/senen/section2.png")}
              alt="Senen"
              width={1440}
              height={700}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        {/* SECTION 4 – текст по центру */}
        <section className={styles.section4}>
          <p>{t("senen.section4p1")}</p>
          <p>{t("senen.section4p2")}</p>
        </section>

        {/* SECTION 5 – изображение слева, текст справа */}
        <section className={styles.section5}>
          <div className={styles.section5ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/senen/section3.png")}
              alt="Senen упаковка"
              width={700}
              height={520}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className={styles.section5Text}>
            <p>{t("senen.section5")}</p>
          </div>
        </section>

        {/* SECTION 6 – полноширинное изображение */}
        <section className={styles.section6}>
          <div className={styles.section6ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/senen/section4.png")}
              alt="Senen"
              width={1440}
              height={800}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        {/* SECTION 7 – итоги */}
        <section className={styles.section7}>
          <span>{t("results")}</span>
          <p>{t("senen.resultsText")}</p>
        </section>
      </div>
    </>
  );
}
