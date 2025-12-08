// scripts/upload-team-images.js
// Загрузка оптимизированных изображений before/after на MinIO

import { Client } from 'minio';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

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
const teamDir = path.join(__dirname, '..', 'public', 'img', 'team');

async function uploadFile(filename, contentType) {
  const filePath = path.join(teamDir, filename);
  const objectName = `img/team/${filename}`;

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filename}`);
    return null;
  }

  const stats = fs.statSync(filePath);
  const metaData = {
    'Content-Type': contentType,
    'Cache-Control': 'public, max-age=31536000, immutable'
  };

  try {
    await minioClient.fPutObject(BUCKET_NAME, objectName, filePath, metaData);
    console.log(`✓ Uploaded: ${objectName} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    return objectName;
  } catch (error) {
    console.error(`✗ Failed to upload ${filename}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Uploading optimized team images to MinIO...\n');

  try {
    // Upload PNG versions
    await uploadFile('before.png', 'image/png');
    await uploadFile('after.png', 'image/png');

    // Upload WebP versions
    await uploadFile('before.webp', 'image/webp');
    await uploadFile('after.webp', 'image/webp');

    console.log('\n🌐 URLs:');
    console.log('  Before PNG:  https://media.circleburo.kz/media/img/team/before.png');
    console.log('  Before WebP: https://media.circleburo.kz/media/img/team/before.webp');
    console.log('  After PNG:   https://media.circleburo.kz/media/img/team/after.png');
    console.log('  After WebP:  https://media.circleburo.kz/media/img/team/after.webp');

    console.log('\n✅ Upload completed!');
    console.log('⚠️  Note: Purge CloudFlare cache for these URLs');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
