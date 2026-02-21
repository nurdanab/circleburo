"use client";

import { useLocale, useTranslations } from "next-intl";
import styles from "./Dive.module.scss";

const getLocaleForFormatting = (locale: string): string => {
  const localeMap: Record<string, string> = {
    ru: "ru-RU",
    en: "en-US",
    kz: "kk-KZ",
    zh: "zh-CN",
  };
  return localeMap[locale] || "ru-RU";
};

type Props = {
  title: string;
  period: string;

  total: number; // 12029 -> 12.029
  adsPercent: number; // 56.4 (оранжевый сегмент на круге)
  subscribersPercent: number; // 11.2 (маленький фиолетовый сегмент)

  labelNonSubscribers: string; // "Неподписчики"
  percentNonSubscribers: number; // 88.8 (ТОЛЬКО для легенды справа)

  labelSubscribers: string; // "Подписчики"
  percentSubscribers: number; // 11.2 (для легенды)

  reelsPercent: number; // 60.8
  storiesPercent: number; // 39.2

  reached: number; // 5622 -> 5.622
  reachedChange: number; // +594.1
  interactions: number; // 170
};

const formatDots = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export default function ChartDive(props: Props) {
  const t = useTranslations("projects");
  const locale = useLocale();
  const formatLocale = getLocaleForFormatting(locale);

  const percentRU = (n: number) =>
    n.toLocaleString(formatLocale, { maximumFractionDigits: 1 });
  const size = 300;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const c = 2 * Math.PI * radius;

  // GAP чтобы визуально было "как на скрине" (у тебя было слишком много оранжевого)
  const gap = 10; // длина в px по окружности

  // сегменты кольца:
  // 1) фон - мягкий фиолетовый (100%)
  // 2) маленький фиолетовый сегмент = subscribersPercent
  // 3) оранжевый сегмент = adsPercent
  const subsLen = Math.max(0, (props.subscribersPercent / 100) * c - gap);
  const adsLen = Math.max(0, (props.adsPercent / 100) * c - gap);

  const startRotation = -90;

  // Прогресс-бары: заполнение = reels/stories,
  // внутри заполнения делаем 2 сегмента (фиолетовый/оранжевый) по долям подписчиков/неподписчиков.
  // На первом баре фиолетовый в 1.5 раза больше, на втором в 2 раза больше
  const subsRatio =
    props.percentSubscribers /
    Math.max(1e-6, props.percentSubscribers + props.percentNonSubscribers);
  const nonSubsRatio = 1 - subsRatio;

  const splitFill = (value: number, purpleMultiplier: number = 1) => {
    const filled = Math.max(0, Math.min(100, value));
    let purple = filled * subsRatio * purpleMultiplier;
    let orange = filled * nonSubsRatio;

    // Нормализуем так, чтобы сумма не превышала 100%
    const total = purple + orange;
    if (total > 100) {
      purple = (purple / total) * 100;
      orange = (orange / total) * 100;
    }

    return { filled, purple, orange };
  };

  const reels = splitFill(props.reelsPercent, 2);
  const stories = splitFill(props.storiesPercent, 3.5);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>{props.title}</h2>
        <span>{props.period}</span>
      </div>

      <div className={styles.top}>
        {/* DONUT */}
        <div className={styles.donut}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <defs>
              <linearGradient id="orangeGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFB1A8" />
                <stop offset="100%" stopColor="#FF6A5A" />
              </linearGradient>
            </defs>

            {/* фон */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#AC8EEF4D"
              strokeWidth={stroke}
              fill="none"
            />

            {/* реклама — оранжевый сегмент (как на скрине) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#orangeGrad)"
              strokeWidth={stroke}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${adsLen} ${c}`}
              strokeDashoffset={-subsLen - gap}
              transform={`rotate(${startRotation} ${size / 2} ${size / 2})`}
            />

            {/* центр */}
            <text
              x="50%"
              y="47%"
              textAnchor="middle"
              dominantBaseline="middle"
              className={styles.total}
            >
              {formatDots(props.total)}
            </text>

            <text
              x="50%"
              y="60%"
              textAnchor="middle"
              dominantBaseline="middle"
              className={styles.subLabel}
            >
              {percentRU(props.adsPercent)}% {t("fromAds")}
            </text>
          </svg>
        </div>

        {/* legend справа */}
        <div className={styles.legend}>
          <div className={styles.item}>
            <span className={`${styles.dot} ${styles.dotOrange}`} />
            <div>
              <b>{percentRU(props.percentNonSubscribers)}%</b>
              <span>{props.labelNonSubscribers}</span>
            </div>
          </div>

          <div className={styles.item}>
            <span className={`${styles.dot} ${styles.dotPurple}`} />
            <div>
              <b>{percentRU(props.percentSubscribers)}%</b>
              <span>{props.labelSubscribers}</span>
            </div>
          </div>
        </div>
      </div>

      {/* bars */}
      <div className={styles.bars}>
        <div className={styles.barRow}>
          <div className={styles.barContainer}>
            <div className={styles.barLabel}>
              <span>{t("videoReels")}</span>
            </div>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{ width: `${reels.filled}%` }}
              >
                <div
                  className={styles.barPurple}
                  style={{ width: `${reels.purple}%` }}
                />
                <div
                  className={styles.barOrange}
                  style={{ width: `${reels.orange}%` }}
                />
              </div>
            </div>
          </div>
          <b className={styles.barPercent}>{percentRU(props.reelsPercent)}%</b>
        </div>

        <div className={styles.barRow}>
          <div className={styles.barContainer}>
            <div className={styles.barLabel}>
              <span>{t("stories")}</span>
            </div>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{ width: `${stories.filled}%` }}
              >
                <div
                  className={styles.barPurple}
                  style={{ width: `${stories.purple}%` }}
                />
                <div
                  className={styles.barOrange}
                  style={{ width: `${stories.orange}%` }}
                />
              </div>
            </div>
          </div>
          <b className={styles.barPercent}>
            {percentRU(props.storiesPercent)}%
          </b>
        </div>
      </div>

      {/* bottom stats */}
      <div className={styles.stats}>
        <div className={styles.statRow}>
          <span>{t("reachedAccounts")}</span>
          <div className={styles.statRight}>
            <b>{formatDots(props.reached)}</b>
            <em className={props.reachedChange < 0 ? styles.neg : styles.pos}>
              {props.reachedChange > 0 ? "+" : ""}
              {percentRU(props.reachedChange)}%
            </em>
          </div>
        </div>

        <div className={styles.statRow}>
          <span>{t("interactions")}</span>
          <div className={styles.statRight}>
            <b>{formatDots(props.interactions)}</b>
          </div>
        </div>
      </div>
    </div>
  );
}
