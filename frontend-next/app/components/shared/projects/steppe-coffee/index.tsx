import Image from "next/image";

import ChartSteppeCoffee from "@/app/components/ui/chart-steppe-coffee/ChartSteppeCoffee";
import styles from "./steppe-coffee.module.scss";

export default function SteppeCoffeeProject() {
  return (
    <>
      {/* SECTION 1 – HERO */}
      <section className={`${styles.hero}`}>
        <div className={styles.heroInner}>
          <Image
            src="/projects-pages/steppe-coffee/hero.png"
            alt="Steppe Coffee hero"
            fill
            priority
          />
        </div>
      </section>

      <div className={styles.sectionsWrapper}>
        {/* SECTION 2 */}
        <section className={styles.section2}>
          <div className={styles.section2Text}>
            <span>STEPPE COFFEE</span>
            <p>
              Steppe Coffee – городской кофейный проект с сильным
              комьюнити-потенциалом и фокусом на живое общение. В рамках первого
              этапа мы пересобрали визуальный язык бренда, усилили характер и
              атмосферу Steppe Coffee, а также заложили единую логику для
              дальнейшего развития контента и коммуникаций. Это позволило бренду
              выглядеть цельно и узнаваемо во всех точках контакта с аудиторией.
            </p>
          </div>

          <div className={styles.section2video}>
            <video
              src="/projects-pages/steppe-coffee/section2.mp4"
              playsInline
              muted
              loop
              autoPlay
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </section>

        {/* SECTION 3 */}
        <section className={styles.section3}>
          <div className={styles.section3container}>
            <span>До</span>
            <div className={styles.section3ImgWrap}>
              <Image
                src="/projects-pages/steppe-coffee/section-3.png"
                alt="Steppe Coffee До"
                width={800}
                height={600}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
          <div className={styles.section3container}>
            <span>После</span>
            <div className={styles.section3ImgWrap}>
              <Image
                src="/projects-pages/steppe-coffee/section-3-second.png"
                alt="Steppe Coffee После"
                width={800}
                height={600}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </section>

        {/* SECTION 4 */}
        <section className={styles.section4}>
          <div className={styles.section4PhoneWrap}>
            <Image
              src="/projects-pages/steppe-coffee/section4.png"
              alt="Steppe Coffee section 4"
              width={519}
              height={792}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className={styles.section4Right}>
            <div className={styles.section4TextBlock}>
              После завершения этого этапа клиент перешел на пакет Cycle –
              формат ежемесячного сопровождения, в рамках которого мы продолжаем
              развивать проект, усиливать комьюнити и последовательно
              масштабировать коммуникацию на базе обновленного визуального и
              смыслового фундамента.
            </div>
            <div className={styles.section4TextBlock}>
              Мы взяли на себя работу с контентом, визуальной подачей, печатными
              материалами и офлайн-активностями, а также участвовали в
              оформлении интерьера кофейни, чтобы пространство и коммуникация
              работали как единое целое.
            </div>
            <div className={styles.section4ImgWrap}>
              <Image
                src="/projects-pages/steppe-coffee/section4-second.png"
                alt="Steppe Coffee интерьер"
                width={800}
                height={500}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </section>

        {/* SECTION 5 */}
        <section className={styles.section5}>
          <div className={styles.section5ImgWrap}>
            <Image
              src="/projects-pages/steppe-coffee/section5.png"
              alt="Steppe Coffee section 5"
              width={1200}
              height={675}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        {/* SECTION 6 */}
        <section className={styles.section6}>
          <div className={styles.section6ImgWrap}>
            <Image
              src="/projects-pages/steppe-coffee/section6.png"
              alt="Steppe Coffee section 6"
              width={800}
              height={600}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className={styles.section6ImgWrap}>
            <Image
              src="/projects-pages/steppe-coffee/section6-second.png"
              alt="Steppe Coffee section 6"
              width={800}
              height={600}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        {/* SECTION 7 */}
        <section className={styles.section7}>
          <div className={styles.section7Card}>
            <div className={styles.section7Text}>
              В рамках SMM мы выстроили регулярное присутствие бренда в
              Instagram и TikTok, переработали подачу контента и сделали акцент
              на живые форматы. В сентябре, несмотря на просадку охватов
              относительно предыдущего периода, нам удалось сохранить активность
              аудитории и зафиксировать рост подписчиков на 9% по сравнению с
              августом. Этот этап стал диагностическим: мы протестировали
              форматы и выявили, что наибольшую вовлеченность дают визуальные
              посты и контент с офлайн-жизнью кофейни.
            </div>
            <div className={styles.section7Chart}>
              <ChartSteppeCoffee
                title="ПРОСМОТРЫ"
                period="1 сен - 30 сен"
                total={35.647}
                label="Просмотры"
                percentA={55.8}
                labelA="Неподписчики"
                percentB={44.2}
                labelB="Подписчики"
                reach={2190}
                reachChange={-65.5}
              />
            </div>
          </div>
          <div className={styles.section7PhoneWrap}>
            <div className={styles.phoneInner}>
              <Image
                src="/projects-pages/steppe-coffee/section7.png"
                alt="Steppe Coffee section 7"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </section>

        {/* SECTION 8 */}
        <section className={styles.section8}>
          <div className={styles.section8Text}>
            <span>В ОКТЯБРЕ</span>
            <p>
              Мы усилили стратегию и сместили фокус в сторону Reels и сторис, а
              также более плотной связки онлайна и офлайна. Результат – резкий
              рост ключевых метрик: охваты аккаунта выросли на 125,3%, действия
              в профиле – на 6,3%, посещения профиля – на 8,4%. Прирост
              подписчиков за месяц составил почти 12% по сравнению с концом
              сентября. Это подтвердило, что выбранная модель контента и темп
              публикаций начали работать системно .
            </p>
          </div>
          <div className={styles.section8Chart}>
            <ChartSteppeCoffee
              title="ПРОСМОТРЫ"
              period="1 окт - 31 окт"
              total={41.982}
              label="Просмотры"
              percentA={54.0}
              labelA="Неподписчики"
              percentB={46.0}
              labelB="Подписчики"
              reach={4935}
              reachChange={+125.3}
            />
          </div>
        </section>

        {/* SECTION 9 */}
        <section className={styles.section9}>
          <div className={styles.section9ImgWrap}>
            <Image
              src="/projects-pages/steppe-coffee/section9.png"
              alt="Steppe Coffee section 9"
              width={600}
              height={800}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className={styles.section9Text}>
            Отдельным направлением стала работа с комьюнити. Мы не просто
            анонсировали мероприятия, а выстраивали вокруг Steppe Coffee точки
            притяжения. За период сотрудничества были восстановлены связи с уже
            существующими сообществами и привлечены новые – SpacED, Language
            Mixer, Bookclub Almaty. В кофейне прошёл арт-мастер-класс, который
            усилил офлайн-трафик и стал контентной опорой для социальных сетей.
            Такой формат позволил бренду выйти за рамки «кофейни» и закрепиться
            как городское пространство для встреч и идей.
          </div>
        </section>

        {/* SECTION 10 */}
        <section className={styles.section10}>
          <div className={styles.section10Text}>
            Дополнительно мы занимались дизайном печатных материалов и
            оформлением интерьера, чтобы визуальный язык бренда был
            последовательно представлен и в цифровой среде, и в физическом
            пространстве. Это усилило узнаваемость и связало коммуникацию в
            соцсетях с реальным опытом гостей.
          </div>
          <div className={styles.section10ImgWrap}>
            <Image
              src="/projects-pages/steppe-coffee/section10.png"
              alt="Steppe Coffee section 10"
              width={600}
              height={800}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        {/* SECTION 11 */}
        <section className={styles.section11}>
          <div className={styles.section11Img1Wrap}>
            <Image
              src="/projects-pages/steppe-coffee/section11.png"
              alt="Steppe Coffee section 11"
              width={800}
              height={600}
              style={{ width: "100%", height: "auto" }}
            />
          </div>

          <div className={styles.section11Img2Wrap}>
            <Image
              src="/projects-pages/steppe-coffee/section11-second.png"
              alt="Steppe Coffee section 11"
              width={800}
              height={600}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </section>

        <section className={styles.section12}>
          <span>Итоги</span>
          <p>
            Итог работы с Steppe Coffee: Социальные сети стали отражением жизни
            кофейни, офлайн-мероприятия начали работать как инструмент
            привлечения и удержания аудитории, а бренд получил понятную и
            устойчивую коммуникационную модель, которую можно масштабировать
            дальше.
          </p>
        </section>

        {/* SECTION 12 */}
        <section className={styles.section13}>
          <Image
            src="/projects-pages/steppe-coffee/section12.png"
            alt="Steppe Coffee section 13"
            width={1200}
            height={750}
            style={{ width: "100%", height: "auto" }}
          />
        </section>
      </div>
    </>
  );
}
