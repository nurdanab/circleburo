import Image from "next/image";
import InterierSlider from "@/app/components/shared/showCases/interier/interierBlocks/InterierSlider";

import styles from "./homeBank.module.scss";

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
          <Image
            src="/projects-pages/home-bank/home-bank-logo.png"
            alt="Home Bank logo"
            width={520}
            height={920}
            className={styles.sectionBg}
          />
        </div>
        <div>
          <span>Home Bank</span>
          <p>
            Этот проект был выполнен как исследовательская и стратегическая
            диагностика бренда с целью понять, почему банк не формирует доверие
            и как можно изменить его восприятие через ребрендинг, пространство и
            цифровой опыт.
          </p>
        </div>
      </section>

      <section className={styles.section3}>
        <div>
          <Image
            src="/projects-pages/home-bank/home-bank-logo.png"
            alt="Home Bank logo"
            width={520}
            height={920}
            className={styles.sectionBg}
          />
        </div>
        <div>
          <Image
            src="/projects-pages/home-bank/home-bank-logo.png"
            alt="Home Bank logo"
            width={520}
            height={920}
            className={styles.sectionBg}
          />
        </div>
      </section>

      <section className={styles.section4}>
        <div>
          <p>
            В качестве основы проекта были выбраны  потребительское
            исследование. В опросе приняли участие 110 респондентов из разных
            городов Казахстана. Анализ показал, что у 58% аудитории отсутствует
            сформированное восприятие бренда, а уровень доверия находится на
            критически низком уровне – около 9-12% по сравнению с лидерами
            рынка. При этом проблема заключалась не в активном недоверии, а в
            отсутствии четкого образа и опыта, который мог бы это доверие
            сформировать.
          </p>
        </div>
        <div>
          <Image
            src="/projects-pages/home-bank/home-bank-logo.png"
            alt="Home Bank logo"
            width={520}
            height={920}
            className={styles.sectionBg}
          />
        </div>
      </section>

      <section className={styles.section5}>
        <div>
          <Image
            src="/projects-pages/home-bank/home-bank-logo.png"
            alt="Home Bank logo"
            width={520}
            height={920}
            className={styles.sectionBg}
          />
        </div>
        <div>
          <p>
            Исследование поведения клиентов выявило ключевую закономерность.
            Депозиты оказались главным индикатором долгосрочных отношений с
            банком, а наличие доверия увеличивает вероятность выбора депозитов
            примерно в 30 раз. Также выяснилось, что несмотря на развитие
            онлайн-каналов, более 67% респондентов либо предпочитают отделения,
            либо готовы с ними взаимодействовать. Однако положительный опыт
            посещения отделений был зафиксирован менее чем у трети аудитории, за
            исключением группы с высоким уровнем доверия, где этот показатель
            достигал 78%.
          </p>
        </div>
      </section>

      <section className={styles.section6}>
        <div>
          <p>
            На основе этих данных был сформирован стратегический вывод. Для
            изменения восприятия бренда недостаточно усиливать коммуникации или
            продвигать продукты. Ключевым фактором является опыт – физический и
            цифровой. Пространство отделений и интерфейс приложения напрямую
            влияют на уровень доверия и готовность клиентов к более сложным
            финансовым продуктам.
          </p>
        </div>
        <div>
          <Image
            src="/projects-pages/home-bank/home-bank-logo.png"
            alt="Home Bank logo"
            width={520}
            height={920}
            className={styles.sectionBg}
          />
        </div>
      </section>
      <section className={styles.section7}>
        <div>
          <Image
            src="/projects-pages/home-bank/home-bank-logo.png"
            alt="Home Bank logo"
            width={520}
            height={920}
            className={styles.sectionBg}
          />
        </div>
        <div>
          <p>
            В рамках проекта была предложена концепция эволюционного ребрендинга
            под именем HomeBank. Название и визуальная система опираются на
            ассоциации с безопасностью, стабильностью и понятностью. Цветовая
            палитра построена вокруг синего как базового маркера надёжности.
            Интерьер рассматривается как инструмент бренда: спокойная среда,
            понятная навигация и комфорт снижают напряжение и усиливают доверие
            на подсознательном уровне.
          </p>
        </div>
      </section>
      <section className={styles.section8}>
        <div>
          <p>
            Отдельный блок диагностики был посвящен мобильному приложению.
            Анализ показал, что при стандартном функционале приложение не
            работает на формирование доверия и долгосрочных финансовых решений.
            В качестве стратегического направления были предложены улучшения UX
            и внедрение инструментов финансового планирования и обучения,
            которые усиливают позицию банка как партнера, а не просто сервиса
            для операций.
          </p>
        </div>
        <div>
          <Image
            src="/projects-pages/home-bank/home-bank-logo.png"
            alt="Home Bank logo"
            width={520}
            height={920}
            className={styles.sectionBg}
          />
        </div>
      </section>
      <section className={styles.section9}>
        <InterierSlider />
      </section>
      <section className={styles.section10}>
        <div>
          <Image
            src="/projects-pages/home-bank/home-bank-logo.png"
            alt="Home Bank logo"
            width={520}
            height={920}
            className={styles.sectionBg}
          />
        </div>
        <div>
          <Image
            src="/projects-pages/home-bank/home-bank-logo.png"
            alt="Home Bank logo"
            width={520}
            height={920}
            className={styles.sectionBg}
          />
        </div>
      </section>

      <section className={styles.section11}>
        <span>Итоги</span>
        <p>
          Структурированная диагностическая модель, показывающая, как через
          связку исследования, брендинга, интерьера и цифрового опыта можно
          изменить восприятие банка и создать основу для роста доверия и
          долгосрочной ценности клиента.
        </p>
      </section>
    </main>
  );
}
