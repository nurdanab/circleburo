// scripts/upload-to-minio.js
// Скрипт для загрузки медиа-файлов в MinIO

import { Client } from 'minio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Конфигурация MinIO
const minioClient = new Client({
  endPoint: '78.109.18.11',
  port: 9000,
  useSSL: false,
  accessKey: 'circleburo_admin',
  secretKey: 'Circle2025'
});

const BUCKET_NAME = 'media';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Функция для получения всех файлов в директории рекурсивно
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// Функция для определения MIME типа
function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.pdf': 'application/pdf'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// Функция для загрузки файла
async function uploadFile(filePath, bucketName) {
  const relativePath = path.relative(PUBLIC_DIR, filePath);
  const objectName = relativePath.replace(/\\/g, '/');
  const mimeType = getMimeType(filePath);

  try {
    const fileStats = fs.statSync(filePath);
    const fileSize = fileStats.size;

    // Метаданные для правильного отображения в браузере
    const metaData = {
      'Content-Type': mimeType,
      'Cache-Control': 'public, max-age=31536000, immutable'
    };

    await minioClient.fPutObject(bucketName, objectName, filePath, metaData);
    console.log(`✓ Uploaded: ${objectName} (${(fileSize / 1024 / 1024).toFixed(2)} MB)`);
    return { success: true, file: objectName, size: fileSize };
  } catch (error) {
    console.error(`✗ Failed to upload ${objectName}:`, error.message);
    return { success: false, file: objectName, error: error.message };
  }
}

// Основная функция
async function main() {
  console.log('🚀 Starting upload to MinIO...\n');

  try {
    // Проверяем существование bucket
    const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
    if (!bucketExists) {
      console.log(`Creating bucket: ${BUCKET_NAME}`);
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
    }

    // Устанавливаем публичную политику для bucket
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`]
        }
      ]
    };

    await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
    console.log(`✓ Bucket ${BUCKET_NAME} is ready and public\n`);

    // Директории для загрузки
    const dirsToUpload = ['img', 'videos', 'cover', 'fonts', 'images'];
    const results = {
      success: [],
      failed: [],
      totalSize: 0
    };

    for (const dir of dirsToUpload) {
      const dirPath = path.join(PUBLIC_DIR, dir);

      if (!fs.existsSync(dirPath)) {
        console.log(`⚠ Directory not found: ${dir}`);
        continue;
      }

      console.log(`\n📁 Processing ${dir}/...`);
      const files = getAllFiles(dirPath);

      for (const file of files) {
        const result = await uploadFile(file, BUCKET_NAME);
        if (result.success) {
          results.success.push(result.file);
          results.totalSize += result.size;
        } else {
          results.failed.push(result.file);
        }
      }
    }

    // Итоговая статистика
    console.log('\n' + '='.repeat(50));
    console.log('📊 Upload Summary:');
    console.log('='.repeat(50));
    console.log(`✓ Successfully uploaded: ${results.success.length} files`);
    console.log(`✗ Failed: ${results.failed.length} files`);
    console.log(`📦 Total size: ${(results.totalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`🌐 MinIO URL: http://78.109.18.11:9000/${BUCKET_NAME}/`);

    if (results.failed.length > 0) {
      console.log('\n❌ Failed files:');
      results.failed.forEach(file => console.log(`  - ${file}`));
    }

    console.log('\n✅ Upload completed!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
