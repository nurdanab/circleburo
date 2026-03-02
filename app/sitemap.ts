import { MetadataRoute } from 'next';
import { blogApi } from '@/lib/blogApi';

const BASE_URL = 'https://circleburo.kz';
const LOCALES = ['ru', 'en', 'kz', 'zh'] as const;
const DEFAULT_LOCALE = 'ru';

// Static pages that exist on the site
const STATIC_PAGES = [
  '', // home
  '/about',
  '/services',
  '/projects',
  '/contact',
  '/show-cases',
  '/show-cases/design',
  '/show-cases/web',
  '/show-cases/prod',
  '/show-cases/interier',
  '/circle-blog',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Add static pages for all locales
  for (const page of STATIC_PAGES) {
    const languages: Record<string, string> = {};

    for (const locale of LOCALES) {
      const localePath = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
      languages[locale] = `${BASE_URL}${localePath}${page}`;
    }

    // Add entry for default locale (ru)
    entries.push({
      url: `${BASE_URL}${page}`,
      lastModified: new Date(),
      changeFrequency: page === '' ? 'weekly' : 'monthly',
      priority: page === '' ? 1.0 : 0.8,
      alternates: {
        languages,
      },
    });

    // Add entries for other locales
    for (const locale of LOCALES) {
      if (locale !== DEFAULT_LOCALE) {
        entries.push({
          url: `${BASE_URL}/${locale}${page}`,
          lastModified: new Date(),
          changeFrequency: page === '' ? 'weekly' : 'monthly',
          priority: page === '' ? 0.9 : 0.7,
          alternates: {
            languages,
          },
        });
      }
    }
  }

  // Add blog articles
  try {
    const result = await blogApi.getAllSlugs();

    if (result.data?.slugs) {
      for (const slug of result.data.slugs) {
        const languages: Record<string, string> = {};

        for (const locale of LOCALES) {
          const localePath = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
          languages[locale] = `${BASE_URL}${localePath}/circle-blog/${slug}`;
        }

        // Add entry for default locale
        entries.push({
          url: `${BASE_URL}/circle-blog/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: {
            languages,
          },
        });

        // Add entries for other locales
        for (const locale of LOCALES) {
          if (locale !== DEFAULT_LOCALE) {
            entries.push({
              url: `${BASE_URL}/${locale}/circle-blog/${slug}`,
              lastModified: new Date(),
              changeFrequency: 'weekly',
              priority: 0.6,
              alternates: {
                languages,
              },
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error fetching blog slugs for sitemap:', error);
  }

  return entries;
}
