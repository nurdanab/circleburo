"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./Footer.module.scss";
import { getMediaUrl } from "@/app/lib/media";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className={styles.footer}>

      <div className={styles.inner}>
        <div className={styles.left}>
          <Image
            src={getMediaUrl("/footer-logo.png")}
            alt="CIRCLE creative buro"
            width={72}
            height={24}
            className={styles.logo}
          />

          <p className={styles.description}>
            {t("description")}
          </p>
        </div>

        <div className={styles.right}>
          <h3 className={styles.contactsTitle}>{t("contacts")}</h3>

          <ul className={styles.contactsList}>
            <li className={styles.contactItem}>
              <Image src={getMediaUrl("/Call.svg")} alt="Phone" width={20} height={20} />
              <a href="tel:+77082686982">+7 708 268 69 82</a>
            </li>
            <li className={styles.contactItem}>
              <Image
                src={getMediaUrl("/Location.svg")}
                alt="Location"
                width={20}
                height={20}
              />
              <span>{t("address")}</span>
            </li>
            <li className={styles.contactItem}>
              <Image src={getMediaUrl("/Mail.svg")} alt="Email" width={20} height={20} />
              <a href="mailto:info@circleburo.kz">info@circleburo.kz</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
