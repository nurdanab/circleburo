"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { blogAdminApi, blogApi } from "@/lib/blogApi";
import LanguageTabs from "../LanguageTabs";
import BlockEditor from "../BlockEditor";
import ImageUploader from "../ImageUploader";
import type {
  ArticleTranslations,
  ArticleTranslation,
  BlogLocale,
  ContentBlock,
  BlogCategory,
} from "@/lib/types/blog";
import styles from "./ArticleEditor.module.scss";

interface ArticleEditorProps {
  articleId?: number;
}

const EMPTY_TRANSLATION: ArticleTranslation = {
  title: "",
  lead: "",
  content: [],
  meta_title: "",
  meta_description: "",
};

export default function ArticleEditor({ articleId }: ArticleEditorProps) {
  const router = useRouter();
  const isEditing = !!articleId;

  // Form state
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [translations, setTranslations] = useState<ArticleTranslations>({
    ru: { ...EMPTY_TRANSLATION },
  });

  // UI state
  const [activeLocale, setActiveLocale] = useState<BlogLocale>("ru");
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Category creation state
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [newCategoryNames, setNewCategoryNames] = useState({
    ru: "",
    en: "",
    kz: "",
    zh: "",
  });
  const [creatingCategory, setCreatingCategory] = useState(false);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      const result = await blogApi.getCategories("ru");
      if (result.data) {
        setCategories(result.data.categories);
      }
    };
    loadCategories();
  }, []);

  // Load article if editing
  useEffect(() => {
    if (articleId) {
      const loadArticle = async () => {
        setLoading(true);
        const result = await blogAdminApi.getArticle(articleId);

        if (result.error) {
          setError("Ошибка загрузки статьи");
        } else if (result.data) {
          setSlug(result.data.slug);
          setCategoryId(result.data.category_id);
          setCoverImage(result.data.cover_image || "");
          setStatus(result.data.status);
          setTranslations(result.data.translations || { ru: { ...EMPTY_TRANSLATION } });
        }
        setLoading(false);
      };
      loadArticle();
    }
  }, [articleId]);

  // Get current translation
  const currentTranslation = translations[activeLocale] || EMPTY_TRANSLATION;

  // Update translation field
  const updateTranslation = (field: keyof ArticleTranslation, value: string | ContentBlock[]) => {
    setTranslations((prev) => ({
      ...prev,
      [activeLocale]: {
        ...(prev[activeLocale] || EMPTY_TRANSLATION),
        [field]: value,
      },
    }));
  };

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[а-яё]/g, (char) => {
        const map: Record<string, string> = {
          а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
          з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
          п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
          ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
        };
        return map[char] || char;
      })
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 100);
  };

  // Handle title change and auto-generate slug
  const handleTitleChange = (title: string) => {
    updateTranslation("title", title);

    // Auto-generate slug only if slug is empty and this is Russian title
    if (!slug && activeLocale === "ru") {
      setSlug(generateSlug(title));
    }
  };

  // Create new category
  const handleCreateCategory = async () => {
    if (!newCategorySlug.trim()) {
      setError("Укажите slug категории");
      return;
    }

    const hasAnyName = Object.values(newCategoryNames).some((n) => n.trim());
    if (!hasAnyName) {
      setError("Укажите название категории хотя бы на одном языке");
      return;
    }

    setCreatingCategory(true);
    setError("");

    const result = await blogAdminApi.createCategory({
      slug: newCategorySlug.trim(),
      translations: Object.fromEntries(
        Object.entries(newCategoryNames).filter(([, v]) => v.trim())
      ),
    });

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      // Add to categories list and select it
      setCategories((prev) => [...prev, result.data!]);
      setCategoryId(result.data.id);

      // Reset form
      setShowCategoryForm(false);
      setNewCategorySlug("");
      setNewCategoryNames({ ru: "", en: "", kz: "", zh: "" });
    }

    setCreatingCategory(false);
  };

  // Generate category slug from Russian name
  const handleCategoryNameChange = (locale: string, value: string) => {
    setNewCategoryNames((prev) => ({ ...prev, [locale]: value }));

    if (locale === "ru" && !newCategorySlug) {
      setNewCategorySlug(generateSlug(value));
    }
  };

  // Save article
  const handleSave = async () => {
    // Validation
    if (!slug) {
      setError("Укажите URL-slug статьи");
      return;
    }

    const hasAnyTitle = Object.values(translations).some((t) => t?.title?.trim());
    if (!hasAnyTitle) {
      setError("Укажите заголовок хотя бы на одном языке");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const data = {
      slug,
      category_id: categoryId,
      cover_image: coverImage || null,
      status,
      translations,
    };

    let result;

    if (isEditing) {
      result = await blogAdminApi.updateArticle(articleId, data);
    } else {
      result = await blogAdminApi.createArticle(data);
    }

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(isEditing ? "Статья сохранена" : "Статья создана");

      if (!isEditing && result.data) {
        // Redirect to edit page
        setTimeout(() => {
          router.push(`/admin/blog/${result.data!.id}/edit`);
        }, 1000);
      }
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className={styles.editor}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/admin/blog" className={styles.backLink}>
            ← Назад к списку
          </Link>
          <h1 className={styles.title}>
            {isEditing ? "Редактирование статьи" : "Новая статья"}
          </h1>
        </div>
        <div className={styles.headerRight}>
          <button
            onClick={handleSave}
            disabled={saving}
            className={styles.saveBtn}
          >
            {saving ? "Сохранение..." : isEditing ? "Сохранить" : "Создать"}
          </button>
        </div>
      </header>

      {/* Messages */}
      {error && (
        <div className={styles.error}>
          <span>{error}</span>
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      {success && (
        <div className={styles.success}>
          <span>{success}</span>
          <button onClick={() => setSuccess("")}>×</button>
        </div>
      )}

      {/* Main Content */}
      <div className={styles.content}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <label className={styles.label}>URL Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="article-url-slug"
              className={styles.input}
            />
            <span className={styles.hint}>/circle-blog/{slug || "..."}</span>
          </div>

          <div className={styles.sidebarSection}>
            <label className={styles.label}>Категория</label>
            <select
              value={categoryId || ""}
              onChange={(e) => setCategoryId(e.target.value ? parseInt(e.target.value) : null)}
              className={styles.select}
            >
              <option value="">Без категории</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {!showCategoryForm ? (
              <button
                type="button"
                onClick={() => setShowCategoryForm(true)}
                className={styles.addCategoryBtn}
              >
                + Добавить категорию
              </button>
            ) : (
              <div className={styles.categoryForm}>
                <div className={styles.categoryFormHeader}>
                  <span>Новая категория</span>
                  <button
                    type="button"
                    onClick={() => setShowCategoryForm(false)}
                    className={styles.closeCategoryBtn}
                  >
                    ×
                  </button>
                </div>

                <input
                  type="text"
                  value={newCategorySlug}
                  onChange={(e) => setNewCategorySlug(e.target.value)}
                  placeholder="slug (например: branding)"
                  className={styles.input}
                />

                <div className={styles.categoryNames}>
                  <input
                    type="text"
                    value={newCategoryNames.ru}
                    onChange={(e) => handleCategoryNameChange("ru", e.target.value)}
                    placeholder="Название (RU)"
                    className={styles.input}
                  />
                  <input
                    type="text"
                    value={newCategoryNames.en}
                    onChange={(e) => handleCategoryNameChange("en", e.target.value)}
                    placeholder="Name (EN)"
                    className={styles.input}
                  />
                  <input
                    type="text"
                    value={newCategoryNames.kz}
                    onChange={(e) => handleCategoryNameChange("kz", e.target.value)}
                    placeholder="Атауы (KZ)"
                    className={styles.input}
                  />
                  <input
                    type="text"
                    value={newCategoryNames.zh}
                    onChange={(e) => handleCategoryNameChange("zh", e.target.value)}
                    placeholder="名称 (ZH)"
                    className={styles.input}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={creatingCategory}
                  className={styles.createCategoryBtn}
                >
                  {creatingCategory ? "Создание..." : "Создать"}
                </button>
              </div>
            )}
          </div>

          <div className={styles.sidebarSection}>
            <label className={styles.label}>Обложка</label>
            <ImageUploader
              value={coverImage}
              onChange={setCoverImage}
              placeholder="Перетащите или выберите обложку"
            />
          </div>

          <div className={styles.sidebarSection}>
            <label className={styles.label}>Статус</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published")}
              className={styles.select}
            >
              <option value="draft">Черновик</option>
              <option value="published">Опубликовано</option>
            </select>
          </div>
        </aside>

        {/* Main Editor */}
        <main className={styles.main}>
          <LanguageTabs
            activeLocale={activeLocale}
            onLocaleChange={setActiveLocale}
            translations={translations}
          />

          {/* Title & Lead */}
          <div className={styles.formSection}>
            <label className={styles.label}>Заголовок ({activeLocale.toUpperCase()})</label>
            <input
              type="text"
              value={currentTranslation.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Введите заголовок статьи..."
              className={styles.titleInput}
            />
          </div>

          <div className={styles.formSection}>
            <label className={styles.label}>Лид (краткое описание)</label>
            <textarea
              value={currentTranslation.lead}
              onChange={(e) => updateTranslation("lead", e.target.value)}
              placeholder="Краткое описание статьи для превью..."
              className={styles.leadInput}
              rows={2}
            />
          </div>

          {/* Content Blocks */}
          <div className={styles.formSection}>
            <label className={styles.label}>Контент</label>
            <BlockEditor
              blocks={currentTranslation.content}
              onChange={(blocks) => updateTranslation("content", blocks)}
            />
          </div>

          {/* SEO */}
          <div className={styles.seoSection}>
            <h3 className={styles.seoTitle}>SEO</h3>
            <p className={styles.seoHint}>
              Эти данные используются для отображения статьи в поисковых системах (Google, Yandex) и при шеринге в соцсетях.
            </p>
            <div className={styles.formSection}>
              <label className={styles.label}>Meta Title</label>
              <input
                type="text"
                value={currentTranslation.meta_title}
                onChange={(e) => updateTranslation("meta_title", e.target.value)}
                placeholder="Заголовок для поисковиков (50-60 символов)"
                className={styles.input}
              />
              <span className={styles.hint}>
                Отображается в результатах поиска как заголовок страницы. Рекомендуется 50-60 символов.
              </span>
            </div>
            <div className={styles.formSection}>
              <label className={styles.label}>Meta Description</label>
              <textarea
                value={currentTranslation.meta_description}
                onChange={(e) => updateTranslation("meta_description", e.target.value)}
                placeholder="Описание для поисковиков (150-160 символов)"
                className={styles.input}
                rows={2}
              />
              <span className={styles.hint}>
                Отображается под заголовком в результатах поиска. Рекомендуется 150-160 символов.
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
