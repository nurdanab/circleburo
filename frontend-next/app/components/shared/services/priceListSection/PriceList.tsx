import Image from "next/image";
import styles from "./PriceList.module.scss";

const priceData = [
  {
    category: "МАРКЕТИНГ",
    services: [
      { name: "Концепция / визуализация", price: "250 000" },
      { name: "Мини-ивенты", price: "Индивидуальная цена" },
      { name: "Аудит и анализ", price: "250 000" },
    ],
  },
  {
    category: "ДИЗАЙН",
    services: [
      { name: "Мини-гайдбук (6 страниц)", price: "500 000" },
      { name: "Презентация (1 страница)", price: "10 000" },
      { name: "Упаковка и брендинг (1 шт.)", price: "Индивидуальная цена" },
      { name: "2D-анимация (1 сек.)", price: "10 000" },
      { name: "3D-анимация (1 сек.)", price: "20 000" },
      { name: "3D-визуализация концепции (1 сек.)", price: "35 000" },
      { name: "Постеры, баннеры, иллюстрации (1 шт.)", price: "20 000" },
      { name: "Дизайн для социальных сетей", price: "10 000" },
      { name: "Разработка сайта (React) / Pro", price: "2,500,000-5,000,000" },
      { name: "Разработка сайта (Tilda) / Business", price: "1 000 000" },
      { name: "Поддержка сайта", price: "150 000" },
      { name: "Дизайн интерьера (1 м²)", price: "30 000" },
      { name: "Дизайн интерьера «под ключ» (1 м²)", price: "50 000" },
    ],
  },
  {
    category: "SMM",
    showIndividualPrice: true,
    services: [
      { name: "Контент-план", price: "" },
      { name: "Оформление профиля (10 постов)", price: "" },
      { name: "Съёмка Reels / TikTok (12 шт.)", price: "" },
      { name: "Stories (20 шт.)", price: "" },
      { name: "Таргетированная реклама", price: "" },
    ],
  },
  {
    category: "ПРОДАКШН",
    services: [
      { name: "Видеомонтаж (1 ролик)", price: "100 000" },
      { name: "Видеопроизводство (1 час)", price: "50 000" },
      { name: "Фотосъёмка (1 час)", price: "35 000" },
    ],
  },
];

export default function PriceList() {
  return (
    <section className={styles.priceList}>
      <Image
        src="/services/priceList-bg.png"
        alt=""
        fill
        className={styles.bgImage}
      />
      <div className={styles.container}>
        <h1 className={styles.mainTitle}>цены semisircle</h1>

        <div className={styles.categories}>
          {priceData.map((category, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.categoryTitle}>{category.category}</h2>
                {category.showIndividualPrice && (
                  <span className={styles.individualNote}>Индивидуальная цена</span>
                )}
              </div>
              <ul className={styles.servicesList}>
                {category.services.map((service, serviceIdx) => (
                  <li key={serviceIdx} className={styles.serviceItem}>
                    <span className={styles.serviceName}>{service.name}</span>
                    <span className={styles.dots}></span>
                    {service.price && (
                      <span className={styles.servicePrice}>{service.price}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

