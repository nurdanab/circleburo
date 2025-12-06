# 🎨 Полное руководство по оптимизации медиа

## 🎯 Зачем оптимизировать?

### Текущая проблема:
- **arc-video2.mp4**: 183 MB ❌
- **arc-video1.mp4**: 51 MB ❌
- **arc-video3.mp4**: 40 MB ❌
- **motion-circle.mp4**: 15 MB ❌
- **Изображения PNG**: ~500KB-2MB каждое ❌

**Итого загрузка страницы:** ~300+ MB 😱

### После оптимизации:
- **Видео**: ~15 MB (вместо 289 MB) ✅
- **Изображения WebP**: ~50-200KB каждое ✅
- **Poster images**: ~20-50KB каждое ✅

**Итого:** ~30-40 MB (-87% 🔥)

---

## 🚀 Быстрый старт

### 1. Установите FFmpeg

```bash
# macOS
brew install ffmpeg

# Linux
sudo apt-get install ffmpeg

# Проверка установки
ffmpeg -version
```

### 2. Запустите оптимизацию

```bash
bash optimize-all-media.sh
```

Скрипт автоматически:
- ✅ Создаст резервные копии
- ✅ Сожмет все видео (MP4 → оптимизированный MP4)
- ✅ Конвертирует изображения (PNG/JPG → WebP)
- ✅ Создаст poster images для видео
- ✅ Покажет детальный отчет

### 3. Проверьте результаты

```bash
# Откройте папку с оптимизированными файлами
open public/optimized/

# Сравните размеры
du -sh public/backup/
du -sh public/optimized/
```

### 4. Замените файлы (если качество OK)

```bash
# Удалите старые файлы
rm -rf public/videos/*.mp4
rm -rf public/img/*.png public/img/*.jpg

# Скопируйте оптимизированные
cp -r public/optimized/videos/* public/videos/
cp -r public/optimized/img/* public/img/
cp -r public/optimized/cover/* public/cover/

# Или используйте rsync
rsync -av --delete public/optimized/videos/ public/videos/
rsync -av --delete public/optimized/img/ public/img/
rsync -av --delete public/optimized/cover/ public/cover/
```

### 5. Обновите код для WebP

**Вариант А: Автоматическая замена расширений**

Обновите `src/utils/media.js`:

```javascript
export const getMediaUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Автоматически заменяем PNG/JPG на WebP для изображений
  let optimizedPath = cleanPath;
  if (cleanPath.match(/\.(png|jpg|jpeg)$/i) && !cleanPath.includes('favicon')) {
    optimizedPath = cleanPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  }

  if (MEDIA_BASE_URL) {
    return `${MEDIA_BASE_URL}/media/${optimizedPath}`;
  }

  return `/${optimizedPath}`;
};
```

**Вариант Б: Picture элемент с fallback**

```jsx
<picture>
  <source srcSet={getMediaUrl("img/logo.webp")} type="image/webp" />
  <img src={getMediaUrl("img/logo.png")} alt="Logo" />
</picture>
```

### 6. Загрузите на CDN

```bash
# Загрузите все медиа на MinIO
npm run upload-media

# Или используйте mc (MinIO Client)
mc cp --recursive public/videos/ minio/media/videos/
mc cp --recursive public/img/ minio/media/img/
mc cp --recursive public/cover/ minio/media/cover/
```

### 7. Протестируйте

```bash
# Запустите dev server
npm run dev

# Откройте в браузере
open http://localhost:5174

# Проверьте в DevTools → Network
# - Видео должны быть <10MB
# - Изображения должны быть .webp и <200KB
```

---

## 📊 Детальная оптимизация

### Видео оптимизация

#### Параметры сжатия:

| Размер исходного | CRF | Макс. ширина | Ожидаемое сжатие |
|-----------------|-----|--------------|------------------|
| > 100 MB | 30 | 1920px | ~95% |
| 20-100 MB | 28 | 1920px | ~90% |
| < 20 MB | 26 | 1920px | ~70% |

#### Ручная оптимизация видео:

```bash
# Максимальное сжатие (для >100MB)
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -crf 30 \
  -preset slow \
  -movflags +faststart \
  -vf "scale='min(1920,iw)':-2" \
  -c:a aac -b:a 128k \
  output.mp4

# Среднее сжатие (для 20-100MB)
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -crf 28 \
  -preset slow \
  -movflags +faststart \
  -vf "scale='min(1920,iw)':-2" \
  -c:a aac -b:a 128k \
  output.mp4

# Легкое сжатие (для <20MB)
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -crf 26 \
  -preset slow \
  -movflags +faststart \
  -vf "scale='min(1920,iw)':-2" \
  -c:a aac -b:a 128k \
  output.mp4
```

**Параметры:**
- `-crf` (18-30): Качество. Меньше = лучше качество, больше размер
- `-preset slow`: Лучшее сжатие (медленнее кодирование)
- `-movflags +faststart`: Быстрый старт воспроизведения
- `-vf "scale='min(1920,iw)':-2"`: Макс. ширина 1920px
- `-c:a aac -b:a 128k`: Аудио AAC 128kbps

