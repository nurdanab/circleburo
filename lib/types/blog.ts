// Blog Content Block Types

export type BlockType = 'text' | 'paragraph' | 'heading' | 'image' | 'quote' | 'list';

// Простой текст — без оформления
export interface TextBlock {
  id: string;
  type: 'text';
  data: {
    text: string;
  };
}

// Параграф — с полоской слева, поддерживает форматирование (жирный, курсив)
export interface ParagraphBlock {
  id: string;
  type: 'paragraph';
  data: {
    text: string; // Поддерживает <strong>, <em>
  };
}

export interface HeadingBlock {
  id: string;
  type: 'heading';
  data: {
    text: string;
    level: 2 | 3;
  };
}

export interface ImageBlock {
  id: string;
  type: 'image';
  data: {
    url: string;
    alt: string;
    caption?: string;
  };
}

export interface QuoteBlock {
  id: string;
  type: 'quote';
  data: {
    text: string;
    author?: string;
  };
}

export interface ListBlock {
  id: string;
  type: 'list';
  data: {
    style: 'ordered' | 'unordered';
    items: string[];
  };
}

export type ContentBlock = TextBlock | ParagraphBlock | HeadingBlock | ImageBlock | QuoteBlock | ListBlock;

// Category Types

export interface BlogCategory {
  id: number;
  slug: string;
  name: string;
}

// Article Types

export interface ArticleListItem {
  id: number;
  slug: string;
  cover_image: string | null;
  category_id: number | null;
  category_slug: string | null;
  category_name: string | null;
  status: 'draft' | 'published';
  published_at: string | null;
  title: string;
  lead: string | null;
}

export interface Article extends ArticleListItem {
  content: ContentBlock[];
  meta_title: string | null;
  meta_description: string | null;
}

export interface ArticleTranslation {
  title: string;
  lead: string;
  content: ContentBlock[];
  meta_title: string;
  meta_description: string;
}

export interface ArticleTranslations {
  ru?: ArticleTranslation;
  en?: ArticleTranslation;
  kz?: ArticleTranslation;
  zh?: ArticleTranslation;
}

export interface ArticleWithTranslations {
  id: number;
  slug: string;
  category_id: number | null;
  cover_image: string | null;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
  updated_at: string;
  translations: ArticleTranslations;
}

// API Response Types

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ArticlesResponse {
  articles: ArticleListItem[];
  pagination: PaginationInfo;
}

export interface CategoriesResponse {
  categories: BlogCategory[];
}

// Admin Create/Update Types

export interface CreateArticleInput {
  slug: string;
  category_id: number | null;
  cover_image: string | null;
  status: 'draft' | 'published';
  translations: ArticleTranslations;
}

export interface UpdateArticleInput extends Partial<CreateArticleInput> {
  id: number;
}

// Locale type
export type BlogLocale = 'ru' | 'en' | 'kz' | 'zh';
