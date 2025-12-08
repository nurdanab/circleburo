// scripts/upload-motion-video.js
// Загрузка оптимизированной версии motion-circle.mp4 на MinIO

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

async function uploadVideo() {
  const filePath = path.join(__dirname, '..', 'public', 'videos', 'motion-circle.mp4');
  const objectName = 'videos/motion-circle.mp4';

  if (!fs.existsSync(filePath)) {
    console.log('❌ File not found locally');
    return;
  }

  const stats = fs.statSync(filePath);
  console.log(`📤 Uploading optimized motion-circle.mp4...`);
  console.log(`   Local file size: ${(stats.size / 1024 / 1024).toFixed(2)} MB\n`);

  const metaData = {
    'Content-Type': 'video/mp4',
    'Cache-Control': 'public, max-age=31536000, immutable'
  };

  try {
    await minioClient.fPutObject(BUCKET_NAME, objectName, filePath, metaData);
    console.log(`✓ Successfully uploaded: ${objectName}`);
    console.log(`🌐 URL: https://media.circleburo.kz/media/videos/motion-circle.mp4`);
    console.log(`\n💾 Savings: 11.24 MB (from 15.23 MB to 3.98 MB)`);
    console.log(`\n⚠️  Note: Purge CloudFlare cache for this URL`);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

uploadVideo();
