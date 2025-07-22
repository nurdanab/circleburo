import "../scss/main.scss";
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from "../components/Header";
import { useTranslation } from 'react-i18next';

const Semicircle = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // Future logic
  }, []);

  return (
    <>
      <Header />

      <section className="circle-hero">
        <div className="circle-hero__container">
          <h1 className="circle-hero__title">{t('semicircle.hero.title')}</h1>
          <p className="circle-hero__subtitle">{t('semicircle.hero.subtitle')}</p>
        </div>
      </section>

      <section className="included-wrapper">
        <div className="circle-decor decor-1" />
        <div className="circle-decor decor-2" />

        <section className="included-section" id="services">
          <div className="included-container">
            <h2 className="included-title">{t('semicircle.included.title')}</h2>

            <div className="included-table">
              {/* Header row */}
              <div className="included-row included-header">
                <div>{t('semicircle.included.headers.category')}</div>
                <div>{t('semicircle.included.headers.services')}</div>
                <div>{t('semicircle.included.headers.details')}</div>
              </div>

              {/* MARKETING */}
              <div className="included-row">
                <div data-label="Category">{t('semicircle.included.marketing.title')}</div>
                <div data-label="Services">
                  <ul>
                    <li>{t('semicircle.included.marketing.items.0')}</li>
                    <li>{t('semicircle.included.marketing.items.1')}</li>
                  </ul>
                </div>
                <div data-label="Details">
                  <ul>
                    <li>{t('semicircle.included.marketing.details.0')}</li>
                    <li>{t('semicircle.included.marketing.details.1')}</li>
                  </ul>
                </div>
              </div>

              {/* DESIGN */}
              <div className="included-row">
                <div data-label="Category">{t('semicircle.included.design.title')}</div>
                <div data-label="Services">
                  <ul>
                    {Array.from({ length: 10 }, (_, i) => (
                      <li key={i}>{t(`semicircle.included.design.items.${i}`)}</li>
                    ))}
                  </ul>
                </div>
                <div data-label="Details">
                  <ul>
                    {Array.from({ length: 10 }, (_, i) => (
                      <li key={i}>{t(`semicircle.included.design.details.${i}`)}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* SMM */}
              <div className="included-row">
                <div data-label="Category">{t('semicircle.included.smm.title')}</div>
                <div data-label="Services">
                  <ul>
                    {Array.from({ length: 6 }, (_, i) => (
                      <li key={i}>{t(`semicircle.included.smm.items.${i}`)}</li>
                    ))}
                  </ul>
                </div>
                <div data-label="Details">
                  <ul>
                    {Array.from({ length: 6 }, (_, i) => (
                      <li key={i}>{t(`semicircle.included.smm.details.${i}`)}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* PRODUCTION */}
              <div className="included-row">
                <div data-label="Category">{t('semicircle.included.production.title')}</div>
                <div data-label="Services">
                  <ul>
                    <li>{t('semicircle.included.production.items.0')}</li>
                    <li>{t('semicircle.included.production.items.1')}</li>
                  </ul>
                </div>
                <div data-label="Details">
                  <ul>
                    <li>{t('semicircle.included.production.details.0')}</li>
                    <li>{t('semicircle.included.production.details.1')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section className="circle-pricing">
        <div className="circle-pricing__container">
          <p className="circle-pricing__note">{t('semicircle.pricing.note')}</p>

          <Link to="/phone-form">
            <div className="circle-pricing__cta">{t('semicircle.pricing.cta')}</div>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Semicircle;