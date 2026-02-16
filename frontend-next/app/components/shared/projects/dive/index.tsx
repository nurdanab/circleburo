import Image from "next/image";

import ChartDive from "@/app/components/ui/chart-dive/ChartDive";
import styles from "./dive.module.scss";

export default function SteppeCoffeeProject() {
  return (
    <main className={styles.steppeCoffeePage}>
      {/* SECTION 1 – HERO */}
      <section className={`${styles.section}`}>
        <div className={styles.heroInner}>
          <Image
            src="/projects-pages/steppe-coffee/hero.png"
            alt="Steppe Coffee hero"
            fill
            className={styles.sectionBg}
            priority
          />
        </div>
      </section>

      <section className={styles.section2}>
        <div>
          <div>
            <span>Dive</span>
            <p>
              Dive – бренд кассетных бескассетных жалюзи, для которого мы
              выстраивали присутствие в социальных сетях с нуля. Проект
              стартовал в конце декабря, и ключевая задача на первом этапе
              заключалась в запуске аккаунта, формировании базовой аудитории и
              тестировании спроса через контент и рекламу.
            </p>
          </div>
          <div>
            <p>
              Мы сразу сделали ставку на простую и понятную подачу: объяснение
              продукта, живые лица, короткие форматы и фокус на пользе для
              клиента. Это позволило начать набор просмотров и первых
              подписчиков без долгого подготовительного этапа.
            </p>
          </div>
        </div>
        <Image
          src="/projects-pages/dive/dive-logo.png"
          alt="Dive logo"
          width={410}
          height={740}
          className={styles.sectionBg}
        />
      </section>

      <section className={styles.section3}>
        <div>
          <Image
            src="/projects-pages/dive/dive-logo.png"
            alt="Dive logo"
            fill
            className={styles.sectionBg}
          />
        </div>
        <div>
          <Image
            src="/projects-pages/dive/dive-logo.png"
            alt="Dive logo"
            fill
            className={styles.sectionBg}
          />
        </div>
        <div>
          <Image
            src="/projects-pages/dive/dive-logo.png"
            alt="Dive logo"
            fill
            className={styles.sectionBg}
          />
        </div>
        <div>
          <Image
            src="/projects-pages/dive/dive-logo.png"
            alt="Dive logo"
            fill
            className={styles.sectionBg}
          />
        </div>
        <div>
          <Image
            src="/projects-pages/dive/dive-logo.png"
            alt="Dive logo"
            fill
            className={styles.sectionBg}
          />
        </div>
      </section>

      <section className={styles.section4}>
        <Image
          src="/projects-pages/dive/dive-logo.png"
          alt="Dive logo"
          fill
          className={styles.sectionBg}
        />
        <div>
          <p>
            Параллельно был выстроен сам фундамент аккаунта. Мы разработали
            единую визуальную стилистику, оформили шапку профиля,
            скорректировали название аккаунта под задачи продвижения и создали
            хайлайты, которые закрывали основные вопросы клиента: ассортимент,
            установка, причины выбрать бренд. В результате профиль стал
            выглядеть как полноценный цифровой каталог и точка продаж.
          </p>
          <p>
            В процессе работы мы выстроили регулярный контент и планирование
            публикаций. Контент сочетал образовательные видео, презентацию
            продукта и простые объяснения процесса заказа и установки. Это
            позволило охватывать не только подписчиков, но и холодную аудиторию,
            которая ранее не была знакома с брендом. Дополнительно была запущена
            таргетированная реклама. Она дала не только рост показателей, но и
            прямой отклик в виде входящих запросов и подписок из рекламных
            объявлений.
          </p>
        </div>
      </section>

      <section className={styles.section5}>
        <p>
          В процессе работы мы выстроили регулярный контент и планирование
          публикаций. Контент сочетал образовательные видео, презентацию
          продукта и простые объяснения процесса заказа и установки. Это
          позволило охватывать не только подписчиков, но и холодную аудиторию,
          которая ранее не была знакома с брендом. Дополнительно была запущена
          таргетированная реклама. Она дала не только рост показателей, но и
          прямой отклик в виде входящих запросов и подписок из рекламных
          объявлений.
        </p>
        <ChartDive
          title="ПРОСМОТРЫ"
          period="28 ноя - 27 дек"
          total={12029}
          subLabel="56,4% от рекламы"
          percentMain={88.8}
          percentSubscribers={11.2}
          labelMain="Неподписчики"
          labelSubscribers="Подписчики"
        />
      </section>

      <section className={styles.section6}>
        <Image
          src="/projects-pages/dive/dive-logo.png"
          alt="Dive logo"
          fill
          className={styles.sectionBg}
        />
      </section>
      <section className={styles.section7}>
        <span>Итоги</span>
        <p>
          Итог проекта Dive: За короткий срок был создан упакованный аккаунт,
          выстроена логика контента, протестированы форматы и получены первые
          подтверждения спроса через охваты, просмотры и рекламные отклики.
          Проект заложил основу для дальнейшего масштабирования и превращения
          соцсетей в стабильный канал лидогенерации.
        </p>
      </section>
    </main>
  );
}
