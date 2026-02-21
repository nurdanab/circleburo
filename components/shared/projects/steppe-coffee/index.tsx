import ChartSteppeCoffee from "@/components/ui/chart-steppe-coffee/ChartSteppeCoffee";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { getMediaUrl } from "@/lib/media";
import styles from "./steppe-coffee.module.scss";

export default async function SteppeCoffeeProject() {
  const t = await getTranslations("projects");
  return (
    <>
      {/* SECTION 1 – HERO */}
      <section className={`${styles.hero}`}>
        <div className={styles.heroInner}>
          <Image
            src={getMediaUrl("/projects-pages/steppe-coffee/hero.png")}
            alt="Steppe Coffee hero"
            fill
            sizes="100vw"
            quality={80}
          />
        </div>
      </section>

      <div className={styles.sectionsWrapper}>
        {/* SECTION 2 */}
        <section className={styles.section2}>
          <div className={styles.section2Text}>
            <span>{t("steppeCoffee.title")}</span>
            <p>{t("steppeCoffee.description")}</p>
          </div>

          <div className={styles.section2video}>
            <video
              src={getMediaUrl("/projects-pages/steppe-coffee/section2.mp4")}
              playsInline
              muted
              loop
              autoPlay
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </section>

        {/* SECTION 3 */}
        <section className={styles.section3}>
          <div className={styles.section3container}>
            <span>{t("before")}</span>
            <div className={styles.section3ImgWrap}>
              <Image
                src={getMediaUrl("/projects-pages/steppe-coffee/section-3-second.png")}
                alt="Steppe Coffee До"
                width={800}
                height={600}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
          <div className={styles.section3container}>
            <span>{t("after")}</span>
            <div className={styles.section3ImgWrap}>
              <Image
                src={getMediaUrl("/projects-pages/steppe-coffee/section-3.png")}
                alt="Steppe Coffee После"
                width={800}
                height={600}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </section>

        {/* SECTION 4 */}
        <section className={styles.section4}>
          <div className={styles.section4PhoneWrap}>
            <video
              src={getMediaUrl("/projects-pages/steppe-coffee/section4-video.mp4")}
              playsInline
              muted
              loop
              autoPlay
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
          <div className={styles.section4Right}>
            <div className={styles.section4TextBlock}>
              {t("steppeCoffee.section4p1")}
            </div>
            <div className={styles.section4TextBlock}>
              {t("steppeCoffee.section4p2")}
            </div>
            <div className={styles.section4ImgWrap}>
              <Image
                src={getMediaUrl("/projects-pages/steppe-coffee/section4-second.png")}
                alt="Steppe Coffee интерьер"
                width={800}
                height={500}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </section>

        {/* SECTION 5 */}
        <section className={styles.section5}>
          <div className={styles.section5ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/steppe-coffee/section5.png")}
              alt="Steppe Coffee section 5"
              width={1200}
              height={675}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        {/* SECTION 6 */}
        <section className={styles.section6}>
          <div className={styles.section6ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/steppe-coffee/section6.png")}
              alt="Steppe Coffee section 6"
              width={800}
              height={600}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className={styles.section6ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/steppe-coffee/section6-second.png")}
              alt="Steppe Coffee section 6"
              width={800}
              height={600}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        {/* SECTION 7 */}
        <section className={styles.section7}>
          <div className={styles.section7Card}>
            <div className={styles.section7Text}>
              {t("steppeCoffee.section7")}
            </div>
            <div className={styles.section7Chart}>
              <ChartSteppeCoffee
                title={t("views").toUpperCase()}
                period={t("steppeCoffee.periodSep")}
                total={35.647}
                label={t("views")}
                percentA={55.8}
                labelA={t("nonSubscribers")}
                percentB={44.2}
                labelB={t("subscribers")}
                reach={2190}
                reachChange={-65.5}
              />
            </div>
          </div>
          <div className={styles.section7PhoneWrap}>
            <div className={styles.phoneInner}>
              <video
                src={getMediaUrl("/projects-pages/steppe-coffee/section7-video.mp4")}
                playsInline
                muted
                loop
                autoPlay
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          </div>
        </section>

        {/* SECTION 8 */}
        <section className={styles.section8}>
          <div className={styles.section8Text}>
            <span>{t("inOctober")}</span>
            <p>{t("steppeCoffee.section8")}</p>
          </div>
          <div className={styles.section8Chart}>
            <ChartSteppeCoffee
              title={t("views").toUpperCase()}
              period={t("steppeCoffee.periodOct")}
              total={41.982}
              label={t("views")}
              percentA={54.0}
              labelA={t("nonSubscribers")}
              percentB={46.0}
              labelB={t("subscribers")}
              reach={4935}
              reachChange={+125.3}
            />
          </div>
        </section>

        {/* SECTION 9 */}
        <section className={styles.section9}>
          <div className={styles.section9ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/steppe-coffee/section9.png")}
              alt="Steppe Coffee section 9"
              width={600}
              height={800}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className={styles.section9Text}>
            {t("steppeCoffee.section9")}
          </div>
        </section>

        {/* SECTION 10 */}
        <section className={styles.section10}>
          <div className={styles.section10Text}>
            {t("steppeCoffee.section10")}
          </div>
          <div className={styles.section10ImgWrap}>
            <Image
              src={getMediaUrl("/projects-pages/steppe-coffee/section10.png")}
              alt="Steppe Coffee section 10"
              width={600}
              height={800}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        {/* SECTION 11 */}
        <section className={styles.section11}>
          <div className={styles.section11Img1Wrap}>
            <Image
              src={getMediaUrl("/projects-pages/steppe-coffee/section11.png")}
              alt="Steppe Coffee section 11"
              width={800}
              height={600}
              style={{ width: "100%", height: "auto" }}
            />
          </div>

          <div className={styles.section11Img2Wrap}>
            <Image
              src={getMediaUrl("/projects-pages/steppe-coffee/section11-second.png")}
              alt="Steppe Coffee section 11"
              width={800}
              height={600}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        <section className={styles.section12}>
          <span>{t("results")}</span>
          <p>{t("steppeCoffee.resultsText")}</p>
        </section>

        {/* SECTION 12 */}
        <section className={styles.section13}>
          <Image
            src={getMediaUrl("/projects-pages/steppe-coffee/section12.png")}
            alt="Steppe Coffee section 13"
            width={1200}
            height={750}
            style={{ width: "100%", height: "auto" }}
          />
        </section>
      </div>
    </>
  );
}
