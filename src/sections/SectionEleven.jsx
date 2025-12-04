import React, { useState, useCallback, useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { getMediaUrl } from '../utils/media';
import './SectionEleven.css';

// Мемоизированный компонент фейерверка для оптимизации рендеринга
const Firework = memo(({ index }) => (
  <div className={`firework firework-${index + 1}`}>
    {Array.from({ length: 12 }, (_, j) => (
      <div key={j} className="particle"></div>
    ))}
  </div>
));

Firework.displayName = 'Firework';

const SectionEleven = () => {
  const { t } = useTranslation();
  const [isAfter, setIsAfter] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  // Мемоизированный обработчик переключения
  const handleToggle = useCallback(() => {
    setIsAfter((prev) => {
      const newState = !prev;
      if (newState) {
        // Показываем фейерверки только при переключении на "after"
        setShowFireworks(true);
        setTimeout(() => {
          setShowFireworks(false);
        }, 4000);
      }
      return newState;
    });
  }, []);

  // Мемоизированные пути к изображениям
  const imageSrc = useMemo(
    () => (isAfter ? getMediaUrl("img/team/after.PNG") : getMediaUrl("img/team/before.PNG")),
    [isAfter]
  );

  const imageAlt = useMemo(
    () => t(isAfter ? 'beforeAfter.afterAlt' : 'beforeAfter.beforeAlt'),
    [isAfter, t]
  );

  // Массив фейерверков для оптимизации
  const fireworks = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);

  return (
    <section className="section-eleven" aria-label={t('beforeAfter.toggleText')}>
      {/* Фоновое изображение */}
      <div className="image-container">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="background-image"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Кнопка-переключатель */}
      <div className="box">
        <input
          className="sr-only checkbox"
          type="checkbox"
          id="toggle-checkbox"
          checked={isAfter}
          onChange={handleToggle}
          aria-label={t('beforeAfter.toggleText')}
        />
        <label className="label" htmlFor="toggle-checkbox" aria-hidden="true">
          <div className="head">
            <div className="face">
              <div className="face__smile"></div>
              <div className="face__sleep"></div>
            </div>
          </div>
        </label>
        <div className="toggle-text" aria-hidden="true">
          {t('beforeAfter.toggleText')}
        </div>
      </div>

      {/* Анимация фейерверков */}
      {showFireworks && (
        <div className="fireworks-container" aria-hidden="true">
          {fireworks.map((i) => (
            <Firework key={i} index={i} />
          ))}
        </div>
      )}
    </section>
  );
};

export default memo(SectionEleven);
