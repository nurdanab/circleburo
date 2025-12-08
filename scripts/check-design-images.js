// scripts/check-design-images.js
// Проверка размеров изображений дизайна

import https from 'https';

const images = [
  ...Array.from({ length: 15 }, (_, i) => `img/design/${i + 1}d.png`),
  'img/design/16d.jpeg',
  ...Array.from({ length: 6 }, (_, i) => `img/design/${i + 17}d.png`),
];

function getFileSize(url) {
  return new Promise((resolve) => {
    https.request(url, { method: 'HEAD' }, (res) => {
      const size = parseInt(res.headers['content-length'] || '0');
      resolve(size);
    }).on('error', () => resolve(0)).end();
  });
}

async function main() {
  console.log('📊 Checking design images sizes...\n');

  let totalSize = 0;
  const results = [];

  for (const img of images) {
    const url = `https://media.circleburo.kz/media/${img}`;
    const size = await getFileSize(url);
    const sizeMB = (size / 1024 / 1024).toFixed(2);

    results.push({ img, size, sizeMB });
    totalSize += size;

    if (size < 1000) {
      console.log(`⚠️  ${img}: ${size} bytes (Git LFS pointer!)`);
    } else if (size > 500000) {
      console.log(`❌ ${img}: ${sizeMB} MB (too large!)`);
    } else {
      console.log(`✓ ${img}: ${sizeMB} MB`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`Total: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Average: ${(totalSize / images.length / 1024 / 1024).toFixed(2)} MB per image`);

  const lfsPointers = results.filter(r => r.size < 1000).length;
  if (lfsPointers > 0) {
    console.log(`\n⚠️  Found ${lfsPointers} Git LFS pointers - need to pull from LFS!`);
  }
}

main();
