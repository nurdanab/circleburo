"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import styles from "./ShowCaseTabs.module.scss";

const TAB_KEYS = [
  { href: "/show-cases/design" as const, key: "design" },
  { href: "/show-cases/web" as const, key: "web" },
  { href: "/show-cases/interier" as const, key: "interior" },
  { href: "/show-cases/prod" as const, key: "production" },
] as const;

export default function ShowCaseTabs() {
  const t = useTranslations("showCaseTabs");
  const pathname = usePathname();

  if (!pathname.startsWith("/show-cases")) return null;

  return (
    <div className={styles.tabsBar}>
      <nav className={styles.tabsNav}>
        <ul className={styles.tabsList}>
          {TAB_KEYS.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  className={`${styles.tabLink} ${
                    isActive ? styles.tabLinkActive : ""
                  }`}
                >
                  {t(tab.key)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
