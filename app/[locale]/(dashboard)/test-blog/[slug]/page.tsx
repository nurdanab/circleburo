"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import BlockRenderer from "@/components/blog/BlockRenderer";
import RelatedArticles from "@/components/blog/RelatedArticles";
import BlogCTA from "@/components/blog/BlogCTA";
import type { Article, ArticleListItem, ContentBlock } from "@/lib/types/blog";
import styles from "./test-article.module.scss";

// Mock article data
// =====================================================
// РУКОВОДСТВО ПО БЛОКАМ КОНТЕНТА:
// =====================================================
//
// 1. TEXT (Простой текст) — обычный текст без оформления
//
// 2. PARAGRAPH (Параграф) — текст с полоской слева
//    - Поддерживает форматирование: <strong>, <em>
//    - Используется для выделения важных абзацев
//
// 3. HEADING (Заголовок) — заголовки разделов
//    - level: 2 — большой заголовок (H2)
//    - level: 3 — подзаголовок (H3)
//
// 4. IMAGE (Изображение) — картинка в статье
//    - url: путь к изображению
//    - alt: описание для SEO
//    - caption: подпись под картинкой (опционально)
//
// 5. QUOTE (Цитата) — выделенная цитата
//    - text: текст цитаты
//    - author: автор цитаты (опционально)
//
// 6. LIST (Список) — маркированный или нумерованный
//    - style: "unordered" — маркированный (буллеты)
//    - style: "ordered" — нумерованный (1, 2, 3...)
// =====================================================

const mockArticle: Article = {
  id: 1,
  slug: "branding-trends-2025",
  title: "Тренды брендинга 2025: что ждёт рынок",
  lead: "Разбираем ключевые тенденции в мире брендинга и визуальной идентичности на ближайший год. От минимализма до эмоционального дизайна.",
  cover_image: null,
  category_id: 1,
  category_slug: "branding",
  category_name: "Брендинг",
  status: "published",
  published_at: "2025-01-15",
  meta_title: null,
  meta_description: null,
  content: [
    // ===== БЛОК: TEXT (Простой текст) =====
    {
      id: "1",
      type: "text",
      data: {
        text: "Это простой текст — блок без оформления. Используется для обычного текста статьи без выделения."
      }
    },

    // ===== БЛОК: PARAGRAPH (Параграф с полоской) =====
    {
      id: "2",
      type: "paragraph",
      data: {
        text: "Это <strong>параграф</strong> — блок с оранжевой полоской слева. Поддерживает <em>форматирование</em>: жирный и курсив. Используется для выделения важных абзацев."
      }
    },

    // ===== БЛОК: HEADING level 2 (Заголовок H2) =====
    {
      id: "3",
      type: "heading",
      data: {
        text: "Заголовок H2 — большой заголовок раздела",
        level: 2
      }
    },

    // ===== БЛОК: TEXT =====
    {
      id: "4",
      type: "text",
      data: {
        text: "Текст после заголовка — это отдельный блок. Заголовки H2 используются для основных разделов статьи."
      }
    },

    // ===== БЛОК: HEADING level 3 (Подзаголовок H3) =====
    {
      id: "5",
      type: "heading",
      data: {
        text: "Подзаголовок H3 — меньший заголовок",
        level: 3
      }
    },

    // ===== БЛОК: TEXT =====
    {
      id: "6",
      type: "text",
      data: {
        text: "Заголовки H3 используются для подразделов внутри основного раздела. Они меньше чем H2."
      }
    },

    // ===== БЛОК: IMAGE (Изображение) =====
    {
      id: "7",
      type: "image",
      data: {
        url: "/blog/placeholder.jpg",
        alt: "Описание изображения для SEO",
        caption: "Подпись под изображением (опционально)"
      }
    },

    // ===== БЛОК: TEXT =====
    {
      id: "8",
      type: "text",
      data: {
        text: "После изображения можно продолжить текст. Изображения разбивают контент и делают статью визуально привлекательнее."
      }
    },

    // ===== БЛОК: QUOTE с автором (Цитата) =====
    {
      id: "9",
      type: "quote",
      data: {
        text: "Это блок цитаты с указанием автора. Минималистичный стиль с полоской слева.",
        author: "Имя автора"
      }
    },

    // ===== БЛОК: QUOTE без автора =====
    {
      id: "10",
      type: "quote",
      data: {
        text: "Цитата без автора — просто выделенный важный текст."
      }
    },

    // ===== БЛОК: HEADING H2 =====
    {
      id: "11",
      type: "heading",
      data: {
        text: "Списки в статьях",
        level: 2
      }
    },

    // ===== БЛОК: TEXT =====
    {
      id: "12",
      type: "text",
      data: {
        text: "Списки помогают структурировать информацию. Есть два типа:"
      }
    },

    // ===== БЛОК: LIST unordered (Маркированный список) =====
    {
      id: "13",
      type: "list",
      data: {
        style: "unordered",
        items: [
          "Первый пункт маркированного списка",
          "Второй пункт маркированного списка",
          "Третий пункт маркированного списка"
        ]
      }
    },

    // ===== БЛОК: TEXT =====
    {
      id: "14",
      type: "text",
      data: {
        text: "Нумерованный список:"
      }
    },

    // ===== БЛОК: LIST ordered (Нумерованный список) =====
    {
      id: "15",
      type: "list",
      data: {
        style: "ordered",
        items: [
          "Первый шаг",
          "Второй шаг",
          "Третий шаг"
        ]
      }
    },

    // ===== БЛОК: HEADING H2 =====
    {
      id: "16",
      type: "heading",
      data: {
        text: "Заключение",
        level: 2
      }
    },

    // ===== БЛОК: PARAGRAPH =====
    {
      id: "17",
      type: "paragraph",
      data: {
        text: "Это <strong>все блоки контента</strong>. Комбинируя их, можно создавать <em>структурированные</em> статьи для блога."
      }
    }
  ] as ContentBlock[]
};

