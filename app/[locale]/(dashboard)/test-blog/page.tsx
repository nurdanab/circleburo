"use client";

import ArticleCard from "@/components/blog/ArticleCard";
import styles from "./test-blog.module.scss";

// Mock data for testing
const mockArticles = [
  {
    id: 1,
    slug: "branding-trends-2025",
    title: "Тренды брендинга 2025: что ждёт рынок",
    lead: "Разбираем ключевые тенденции в мире брендинга и визуальной идентичности на ближайший год.",
    coverImage: null,
    categoryName: "Брендинг",
    categorySlug: "branding",
    publishedAt: "2025-01-15",
  },
  {
    id: 2,
    slug: "effective-marketing-strategies",
    title: "Эффективные маркетинговые стратегии для малого бизнеса",
    lead: "Практические советы по продвижению вашего бизнеса без огромных бюджетов. Проверенные методы и кейсы.",
    coverImage: null,
    categoryName: "Маркетинг",
    categorySlug: "marketing",
    publishedAt: "2025-01-10",
  },
  {
    id: 3,
    slug: "web-design-principles",
    title: "Принципы современного веб-дизайна",
    lead: "Минимализм, доступность и пользовательский опыт — три кита успешного сайта.",
    coverImage: null,
    categoryName: "Дизайн",
    categorySlug: "design",
    publishedAt: "2025-01-05",
  },
  {
    id: 4,
    slug: "customer-research-guide",
    title: "Как проводить исследования клиентов: полное руководство",
    lead: "От глубинных интервью до количественных опросов — все методы изучения вашей аудитории.",
    coverImage: null,
    categoryName: "Исследования",
    categorySlug: "research",
    publishedAt: "2024-12-28",
  },
  {
    id: 5,
    slug: "logo-design-process",
    title: "Процесс создания логотипа: от брифа до финального варианта",
    lead: "Пошаговый разбор нашего подхода к разработке визуальной идентичности бренда.",
    coverImage: null,
    categoryName: "Брендинг",
    categorySlug: "branding",
    publishedAt: "2024-12-20",
  },
  {
    id: 6,
    slug: "social-media-content",
    title: "Контент для социальных сетей: что работает в 2025",
    lead: "Анализируем форматы, которые привлекают внимание и генерируют вовлечённость.",
    coverImage: null,
    categoryName: "Маркетинг",
    categorySlug: "marketing",
    publishedAt: "2024-12-15",
  },
];

export default function TestBlogPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Тест карточек блога</h1>

        {/* Grid View */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Grid View (3 колонки)</h2>
          <div className={styles.grid}>
            {mockArticles.map((article) => (
              <ArticleCard
                key={article.id}
                slug={article.slug}
                title={article.title}
                lead={article.lead}
                coverImage={article.coverImage}
                categoryName={article.categoryName}
                categorySlug={article.categorySlug}
                publishedAt={article.publishedAt}
                variant="grid"
              />
            ))}
          </div>
        </section>

        {/* List View */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>List View</h2>
          <div className={styles.list}>
            {mockArticles.slice(0, 3).map((article) => (
              <ArticleCard
                key={article.id}
                slug={article.slug}
                title={article.title}
                lead={article.lead}
                coverImage={article.coverImage}
                categoryName={article.categoryName}
                categorySlug={article.categorySlug}
                publishedAt={article.publishedAt}
                variant="list"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
