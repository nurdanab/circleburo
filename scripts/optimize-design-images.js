// scripts/optimize-design-images.js
// Оптимизация всех изображений дизайна для секции 6

import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const designDir = path.join(__dirname, '..', 'public', 'img', 'design');

// Создаём директорию если не существует
if (!fs.existsSync(designDir)) {
  fs.mkdirSync(designDir, { recursive: true });
}

const images = [
  ...Array.from({ length: 15 }, (_, i) => `${i + 1}d.png`),
  '16d.jpeg',
  ...Array.from({ length: 6 }, (_, i) => `${i + 17}d.png`),
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function optimizeImage(filename) {
  const inputPath = path.join(designDir, filename);
  const ext = path.extname(filename);
  const baseName = path.basename(filename, ext);
  const outputWebpPath = path.join(designDir, `${baseName}.webp`);

  // Проверяем нужно ли скачивать
  if (!fs.existsSync(inputPath)) {
    console.log(`  📥 Downloading ${filename}...`);
    const url = `https://media.circleburo.kz/media/img/design/${filename}`;
    try {
      await downloadFile(url, inputPath);
    } catch (error) {
      console.log(`  ⚠️  Failed to download ${filename}`);
      return null;
    }
  }

  const stats = fs.statSync(inputPath);

  // Проверяем не LFS ли это pointer
  if (stats.size < 1000) {
    console.log(`  ⚠️  ${filename} is Git LFS pointer (${stats.size} bytes) - skipping`);
    return null;
  }

  console.log(`\n🔄 Optimizing ${filename}...`);
  console.log(`  Original size: ${(stats.size / 1024).toFixed(0)} KB`);

  try {
    // Получаем метаданные изображения
    const metadata = await sharp(inputPath).metadata();

    // Определяем целевую ширину (максимум 800px для галереи)
    const targetWidth = Math.min(800, metadata.width);

    // Создаем WebP версию
    await sharp(inputPath)
      .resize(targetWidth, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: 85 })
      .toFile(outputWebpPath);

    const webpStats = fs.statSync(outputWebpPath);
    console.log(`  ✓ WebP (${targetWidth}px): ${(webpStats.size / 1024).toFixed(0)} KB`);

    const savings = ((stats.size - webpStats.size) / stats.size * 100).toFixed(1);
    console.log(`  💾 Savings: ${savings}%`);

    return {
      filename,
      original: stats.size,
      webp: webpStats.size
    };
  } catch (error) {
    console.error(`  ❌ Error optimizing ${filename}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting design images optimization...\n');

  const results = [];
  for (const filename of images) {
    const result = await optimizeImage(filename);
    if (result) results.push(result);
  }

  if (results.length === 0) {
    console.log('\n❌ No images optimized');
    return;
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Optimization Summary:');
  console.log('='.repeat(50));

  const totalOriginal = results.reduce((sum, r) => sum + r.original, 0);
  const totalWebp = results.reduce((sum, r) => sum + r.webp, 0);

  console.log(`Images optimized: ${results.length}/${images.length}`);
  console.log(`Original total: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`WebP total:     ${(totalWebp / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Savings:        ${((1 - totalWebp / totalOriginal) * 100).toFixed(1)}%`);

  console.log('\n✅ Optimization completed!');
}

main();
