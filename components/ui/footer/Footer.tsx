"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { getMediaUrl } from "@/lib/media";
import styles from "./Footer.module.scss";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Image
            src={getMediaUrl("/footer-icon.svg")}
            unoptimized
            alt={t("logoAlt")}
            width={180}
            height={60}
            className={styles.logo}
          />

          <p className={styles.description}>{t("description")}</p>
        </div>

        <div className={styles.right}>
          <h3 className={styles.contactsTitle}>{t("contactsTitle")}</h3>

          <ul className={styles.contactsList}>
            <li className={styles.contactItem}>
              <Image src={getMediaUrl("/Call.svg")} alt={t("phoneAlt")} width={20} height={20} unoptimized />
              <a href="tel:+77082686982">+7 708 268 69 82</a>
            </li>
            <li className={styles.contactItem}>
              <Image
                src={getMediaUrl("/Location.svg")}
                alt={t("locationAlt")}
                width={20}
                height={20}
                unoptimized
              />
              <span>{t("address")}</span>
            </li>
            <li className={styles.contactItem}>
              <Image src={getMediaUrl("/Mail.svg")} alt={t("emailAlt")} width={20} height={20} unoptimized />
              <a href="mailto:info@circleburo.kz">info@circleburo.kz</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
