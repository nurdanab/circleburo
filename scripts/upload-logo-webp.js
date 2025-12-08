// scripts/upload-logo-webp.js
// Скрипт для загрузки только WebP логотипа в MinIO

import { Client } from 'minio';
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

async function uploadLogoWebP() {
  console.log('🚀 Uploading logo-header.webp to MinIO...\n');

  try {
    const filePath = path.join(__dirname, '..', 'public', 'img', 'logo-header.webp');
    const objectName = 'img/logo-header.webp';

    const metaData = {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable'
    };

    await minioClient.fPutObject(BUCKET_NAME, objectName, filePath, metaData);
    console.log(`✓ Successfully uploaded: ${objectName}`);
    console.log(`🌐 URL: https://media.circleburo.kz/media/${objectName}`);
    console.log('\n✅ Upload completed!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

uploadLogoWebP();
