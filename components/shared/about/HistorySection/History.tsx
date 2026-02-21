import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getMediaUrl } from "@/lib/media";
import styles from "./History.module.scss";

export default async function History() {
  const t = await getTranslations("about");

  return (
    <section className={styles.history}>
      <Image
        src={getMediaUrl("/about/3.png")}
        alt=""
        fill
        sizes="100vw"
        quality={75}
        className={styles.bgImage}
      />
      <div className={styles.content}>
        <div className={styles.imageBlock}>
          <Image
            src={getMediaUrl("/about/4.jpg")}
            alt={t("historyTeamAlt")}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={75}
            className={styles.handsImage}
          />
        </div>
        <div className={styles.textBlock}>
          <div className={styles.card}>
            <h2 className={styles.title}>{t("historyTitle")}</h2>
            <p className={styles.description}>{t("historyDescription")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}