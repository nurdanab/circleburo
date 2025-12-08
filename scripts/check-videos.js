// scripts/check-videos.js
// Проверка размеров всех видео файлов

import https from 'https';

const videos = [
  'videos/arc-video1.mp4',
  'videos/arc-video2.mp4',
  'videos/arc-video3.mp4',
  'videos/prod1.mp4',
  'videos/motion-circle.mp4'
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
  console.log('📊 Checking video files sizes...\n');

  let totalSize = 0;

  for (const video of videos) {
    const url = `https://media.circleburo.kz/media/${video}`;
    const size = await getFileSize(url);
    const sizeMB = (size / 1024 / 1024).toFixed(2);

    totalSize += size;

    if (size === 0) {
      console.log(`❌ ${video}: Not found`);
    } else if (size > 5000000) {
      console.log(`⚠️  ${video}: ${sizeMB} MB (large)`);
    } else {
      console.log(`✓ ${video}: ${sizeMB} MB`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`Total: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Average: ${(totalSize / videos.length / 1024 / 1024).toFixed(2)} MB per video`);
}

main();
