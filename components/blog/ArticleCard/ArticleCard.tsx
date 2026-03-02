"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { getMediaUrl } from "@/lib/media";
import styles from "./ArticleCard.module.scss";

interface ArticleCardProps {
  slug: string;
  title: string;
  lead: string | null;
  coverImage: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  publishedAt: string | null;
  variant?: "grid" | "list";
}

export default function ArticleCard({
  slug,
  title,
  lead,
  coverImage,
  categoryName,
  variant = "grid",
}: ArticleCardProps) {
  const t = useTranslations("blog");

  return (
    <Link
      href={`/circle-blog/${slug}`}
      className={`${styles.card} ${variant === "list" ? styles.listVariant : ""}`}
    >
      <div className={styles.imageWrapper}>
        {coverImage ? (
          <Image
            src={getMediaUrl(coverImage)}
            alt={title}
            fill
            sizes={variant === "list"
              ? "(max-width: 768px) 100vw, 280px"
              : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder} />
        )}
        {categoryName && (
          <span className={styles.category}>{categoryName}</span>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {lead && <p className={styles.lead}>{lead}</p>}
        <span className={styles.readMore}>
          {t("readMore")}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 8H13M13 8L8 3M13 8L8 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
