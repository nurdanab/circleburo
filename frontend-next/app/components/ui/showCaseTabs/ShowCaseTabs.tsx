"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import styles from "./ShowCaseTabs.module.scss";

export default function ShowCaseTabs() {
  const pathname = usePathname();
  const t = useTranslations("showCases");

  const TABS = [
    { href: "/show-cases/design", label: t("design") },
    { href: "/show-cases/web", label: t("web") },
    { href: "/show-cases/interier", label: t("interior") },
    { href: "/show-cases/prod", label: t("production") },
  ] as const;

  if (!pathname.startsWith("/show-cases")) return null;

  return (
    <div className={styles.tabsBar}>
      <nav className={styles.tabsNav}>
        <ul className={styles.tabsList}>
          {TABS.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  className={`${styles.tabLink} ${
                    isActive ? styles.tabLinkActive : ""
                  }`}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
