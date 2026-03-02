"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getMediaUrl } from "@/lib/media";
import BlockRenderer from "@/components/blog/BlockRenderer";
import RelatedArticles from "@/components/blog/RelatedArticles";
import BlogCTA from "@/components/blog/BlogCTA";
import type { Article, ArticleListItem } from "@/lib/types/blog";
import styles from "./article.module.scss";

interface ArticleClientProps {
  article: Article;
  relatedArticles: ArticleListItem[];
}

export default function ArticleClient({
  article,
  relatedArticles,
}: ArticleClientProps) {
  const t = useTranslations("blog");
  const locale = useLocale();

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    const localeMap: Record<string, string> = {
      ru: "ru-RU",
      en: "en-US",
      kz: "kk-KZ",
      zh: "zh-CN",
    };

    return date.toLocaleDateString(localeMap[locale] || "ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article className={styles.article}>
      {/* Hero */}
      <header className={styles.hero}>
        {/* Decorative shapes */}
        <div className={styles.heroDecoration} />

        <div className={styles.heroContent}>
          <nav className={styles.breadcrumb}>
            <Link href="/circle-blog">{t("title")}</Link>
            {article.category_name && (
              <>
                <span className={styles.separator}>/</span>
                <Link href={`/circle-blog?category=${article.category_slug}`}>
                  {article.category_name}
                </Link>
              </>
            )}
          </nav>

          <h1 className={styles.title}>{article.title}</h1>

          {article.lead && <p className={styles.lead}>{article.lead}</p>}

          {/* Meta Section */}
          <div className={styles.metaSection}>
            <span className={styles.authorName}>Circle Buro</span>
            <span className={styles.divider}>•</span>
            {article.category_name && (
              <>
                <span className={styles.category}>{article.category_name}</span>
                <span className={styles.divider}>•</span>
              </>
            )}
            {article.published_at && (
              <time className={styles.date}>
                {formatDate(article.published_at)}
              </time>
            )}
          </div>
        </div>

        {article.cover_image && (
          <div className={styles.heroImage}>
            <Image
              src={getMediaUrl(article.cover_image)}
              alt={article.title}
              fill
              priority
              sizes="100vw"
              className={styles.coverImage}
            />
          </div>
        )}
      </header>

      {/* Content */}
      <div className={styles.contentWrapper}>
        <BlockRenderer blocks={article.content} />

        <BlogCTA />
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <RelatedArticles articles={relatedArticles} />
      )}
    </article>
  );
}