// Mock related articles
const mockRelatedArticles: ArticleListItem[] = [
  {
    id: 2,
    slug: "effective-marketing-strategies",
    title: "Эффективные маркетинговые стратегии для малого бизнеса",
    lead: "Практические советы по продвижению вашего бизнеса без огромных бюджетов.",
    cover_image: null,
    category_id: 2,
    category_slug: "marketing",
    category_name: "Маркетинг",
    status: "published",
    published_at: "2025-01-10",
  },
  {
    id: 3,
    slug: "web-design-principles",
    title: "Принципы современного веб-дизайна",
    lead: "Минимализм, доступность и пользовательский опыт — три кита успешного сайта.",
    cover_image: null,
    category_id: 3,
    category_slug: "design",
    category_name: "Дизайн",
    status: "published",
    published_at: "2025-01-05",
  },
  {
    id: 4,
    slug: "logo-design-process",
    title: "Процесс создания логотипа: от брифа до финального варианта",
    lead: "Пошаговый разбор нашего подхода к разработке визуальной идентичности бренда.",
    cover_image: null,
    category_id: 1,
    category_slug: "branding",
    category_name: "Брендинг",
    status: "published",
    published_at: "2024-12-20",
  },
];

export default function TestArticlePage() {
  const article = mockArticle;

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article className={styles.article}>
      {/* Hero */}
      <header className={styles.hero}>
        <div className={styles.heroDecoration} />

        <div className={styles.heroContent}>
          <nav className={styles.breadcrumb}>
            <Link href="/test-blog">Блог</Link>
            {article.category_name && (
              <>
                <span className={styles.separator}>/</span>
                <span>{article.category_name}</span>
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

        {/* Placeholder for cover image */}
        <div className={styles.heroImage}>
          <div className={styles.imagePlaceholder} />
        </div>
      </header>

      {/* Content */}
      <div className={styles.contentWrapper}>
        <BlockRenderer blocks={article.content} />
        <BlogCTA />
      </div>

      {/* Related Articles */}
      <RelatedArticles articles={mockRelatedArticles} />
    </article>
  );
}
