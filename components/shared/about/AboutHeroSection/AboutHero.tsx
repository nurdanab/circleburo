import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getMediaUrl } from "@/lib/media";
import styles from "./AboutHero.module.scss";

export default async function AboutHero() {
  const t = await getTranslations("about");

  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <Image
          src={getMediaUrl("/about/1.png")}
          alt={t("heroAlt")}
          fill
          sizes="100vw"
          quality={80}
          className={styles.heroImage}
        />
        <div className={styles.content}>
          <h1 className={styles.title}>
            <span className={styles.titleLight}>{t("heroTitle1")}</span>
            <span className={styles.titleAccent}>{t("heroTitle2")}</span>
          </h1>
          <p className={styles.description}>{t("heroDescription")}</p>
        </div>
      </div>
    </section>
  );
}
