"use client";

import Image from "next/image";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import styles from "./Header.module.scss";
import { MobileMenu } from "../mobileBar/MobileMenu";
import ShowCaseTabs from "../showCaseTabs/ShowCaseTabs";
import { getMediaUrl } from "@/app/lib/media";
import type { Locale } from "@/i18n/routing";

const LOCALE_LABELS: Record<Locale, string> = {
  ru: "РУС",
  kz: "ҚАЗ",
  en: "ENG",
  cn: "中文",
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as Locale;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link href="/" className={styles.logoBlock}>
            <Image
              src={getMediaUrl("/Logo.svg")}
              alt="CIRCLE creative buro"
              width={48}
              height={48}
              className={styles.logoImage}
            />
          </Link>

          <nav className={styles.nav}>
            <ul className={styles.navList}>
              <li>
                <Link href="/about" className={styles.navLink}>
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link href="/services" className={styles.navLink}>
                  {t("services")}
                </Link>
              </li>
              <li>
                <Link href="/projects" className={styles.navLink}>
                  {t("projects")}
                </Link>
              </li>
              <li>
                <Link href="/show-cases" className={styles.navLink}>
                  {t("showCases")}
                </Link>
              </li>
            </ul>
          </nav>

          <div className={styles.actions}>
            <select
              className={styles.langSelect}
              value={locale}
              onChange={handleLocaleChange}
              aria-label="Language"
            >
              {Object.entries(LOCALE_LABELS).map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
            <Link href="/contact" className={styles.ctaButton}>
              {t("contact")}
            </Link>
            <button
              type="button"
              className={styles.burgerButton}
              aria-label="Open menu"
              onClick={() => setIsMenuOpen(true)}
            >
              <Image src={getMediaUrl("/burger-menu.svg")} alt="Menu" width={32} height={32} />
            </button>
          </div>
          <MobileMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
          />
        </div>

        <ShowCaseTabs />
      </header>
    </>
  );
}
