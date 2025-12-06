# 🎥 Оптимизация видео для Circle Buro

## 📊 Текущие размеры видео:

| Видео | Размер | Статус |
|-------|--------|--------|
| motion-circle.mp4 | 15 MB | ❌ Критично большой |
| prod1.mp4 | 1 MB | ✅ OK |
| cover1-7.mp4 | ~5 MB каждый | ⚠️ Средний |

---

## ✅ Что уже сделано:

1. **Lazy Loading** ✅
   - Видео загружаются только когда становятся видимыми
   - Используется Intersection Observer API
   - `preload="none"` для отложенной загрузки

2. **Memory Optimization** ✅
   - Видео автоматически паузятся когда выходят из viewport
   - Очистка буфера для длинных видео

3. **Preload Strategy** ✅
   - `preload="metadata"` для cover видео (быстрый старт)
   - `preload="none"` для больших видео (экономия трафика)

4. **Poster Images** ✅
   - Добавлены атрибуты poster для превью

---

## 🚨 ВАЖНО: Создайте Poster Images!

Poster images - это превью-изображения, которые показываются до загрузки видео.

### Как создать poster images:

#### Вариант 1: Используя FFmpeg (рекомендуется)

```bash
# Установите FFmpeg
brew install ffmpeg  # macOS
# или
sudo apt-get install ffmpeg  # Linux

# Создайте WebP poster из первого кадра видео
ffmpeg -i public/videos/motion-circle.mp4 -vframes 1 -f image2 -vcodec libwebp -q:v 80 public/cover/motion-circle-poster.webp

# Для всех видео сразу:
for video in public/videos/*.mp4; do
  name=$(basename "$video" .mp4)
  ffmpeg -i "$video" -vframes 1 -f image2 -vcodec libwebp -q:v 80 "public/cover/${name}-poster.webp"
done
```

#### Вариант 2: Вручную

1. Откройте видео в любом плеере
2. Сделайте скриншот первого кадра
3. Сожмите изображение до WebP формата на https://squoosh.app/
4. Сохраните как `{video-name}-poster.webp` в `public/cover/`

---

## 🎯 Рекомендации по оптимизации видео:

### 1. Сжатие motion-circle.mp4 (15 MB → ~3-5 MB)

```bash
ffmpeg -i public/videos/motion-circle.mp4 \
  -c:v libx264 \
  -crf 28 \
  -preset slow \
  -movflags +faststart \
  -vf "scale=1920:-2" \
  -c:a aac \
  -b:a 128k \
  public/videos/motion-circle-optimized.mp4
```

**Параметры:**
- `-crf 28` - качество (18-28, меньше = лучше качество)
- `-preset slow` - лучшее сжатие
- `-movflags +faststart` - быстрый старт воспроизведения
- `scale=1920:-2` - макс. ширина 1920px

### 2. Создание адаптивных версий

```bash
# Desktop version (Full HD)
ffmpeg -i input.mp4 -c:v libx264 -crf 26 -vf "scale=1920:-2" output-desktop.mp4

# Mobile version (HD)
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -vf "scale=1280:-2" output-mobile.mp4
```

### 3. WebM формат (лучшее сжатие для web)

```bash
ffmpeg -i input.mp4 \
  -c:v libvpx-vp9 \
  -crf 30 \
  -b:v 0 \
  -vf "scale=1920:-2" \
  output.webm
```

---

## 📦 Загрузка на MinIO CDN:

После оптимизации, загрузите файлы на CDN:

```bash
# Загрузить poster images
npm run upload-media

# Или вручную через mc (MinIO Client)
mc cp public/cover/*.webp minio/media/cover/
```

---

## 🔍 Проверка результатов:

```bash
# Проверить размер видео
ls -lh public/videos/*.mp4

# Проверить на CDN
curl -I https://media.circleburo.kz/media/videos/motion-circle.mp4 | grep content-length
```

---

## 💡 Дополнительные оптимизации:

### 1. Service Worker для кэширования

Видео автоматически кэшируются CloudFlare CDN на 1 год.

### 2. Adaptive Bitrate Streaming (будущее)

Для очень больших видео можно использовать HLS или DASH:

```bash
# Создать HLS playlist
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -hls_time 10 \
  -hls_list_size 0 \
  -f hls \
  output.m3u8
```

### 3. Замена видео на анимированные WebP/GIF (для коротких роликов)

Для коротких cover videos (<3 сек):

```bash
ffmpeg -i cover1.mp4 -vcodec libwebp -loop 0 -quality 80 cover1.webp
```

---

## 📈 Ожидаемые улучшения:

| Метрика | До | После |
|---------|-------|--------|
| Начальная загрузка страницы | ~20 MB | **~2 MB** ✅ |
| Time to Interactive | ~8 сек | **~2 сек** ✅ |
| Poster load time | N/A | **< 100ms** ✅ |
| Mobile data usage | ~25 MB | **~3-5 MB** ✅ |

---

## ✅ Checklist:

- [x] Добавлен lazy loading для всех видео
- [x] Настроен preload strategy
- [x] Добавлены poster атрибуты
- [ ] **Создать poster images (WebP)**
- [ ] **Оптимизировать motion-circle.mp4**
- [ ] Загрузить poster images на CDN
- [ ] Протестировать на медленном соединении

---

## 🚀 Быстрый старт:

```bash
# 1. Создайте poster images
for video in public/videos/*.mp4; do
  name=$(basename "$video" .mp4)
  ffmpeg -i "$video" -vframes 1 -f image2 -vcodec libwebp -q:v 80 "public/cover/${name}-poster.webp"
done

# 2. Оптимизируйте motion-circle.mp4
ffmpeg -i public/videos/motion-circle.mp4 \
  -c:v libx264 -crf 28 -preset slow -movflags +faststart \
  -vf "scale=1920:-2" \
  public/videos/motion-circle-optimized.mp4

# 3. Замените старый файл
mv public/videos/motion-circle.mp4 public/videos/motion-circle-old.mp4
mv public/videos/motion-circle-optimized.mp4 public/videos/motion-circle.mp4

# 4. Загрузите на CDN
npm run upload-media
```

**Готово! 🎉**
