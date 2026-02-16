import styles from "./Dive.module.scss";

type Props = {
  title: string;
  period: string;

  total: number;
  subLabel: string; // например "56,4% от рекламы"

  percentMain: number; // основной прогресс (фиолетовый)
  percentSubscribers: number; // процент подписчиков

  labelMain: string;
  labelSubscribers: string;
};

const format = (n: number) => n.toLocaleString("ru-RU");
const percent = (n: number) =>
  n.toLocaleString("ru-RU", { maximumFractionDigits: 1 });

export default function ChartDive(props: Props) {
  const size = 260;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const offset = circumference - (props.percentMain / 100) * circumference;

  const mainColor = "#AC8EEF";
  const softColor = "rgba(172,142,239,0.3)";

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>{props.title}</h2>
        <span>{props.period}</span>
      </div>

      <div className={styles.main}>
        <div className={styles.chart}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* фон */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={softColor}
              strokeWidth={stroke}
              fill="none"
            />

            {/* активная часть */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={mainColor}
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

            {/* число */}
            <text
              x="50%"
              y="46%"
              textAnchor="middle"
              dominantBaseline="middle"
              className={styles.total}
            >
              {format(props.total)}
            </text>

            {/* подзаголовок */}
            <text
              x="50%"
              y="60%"
              textAnchor="middle"
              dominantBaseline="middle"
              className={styles.subLabel}
            >
              {props.subLabel}
            </text>
          </svg>
        </div>

        <div className={styles.legend}>
          <div className={styles.item}>
            <span className={styles.dot} style={{ background: mainColor }} />
            <div>
              <b>{percent(props.percentMain)}%</b>
              <span>{props.labelMain}</span>
            </div>
          </div>

          <div className={styles.item}>
            <span className={styles.dot} style={{ background: softColor }} />
            <div>
              <b>{percent(props.percentSubscribers)}%</b>
              <span>{props.labelSubscribers}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
