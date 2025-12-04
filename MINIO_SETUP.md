# MinIO Media Storage Setup

## Что было сделано

### 1. Настройка MinIO
- Все медиа-файлы (404 MB) перенесены в MinIO облачное хранилище
- Создан публичный bucket `media`
- Настроена политика доступа для публичного чтения

### 2. Структура хранилища
```
MinIO (78.109.18.11:9000/media/)
├── img/           (72 MB - 40 изображений)
├── videos/        (300 MB - 8 видео файлов)
├── cover/         (32 MB - 8 файлов)
└── fonts/         (< 1 MB - 4 шрифта)
```

### 3. Обновленный код
- Создана утилита `src/utils/media.js` с функциями:
  - `getMediaUrl(path)` - универсальная функция для любых медиа
  - `getVideoUrl(filename)` - для видео
  - `getImageUrl(filename)` - для изображений
  - `getCoverUrl(filename)` - для cover файлов

- Обновлены все компоненты для использования MinIO:
  - Header.jsx
  - SEOHead.jsx
  - PerformanceMeta.jsx
  - Все Section компоненты
  - VideoPinSection.jsx

## Доступ к MinIO

### Веб-консоль
- URL: http://78.109.18.11:9001
- Логин: circleburo_admin
- Пароль: Circle2025

### API Endpoint
- URL: http://78.109.18.11:9000
- Bucket: media
- Public URL: http://78.109.18.11:9000/media/

## Переменные окружения

### Локальная разработка (.env.local)
```bash
VITE_MEDIA_BASE_URL=http://78.109.18.11:9000/media
```

### Production (Netlify)
Добавьте в Netlify Environment Variables:
```bash
VITE_MEDIA_BASE_URL=http://78.109.18.11:9000/media
```

## Скрипты

### Загрузка медиа в MinIO
```bash
npm run upload-media
```

### Обновление путей в коде
```bash
npm run update-media-paths
```

## Преимущества

1. **Уменьшение размера репозитория**: Git больше не хранит большие медиа-файлы
2. **Быстрый деплой**: Netlify не нужно копировать 404 MB файлов
3. **CDN-готовность**: Легко добавить CloudFront или другой CDN перед MinIO
4. **Кеширование**: Настроены правильные Cache-Control headers
5. **Масштабируемость**: Легко добавлять новые файлы через API

## Что дальше

### Рекомендуется:
1. Настроить CloudFlare или AWS CloudFront перед MinIO для глобального CDN
2. Настроить автоматическую оптимизацию изображений
3. Добавить резервное копирование MinIO bucket
4. Настроить мониторинг доступности MinIO

### Опционально:
- Удалить медиа из Git LFS (если не нужны локальные копии)
- Настроить автоматическую загрузку новых файлов при деплое
- Добавить fallback на локальные файлы при недоступности MinIO
