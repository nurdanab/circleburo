"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRouter, usePathname, Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { getMediaUrl } from "@/lib/media";
import Select from "../select/Select";
import styles from "./MobileMenu.module.scss";

const LOCALE_OPTIONS = [
  { value: "ru", label: "РУС" },
  { value: "en", label: "ENG" },
  { value: "kz", label: "ҚАЗ" },
  { value: "zh", label: "中文" },
] as const;

const overlayTransition = { duration: 0.25, ease: "easeOut" as const };
const panelTransition = { duration: 0.35, ease: "easeOut" as const };
const staggerTransition = { staggerChildren: 0.05, delayChildren: 0.1 };

const itemVariants = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 16 },
};

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    { href: "/services" as const, label: t("navServices") },
    { href: "/about" as const, label: t("navAbout") },
    { href: "/projects" as const, label: t("navWorks") },
    { href: "/show-cases" as const, label: t("navShowCases") },
    { href: "/contact" as const, label: t("navContacts") },
  ];

  const handleLocaleChange = (value: string) => {
    router.replace(pathname, { locale: value as "ru" | "en" | "kz" | "zh" });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            className={styles.menuOverlay}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={overlayTransition}
          />
          <motion.div
            key="panel"
            className={styles.menuModal}
            onClick={(e) => e.stopPropagation()}
            initial={{ x: "100%" }}
            animate={{
              x: 0,
              transition: { ...panelTransition, when: "beforeChildren" },
            }}
            exit={{
              x: "100%",
              transition: { ...panelTransition, when: "afterChildren" },
            }}
          >
            <motion.div
              className={styles.menuTop}
              variants={{
                visible: { transition: staggerTransition },
                exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div variants={itemVariants}>
                <Link href="/" onClick={onClose}>
                  <Image
                    src={getMediaUrl("/Logo.svg")}
                    unoptimized
                    alt={t("logoAlt")}
                    width={40}
                    height={40}
                    className={styles.menuLogo}
                  />
                </Link>
              </motion.div>

              <motion.div className={styles.menuTopRight} variants={itemVariants}>
                <Select
                  options={LOCALE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                  value={locale}
                  onChange={handleLocaleChange}
                  variant="compact"
                  className={styles.menuLangSelect}
                  aria-label={t("langAria")}
                />
                <button
                  type="button"
                  className={styles.menuCloseButton}
                  aria-label={t("closeMenu")}
                  onClick={onClose}
                >
                  ✕
                </button>
              </motion.div>
            </motion.div>

            <motion.nav
              className={styles.menuNav}
              variants={{
                visible: { transition: staggerTransition },
                exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <ul className={styles.menuNavList}>
                {navLinks.map((link) => (
                  <motion.li key={link.href} variants={itemVariants}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={styles.menuNavLink}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>

            <motion.div
              className={styles.menuBottom}
              variants={{
                visible: { transition: staggerTransition },
                exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div variants={itemVariants}>
                <Link
                  href="/contact"
                  onClick={onClose}
                  className={styles.menuContactButton}
                >
                  {t("cta")}
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
