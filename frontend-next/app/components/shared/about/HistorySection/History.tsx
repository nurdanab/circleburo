"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./History.module.scss";
import { getMediaUrl } from "@/app/lib/media";

export default function History() {
  const t = useTranslations("aboutPage");

  return (
    <section className={styles.history}>
      <Image
        src={getMediaUrl("/about/about-history-bg.png")}
        alt=""
        fill
        className={styles.bgImage}
      />
      <div className={styles.content}>
        <div className={styles.imageBlock}>
          <Image
            src={getMediaUrl("/about/about-hands.jpg")}
            alt={t("historyAlt")}
            fill
            className={styles.handsImage}
          />
        </div>
        <div className={styles.textBlock}>
          <div className={styles.card}>
            <h2 className={styles.title}>{t("historyTitle")}</h2>
            <p className={styles.description}>
              {t("historyDescription")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}