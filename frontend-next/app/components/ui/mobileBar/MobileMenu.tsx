import Image from "next/image";
import Link from "next/link";
import styles from "./MobileMenu.module.scss";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
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
              src="/Logo.svg"
              alt="CIRCLE creative buro"
              width={40}
              height={40}
              className={styles.menuLogo}
            />
          </Link>

          <div className={styles.menuTopRight}>
            <select
              className={styles.menuLangSelect}
              defaultValue="ru"
              aria-label="Язык"
            >
              <option value="ru">РУС</option>
            </select>
            <button
              type="button"
              className={styles.menuCloseButton}
              aria-label="Закрыть меню"
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
                Услуги
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                onClick={onClose}
                className={styles.menuNavLink}
              >
                О нас
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                onClick={onClose}
                className={styles.menuNavLink}
              >
                Работы
              </Link>
            </li>
            <li>
              <Link
                href="/show-cases"
                onClick={onClose}
                className={styles.menuNavLink}
              >
                Шоу кейсы
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                onClick={onClose}
                className={styles.menuNavLink}
              >
                Контакты
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
            Связаться с нами
          </Link>
        </div>
      </div>
    </div>
  );
}

