"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./ShowCaseTabs.module.scss";

const TABS = [
  { href: "/show-cases/design", label: "Дизайн" },
  { href: "/show-cases/web", label: "Веб-разработка" },
  { href: "/show-cases/interier", label: "Интерьер" },
  { href: "/show-cases/prod", label: "Продакшн" },
] as const;

export default function ShowCaseTabs() {
  const pathname = usePathname();

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
