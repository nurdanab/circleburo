const Minio = require('minio');
const logger = require('../utils/logger');

// MinIO Client configuration
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || '78.109.18.11',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || '',
  secretKey: process.env.MINIO_SECRET_KEY || '',
});

const BUCKET_NAME = process.env.MINIO_BUCKET || 'media';
const BLOG_FOLDER = 'blog';

// Ensure blog folder exists in bucket
const ensureBucket = async () => {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME);
      logger.info(`Bucket ${BUCKET_NAME} created`);
    }
    return true;
  } catch (error) {
    logger.error('Error ensuring bucket exists:', error);
    return false;
  }
};

// Upload file to MinIO
const uploadFile = async (file, filename) => {
  try {
    await ensureBucket();

    const objectName = `${BLOG_FOLDER}/${filename}`;

    await minioClient.putObject(
      BUCKET_NAME,
      objectName,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
        'x-amz-meta-uploaded-at': new Date().toISOString(),
      }
    );

    // Generate public URL
    const baseUrl = process.env.MINIO_PUBLIC_URL || `http://${process.env.MINIO_ENDPOINT || '78.109.18.11'}:${process.env.MINIO_PORT || '9000'}`;
    const publicUrl = `${baseUrl}/${BUCKET_NAME}/${objectName}`;

    logger.info(`File uploaded: ${objectName}`);
    return {
      success: true,
      url: publicUrl,
      objectName,
    };
  } catch (error) {
    logger.error('Error uploading file:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Delete file from MinIO
const deleteFile = async (objectName) => {
  try {
    // Extract object name from full URL if needed
    let name = objectName;
    if (objectName.includes(`/${BUCKET_NAME}/`)) {
      name = objectName.split(`/${BUCKET_NAME}/`)[1];
    }

    await minioClient.removeObject(BUCKET_NAME, name);
    logger.info(`File deleted: ${name}`);
    return { success: true };
  } catch (error) {
    logger.error('Error deleting file:', error);
    return { success: false, error: error.message };
  }
};

// List all files in blog folder
const listBlogFiles = async () => {
  try {
    const files = [];
    const stream = minioClient.listObjects(BUCKET_NAME, BLOG_FOLDER + '/', true);

    return new Promise((resolve, reject) => {
      stream.on('data', (obj) => {
        files.push({
          name: obj.name,
          size: obj.size,
          lastModified: obj.lastModified,
        });
      });
      stream.on('error', reject);
      stream.on('end', () => resolve(files));
    });
  } catch (error) {
    logger.error('Error listing files:', error);
    return [];
  }
};

// Delete multiple files
const deleteFiles = async (objectNames) => {
  try {
    if (objectNames.length === 0) return { success: true, deleted: 0 };

    await minioClient.removeObjects(BUCKET_NAME, objectNames);
    logger.info(`Deleted ${objectNames.length} files`);
    return { success: true, deleted: objectNames.length };
  } catch (error) {
    logger.error('Error deleting files:', error);
    return { success: false, error: error.message };
  }
};

// Get all image URLs used in articles (from database)
const getUsedImageUrls = async (pool) => {
  const usedUrls = new Set();

  try {
    // Get cover images
    const coverResult = await pool.query(
      'SELECT cover_image FROM blog_articles WHERE cover_image IS NOT NULL'
    );
    coverResult.rows.forEach((row) => {
      if (row.cover_image) usedUrls.add(row.cover_image);
    });

    // Get images from article content
    const contentResult = await pool.query(
      'SELECT content FROM blog_article_translations WHERE content IS NOT NULL'
    );
    contentResult.rows.forEach((row) => {
      if (row.content && Array.isArray(row.content)) {
        row.content.forEach((block) => {
          if (block.type === 'image' && block.data?.url) {
            usedUrls.add(block.data.url);
          }
        });
      }
    });

    return usedUrls;
  } catch (error) {
    logger.error('Error getting used image URLs:', error);
    return usedUrls;
  }
};

// Cleanup unused images older than specified days
const cleanupUnusedImages = async (pool, daysOld = 1) => {
  try {
    const usedUrls = await getUsedImageUrls(pool);
    const allFiles = await listBlogFiles();

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const filesToDelete = [];
    const baseUrl = process.env.MINIO_PUBLIC_URL || `http://${process.env.MINIO_ENDPOINT || '78.109.18.11'}:${process.env.MINIO_PORT || '9000'}`;

    for (const file of allFiles) {
      const fileUrl = `${baseUrl}/${BUCKET_NAME}/${file.name}`;

      // Check if file is unused and old enough
      if (!usedUrls.has(fileUrl) && file.lastModified < cutoffDate) {
        filesToDelete.push(file.name);
      }
    }

    if (filesToDelete.length > 0) {
      await deleteFiles(filesToDelete);
      logger.info(`Cleanup: Deleted ${filesToDelete.length} unused images`);
    }

    return { deleted: filesToDelete.length };
  } catch (error) {
    logger.error('Error during cleanup:', error);
    return { deleted: 0, error: error.message };
  }
};

// Get all images used in a specific article
const getArticleImages = async (pool, articleId) => {
  const images = [];

  try {
    // Get cover image
    const articleResult = await pool.query(
      'SELECT cover_image FROM blog_articles WHERE id = $1',
      [articleId]
    );
    if (articleResult.rows[0]?.cover_image) {
      images.push(articleResult.rows[0].cover_image);
    }

    // Get content images
    const contentResult = await pool.query(
      'SELECT content FROM blog_article_translations WHERE article_id = $1',
      [articleId]
    );
    contentResult.rows.forEach((row) => {
      if (row.content && Array.isArray(row.content)) {
        row.content.forEach((block) => {
          if (block.type === 'image' && block.data?.url) {
            images.push(block.data.url);
          }
        });
      }
    });

    return images;
  } catch (error) {
    logger.error('Error getting article images:', error);
    return images;
  }
};

// Delete all images associated with an article
const deleteArticleImages = async (pool, articleId) => {
  try {
    const images = await getArticleImages(pool, articleId);
    const blogFolder = `${BLOG_FOLDER}/`;

    const objectNames = images
      .filter((url) => url.includes(blogFolder))
      .map((url) => {
        const parts = url.split(`/${BUCKET_NAME}/`);
        return parts.length > 1 ? parts[1] : null;
      })
      .filter((name) => name !== null);

    if (objectNames.length > 0) {
      await deleteFiles(objectNames);
    }

    return { deleted: objectNames.length };
  } catch (error) {
    logger.error('Error deleting article images:', error);
    return { deleted: 0, error: error.message };
  }
};

module.exports = {
  uploadFile,
  deleteFile,
  deleteFiles,
  listBlogFiles,
  cleanupUnusedImages,
  getArticleImages,
  deleteArticleImages,
};
