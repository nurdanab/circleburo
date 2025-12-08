// scripts/upload-design-images.js
// Загрузка оптимизированных изображений дизайна на MinIO

import { Client } from 'minio';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const minioClient = new Client({
  endPoint: '78.109.18.11',
  port: 9000,
  useSSL: false,
  accessKey: 'circleburo_admin',
  secretKey: 'Circle2025'
});

const BUCKET_NAME = 'media';
const designDir = path.join(__dirname, '..', 'public', 'img', 'design');

async function uploadFile(filename) {
  const filePath = path.join(designDir, filename);
  const objectName = `img/design/${filename}`;

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filename}`);
    return false;
  }

  const stats = fs.statSync(filePath);
  const metaData = {
    'Content-Type': 'image/webp',
    'Cache-Control': 'public, max-age=31536000, immutable'
  };

  try {
    await minioClient.fPutObject(BUCKET_NAME, objectName, filePath, metaData);
    console.log(`✓ Uploaded: ${objectName} (${(stats.size / 1024).toFixed(0)} KB)`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to upload ${filename}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Uploading optimized design images to MinIO...\n');

  // Находим все .webp файлы
  const files = fs.readdirSync(designDir).filter(f => f.endsWith('.webp'));

  let uploaded = 0;
  for (const file of files) {
    if (await uploadFile(file)) {
      uploaded++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Uploaded ${uploaded}/${files.length} files`);
  console.log('\n⚠️  Note: Purge CloudFlare cache for these URLs:');
  console.log('   https://media.circleburo.kz/media/img/design/*');
}

main();
