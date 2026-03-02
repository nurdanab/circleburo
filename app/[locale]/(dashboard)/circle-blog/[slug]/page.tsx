import { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { blogApi } from "@/lib/blogApi";
import { getMediaUrl } from "@/lib/media";
import type { BlogLocale } from "@/lib/types/blog";
import ArticleClient from "./ArticleClient";

const BASE_URL = "https://circleburo.kz";
const LOCALES = ["ru", "en", "kz", "zh"] as const;
const DEFAULT_LOCALE = "ru";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  const result = await blogApi.getArticle(slug, locale as BlogLocale);

  if (!result.data) {
    return {
      title: "Article Not Found",
    };
  }

  const article = result.data;
  const title = article.meta_title || article.title;
  const description = article.meta_description || article.lead || undefined;
  const imageUrl = article.cover_image ? getMediaUrl(article.cover_image) : undefined;

  // Build canonical and alternate URLs
  const localePath = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const canonicalUrl = `${BASE_URL}${localePath}/circle-blog/${slug}`;

  // Build alternates for all locales
  const languages: Record<string, string> = {};
  for (const loc of LOCALES) {
    const locPath = loc === DEFAULT_LOCALE ? "" : `/${loc}`;
    languages[loc] = `${BASE_URL}${locPath}/circle-blog/${slug}`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonicalUrl,
      siteName: "Circle Creative Buro",
      locale: locale === "ru" ? "ru_RU" : locale === "en" ? "en_US" : locale === "kz" ? "kk_KZ" : "zh_CN",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
      publishedTime: article.published_at || undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // Fetch article and related articles
  const [articleResult, relatedResult] = await Promise.all([
    blogApi.getArticle(slug, locale as BlogLocale),
    blogApi.getRelatedArticles(slug, locale as BlogLocale, 3),
  ]);

  if (!articleResult.data) {
    notFound();
  }

  const article = articleResult.data;
  const relatedArticles = relatedResult.data?.articles || [];

  // Build JSON-LD structured data
  const localePath = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const articleUrl = `${BASE_URL}${localePath}/circle-blog/${slug}`;
  const imageUrl = article.cover_image ? getMediaUrl(article.cover_image) : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.lead || undefined,
    image: imageUrl,
    datePublished: article.published_at,
    dateModified: article.published_at,
    author: {
      "@type": "Organization",
      name: "Circle Creative Buro",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Circle Creative Buro",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleClient article={article} relatedArticles={relatedArticles} />
    </>
  );
}
