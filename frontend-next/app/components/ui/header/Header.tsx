"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./Header.module.scss";
import { MobileMenu } from "../mobileBar/MobileMenu";
import ShowCaseTabs from "../showCaseTabs/ShowCaseTabs";
import { getMediaUrl } from "@/app/lib/media";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/services" className={styles.navLink}>
                  Услуги
                </Link>
              </li>
              <li>
                <Link href="/projects" className={styles.navLink}>
                  Проекты
                </Link>
              </li>
              <li>
                <Link href="/show-cases" className={styles.navLink}>
                  Шоу кейсы
                </Link>
              </li>
            </ul>
          </nav>

          <div className={styles.actions}>
            <select
              className={styles.langSelect}
              defaultValue="ru"
              aria-label="Язык"
            >
              <option value="ru">РУС</option>
              <option value="kz">ҚАЗ</option>
              <option value="en">ENG</option>
              <option value="cn">中文</option>
            </select>
            <Link href="/contact" className={styles.ctaButton}>
              Связаться с нами
            </Link>
            <button
              type="button"
              className={styles.burgerButton}
              aria-label="Открыть меню"
              onClick={() => setIsMenuOpen(true)}
            >
              <Image src={getMediaUrl("/burger-menu.svg")} alt="Меню" width={32} height={32} />
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
