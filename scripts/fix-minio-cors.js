// scripts/fix-minio-cors.js
// Скрипт для настройки CORS в MinIO

import { Client } from 'minio';

const minioClient = new Client({
  endPoint: '78.109.18.11',
  port: 9000,
  useSSL: false,
  accessKey: 'circleburo_admin',
  secretKey: 'Circle2025'
});

const BUCKET_NAME = 'media';

async function setCORS() {
  try {
    console.log('🔧 Настройка CORS для bucket:', BUCKET_NAME);

    // CORS конфигурация
    const corsConfig = {
      CORSRules: [
        {
          AllowedOrigins: ['*'], // Разрешить все домены (или укажите конкретные)
          AllowedMethods: ['GET', 'HEAD'],
          AllowedHeaders: ['*'],
          MaxAgeSeconds: 3600
        }
      ]
    };

    // Устанавливаем CORS (MinIO использует setBucketCors)
    await minioClient.setBucketCors(BUCKET_NAME, corsConfig);

    console.log('✅ CORS успешно настроен!');
    console.log('Разрешены:');
    console.log('  - Origins: * (все домены)');
    console.log('  - Methods: GET, HEAD');
    console.log('  - Headers: *');

  } catch (error) {
    console.error('❌ Ошибка настройки CORS:', error.message);

    // Альтернативный способ через mc (MinIO Client CLI)
    console.log('\n💡 Альтернатива: используйте MinIO CLI (mc):');
    console.log('\nУстановка mc:');
    console.log('  brew install minio/stable/mc');
    console.log('\nНастройка alias:');
    console.log('  mc alias set myminio http://78.109.18.11:9000 circleburo_admin Circle2025');
    console.log('\nУстановка CORS:');
    console.log('  mc anonymous set download myminio/media');
    console.log('  mc cors set --add \'{"CORSRules":[{"AllowedOrigins":["*"],"AllowedMethods":["GET","HEAD"],"AllowedHeaders":["*"]}]}\' myminio/media');
  }
}

setCORS();
