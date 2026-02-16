import Image from "next/image";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>

      <div className={styles.inner}>
        <div className={styles.left}>
          <Image
            src="/footer-icon.svg"
            alt="CIRCLE creative buro"
            width={180}
            height={60}
            className={styles.logo}
          />

          <p className={styles.description}>
            Circle Creative Buro – креативное бюро и рекламное агентство полного
            цикла в Алматы. Развиваем бренды в цифровом пространстве и за его
            пределами: стратегия, креатив, веб, моушн, интерьеры под ключ.
          </p>
        </div>

        <div className={styles.right}>
          <h3 className={styles.contactsTitle}>Контакты</h3>

          <ul className={styles.contactsList}>
            <li className={styles.contactItem}>
              <Image src="/Call.svg" alt="Phone" width={20} height={20} />
              <a href="tel:+77082686982">+7 708 268 69 82</a>
            </li>
            <li className={styles.contactItem}>
              <Image
                src="/Location.svg"
                alt="Location"
                width={20}
                height={20}
              />
              <span>ул. Байзакова 280, Алматы</span>
            </li>
            <li className={styles.contactItem}>
              <Image src="/Mail.svg" alt="Email" width={20} height={20} />
              <a href="mailto:info@circleburo.kz">info@circleburo.kz</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