### Изображения оптимизация

#### PNG/JPG → WebP:

```bash
# Высокое качество (для hero images)
ffmpeg -i input.png -c:v libwebp -quality 90 output.webp

# Среднее качество (для обычных изображений)
ffmpeg -i input.png -c:v libwebp -quality 85 output.webp

# Сжатие (для thumbnails)
ffmpeg -i input.png -c:v libwebp -quality 75 output.webp
```

#### Batch конвертация:

```bash
# Все PNG в папке
for img in *.png; do
  ffmpeg -i "$img" -c:v libwebp -quality 85 "${img%.png}.webp"
done

# Все JPG в папке
for img in *.jpg; do
  ffmpeg -i "$img" -c:v libwebp -quality 85 "${img%.jpg}.webp"
done
```

### Создание Poster Images

```bash
# Один poster из видео
ffmpeg -i video.mp4 -vframes 1 -vcodec libwebp -quality 85 poster.webp

# Все видео в папке
for video in *.mp4; do
  name="${video%.mp4}"
  ffmpeg -i "$video" -vframes 1 -vcodec libwebp -quality 85 "${name}-poster.webp"
done
```

---

## 🎯 Целевые размеры

### Видео:

| Тип | Длительность | Макс. размер |
|-----|--------------|--------------|
| Hero video | 10-20 сек | 3-5 MB |
| Background video | 5-10 сек | 2-3 MB |
| Cover video | 2-5 сек | 1-2 MB |

### Изображения:

| Тип | Размер | Макс. файл |
|-----|--------|------------|
| Hero image | 1920x1080 | 200 KB |
| Cover image | 1200x800 | 150 KB |
| Thumbnail | 600x400 | 50 KB |
| Icon | 256x256 | 20 KB |

---

## 🔍 Проверка качества

### Визуальная проверка:

```bash
# Откройте оригинал и оптимизированную версию
open public/backup/videos/arc-video2.mp4
open public/optimized/videos/arc-video2.mp4
```

Проверьте:
- ✅ Нет артефактов сжатия
- ✅ Детали видны
- ✅ Цвета правильные
- ✅ Плавное воспроизведение

### Технические метрики:

```bash
# Информация о видео
ffprobe -v error -show_format -show_streams video.mp4

# Битрейт видео
ffprobe -v error -select_streams v:0 -show_entries stream=bit_rate -of default=noprint_wrappers=1:nokey=1 video.mp4
```

---

## 📈 Ожидаемые улучшения

### Performance Metrics:

| Метрика | До | После | Улучшение |
|---------|-------|--------|-----------|
| Начальная загрузка | ~300 MB | **~30 MB** | -90% 🔥 |
| LCP (Largest Contentful Paint) | 8 сек | **2 сек** | -75% ⚡ |
| Time to Interactive | 12 сек | **3 сек** | -75% ⚡ |
| Mobile 3G load | 45 сек | **8 сек** | -82% 📱 |
| Lighthouse Score | 60 | **90+** | +50% 🎯 |

### User Experience:

- ✅ Мгновенная загрузка изображений (WebP)
- ✅ Быстрый старт видео (faststart)
- ✅ Poster images показываются моментально
- ✅ Меньше мобильного трафика
- ✅ Лучше работа на медленном интернете

---

## 🛠️ Troubleshooting

### FFmpeg не установлен

```bash
# macOS
brew install ffmpeg

# Linux (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install ffmpeg

# Linux (CentOS/RHEL)
sudo yum install ffmpeg
```

### Качество слишком низкое

Уменьшите CRF (лучше качество, больше размер):

```bash
# Вместо CRF 30
ffmpeg -i input.mp4 -crf 30 output.mp4

# Используйте CRF 24
ffmpeg -i input.mp4 -crf 24 output.mp4
```

### Файл слишком большой

Увеличьте CRF (хуже качество, меньше размер):

```bash
# Для очень агрессивного сжатия
ffmpeg -i input.mp4 -crf 32 output.mp4
```

### WebP не поддерживается

Добавьте fallback в код:

```jsx
<picture>
  <source srcSet={webpUrl} type="image/webp" />
  <source srcSet={jpgUrl} type="image/jpeg" />
  <img src={pngUrl} alt="" />
</picture>
```

---

## ✅ Checklist

- [ ] FFmpeg установлен
- [ ] Запущен `bash optimize-all-media.sh`
- [ ] Проверено качество файлов в `public/optimized/`
- [ ] Обновлен код для использования WebP
- [ ] Файлы скопированы из `public/optimized/` в `public/`
- [ ] Загружено на CDN (`npm run upload-media`)
- [ ] Протестировано в браузере
- [ ] Проверен DevTools Network
- [ ] Проверена загрузка на медленном соединении
- [ ] Lighthouse Score > 90

---

## 🎉 Готово!

После выполнения всех шагов ваш сайт будет загружаться **в 10 раз быстрее**! 🚀
