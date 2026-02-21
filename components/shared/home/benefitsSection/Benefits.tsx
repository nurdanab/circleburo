"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getMediaUrl } from "@/lib/media";
import styles from "./Benefits.module.scss";

const BENEFIT_KEYS = [
  { title: "benefitsApproach", desc: "benefitsApproachDesc" },
  { title: "benefitsHonesty", desc: "benefitsHonestyDesc" },
  { title: "benefitsNoTemplates", desc: "benefitsNoTemplatesDesc" },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function Benefits() {
  const t = useTranslations("home");

  return (
    <section className={styles.benefits}>
      <Image
        src={getMediaUrl("/home/2.png")}
        alt="Benefits background"
        fill
        sizes="100vw"
        quality={75}
        className={styles.bgImage}
      />

      <motion.div
        className={styles.inner}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.4 }}
      >
        <motion.h2 className={styles.title} variants={itemVariants}>
          {t("benefitsTitle")}
        </motion.h2>

        <div className={styles.container}>
          {BENEFIT_KEYS.map((key) => (
            <motion.article
              key={key.title}
              className={styles.card}
              variants={itemVariants}
            >
              <h3 className={styles.cardTitle}>{t(key.title)}</h3>
              <p className={styles.cardText}>{t(key.desc)}</p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
