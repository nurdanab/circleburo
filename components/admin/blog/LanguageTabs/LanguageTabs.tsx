"use client";

import type { BlogLocale, ArticleTranslations } from "@/lib/types/blog";
import styles from "./LanguageTabs.module.scss";

interface LanguageTabsProps {
  activeLocale: BlogLocale;
  onLocaleChange: (locale: BlogLocale) => void;
  translations: ArticleTranslations;
}

const LOCALES: { value: BlogLocale; label: string }[] = [
  { value: "ru", label: "РУС" },
  { value: "en", label: "ENG" },
  { value: "kz", label: "ҚАЗ" },
  { value: "zh", label: "中文" },
];

export default function LanguageTabs({
  activeLocale,
  onLocaleChange,
  translations,
}: LanguageTabsProps) {
  const hasContent = (locale: BlogLocale) => {
    const t = translations[locale];
    return t && t.title && t.title.trim().length > 0;
  };

  return (
    <div className={styles.tabs}>
      {LOCALES.map((locale) => (
        <button
          key={locale.value}
          className={`${styles.tab} ${activeLocale === locale.value ? styles.active : ""}`}
          onClick={() => onLocaleChange(locale.value)}
        >
          {locale.label}
          <span
            className={`${styles.indicator} ${hasContent(locale.value) ? styles.filled : ""}`}
          />
        </button>
      ))}
    </div>
  );
}
