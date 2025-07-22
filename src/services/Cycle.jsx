import "../scss/main.scss";
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from "../components/Header";
import { useTranslation } from 'react-i18next';

const Cycle = () => {
  const { t } = useTranslation();

  useEffect(() => {}, []);

  return (
    <>
      <Header />

      <section className="circle-hero">
        <div className="circle-hero__container">
          <h1 className="circle-hero__title">{t("cycle.hero.title")}</h1>
          <p className="circle-hero__subtitle">{t("cycle.hero.subtitle")}</p>
        </div>
      </section>

      <section className="included-wrapper">
        <div className="circle-decor decor-1" />
        <div className="circle-decor decor-2" />

        <section className="included-section" id="services">
          <div className="included-container">
            <h2 className="included-title">{t("cycle.included.title")}</h2>

            <div className="included-table">
              <div className="included-row included-header">
                <div>{t("cycle.included.headers.category")}</div>
                <div>{t("cycle.included.headers.services")}</div>
                <div>{t("cycle.included.headers.details")}</div>
              </div>

              {/* Social Media */}
              <div className="included-row">
                <div data-label="Category">{t("cycle.included.social.title")}</div>
                <div data-label="Services">
                  <ul>
                    {t("cycle.included.social.items", { returnObjects: true }).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div data-label="Details">
                  <ul>
                    {t("cycle.included.social.details", { returnObjects: true }).map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Design */}
              <div className="included-row">
                <div data-label="Category">{t("cycle.included.design.title")}</div>
                <div data-label="Services">
                  <ul>
                    {t("cycle.included.design.items", { returnObjects: true }).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div data-label="Details">
                  <ul>
                    {t("cycle.included.design.details", { returnObjects: true }).map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Promotion */}
              <div className="included-row">
                <div data-label="Category">{t("cycle.included.promotion.title")}</div>
                <div data-label="Services">
                  <ul>
                    {t("cycle.included.promotion.items", { returnObjects: true }).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div data-label="Details">
                  <ul>
                    {t("cycle.included.promotion.details", { returnObjects: true }).map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section className="circle-pricing">
        <div className="circle-pricing__container">
          <h2 className="circle-pricing__title">{t("cycle.pricing.title")}</h2>
          <p className="circle-pricing__amount">{t("cycle.pricing.amount")}</p>
          <p className="circle-pricing__note">{t("cycle.pricing.note")}</p>

          <Link to="/phone-form">
            <div className="circle-pricing__cta">{t("cycle.pricing.cta")}</div>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Cycle;