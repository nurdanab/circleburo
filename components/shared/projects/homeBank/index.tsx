import InterierSlider from "@/components/shared/showCases/interier/interierBlocks/InterierSlider";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { getMediaUrl } from "@/lib/media";
import styles from "./homeBank.module.scss";

export default async function HomeBankProject() {
  const t = await getTranslations("projects");
  return (
    <>
      {/* SECTION 1 – HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <Image
            src={getMediaUrl("/projects-pages/homeBank/hero.png")}
            alt="Home Bank hero"
            fill
            sizes="100vw"
            quality={80}
            className={styles.heroImage}
          />
        </div>
      </section>

      <div className={styles.sectionsWrapper}>
        {/* SECTION 2 – изображение слева, текст справа */}
        <section className={styles.section2}>
          <div className={styles.section2ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/homeBank/section1.png")}
              alt="Home Bank"
              width={600}
              height={800}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className={styles.section2Text}>
            <span>{t("homeBank.title")}</span>
            <p>{t("homeBank.description")}</p>
          </div>
        </section>

        {/* SECTION 3 – два изображения */}
        <section className={styles.section3}>
          <div className={styles.section3ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/homeBank/section2_1.png")}
              alt="Home Bank"
              width={600}
              height={800}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className={styles.section3ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/homeBank/section2_2.png")}
              alt="Home Bank"
              width={600}
              height={800}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        {/* SECTION 4 – текст слева, изображение справа */}
        <section className={styles.section4}>
          <div className={styles.section4Text}>
            <p>{t("homeBank.section4")}</p>
          </div>
          <div className={styles.section4ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/homeBank/section3.png")}
              alt="Home Bank исследование"
              width={700}
              height={520}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        {/* SECTION 5 – изображение слева, текст справа */}
        <section className={styles.section5}>
          <div className={styles.section5ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/homeBank/section4.png")}
              alt="Home Bank"
              width={700}
              height={520}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className={styles.section5Text}>
            <p>{t("homeBank.section5")}</p>
          </div>
        </section>

        {/* SECTION 6 – текст слева, изображение справа */}
        <section className={styles.section6}>
          <div className={styles.section6Text}>
            <p>{t("homeBank.section6")}</p>
          </div>
          <div className={styles.section6ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/homeBank/section5.png")}
              alt="Home Bank"
              width={700}
              height={520}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        {/* SECTION 7 – изображение слева, текст справа */}
        <section className={styles.section7}>
          <div className={styles.section7ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/homeBank/section6.png")}
              alt="Home Bank концепция"
              width={700}
              height={520}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className={styles.section7Text}>
            <p>{t("homeBank.section7")}</p>
          </div>
        </section>

        {/* SECTION 8 – текст слева, изображение справа */}
        <section className={styles.section8}>
          <div className={styles.section8Text}>
            <p>{t("homeBank.section8")}</p>
          </div>
          <div className={styles.section8ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/homeBank/section7.png")}
              alt="Home Bank приложение"
              width={700}
              height={520}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        {/* SECTION 9 – слайдер (InterierSlider) */}
        <section className={styles.section9}>
          <InterierSlider />
        </section>

        {/* SECTION 10 – два изображения */}
        <section className={styles.section10}>
          <div className={styles.section10ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/homeBank/section9_1.png")}
              alt="Home Bank"
              width={600}
              height={800}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className={styles.section10ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/homeBank/section9_2.png")}
              alt="Home Bank"
              width={600}
              height={800}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        {/* SECTION 11 – итоги */}
        <section className={styles.section11}>
          <span>{t("results")}</span>
          <p>{t("homeBank.resultsText")}</p>
        </section>
      </div>
    </>
  );
}
