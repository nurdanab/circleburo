"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getMediaUrl } from "@/lib/media";
import styles from "./Services.module.scss";

const SERVICE_KEYS = [
  { title: "servicesMotion", desc: "servicesMotionDesc" },
  { title: "servicesWeb", desc: "servicesWebDesc" },
  { title: "servicesSmm", desc: "servicesSmmDesc" },
  { title: "servicesMarketing", desc: "servicesMarketingDesc" },
  { title: "servicesDesign", desc: "servicesDesignDesc" },
  { title: "servicesInterior", desc: "servicesInteriorDesc" },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function Services() {
  const t = useTranslations("home");

  return (
    <section className={styles.services} id="services">
      <Image
        src={getMediaUrl("/home/3.png")}
        alt="Services background"
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
          {t("servicesTitle")}
        </motion.h2>

        <div className={styles.grid}>
          {SERVICE_KEYS.map((key) => (
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

        <motion.div variants={itemVariants}>
          <Link href="/services" className={styles.btn}>
            {t("servicesMore")} <span className={styles.arrow}>→</span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
