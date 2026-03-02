"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import ArticleCard from "@/components/blog/ArticleCard";
import type { ArticleListItem, BlogCategory, PaginationInfo } from "@/lib/types/blog";
import styles from "./blog.module.scss";

type ViewMode = "grid" | "list";
type SortOrder = "newest" | "oldest";

interface BlogListClientProps {
  articles: ArticleListItem[];
  categories: BlogCategory[];
  pagination: PaginationInfo;
  activeCategory: string | null;
}

export default function BlogListClient({
  articles,
  categories,
  pagination,
  activeCategory,
}: BlogListClientProps) {
  const t = useTranslations("blog");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage > 1) {
      params.set("page", newPage.toString());
    } else {
      params.delete("page");
    }
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleCategoryChange = (categorySlug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categorySlug) {
      params.set("category", categorySlug);
    } else {
      params.delete("category");
    }
    params.delete("page");
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    } else {
      params.delete("search");
    }
    params.delete("page");
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleSortChange = (order: SortOrder) => {
    setSortOrder(order);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", order);
    params.delete("page");
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  return (
    <section className={styles.blog}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.subtitle}>{t("subtitle")}</p>

          {/* Search Bar */}
          <form className={styles.searchWrapper} onSubmit={handleSearch}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className={styles.searchBtn}>
              {t("search")}
            </button>
          </form>

          {/* Category Filter */}
          <div className={styles.filterWrapper}>
            <button
              className={`${styles.filterBtn} ${!activeCategory ? styles.active : ""}`}
              onClick={() => handleCategoryChange(null)}
            >
              {t("allCategories")}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.filterBtn} ${activeCategory === cat.slug ? styles.active : ""}`}
                onClick={() => handleCategoryChange(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className={styles.container}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          {/* View & Sort Controls */}
          <div className={styles.controls}>
            {/* Sort */}
            <div className={styles.sortWrapper}>
              <select
                className={styles.sortSelect}
                value={sortOrder}
                onChange={(e) => handleSortChange(e.target.value as SortOrder)}
              >
                <option value="newest">{t("sortNewest")}</option>
                <option value="oldest">{t("sortOldest")}</option>
              </select>
            </div>

            <div className={styles.divider} />

            {/* View Toggle */}
            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewBtn} ${viewMode === "grid" ? styles.active : ""}`}
                onClick={() => setViewMode("grid")}
                aria-label={t("viewGrid")}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                  <rect x="0" y="0" width="8" height="8" rx="1" />
                  <rect x="10" y="0" width="8" height="8" rx="1" />
                  <rect x="0" y="10" width="8" height="8" rx="1" />
                  <rect x="10" y="10" width="8" height="8" rx="1" />
                </svg>
              </button>
              <button
                className={`${styles.viewBtn} ${viewMode === "list" ? styles.active : ""}`}
                onClick={() => setViewMode("list")}
                aria-label={t("viewList")}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                  <rect x="0" y="0" width="18" height="4" rx="1" />
                  <rect x="0" y="7" width="18" height="4" rx="1" />
                  <rect x="0" y="14" width="18" height="4" rx="1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {articles.length > 0 ? (
          <>
            <div className={viewMode === "grid" ? styles.grid : styles.list}>
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
                  variant={viewMode}
                />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageButton}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  {t("pagination.previous")}
                </button>

                <span className={styles.pageInfo}>
                  {t("pagination.page", {
                    current: pagination.page,
                    total: pagination.totalPages,
                  })}
                </span>

                <button
                  className={styles.pageButton}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  {t("pagination.next")}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className={styles.empty}>
            <p>{t("noArticles")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
