import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

gsap.registerPlugin(ScrollTrigger);

const SectionNine = () => {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    const cardElements = gsap.utils.toArray(".section-nine-card", sectionRef.current);
    const totalCards = cardElements.length;

    if (totalCards === 0) return;

    // Устанавливаем начальное состояние для всех карточек
    cardElements.forEach((card, index) => {
      gsap.set(card, {
        xPercent: -50,
        yPercent: -50,
        y: index === 0 ? 0 : "100vh",
        opacity: index === 0 ? 1 : 0
      });
    });

    // Создаем один master timeline для всех карточек
    const masterTL = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * totalCards * 1.5}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        markers: false,
        anticipatePin: 1,
      }
    });

    // Добавляем анимации для каждой карточки в master timeline
    cardElements.forEach((card, index) => {
      if (index === 0) return;

      const label = `card${index}`;
      masterTL.addLabel(label, index * 2);

      // Исчезновение предыдущей карточки
      masterTL.to(cardElements[index - 1], {
        y: "-100vh",
        opacity: 0,
        ease: "power2.out",
        duration: 1
      }, label);

      // Появление текущей карточки
      masterTL.fromTo(card, {
        y: "100vh",
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        ease: "power2.in",
        duration: 1
      }, label);
    });

    return () => {
      masterTL.kill();
    };
  }, { scope: sectionRef, dependencies: [] });

  const getCardServices = (cardKey) => {
    const services = [];

    for (let index = 1; index <= 10; index++) {
      const baseKey = `packages.${cardKey}.services.${index}`;

      // Пробуем получить значение напрямую (для card4, card5)
      const directValue = t(baseKey);

      // Если это не ключ (не содержит 'packages.'), значит перевод найден
      if (directValue && !directValue.includes('packages.')) {
        services.push({
          title: directValue,
          description: null
        });
        continue;
      }

      // Пробуем получить title и description (для card1, card2, card3)
      const titleValue = t(`${baseKey}.title`);

      // Если title существует (не равен ключу)
      if (titleValue && !titleValue.includes('packages.')) {
        const descValue = t(`${baseKey}.description`);
        services.push({
          title: titleValue,
          description: descValue.includes('packages.') ? null : descValue
        });
      } else {
        // Если не нашли сервис, выходим
        break;
      }
    }

    return services;
  };

  const cards = [
    {
      number: "01",
      cardKey: "card1",
      bgColor: "#F0CD4B",
      textColor: "#0E5A4D",
      patternColor1: "#0E5A4D",
      patternColor2: "#F0CD4B",
      itemPadding: "10px"
    },
    {
      number: "02",
      cardKey: "card2",
      bgColor: "#F09FB2",
      textColor: "#0E5A4D",
      patternColor1: "#0E5A4D",
      patternColor2: "#F09FB2",
      itemPadding: "7px"
    },
    {
      number: "03",
      cardKey: "card3",
      bgColor: "#0E5A4D",
      textColor: "#F6EDCE",
      patternColor1: "#F6EDCE",
      patternColor2: "#0E5A4D",
      itemPadding: "12px"
    },
    {
      number: "04",
      cardKey: "card4",
      bgColor: "#F25340",
      textColor: "#F0CD4B",
      patternColor1: "#F0CD4B",
      patternColor2: "#F25340",
      itemPadding: "8px"
    },
    {
      number: "05",
      cardKey: "card5",
      bgColor: "#F09FB2",
      textColor: "#49526F",
      patternColor1: "#49526F",
      patternColor2: "#F09FB2",
      itemPadding: "7px"
    }
  ];

  return (
    <section className="section-nine" ref={sectionRef}>
      <div className="section-nine-cards-container">
        {cards.map((card, index) => {
          const services = getCardServices(card.cardKey);

          return (
            <div
              key={index}
              className="section-nine-card"
              style={{ backgroundColor: card.bgColor }}
            >
              <div className="section-nine-card-inner">
                {/* Header */}
                <div className="card-header">
                  <h2 className="card-main-title" style={{ color: card.textColor }}>
                    {t(`packages.${card.cardKey}.title`)}
                  </h2>
                  <div className="card-price" style={{
                    color: card.textColor,
                    borderBottomColor: card.textColor
                  }}>
                    {t(`packages.${card.cardKey}.price`)}
                  </div>
                </div>

                {/* Services List */}
                <div className="card-services">
                  {services.map((service, idx) => (
                    <div
                      key={idx}
                      className="service-item"
                      style={{
                        borderBottomColor: `${card.textColor}40`,
                        paddingTop: card.itemPadding,
                        paddingBottom: card.itemPadding
                      }}
                    >
                      <div className="service-number" style={{ color: card.textColor }}>
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div className="service-content">
                        {service.title && (
                          <h3 className="service-title" style={{ color: card.textColor }}>
                            {service.title}
                          </h3>
                        )}
                        {service.description && (
                          <p className="service-description" style={{ color: card.textColor }}>
                            {service.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative Bottom Pattern - вне card-inner */}
              <div className="card-pattern">
                {[...Array(18)].map((_, i) => {
                  const row = Math.floor(i / 9);
                  const col = i % 9;
                  const isFirstColor = (row + col) % 2 === 0;
                  return (
                    <div
                      key={i}
                      className="pattern-block"
                      style={{
                        backgroundColor: isFirstColor ? card.patternColor1 : card.patternColor2
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .section-nine {
          position: relative;
          width: 100%;
          height: 100vh;
          background: #F6EDCE;
        }

        .section-nine-cards-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .section-nine-card {
          position: absolute;
          top: 50%;
          left: 50%;
          width: min(90%, 450px);
          height: 600px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          will-change: transform, opacity;
        }

        .section-nine-card-inner {
          padding: 30px 40px 15px 40px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-header {
          margin-bottom: 0;
          flex-shrink: 0;
        }

        .card-main-title {
          font-family: "Lilita One", sans-serif;
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 12px 0;
          line-height: 1.2;
        }

        .card-price {
          font-family: "Metrika", sans-serif;
          font-size: 18px;
          font-weight: 400;
          padding: 0 40px 8px 40px;
          margin: 0 -40px;
          border-bottom: 1px solid;
        }

        .card-services {
          flex: 1;
        }

        .service-item {
          display: grid;
          grid-template-columns: 30px 1fr;
          gap: 10px;
          align-items: start;
          padding-left: 40px;
          padding-right: 40px;
          margin: 0 -40px;
          border-bottom: 1px solid;
        }

        .service-item:last-child {
          border-bottom: none;
        }

        .service-number {
          font-family: "Lilita One", sans-serif;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.3;
        }

        .service-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .service-title {
          font-family: "Lilita One", sans-serif;
          font-size: 16px;
          font-weight: 700;
          margin: 0;
          line-height: 1.3;
        }

        .service-description {
          font-family: "Metrika", sans-serif;
          font-size: 13px;
          font-weight: 400;
          margin: 0;
          line-height: 1.3;
          text-transform: uppercase;
        }

        /* Специальный стиль для карточек без описаний */
        .service-content:has(.service-title:only-child) .service-title {
          font-family: "Metrika", sans-serif;
          font-size: 16px;
          font-weight: 400;
          text-transform: uppercase;
        }

        .card-pattern {
          display: grid;
          grid-template-columns: repeat(9, 1fr);
          grid-template-rows: repeat(2, 50px);
          width: 100%;
          flex-shrink: 0;
        }

        .pattern-block {
          width: 100%;
          height: 100%;
        }

        @media (max-width: 768px) {
          .section-nine-card {
            width: 92%;
            height: 520px;
          }

          .section-nine-card-inner {
            padding: 22px 30px 10px 30px;
          }

          .card-main-title {
            font-size: 17px;
            margin-bottom: 8px;
          }

          .card-price {
            font-size: 15px;
            padding: 0 30px 6px 30px;
            margin: 0 -30px;
          }

          .service-item {
            grid-template-columns: 24px 1fr;
            gap: 8px;
            padding-left: 30px;
            padding-right: 30px;
            margin: 0 -30px;
          }

          .service-number {
            font-size: 13px;
          }

          .service-title {
            font-size: 13px;
          }

          .service-description {
            font-size: 10.5px;
          }

          .card-pattern {
            grid-template-rows: repeat(2, 38px);
          }
        }

        @media (max-width: 480px) {
          .section-nine-card {
            width: 90%;
            height: 500px;
            border-radius: 16px;
          }

          .section-nine-card-inner {
            padding: 18px 24px 8px 24px;
          }

          .card-main-title {
            font-size: 15px;
            margin-bottom: 6px;
          }

          .card-price {
            font-size: 13px;
            padding: 0 24px 5px 24px;
            margin: 0 -24px;
          }

          .service-item {
            grid-template-columns: 20px 1fr;
            gap: 6px;
            padding-left: 24px;
            padding-right: 24px;
            margin: 0 -24px;
          }

          .service-number {
            font-size: 12px;
          }

          .service-title {
            font-size: 12px;
          }

          .service-description {
            font-size: 9.5px;
          }

          .card-pattern {
            grid-template-rows: repeat(2, 32px);
          }
        }
      `}</style>
    </section>
  );
};

export default SectionNine;