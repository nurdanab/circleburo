"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname, Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { getMediaUrl } from "@/lib/media";
import styles from "./Header.module.scss";
import { MobileMenu } from "../mobileBar/MobileMenu";
import Select from "../select/Select";
import ShowCaseTabs from "../showCaseTabs/ShowCaseTabs";

const LOCALE_OPTIONS = [
  { value: "ru", label: "РУС" },
  { value: "en", label: "ENG" },
  { value: "kz", label: "ҚАЗ" },
  { value: "zh", label: "中文" },
] as const;

export default function Header() {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLocaleChange = (value: string) => {
    router.replace(pathname, { locale: value as "ru" | "en" | "kz" | "zh" });
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link href="/" className={styles.logoBlock}>
            <Image
              src={getMediaUrl("/Logo.svg")}
              alt={t("logoAlt")}
              width={110}
              height={50}
              priority
              unoptimized
              className={styles.logoImage}
            />
          </Link>

          <nav className={styles.nav}>
            <ul className={styles.navList}>
              <li>
                <Link href="/about" className={styles.navLink}>
                  {t("navAbout")}
                </Link>
              </li>
              <li>
                <Link href="/services" className={styles.navLink}>
                  {t("navServices")}
                </Link>
              </li>
              <li>
                <Link href="/projects" className={styles.navLink}>
                  {t("navProjects")}
                </Link>
              </li>
              <li>
                <Link href="/show-cases" className={styles.navLink}>
                  {t("navShowCases")}
                </Link>
              </li>
              <li>
                <Link href="/circle-blog" className={styles.navLink}>
                  {t("navBlog")}
                </Link>
              </li>
            </ul>
          </nav>

          <div className={styles.actions}>
            <div className={styles.langSelectWrap}>
              <Select
                options={LOCALE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                value={locale}
                onChange={handleLocaleChange}
                aria-label={t("langAria")}
              />
            </div>
            <Link href="/contact" className={styles.ctaButton}>
              {t("cta")}
            </Link>
            <button
              type="button"
              className={styles.burgerButton}
              aria-label={t("openMenu")}
              onClick={() => setIsMenuOpen(true)}
            >
              <Image src={getMediaUrl("/burger-menu.svg")} alt={t("openMenu")} width={32} height={32} unoptimized />
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
