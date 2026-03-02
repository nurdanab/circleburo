const express = require('express');
const multer = require('multer');
const path = require('path');
const logger = require('../utils/logger');
const storage = require('../services/storage');

// Create routers
const publicRouter = express.Router();
const adminRouter = express.Router();

// Database pool will be injected
let pool;

const setPool = (dbPool) => {
  pool = dbPool;
};

// Multer configuration for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  },
});

// ==================== PUBLIC ENDPOINTS ====================

// Get all published article slugs (for sitemap) - must be before :slug route
publicRouter.get('/articles/slugs', async (req, res) => {
  try {
    const query = `
      SELECT slug
      FROM blog_articles
      WHERE status = 'published'
      ORDER BY published_at DESC
    `;

    const result = await pool.query(query);
    const slugs = result.rows.map(row => row.slug);

    res.json({ slugs });
  } catch (error) {
    logger.error('Error fetching article slugs:', error);
    res.status(500).json({ error: 'Failed to fetch slugs' });
  }
});

// Get all published articles with pagination
publicRouter.get('/articles', async (req, res) => {
  try {
    const { locale = 'ru', category, page = 1, limit = 9 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Validate locale
    const validLocales = ['ru', 'en', 'kz', 'zh'];
    if (!validLocales.includes(locale)) {
      return res.status(400).json({ error: 'Invalid locale' });
    }

    // Build query
    let query = `
      SELECT
        a.id,
        a.slug,
        a.cover_image,
        a.category_id,
        c.slug as category_slug,
        ct.name as category_name,
        a.status,
        a.published_at,
        t.title,
        t.lead
      FROM blog_articles a
      LEFT JOIN blog_article_translations t ON a.id = t.article_id AND t.locale = $1
      LEFT JOIN blog_categories c ON a.category_id = c.id
      LEFT JOIN blog_category_translations ct ON c.id = ct.category_id AND ct.locale = $1
      WHERE a.status = 'published' AND t.title IS NOT NULL
    `;

    const params = [locale];
    let paramCount = 2;

    if (category) {
      query += ` AND c.slug = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    query += ` ORDER BY a.published_at DESC NULLS LAST, a.created_at DESC`;

    // Get total count
    const countQuery = query.replace(/SELECT[\s\S]*?FROM/, 'SELECT COUNT(*) FROM');
    const countResult = await pool.query(countQuery.split('ORDER BY')[0], params);
    const total = parseInt(countResult.rows[0].count);

    // Add pagination
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), offset);

    const result = await pool.query(query, params);

    res.json({
      articles: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Error fetching blog articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Get single article by slug
publicRouter.get('/articles/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { locale = 'ru' } = req.query;

    const validLocales = ['ru', 'en', 'kz', 'zh'];
    if (!validLocales.includes(locale)) {
      return res.status(400).json({ error: 'Invalid locale' });
    }

    const query = `
      SELECT
        a.id,
        a.slug,
        a.cover_image,
        a.category_id,
        c.slug as category_slug,
        ct.name as category_name,
        a.status,
        a.published_at,
        t.title,
        t.lead,
        t.content,
        t.meta_title,
        t.meta_description
      FROM blog_articles a
      LEFT JOIN blog_article_translations t ON a.id = t.article_id AND t.locale = $1
      LEFT JOIN blog_categories c ON a.category_id = c.id
      LEFT JOIN blog_category_translations ct ON c.id = ct.category_id AND ct.locale = $1
      WHERE a.slug = $2 AND a.status = 'published'
    `;

    const result = await pool.query(query, [locale, slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// Get related articles
publicRouter.get('/articles/:slug/related', async (req, res) => {
  try {
    const { slug } = req.params;
    const { locale = 'ru', limit = 3 } = req.query;

    const validLocales = ['ru', 'en', 'kz', 'zh'];
    if (!validLocales.includes(locale)) {
      return res.status(400).json({ error: 'Invalid locale' });
    }

    // First get the category of the current article
    const articleQuery = `SELECT category_id FROM blog_articles WHERE slug = $1`;
    const articleResult = await pool.query(articleQuery, [slug]);

    if (articleResult.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const categoryId = articleResult.rows[0].category_id;

    // Get related articles from same category
    const query = `
      SELECT
        a.id,
        a.slug,
        a.cover_image,
        a.category_id,
        c.slug as category_slug,
        ct.name as category_name,
        a.published_at,
        t.title,
        t.lead
      FROM blog_articles a
      LEFT JOIN blog_article_translations t ON a.id = t.article_id AND t.locale = $1
      LEFT JOIN blog_categories c ON a.category_id = c.id
      LEFT JOIN blog_category_translations ct ON c.id = ct.category_id AND ct.locale = $1
      WHERE a.status = 'published'
        AND a.slug != $2
        AND t.title IS NOT NULL
        ${categoryId ? 'AND a.category_id = $4' : ''}
      ORDER BY a.published_at DESC NULLS LAST
      LIMIT $3
    `;

    const params = categoryId
      ? [locale, slug, parseInt(limit), categoryId]
      : [locale, slug, parseInt(limit)];

    const result = await pool.query(query, params);

    res.json({ articles: result.rows });
  } catch (error) {
    logger.error('Error fetching related articles:', error);
    res.status(500).json({ error: 'Failed to fetch related articles' });
  }
});

// Get all categories
publicRouter.get('/categories', async (req, res) => {
  try {
    const { locale = 'ru' } = req.query;

    const validLocales = ['ru', 'en', 'kz', 'zh'];
    if (!validLocales.includes(locale)) {
      return res.status(400).json({ error: 'Invalid locale' });
    }

    const query = `
      SELECT
        c.id,
        c.slug,
        ct.name
      FROM blog_categories c
      LEFT JOIN blog_category_translations ct ON c.id = ct.category_id AND ct.locale = $1
      ORDER BY c.id
    `;

    const result = await pool.query(query, [locale]);

    res.json({ categories: result.rows });
  } catch (error) {
    logger.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// ==================== ADMIN ENDPOINTS ====================

// Get all articles (including drafts) for admin
adminRouter.get('/articles', async (req, res) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = `
      SELECT
        a.id,
        a.slug,
        a.cover_image,
        a.category_id,
        c.slug as category_slug,
        a.status,
        a.published_at,
        a.created_at,
        a.updated_at,
        (SELECT title FROM blog_article_translations WHERE article_id = a.id AND locale = 'ru' LIMIT 1) as title_ru,
        (SELECT title FROM blog_article_translations WHERE article_id = a.id AND locale = 'en' LIMIT 1) as title_en
      FROM blog_articles a
      LEFT JOIN blog_categories c ON a.category_id = c.id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` AND a.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (category) {
      query += ` AND c.slug = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    query += ` ORDER BY a.updated_at DESC`;

    // Get total count - build a separate simpler query
    let countQuery = `
      SELECT COUNT(*) FROM blog_articles a
      LEFT JOIN blog_categories c ON a.category_id = c.id
      WHERE 1=1
    `;
    if (status) {
      countQuery += ` AND a.status = $1`;
    }
    if (category) {
      const catParam = status ? '$2' : '$1';
      countQuery += ` AND c.slug = ${catParam}`;
    }
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    // Add pagination
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), offset);

    const result = await pool.query(query, params);

    res.json({
      articles: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Error fetching admin articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Get single article with all translations for editing
adminRouter.get('/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get article metadata
    const articleQuery = `
      SELECT
        a.id,
        a.slug,
        a.cover_image,
        a.category_id,
        a.status,
        a.published_at,
        a.created_at,
        a.updated_at
      FROM blog_articles a
      WHERE a.id = $1
    `;

    const articleResult = await pool.query(articleQuery, [id]);

    if (articleResult.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const article = articleResult.rows[0];

    // Get all translations
    const translationsQuery = `
      SELECT locale, title, lead, content, meta_title, meta_description
      FROM blog_article_translations
      WHERE article_id = $1
    `;

    const translationsResult = await pool.query(translationsQuery, [id]);

    // Format translations as object
    const translations = {};
    translationsResult.rows.forEach(row => {
      translations[row.locale] = {
        title: row.title,
        lead: row.lead || '',
        content: row.content || [],
        meta_title: row.meta_title || '',
        meta_description: row.meta_description || ''
      };
    });

    res.json({
      ...article,
      translations
    });
  } catch (error) {
    logger.error('Error fetching article for edit:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// Create new article
adminRouter.post('/articles', async (req, res) => {
  const client = await pool.connect();

  try {
    const { slug, category_id, cover_image, status, translations } = req.body;

    // Validation
    if (!slug) {
      return res.status(400).json({ error: 'Slug is required' });
    }

    if (!translations || Object.keys(translations).length === 0) {
      return res.status(400).json({ error: 'At least one translation is required' });
    }

    await client.query('BEGIN');

    // Insert article
    const published_at = status === 'published' ? new Date().toISOString() : null;

    const articleResult = await client.query(
      `INSERT INTO blog_articles (slug, category_id, cover_image, status, published_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [slug, category_id, cover_image, status || 'draft', published_at]
    );

    const article = articleResult.rows[0];

    // Insert translations
    for (const [locale, translation] of Object.entries(translations)) {
      if (translation.title) {
        await client.query(
          `INSERT INTO blog_article_translations
           (article_id, locale, title, lead, content, meta_title, meta_description)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            article.id,
            locale,
            translation.title,
            translation.lead || '',
            JSON.stringify(translation.content || []),
            translation.meta_title || '',
            translation.meta_description || ''
          ]
        );
      }
    }

    await client.query('COMMIT');

    logger.info(`Blog article created: ${article.id}`);
    res.status(201).json(article);
  } catch (error) {
    await client.query('ROLLBACK');

    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'Article with this slug already exists' });
    }

    logger.error('Error creating article:', error);
    res.status(500).json({ error: 'Failed to create article' });
  } finally {
    client.release();
  }
});

// Update article
adminRouter.put('/articles/:id', async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { slug, category_id, cover_image, status, translations } = req.body;

    // Check if article exists
    const existingResult = await client.query(
      'SELECT * FROM blog_articles WHERE id = $1',
      [id]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const existing = existingResult.rows[0];

    await client.query('BEGIN');

    // Update published_at if status changed to published
    let published_at = existing.published_at;
    if (status === 'published' && existing.status !== 'published') {
      published_at = new Date().toISOString();
    }

    // Update article
    const articleResult = await client.query(
      `UPDATE blog_articles
       SET slug = $1, category_id = $2, cover_image = $3, status = $4, published_at = $5
       WHERE id = $6
       RETURNING *`,
      [slug || existing.slug, category_id, cover_image, status || existing.status, published_at, id]
    );

    const article = articleResult.rows[0];

    // Update translations
    if (translations) {
      for (const [locale, translation] of Object.entries(translations)) {
        if (translation.title) {
          // Upsert translation
          await client.query(
            `INSERT INTO blog_article_translations
             (article_id, locale, title, lead, content, meta_title, meta_description)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             ON CONFLICT (article_id, locale)
             DO UPDATE SET
               title = EXCLUDED.title,
               lead = EXCLUDED.lead,
               content = EXCLUDED.content,
               meta_title = EXCLUDED.meta_title,
               meta_description = EXCLUDED.meta_description,
               updated_at = CURRENT_TIMESTAMP`,
            [
              article.id,
              locale,
              translation.title,
              translation.lead || '',
              JSON.stringify(translation.content || []),
              translation.meta_title || '',
              translation.meta_description || ''
            ]
          );
        }
      }
    }

    await client.query('COMMIT');

    logger.info(`Blog article updated: ${article.id}`);
    res.json(article);
  } catch (error) {
    await client.query('ROLLBACK');

    if (error.code === '23505') {
      return res.status(409).json({ error: 'Article with this slug already exists' });
    }

    logger.error('Error updating article:', error);
    res.status(500).json({ error: 'Failed to update article' });
  } finally {
    client.release();
  }
});

// Create category
adminRouter.post('/categories', async (req, res) => {
  const client = await pool.connect();

  try {
    const { slug, translations } = req.body;

    // Validation
    if (!slug) {
      return res.status(400).json({ error: 'Slug is required' });
    }

    if (!translations || Object.keys(translations).length === 0) {
      return res.status(400).json({ error: 'At least one translation is required' });
    }

    await client.query('BEGIN');

    // Insert category
    const categoryResult = await client.query(
      'INSERT INTO blog_categories (slug) VALUES ($1) RETURNING *',
      [slug]
    );

    const category = categoryResult.rows[0];

    // Insert translations
    for (const [locale, name] of Object.entries(translations)) {
      if (name) {
        await client.query(
          `INSERT INTO blog_category_translations (category_id, locale, name)
           VALUES ($1, $2, $3)`,
          [category.id, locale, name]
        );
      }
    }

    await client.query('COMMIT');

    logger.info(`Blog category created: ${category.id}`);
    res.status(201).json({
      id: category.id,
      slug: category.slug,
      name: translations.ru || Object.values(translations)[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');

    if (error.code === '23505') {
      return res.status(409).json({ error: 'Category with this slug already exists' });
    }

    logger.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  } finally {
    client.release();
  }
});

// Get all categories for admin (with all translations)
adminRouter.get('/categories', async (req, res) => {
  try {
    const query = `
      SELECT
        c.id,
        c.slug,
        ct.name,
        ct.locale
      FROM blog_categories c
      LEFT JOIN blog_category_translations ct ON c.id = ct.category_id
      ORDER BY c.id
    `;

    const result = await pool.query(query);

    // Group by category
    const categoriesMap = new Map();
    result.rows.forEach((row) => {
      if (!categoriesMap.has(row.id)) {
        categoriesMap.set(row.id, {
          id: row.id,
          slug: row.slug,
          translations: {},
        });
      }
      if (row.locale && row.name) {
        categoriesMap.get(row.id).translations[row.locale] = row.name;
      }
    });

    const categories = Array.from(categoriesMap.values()).map((cat) => ({
      ...cat,
      name: cat.translations.ru || Object.values(cat.translations)[0] || cat.slug,
    }));

    res.json({ categories });
  } catch (error) {
    logger.error('Error fetching admin categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Upload image
adminRouter.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate unique filename
    const ext = path.extname(req.file.originalname);
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

    const result = await storage.uploadFile(req.file, filename);

    if (result.success) {
      res.json({ url: result.url });
    } else {
      res.status(500).json({ error: result.error || 'Upload failed' });
    }
  } catch (error) {
    logger.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Delete image
adminRouter.delete('/upload', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const result = await storage.deleteFile(url);

    if (result.success) {
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(500).json({ error: result.error || 'Delete failed' });
    }
  } catch (error) {
    logger.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Delete article
adminRouter.delete('/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete associated images first
    await storage.deleteArticleImages(pool, id);

    const result = await pool.query(
      'DELETE FROM blog_articles WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    logger.info(`Blog article deleted with images: ${id}`);
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    logger.error('Error deleting article:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

module.exports = {
  public: publicRouter,
  admin: adminRouter,
  setPool
};
