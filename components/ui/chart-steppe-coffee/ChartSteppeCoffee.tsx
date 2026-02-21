"use client";

import { useTranslations, useLocale } from "next-intl";
import styles from "./chartSteppeCofee.module.scss";

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
  total: number;
  label: string;

  percentA: number;
  labelA: string;

  percentB: number;
  labelB: string;

  reach: number;
  reachChange: number;
};

export default function ChartSteppeCoffee(props: Props) {
  const t = useTranslations("projects");
  const locale = useLocale();
  const formatLocale = getLocaleForFormatting(locale);
  
  const format = (n: number) => n.toLocaleString(formatLocale);
  const percent = (n: number) =>
    n.toLocaleString(formatLocale, { maximumFractionDigits: 1 });
  const size = 260;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = props.percentA;
  const offset = circumference - (progress / 100) * circumference;

  const color = "#FF8A7A";

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>{props.title}</h2>
        <span>{props.period}</span>
      </div>

      <div className={styles.main}>
        <div className={styles.chart}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Фон */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#ffffff33"
              strokeWidth={stroke}
              fill="none"
            />

            {/* Активная часть */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={color}
              strokeWidth={stroke}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              style={{
                transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)",
              }}
            />

            {/* Число */}
            <text
              x="50%"
              y="47%"
              textAnchor="middle"
              dominantBaseline="middle"
              className={styles.totalSvg}
            >
              {format(props.total)}
            </text>

            {/* Подпись */}
            <text
              x="50%"
              y="60%"
              textAnchor="middle"
              dominantBaseline="middle"
              className={styles.labelSvg}
            >
              {props.label}
            </text>
          </svg>
        </div>

        <div className={styles.legend}>
          <div className={styles.item}>
            <span className={`${styles.dot} ${styles.dotA}`} />
            <div>
              <b>{percent(props.percentA)}%</b>
              <span>{props.labelA}</span>
            </div>
          </div>

          <div className={styles.item}>
            <span className={`${styles.dot} ${styles.dotB}`} />
            <div>
              <b>{percent(props.percentB)}%</b>
              <span>{props.labelB}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <span>{t("reachedAccounts")}</span>
        <div className={styles.reach}>
          <b>{format(props.reach)}</b>
          <span className={props.reachChange < 0 ? styles.neg : styles.pos}>
            {props.reachChange}%
          </span>
        </div>
      </div>
    </div>
  );
}
