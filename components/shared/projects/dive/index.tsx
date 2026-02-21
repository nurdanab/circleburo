import ChartDive from "@/components/ui/chart-dive/ChartDive";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { getMediaUrl } from "@/lib/media";
import styles from "./dive.module.scss";

const SECTION3_PHOTOS = [
  { src: getMediaUrl("/projects-pages/dive/section2/slide1.png"), alt: "Dive — фото 1" },
  { src: getMediaUrl("/projects-pages/dive/section2/slide2.png"), alt: "Dive — фото 2" },
  { src: getMediaUrl("/projects-pages/dive/section2/slide3.png"), alt: "Dive — фото 3" },
  { src: getMediaUrl("/projects-pages/dive/section2/slide4.png"), alt: "Dive — фото 4" },
];

export default async function DiveProject() {
  const t = await getTranslations("projects");
  return (
    <>
      {/* SECTION 1 – HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <Image
            src={getMediaUrl("/projects-pages/dive/hero.png")}
            alt="Dive hero"
            fill
            sizes="100vw"
            quality={80}
            className={styles.heroImage}
          />
        </div>
      </section>

      <div className={styles.sectionsWrapper}>
        {/* SECTION 2 – текст слева, видео справа */}
        <section className={styles.section2}>
          <div className={styles.section2Text}>
            <div className={styles.section2TextBlock}>
              <span>{t("dive.title")}</span>
              <p>{t("dive.description")}</p>
            </div>
            <p className={styles.section2TextBlock2}>
              {t("dive.description2")}
            </p>
          </div>
          <div className={styles.section2VideoWrap}>
            <video
              src={getMediaUrl("/projects-pages/dive/section1.mp4")}
              playsInline
              muted
              loop
              autoPlay
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </section>

        {/* SECTION 3 – контейнер с 4 фото (3 полностью + 4-е на 10%) */}
        <section className={styles.section3}>
          <div className={styles.photosContainer}>
            {SECTION3_PHOTOS.map((photo, index) => (
              <div key={index} className={styles.photo}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={600}
                  height={400}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4 – изображение слева, текст справа */}
        <section className={styles.section4}>
          <div className={styles.section4ImgWrap}>
            <video
              src={getMediaUrl("/projects-pages/dive/secction2.mp4")}
              playsInline
              muted
              loop
              autoPlay
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className={styles.section4Text}>
            <p>{t("dive.section4p1")}</p>
            <p>{t("dive.section4p2")}</p>
          </div>
        </section>

        {/* SECTION 5 – текст + чарт */}
        <section className={styles.section5}>
          <div className={styles.section5Text}>
            <p>{t("dive.section5")}</p>
          </div>
          <div className={styles.section5Chart}>
            <ChartDive
              title={t("views")}
              period={t("dive.period")}
              total={12029}
              adsPercent={56.4}
              subscribersPercent={11.2}
              labelNonSubscribers={t("nonSubscribers")}
              percentNonSubscribers={88.8}
              labelSubscribers={t("subscribers")}
              percentSubscribers={11.2}
              reelsPercent={60.8}
              storiesPercent={39.2}
              reached={5622}
              reachedChange={594.1}
              interactions={170}
            />
          </div>
        </section>

        {/* SECTION 6 – полноширинное изображение */}
        <section className={styles.section6}>
          <div className={styles.section6ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/dive/section3.png")}
              alt="Dive"
              width={1200}
              height={675}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        {/* SECTION 7 – итоги */}
        <section className={styles.section7}>
          <span>{t("results")}</span>
          <p>{t("dive.resultsText")}</p>
        </section>
      </div>
    </>
  );
}
