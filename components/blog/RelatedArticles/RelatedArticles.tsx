"use client";

import { useTranslations } from "next-intl";
import ArticleCard from "../ArticleCard";
import type { ArticleListItem } from "@/lib/types/blog";
import styles from "./RelatedArticles.module.scss";

interface RelatedArticlesProps {
  articles: ArticleListItem[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  const t = useTranslations("blog");

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{t("relatedArticles")}</h2>
      <div className={styles.grid}>
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            slug={article.slug}
            title={article.title}
            lead={article.lead}
            coverImage={article.cover_image}
            categoryName={article.category_name}
            categorySlug={article.category_slug}
            publishedAt={article.published_at}
          />
        ))}
      </div>
    </section>
  );
}
