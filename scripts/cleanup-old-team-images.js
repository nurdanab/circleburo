// scripts/cleanup-old-team-images.js
// Удаление старых больших PNG файлов с MinIO

import { Client } from 'minio';

const minioClient = new Client({
  endPoint: '78.109.18.11',
  port: 9000,
  useSSL: false,
  accessKey: 'circleburo_admin',
  secretKey: 'Circle2025'
});

const BUCKET_NAME = 'media';

async function deleteFile(objectName) {
  try {
    await minioClient.removeObject(BUCKET_NAME, objectName);
    console.log(`✓ Deleted: ${objectName}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to delete ${objectName}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🗑️  Cleaning up old team images from MinIO...\n');

  try {
    // Удаляем старые огромные PNG файлы
    await deleteFile('img/team/before.PNG');
    await deleteFile('img/team/after.PNG');

    console.log('\n✅ Cleanup completed!');
    console.log('💾 Freed up ~38 MB of storage space');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
