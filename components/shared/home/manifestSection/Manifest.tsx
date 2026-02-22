"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getMediaUrl } from "@/lib/media";
import styles from "./Manifest.module.scss";

export default function Manifest() {
  const t = useTranslations("home");

  return (
    <section className={styles.manifest}>
      <div className={styles.manifestInner}>
        <Image
          src={getMediaUrl("/home/manifest1.png")}
          alt="Manifest background"
          fill
          sizes="100vw"
          quality={75}
          loading="lazy"
          className={styles.bgImage}
        />

        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className={styles.title}>
            <span className={styles.brand}>{t("manifestTitle1")}</span>
            {t("manifestTitle2")}
            <br />
            {t("manifestTitle3")}
            <br />
            {t("manifestTitle4")}
          </h2>

          <p className={styles.subtitle}>{t("manifestSubtitle")}</p>
        </motion.div>
      </div>
    </section>
  );
}
