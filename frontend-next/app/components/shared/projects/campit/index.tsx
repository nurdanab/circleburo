import Image from "next/image";

import styles from "./campit.module.scss";

export default function Campit() {
  return (
    <div className={styles.campit}>
      {/* SECTION 1 – HERO */}
      <section className={`${styles.section}`}>
        <div className={styles.heroInner}>
          <Image
            src="/projects-pages/campit/hero.png"
            alt="Campit hero"
            fill
            className={styles.sectionBg}
            priority
          />
        </div>
      </section>

      <div className={styles.sectionsWrapper}>
        {/* SECTION 2 */}
        <section className={styles.section2}>
          <div className={styles.section2Text}>
            <span>Campit</span>
            <p>
              Campit – проект авторских туров с продуманной концепцией и
              вниманием к деталям. Бренд работает с аудиторией, для которой
              важны не массовые маршруты, а впечатления, атмосфера и ощущение
              вовлеченности в путешествие.
            </p>
          </div>
          <div className={styles.section2VideoWrap}>
            <video
              src="/projects-pages/campit/section1.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>
        </section>

        {/* SECTION 3 */}
        <section className={styles.section3}>
          <div className={styles.section3VideoWrap}>
            <video
              src="/projects-pages/campit/section2.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>
          <div className={styles.section3Text}>
            <div className={styles.section3TextBlock}>
              Campit обратились в Circle с задачей усилить присутствие в
              digital-среде и системно выстроить коммуникацию в Instagram.
              Отдельным запросом клиента было создание креативных идей для
              контента, которые органично и качественно интегрировались бы в уже
              существующую стратегию бренда, не нарушая ее логику и тональность.
            </div>
            <div className={styles.section3TextBlock}>
              В рамках сотрудничества Circle взял на себя полное ведение
              Instagram-страницы Campit. Мы работали с визуальным стилем,
              структурой контента и подачей туров, разрабатывали креативные
              концепции для публикаций и выстраивали контент-план таким образом,
              чтобы авторский формат путешествий, маршруты и ценность опыта
              считывались понятно и привлекательно с первых касаний.
            </div>
          </div>
        </section>

        {/* SECTION 4 */}
        <section className={styles.section4}>
          <div className={styles.section4Text}>
            Отдельным направлением стала разработка дизайна для таргетированной
            рекламы. Circle подготовил визуальные решения, адаптированные под
            рекламные форматы, с акцентом на ясное сообщение, атмосферу
            путешествий и визуальную целостность бренда.
          </div>
          <div className={styles.section4ImgWrap}>
            <Image
              src="/projects-pages/campit/section3.png"
              alt="Campit"
              width={800}
              height={600}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        {/* SECTION 5 */}
        <section className={styles.section5}>
          <div className={styles.section5ImgWrap}>
            <Image
              src="/projects-pages/campit/section4.png"
              alt="Campit"
              width={600}
              height={900}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        {/* SECTION 6 */}
        <section className={styles.section6}>
          <span>Итоги</span>
          <p>
            Сотрудничество носило проектный характер и длилось две недели. В
            результате Campit получил структурированную Instagram-страницу,
            креативные идеи для контента, встроенные в существующую стратегию,
            готовый контент-план, смонтированный видеоконтент и визуальные
            материалы для дальнейшего продвижения в digital-каналах.
          </p>
        </section>
      </div>
    </div>
  );
}
