import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getMediaUrl } from "@/lib/media";
import styles from "./Mission.module.scss";

export default async function Mission() {
  const t = await getTranslations("about");

  return (
    <section className={styles.mission}>
      <div className={styles.missionInner}>
        <Image
          src={getMediaUrl("/about/2.png")}
          alt={t("missionAlt")}
          fill
          sizes="100vw"
          quality={75}
          className={styles.bgImage}
        />
        <div className={styles.card}>
          <h2 className={styles.title}>{t("missionTitle")}</h2>
          <p className={styles.description}>{t("missionDescription")}</p>
        </div>
      </div>
    </section>
  );
}
