// scripts/upload-frontend-next-media.js
// Скрипт для загрузки медиа-файлов из frontend-next в MinIO
// Использование: node scripts/upload-frontend-next-media.js [--clear]

import { Client } from 'minio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Проверяем флаг --clear
const CLEAR_BUCKET = process.argv.includes('--clear');

// Конфигурация MinIO
const minioClient = new Client({
  endPoint: '78.109.18.11',
  port: 9000,
  useSSL: false,
  accessKey: 'circleburo_admin',
  secretKey: 'Circle2025'
});

const BUCKET_NAME = 'media';
const PUBLIC_DIR = path.join(__dirname, '..', 'frontend-next', 'public');

// Директории для загрузки
const DIRS_TO_UPLOAD = [
  'about',           // about-hero.png, about-hands.jpg, etc.
  'home',            // Manifest.png, contact.png, services.png, etc.
  'calendar',        // calendar-bg.png, icons
  'contact',         // contact background
  'fonts',           // F37GingerGreek-VF.ttf
  'services',        // services page backgrounds
  'projects-pages',  // individual project pages (campit, citix, etc.)
  'projects-video',  // project showcase videos
  'show-cases'       // design/interier/prod/web showcases
];

// Корневые файлы (SVG иконки)
const ROOT_FILES = [
  'burger-menu.svg',
  'Calendar.svg',
  'Call.svg',
  'Check.svg',
  'footer-icon.svg',
  'Location.svg',
  'Logo.svg',
  'Mail.svg'
];

// Функция для получения всех файлов в директории рекурсивно
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      // Пропускаем пустые файлы
      const stats = fs.statSync(filePath);
      if (stats.size > 0) {
        arrayOfFiles.push(filePath);
      }
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
    '.ttf': 'font/ttf',
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
    console.log(`✓ Uploaded: ${objectName} (${(fileSize / 1024).toFixed(1)} KB)`);
    return { success: true, file: objectName, size: fileSize };
  } catch (error) {
    console.error(`✗ Failed to upload ${objectName}:`, error.message);
    return { success: false, file: objectName, error: error.message };
  }
}

// Функция для очистки бакета
async function clearBucket(bucketName) {
  console.log(`🗑️  Clearing bucket ${bucketName}...`);

  const objectsList = [];
  const stream = minioClient.listObjects(bucketName, '', true);

  return new Promise((resolve, reject) => {
    stream.on('data', (obj) => objectsList.push(obj.name));
    stream.on('error', reject);
    stream.on('end', async () => {
      if (objectsList.length === 0) {
        console.log('   Bucket is already empty');
        resolve();
        return;
      }

      console.log(`   Found ${objectsList.length} objects to delete...`);

      for (const objectName of objectsList) {
        try {
          await minioClient.removeObject(bucketName, objectName);
        } catch (err) {
          console.error(`   Failed to delete ${objectName}:`, err.message);
        }
      }

      console.log(`✓ Deleted ${objectsList.length} objects\n`);
      resolve();
    });
  });
}

// Основная функция
async function main() {
  console.log('🚀 Starting upload to MinIO from frontend-next/public...\n');
  console.log(`📁 Source: ${PUBLIC_DIR}`);

  if (CLEAR_BUCKET) {
    console.log('⚠️  Mode: CLEAR bucket before upload\n');
  } else {
    console.log('📝 Mode: Add/overwrite files (use --clear to clear bucket first)\n');
  }

  try {
    // Проверяем существование bucket
    const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
    if (!bucketExists) {
      console.log(`Creating bucket: ${BUCKET_NAME}`);
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
    }

    // Очищаем бакет если указан флаг --clear
    if (CLEAR_BUCKET && bucketExists) {
      await clearBucket(BUCKET_NAME);
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

    const results = {
      success: [],
      failed: [],
      skipped: [],
      totalSize: 0
    };

    // Загружаем директории
    for (const dir of DIRS_TO_UPLOAD) {
      const dirPath = path.join(PUBLIC_DIR, dir);

      if (!fs.existsSync(dirPath)) {
        console.log(`⚠ Directory not found: ${dir}/`);
        continue;
      }

      console.log(`\n📁 Processing ${dir}/...`);
      const files = getAllFiles(dirPath);

      if (files.length === 0) {
        console.log(`   (empty directory)`);
        continue;
      }

      for (const file of files) {
        const result = await uploadFile(file, BUCKET_NAME);
        if (result.success) {
          results.success.push(result.file);
          results.totalSize += result.size;
        } else if (result.skipped) {
          results.skipped.push(result.file);
        } else {
          results.failed.push(result.file);
        }
      }
    }

    // Загружаем корневые файлы
    console.log(`\n📁 Processing root files...`);
    for (const fileName of ROOT_FILES) {
      const filePath = path.join(PUBLIC_DIR, fileName);

      if (!fs.existsSync(filePath)) {
        console.log(`   ⚠ Not found: ${fileName}`);
        continue;
      }

      const result = await uploadFile(filePath, BUCKET_NAME);
      if (result.success) {
        results.success.push(result.file);
        results.totalSize += result.size;
      } else if (result.skipped) {
        results.skipped.push(result.file);
      } else {
        results.failed.push(result.file);
      }
    }

    // Итоговая статистика
    console.log('\n' + '='.repeat(50));
    console.log('📊 Upload Summary:');
    console.log('='.repeat(50));
    console.log(`✓ Successfully uploaded: ${results.success.length} files`);
    if (results.skipped.length > 0) {
      console.log(`⏭ Skipped (empty files): ${results.skipped.length} files`);
    }
    console.log(`✗ Failed: ${results.failed.length} files`);
    console.log(`📦 Total size: ${(results.totalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`🌐 URL: https://media.circleburo.kz/`);

    if (results.failed.length > 0) {
      console.log('\n❌ Failed files:');
      results.failed.forEach(file => console.log(`  - ${file}`));
    }

    console.log('\n✅ Upload completed!');

    // Показываем первые 10 загруженных файлов
    if (results.success.length > 0) {
      console.log('\n📋 Sample URLs:');
      const sample = results.success.slice(0, 10);
      sample.forEach(file => {
        console.log(`  https://media.circleburo.kz/${file}`);
      });
      if (results.success.length > 10) {
        console.log(`  ... and ${results.success.length - 10} more files`);
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
