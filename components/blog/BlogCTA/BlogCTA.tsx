"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getMediaUrl } from "@/lib/media";
import styles from "./BlogCTA.module.scss";

export default function BlogCTA() {
  const t = useTranslations("blog");

  return (
    <section className={styles.cta}>
      <Image
        src={getMediaUrl("/home/4.png")}
        alt=""
        fill
        sizes="100vw"
        className={styles.bgImage}
      />
      <div className={styles.content}>
        <h2 className={styles.title}>{t("cta.title")}</h2>
        <p className={styles.subtitle}>{t("cta.subtitle")}</p>
        <Link href="/services" className={styles.button}>
          {t("cta.button")}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 10H16M16 10L10 4M16 10L10 16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
