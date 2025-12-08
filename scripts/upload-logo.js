// scripts/upload-logo.js
// Скрипт для загрузки PNG и WebP логотипов в MinIO

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

async function uploadLogo(filename, contentType) {
  const filePath = path.join(__dirname, '..', 'public', 'img', filename);
  const objectName = `img/${filename}`;

  const metaData = {
    'Content-Type': contentType,
    'Cache-Control': 'public, max-age=31536000, immutable'
  };

  await minioClient.fPutObject(BUCKET_NAME, objectName, filePath, metaData);
  console.log(`✓ Successfully uploaded: ${objectName}`);
  return objectName;
}

async function main() {
  console.log('🚀 Uploading logo files to MinIO...\n');

  try {
    // Upload PNG
    await uploadLogo('logo-header.png', 'image/png');

    // Upload WebP
    await uploadLogo('logo-header.webp', 'image/webp');

    console.log('\n🌐 URLs:');
    console.log('  PNG: https://media.circleburo.kz/media/img/logo-header.png');
    console.log('  WebP: https://media.circleburo.kz/media/img/logo-header.webp');
    console.log('\n✅ Upload completed!');
    console.log('\n⚠️  Note: CloudFlare cache may take a few moments to update.');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
