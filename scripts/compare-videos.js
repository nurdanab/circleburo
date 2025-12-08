// scripts/compare-videos.js
// Сравнение локальных и удалённых версий видео

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const videosDir = path.join(__dirname, '..', 'public', 'videos');

const videos = [
  'arc-video1.mp4',
  'arc-video2.mp4',
  'arc-video3.mp4',
  'prod1.mp4',
  'motion-circle.mp4'
];

function getRemoteSize(url) {
  return new Promise((resolve) => {
    https.request(url, { method: 'HEAD' }, (res) => {
      const size = parseInt(res.headers['content-length'] || '0');
      resolve(size);
    }).on('error', () => resolve(0)).end();
  });
}

async function main() {
  console.log('📊 Comparing local and remote video sizes...\n');

  for (const video of videos) {
    const localPath = path.join(videosDir, video);
    const remoteUrl = `https://media.circleburo.kz/media/videos/${video}`;

    let localSize = 0;
    if (fs.existsSync(localPath)) {
      localSize = fs.statSync(localPath).size;
    }

    const remoteSize = await getRemoteSize(remoteUrl);

    const localMB = (localSize / 1024 / 1024).toFixed(2);
    const remoteMB = (remoteSize / 1024 / 1024).toFixed(2);

    if (localSize === 0) {
      console.log(`❌ ${video}`);
      console.log(`   Local: NOT FOUND`);
      console.log(`   Remote: ${remoteMB} MB\n`);
    } else if (remoteSize > localSize * 1.1) {
      console.log(`⚠️  ${video} - Remote is LARGER (outdated!)`);
      console.log(`   Local:  ${localMB} MB (optimized)`);
      console.log(`   Remote: ${remoteMB} MB (old version)`);
      console.log(`   💾 Should re-upload to save ${((remoteSize - localSize) / 1024 / 1024).toFixed(2)} MB\n`);
    } else {
      console.log(`✓ ${video}`);
      console.log(`   Local:  ${localMB} MB`);
      console.log(`   Remote: ${remoteMB} MB\n`);
    }
  }
}

main();
