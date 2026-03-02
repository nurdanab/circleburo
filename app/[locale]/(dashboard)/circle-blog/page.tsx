import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { blogApi } from "@/lib/blogApi";
import type { BlogLocale } from "@/lib/types/blog";
import BlogListClient from "./BlogListClient";

const BASE_URL = "https://circleburo.kz";
const LOCALES = ["ru", "en", "kz", "zh"] as const;
const DEFAULT_LOCALE = "ru";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    ru: "Circle Blog — Статьи о брендинге и маркетинге",
    en: "Circle Blog — Articles on Branding and Marketing",
    kz: "Circle Blog — Брендинг және маркетинг туралы мақалалар",
    zh: "Circle Blog — 品牌与营销文章",
  };

  const descriptions: Record<string, string> = {
    ru: "Экспертные статьи о брендинге, маркетинге, дизайне и исследованиях от агентства Circle Creative Buro",
    en: "Expert articles on branding, marketing, design and research from Circle Creative Buro agency",
    kz: "Circle Creative Buro агенттігінен брендинг, маркетинг, дизайн және зерттеулер туралы сарапшы мақалалары",
    zh: "Circle Creative Buro机构关于品牌、营销、设计和研究的专家文章",
  };

  const title = titles[locale] || titles.ru;
  const description = descriptions[locale] || descriptions.ru;

  // Build canonical and alternate URLs
  const localePath = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const canonicalUrl = `${BASE_URL}${localePath}/circle-blog`;

  // Build alternates for all locales
  const languages: Record<string, string> = {};
  for (const loc of LOCALES) {
    const locPath = loc === DEFAULT_LOCALE ? "" : `/${loc}`;
    languages[loc] = `${BASE_URL}${locPath}/circle-blog`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalUrl,
      siteName: "Circle Creative Buro",
      locale: locale === "ru" ? "ru_RU" : locale === "en" ? "en_US" : locale === "kz" ? "kk_KZ" : "zh_CN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category, page } = await searchParams;
  setRequestLocale(locale);

  const currentPage = page ? parseInt(page) : 1;

  // Fetch data on server
  const [articlesResult, categoriesResult] = await Promise.all([
    blogApi.getArticles(locale as BlogLocale, {
      category: category || undefined,
      page: currentPage,
      limit: 9,
    }),
    blogApi.getCategories(locale as BlogLocale),
  ]);

  const articles = articlesResult.data?.articles || [];
  const pagination = articlesResult.data?.pagination || {
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0,
  };
  const categories = categoriesResult.data?.categories || [];

  // Build JSON-LD structured data for blog listing
  const localePath = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const blogUrl = `${BASE_URL}${localePath}/circle-blog`;

  const titles: Record<string, string> = {
    ru: "Circle Blog — Статьи о брендинге и маркетинге",
    en: "Circle Blog — Articles on Branding and Marketing",
    kz: "Circle Blog — Брендинг және маркетинг туралы мақалалар",
    zh: "Circle Blog — 品牌与营销文章",
  };

  const descriptions: Record<string, string> = {
    ru: "Экспертные статьи о брендинге, маркетинге, дизайне и исследованиях от агентства Circle Creative Buro",
    en: "Expert articles on branding, marketing, design and research from Circle Creative Buro agency",
    kz: "Circle Creative Buro агенттігінен брендинг, маркетинг, дизайн және зерттеулер туралы сарапшы мақалалары",
    zh: "Circle Creative Buro机构关于品牌、营销、设计和研究的专家文章",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: titles[locale] || titles.ru,
    description: descriptions[locale] || descriptions.ru,
    url: blogUrl,
    publisher: {
      "@type": "Organization",
      name: "Circle Creative Buro",
      url: BASE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogListClient
        articles={articles}
        categories={categories}
        pagination={pagination}
        activeCategory={category || null}
      />
    </>
  );
}
