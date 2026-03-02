"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import type { BlogCategory } from "@/lib/types/blog";
import styles from "./CategoryFilter.module.scss";

interface CategoryFilterProps {
  categories: BlogCategory[];
  activeCategory: string | null;
}

export default function CategoryFilter({
  categories,
  activeCategory,
}: CategoryFilterProps) {
  const t = useTranslations("blog");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleCategoryChange = (categorySlug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (categorySlug) {
      params.set("category", categorySlug);
    } else {
      params.delete("category");
    }

    // Reset to page 1 when changing category
    params.delete("page");

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  return (
    <div className={styles.filter}>
      <button
        className={`${styles.button} ${!activeCategory ? styles.active : ""}`}
        onClick={() => handleCategoryChange(null)}
      >
        {t("allCategories")}
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          className={`${styles.button} ${
            activeCategory === category.slug ? styles.active : ""
          }`}
          onClick={() => handleCategoryChange(category.slug)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
