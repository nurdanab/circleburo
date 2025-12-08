// scripts/optimize-team-images.js
// Оптимизация изображений before/after для секции 11

import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '..', 'public', 'img', 'team');
const images = ['before.PNG', 'after.PNG'];

async function optimizeImage(filename) {
  const inputPath = path.join(inputDir, filename);
  const outputPngPath = path.join(inputDir, filename.replace('.PNG', '.png'));
  const outputWebpPath = path.join(inputDir, filename.replace('.PNG', '.webp'));

  console.log(`\n🔄 Optimizing ${filename}...`);

  // Получаем размер оригинала
  const originalStats = fs.statSync(inputPath);
  console.log(`  Original size: ${(originalStats.size / 1024 / 1024).toFixed(2)} MB`);

  try {
    // Создаем оптимизированную PNG версию (2560px ширина, quality 90)
    await sharp(inputPath)
      .resize(2560, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(outputPngPath);

    const pngStats = fs.statSync(outputPngPath);
    console.log(`  ✓ PNG (2560px): ${(pngStats.size / 1024 / 1024).toFixed(2)} MB`);

    // Создаем WebP версию (качество 85 для лучшего сжатия)
    await sharp(inputPath)
      .resize(2560, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: 85 })
      .toFile(outputWebpPath);

    const webpStats = fs.statSync(outputWebpPath);
    console.log(`  ✓ WebP (2560px): ${(webpStats.size / 1024 / 1024).toFixed(2)} MB`);

    // Удаляем оригинальный огромный файл
    fs.unlinkSync(inputPath);
    console.log(`  ✓ Removed original file`);

    const savings = ((originalStats.size - webpStats.size) / originalStats.size * 100).toFixed(1);
    console.log(`  💾 Savings: ${savings}%`);

    return {
      filename: filename,
      original: originalStats.size,
      png: pngStats.size,
      webp: webpStats.size
    };
  } catch (error) {
    console.error(`  ❌ Error optimizing ${filename}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting team images optimization...');

  const results = [];
  for (const filename of images) {
    const result = await optimizeImage(filename);
    if (result) results.push(result);
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Optimization Summary:');
  console.log('='.repeat(50));

  const totalOriginal = results.reduce((sum, r) => sum + r.original, 0);
  const totalPng = results.reduce((sum, r) => sum + r.png, 0);
  const totalWebp = results.reduce((sum, r) => sum + r.webp, 0);

  console.log(`Original total: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`PNG total:      ${(totalPng / 1024 / 1024).toFixed(2)} MB (${((1 - totalPng / totalOriginal) * 100).toFixed(1)}% smaller)`);
  console.log(`WebP total:     ${(totalWebp / 1024 / 1024).toFixed(2)} MB (${((1 - totalWebp / totalOriginal) * 100).toFixed(1)}% smaller)`);

  console.log('\n✅ Optimization completed!');
  console.log('\n📤 Next step: Upload to MinIO using:');
  console.log('   node scripts/upload-team-images.js');
}

main();
