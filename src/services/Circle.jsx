import "../scss/main.scss";
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from "../components/Header";
import { useTranslation } from 'react-i18next';

const Circle = () => {
  const { t } = useTranslation();

  useEffect(() => {}, []);

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="circle-hero">
        <div className="circle-hero__container">
          <h1 className="circle-hero__title">{t('circle.hero.title')}</h1>
          <p className="circle-hero__subtitle">{t('circle.hero.subtitle')}</p>
        </div>
      </section>

      {/* Included Services */}
      <section className="included-wrapper">
        <div className="circle-decor decor-1" />
        <div className="circle-decor decor-2" />

        <section className="included-section" id="services">
          <div className="included-container">
            <h2 className="included-title">{t('circle.included.title')}</h2>

            <div className="included-table">
              {/* Header Row */}
              <div className="included-row included-header">
                <div>{t('circle.included.headers.category')}</div>
                <div>{t('circle.included.headers.services')}</div>
                <div>{t('circle.included.headers.details')}</div>
              </div>

              {/* Block 1 */}
              <div className="included-row">
                <div data-label="Category">{t('circle.included.launch.title')}</div>
                <div data-label="Services">
                  <ul>
                    <li>{t('circle.included.launch.items.0')}</li>
                    <li>{t('circle.included.launch.items.1')}</li>
                    <li>{t('circle.included.launch.items.2')}</li>
                    <li>{t('circle.included.launch.items.3')}</li>
                    <li>{t('circle.included.launch.items.4')}</li>
                    <li>{t('circle.included.launch.items.5')}</li>
                    <li>{t('circle.included.launch.items.6')}</li>
                  </ul>
                </div>
                <div data-label="Details">
                  <ul>
                    <li></li><li></li><li></li><li></li><li></li><li></li><li></li>
                  </ul>
                </div>
              </div>

              {/* Block 2 */}
              <div className="included-row">
                <div data-label="Category">{t('circle.included.design.title')}</div>
                <div data-label="Services">
                  <ul>
                    <li>{t('circle.included.design.items.0')}</li>
                    <li>{t('circle.included.design.items.1')}</li>
                    <li>{t('circle.included.design.items.2')}</li>
                    <li>{t('circle.included.design.items.3')}</li>
                    <li>{t('circle.included.design.items.4')}</li>
                    <li>{t('circle.included.design.items.5')}</li>
                    <li>{t('circle.included.design.items.6')}</li>
                    <li>{t('circle.included.design.items.7')}</li>
                  </ul>
                </div>
                <div data-label="Details">
                  <ul>
                    <li>{t('circle.included.design.details.0')}</li>
                    <li>{t('circle.included.design.details.1')}</li>
                    <li>{t('circle.included.design.details.2')}</li>
                    <li>{t('circle.included.design.details.3')}</li>
                    <li>{t('circle.included.design.details.4')}</li>
                    <li>{t('circle.included.design.details.5')}</li>
                    <li>{t('circle.included.design.details.6')}</li>
                    <li>{t('circle.included.design.details.7')}</li>
                  </ul>
                </div>
              </div>

              {/* Block 3 */}
              <div className="included-row">
                <div data-label="Category">{t('circle.included.social.title')}</div>
                <div data-label="Services">
                  <ul>
                    <li>{t('circle.included.social.items.0')}</li>
                    <li>{t('circle.included.social.items.1')}</li>
                    <li>{t('circle.included.social.items.2')}</li>
                    <li>{t('circle.included.social.items.3')}</li>
                    <li>{t('circle.included.social.items.4')}</li>
                  </ul>
                </div>
                <div data-label="Details">
                  <ul>
                    <li>{t('circle.included.social.details.0')}</li>
                    <li>{t('circle.included.social.details.1')}</li>
                    <li>{t('circle.included.social.details.2')}</li>
                    <li>{t('circle.included.social.details.3')}</li>
                    <li>{t('circle.included.social.details.4')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* Pricing */}
      <section className="circle-pricing">
        <div className="circle-pricing__container">
          <h2 className="circle-pricing__title">{t('circle.pricing.title')}</h2>
          <p className="circle-pricing__amount">1.380.000 ₸</p>
          <p className="circle-pricing__note">{t('circle.pricing.note')}</p>
          <Link to="/phone-form">
            <div className="circle-pricing__cta">{t('circle.pricing.cta')}</div>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Circle;