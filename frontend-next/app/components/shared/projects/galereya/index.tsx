import Image from "next/image";

import styles from "./galereya.module.scss";

export default function Galereya() {
  return (
    <>
      {/* SECTION 1 – HERO */}
      <section className={styles.section}>
        <div className={styles.heroInner}>
          <Image
            src="/projects-pages/galereya/hero1.png"
            alt="Galereya hero"
            fill
            priority
          />
        </div>
      </section>

      <div className={styles.sectionsWrapper}>
        {/* SECTION 2 */}
        <section className={styles.section2}>
          <div className={styles.section2Text}>
            <span>GALERIYA</span>
            <p>
              GALERIYA – культурное пространство, где пересекаются искусство,
              идеи и люди. Проект задумывался как открытая платформа для
              художников, коллекционеров и зрителей, в которой искусство
              становится понятным, доступным и органично встроенным в городской
              контекст.
            </p>
          </div>
          <div className={styles.section2ImgWrap}>
            <Image
              src="/projects-pages/galereya/section1.png"
              alt="Galereya"
              width={600}
              height={980}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        {/* SECTION 3 */}
        <section className={styles.section3}>
          <div className={styles.section3VideoWrapper}>
            <video
              src="/projects-pages/galereya/section2.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>
          <div className={styles.section3Text}>
            <p>
              Circle подключился к проекту на этапе подготовки к открытию, когда
              формировались само пространство и ключевые точки взаимодействия с
              аудиторией. Основной задачей было запустить галерею с нуля,
              выстроив логичную офлайн-среду и создав digital-платформу, которая
              станет главным инструментом презентации проекта.
            </p>

            <p>
              В рамках сотрудничества Circle выступал как креативный и
              стратегический партнёр. Мы участвовали в организации пространства
              галереи и полностью взяли на себя разработку сайта GALERIYA,
              закладывая фундамент для дальнейшего развития бренда.
            </p>
          </div>
        </section>

        {/* SECTION 4 */}
        <section className={styles.section4}>
          <Image
            src="/projects-pages/galereya/Component3.png"
            alt="Galereya"
            width={1440}
            height={700}
            style={{ width: "100%", height: "auto" }}
          />
        </section>

        <section className={styles.section5}>
          <p>
            Сайт был спроектирован как ключевая точка контакта с аудиторией. Мы
            выстроили структуру и визуальную логику платформы так, чтобы работы
            художников были представлены последовательно и корректно, а
            пользовательский путь оставался понятным и легким. Основной акцент
            был сделан на навигации, визуальной подаче и отсутствии лишних
            барьеров.
          </p>
        </section>

        {/* SECTION 5 */}
        <section className={styles.section6}>
          <div className={styles.section6ImgWrap}>
            <Image
              src="/projects-pages/galereya/section4_1.png"
              alt="Galereya"
              width={350}
              height={675}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className={styles.section6ImgWrap}>
            <Image
              src="/projects-pages/galereya/section4_2.png"
              alt="Galereya"
              width={350}
              height={675}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className={styles.section6ImgWrap}>
            <Image
              src="/projects-pages/galereya/section4_3.png"
              alt="Galereya"
              width={350}
              height={675}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className={styles.section6ImgWrap}>
            <Image
              src="/projects-pages/galereya/section4_4.png"
              alt="Galereya"
              width={350}
              height={675}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        {/* SECTION 6 */}
        <section className={styles.section7}>
          <p>
            Работа с физическим пространством галереи была направлена на
            создание комфортной и открытой среды для знакомства с искусством.
            Circle участвовал в организации пространства, чтобы офлайн-опыт
            посетителя соответствовал ценностям проекта и образу, транслируемому
            через digital-каналы.
          </p>
        </section>

        <section className={styles.section8}>
          <Image
            src="/projects-pages/galereya/section5.png"
            alt="Galereya"
            width={1440}
            height={660}
            style={{ width: "100%", height: "auto" }}
          />
        </section>

        {/* SECTION 8 */}
        <section className={styles.section9}>
          <div className={styles.section9Text}>
            <span>Итоги</span>
            <p>
              В результате GALERIYA получила структурированное пространство и
              полноценную digital-платформу, готовую к дальнейшей работе с
              аудиторией и развитию проекта.
            </p>
          </div>
          <div className={styles.section9ImgWrap}>
            <Image
              src="/projects-pages/galereya/section6.png"
              alt="Galereya"
              width={630}
              height={870}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>
      </div>
    </>
  );
}
