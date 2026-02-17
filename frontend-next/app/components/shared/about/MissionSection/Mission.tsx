"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./Mission.module.scss";
import { getMediaUrl } from "@/app/lib/media";

export default function Mission() {
  const t = useTranslations("aboutPage");

  return (
    <section className={styles.mission}>
      <div className={styles.missionInner}>
        <Image
          src={getMediaUrl("/about/mission.png")}
          alt={t("missionAlt")}
          fill
          className={styles.bgImage}
        />
        <div className={styles.card}>
          <h2 className={styles.title}>{t("missionTitle")}</h2>
          <p className={styles.description}>
            {t("missionDescription").split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < t("missionDescription").split("\n").length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
