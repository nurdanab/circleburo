"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import styles from "./MobileMenu.module.scss";
import { getMediaUrl } from "@/app/lib/media";
import type { Locale } from "@/i18n/routing";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LOCALE_LABELS: Record<Locale, string> = {
  ru: "РУС",
  kz: "ҚАЗ",
  en: "ENG",
  cn: "中文",
};

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as Locale;
    router.replace(pathname, { locale: newLocale });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.menuOverlay} onClick={onClose}>
      <div
        className={styles.menuModal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.menuTop}>
          <Link href="/" onClick={onClose}>
            <Image
              src={getMediaUrl("/Logo.svg")}
              alt="CIRCLE creative buro"
              width={40}
              height={40}
              className={styles.menuLogo}
            />
          </Link>

          <div className={styles.menuTopRight}>
            <select
              className={styles.menuLangSelect}
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
            <button
              type="button"
              className={styles.menuCloseButton}
              aria-label={tCommon("close")}
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>

        <nav className={styles.menuNav}>
          <ul className={styles.menuNavList}>
            <li>
              <Link
                href="/services"
                onClick={onClose}
                className={styles.menuNavLink}
              >
                {t("services")}
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                onClick={onClose}
                className={styles.menuNavLink}
              >
                {t("about")}
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                onClick={onClose}
                className={styles.menuNavLink}
              >
                {t("projects")}
              </Link>
            </li>
            <li>
              <Link
                href="/show-cases"
                onClick={onClose}
                className={styles.menuNavLink}
              >
                {t("showCases")}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                onClick={onClose}
                className={styles.menuNavLink}
              >
                {t("contact")}
              </Link>
            </li>
          </ul>
        </nav>

        <div className={styles.menuBottom}>
          <Link
            href="/contact"
            onClick={onClose}
            className={styles.menuContactButton}
          >
            {t("contact")}
          </Link>
        </div>
      </div>
    </div>
  );
}
