import type {
  Article,
  ArticleListItem,
  ArticlesResponse,
  ArticleWithTranslations,
  BlogCategory,
  BlogLocale,
  CategoriesResponse,
  CreateArticleInput,
  PaginationInfo,
} from './types/blog';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// ==================== PUBLIC API ====================

export const blogApi = {
  // Get all published article slugs for sitemap
  async getAllSlugs(): Promise<ApiResponse<{ slugs: string[] }>> {
    try {
      const response = await fetch(`${API_URL}/api/blog/articles/slugs`);

      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Failed to fetch slugs' };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  },

  // Get published articles with pagination
  async getArticles(
    locale: BlogLocale,
    options?: {
      category?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<ApiResponse<ArticlesResponse>> {
    try {
      const params = new URLSearchParams({ locale });

      if (options?.category) params.append('category', options.category);
      if (options?.page) params.append('page', options.page.toString());
      if (options?.limit) params.append('limit', options.limit.toString());

      const response = await fetch(`${API_URL}/api/blog/articles?${params}`);

      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Failed to fetch articles' };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  },

  // Get single article by slug
  async getArticle(slug: string, locale: BlogLocale): Promise<ApiResponse<Article>> {
    try {
      const response = await fetch(`${API_URL}/api/blog/articles/${slug}?locale=${locale}`);

      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Article not found' };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  },

  // Get related articles
  async getRelatedArticles(
    slug: string,
    locale: BlogLocale,
    limit = 3
  ): Promise<ApiResponse<{ articles: ArticleListItem[] }>> {
    try {
      const response = await fetch(
        `${API_URL}/api/blog/articles/${slug}/related?locale=${locale}&limit=${limit}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Failed to fetch related articles' };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  },

  // Get all categories
  async getCategories(locale: BlogLocale): Promise<ApiResponse<CategoriesResponse>> {
    try {
      const response = await fetch(`${API_URL}/api/blog/categories?locale=${locale}`);

      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Failed to fetch categories' };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  },
};

// ==================== ADMIN API ====================

export const blogAdminApi = {
  // Get all articles for admin (including drafts)
  async getArticles(options?: {
    status?: 'draft' | 'published';
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{
    articles: Array<{
      id: number;
      slug: string;
      cover_image: string | null;
      category_id: number | null;
      category_slug: string | null;
      status: 'draft' | 'published';
      published_at: string | null;
      created_at: string;
      updated_at: string;
      title_ru: string | null;
      title_en: string | null;
    }>;
    pagination: PaginationInfo;
  }>> {
    try {
      const params = new URLSearchParams();

      if (options?.status) params.append('status', options.status);
      if (options?.category) params.append('category', options.category);
      if (options?.page) params.append('page', options.page.toString());
      if (options?.limit) params.append('limit', options.limit.toString());

      const response = await fetch(`${API_URL}/api/admin/blog/articles?${params}`);

      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Failed to fetch articles' };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  },

  // Get single article with all translations
  async getArticle(id: number): Promise<ApiResponse<ArticleWithTranslations>> {
    try {
      const response = await fetch(`${API_URL}/api/admin/blog/articles/${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Article not found' };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  },

  // Create new article
  async createArticle(input: CreateArticleInput): Promise<ApiResponse<{ id: number; slug: string }>> {
    try {
      const response = await fetch(`${API_URL}/api/admin/blog/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Failed to create article' };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  },

  // Update article
  async updateArticle(
    id: number,
    input: Partial<CreateArticleInput>
  ): Promise<ApiResponse<{ id: number; slug: string }>> {
    try {
      const response = await fetch(`${API_URL}/api/admin/blog/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Failed to update article' };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  },

  // Delete article
  async deleteArticle(id: number): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`${API_URL}/api/admin/blog/articles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Failed to delete article' };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  },

  // Upload image
  async uploadImage(file: File): Promise<ApiResponse<{ url: string }>> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_URL}/api/admin/blog/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Failed to upload image' };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  },

  // Get categories for admin
  async getCategories(): Promise<ApiResponse<{
    categories: Array<{
      id: number;
      slug: string;
      name: string;
      translations: Record<string, string>;
    }>;
  }>> {
    try {
      const response = await fetch(`${API_URL}/api/admin/blog/categories`);

      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Failed to fetch categories' };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  },

  // Create category
  async createCategory(input: {
    slug: string;
    translations: Record<string, string>;
  }): Promise<ApiResponse<{ id: number; slug: string; name: string }>> {
    try {
      const response = await fetch(`${API_URL}/api/admin/blog/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Failed to create category' };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  },
};
