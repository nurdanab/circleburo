#!/bin/bash

# ========================================
# Полный цикл: Скачать → Оптимизировать → Загрузить
# ========================================

set -e

echo "🚀 Полная оптимизация медиа с CDN"
echo "=================================================="
echo ""

# Цвета
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# CDN URL
CDN_BASE="https://media.circleburo.kz/media"

# Создаем папки
mkdir -p public/videos
mkdir -p public/cover
mkdir -p public/img
mkdir -p public/optimized/{videos,cover,img}
mkdir -p public/backup/{videos,cover,img}

# ========================================
# ШАГ 1: СКАЧИВАНИЕ ВИДЕО С CDN
# ========================================
echo "========================================="
echo "1️⃣  СКАЧИВАНИЕ ВИДЕО С CDN"
echo "========================================="
echo ""

videos=(
    "motion-circle.mp4"
    "prod1.mp4"
    "arc-video1.mp4"
    "arc-video2.mp4"
    "arc-video3.mp4"
)

cover_videos=(
    "cover1.mp4"
    "cover2.mp4"
    "cover3.mp4"
    "cover5.mp4"
    "cover6.mp4"
    "cover7.mp4"
)

echo -e "${YELLOW}📥 Скачиваем видео из /videos/${NC}"
for video in "${videos[@]}"; do
    echo "  Скачиваю: $video"
    curl -s -o "public/videos/$video" "$CDN_BASE/videos/$video" || echo "  ⚠️  Не найден: $video"
done
echo ""

echo -e "${YELLOW}📥 Скачиваем видео из /cover/${NC}"
for video in "${cover_videos[@]}"; do
    echo "  Скачиваю: $video"
    curl -s -o "public/cover/$video" "$CDN_BASE/cover/$video" || echo "  ⚠️  Не найден: $video"
done
echo ""

echo -e "${GREEN}✅ Скачивание завершено${NC}"
echo ""

# Показываем размеры
echo "📊 Скачанные файлы:"
du -sh public/videos/ public/cover/ 2>/dev/null
echo ""

# ========================================
# ШАГ 2: ОПТИМИЗАЦИЯ
# ========================================
echo "========================================="
echo "2️⃣  ОПТИМИЗАЦИЯ ВИДЕО"
echo "========================================="
echo ""

# Проверяем FFmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}❌ FFmpeg не установлен!${NC}"
    echo "Установите: brew install ffmpeg"
    exit 1
fi

optimize_video() {
    local input=$1
    local output=$2
    local crf=${3:-28}

    if [ ! -f "$input" ]; then
        echo "  ⚠️  Файл не найден: $input"
        return
    fi

    echo -e "${YELLOW}🎥 Сжатие: $(basename $input)${NC}"

    # Создаем резервную копию
    backup_path="${input/public\//public\/backup\/}"
    mkdir -p "$(dirname "$backup_path")"
    cp "$input" "$backup_path"

    # Получаем размер
    size_mb=$(du -m "$input" | cut -f1)

    # Определяем уровень сжатия
    if [ $size_mb -gt 100 ]; then
        crf=30
        echo "   📦 Размер: ${size_mb}MB - агрессивное сжатие (CRF=$crf)"
    elif [ $size_mb -gt 20 ]; then
        crf=28
        echo "   📦 Размер: ${size_mb}MB - среднее сжатие (CRF=$crf)"
    else
        crf=26
        echo "   📦 Размер: ${size_mb}MB - легкое сжатие (CRF=$crf)"
    fi

    ffmpeg -i "$input" \
        -c:v libx264 \
        -crf $crf \
        -preset slow \
        -movflags +faststart \
        -vf "scale='min(1920,iw)':-2" \
        -c:a aac \
        -b:a 128k \
        -y \
        "$output" 2>&1 | grep -E "time=" | tail -1 || true

    original_size=$(du -h "$input" | cut -f1)
    optimized_size=$(du -h "$output" | cut -f1)
    echo -e "   ${GREEN}✅ $original_size → $optimized_size${NC}"
    echo ""
}

# Оптимизируем видео из videos/
for video in public/videos/*.mp4; do
    [ -f "$video" ] || continue
    filename=$(basename "$video")
    optimize_video "$video" "public/optimized/videos/$filename"
done

# Оптимизируем видео из cover/
for video in public/cover/*.mp4; do
    [ -f "$video" ] || continue
    filename=$(basename "$video")
    optimize_video "$video" "public/optimized/cover/$filename"
done

# ========================================
# ШАГ 3: СОЗДАНИЕ POSTER IMAGES
# ========================================
echo "========================================="
echo "3️⃣  СОЗДАНИЕ POSTER IMAGES"
echo "========================================="
echo ""

for video in public/optimized/videos/*.mp4; do
    [ -f "$video" ] || continue

    filename=$(basename "$video" .mp4)
    poster="public/optimized/cover/${filename}-poster.webp"

    echo -e "${YELLOW}📸 Создаем poster: ${filename}${NC}"

    ffmpeg -i "$video" \
        -vframes 1 \
        -f image2 \
        -vcodec libwebp \
        -quality 85 \
        -y \
        "$poster" 2>&1 | grep -E "Output" | head -1 || true

    poster_size=$(du -h "$poster" 2>/dev/null | cut -f1 || echo "N/A")
    echo -e "   ${GREEN}✅ $poster_size${NC}"
done
echo ""

# ========================================
# ШАГ 4: СТАТИСТИКА
# ========================================
echo "========================================="
echo "📊 РЕЗУЛЬТАТЫ ОПТИМИЗАЦИИ"
echo "========================================="
echo ""

original_size=$(du -sh public/backup/ 2>/dev/null | cut -f1 || echo "0")
optimized_size=$(du -sh public/optimized/ 2>/dev/null | cut -f1 || echo "0")

echo -e "${RED}❌ Оригиналы: $original_size${NC}"
echo -e "${GREEN}✅ Оптимизированные: $optimized_size${NC}"
echo ""

echo "📹 Оптимизированные видео:"
ls -lh public/optimized/videos/*.mp4 2>/dev/null | awk '{print "  ✅", $9, "-", $5}' || echo "  Нет файлов"
echo ""

echo "📸 Poster images:"
ls -lh public/optimized/cover/*-poster.webp 2>/dev/null | awk '{print "  ✅", $9, "-", $5}' || echo "  Нет файлов"
echo ""

# ========================================
# ШАГ 5: ПРОВЕРКА КАЧЕСТВА
# ========================================
echo "========================================="
echo "🎯 СЛЕДУЮЩИЕ ШАГИ"
echo "========================================="
echo ""

echo "1️⃣  Проверьте качество видео:"
echo "   open public/optimized/videos/"
echo ""
echo "   Сравните с оригиналами:"
echo "   open public/backup/videos/"
echo ""

echo "2️⃣  Если качество OK - замените файлы:"
echo "   rm -rf public/videos/*.mp4 public/cover/*.mp4"
echo "   cp -r public/optimized/videos/* public/videos/"
echo "   cp -r public/optimized/cover/* public/cover/"
echo ""

echo "3️⃣  Загрузите на MinIO CDN:"
echo "   npm run upload-media"
echo ""
echo "   Или вручную через mc:"
echo "   mc cp --recursive public/videos/ minio/media/videos/"
echo "   mc cp --recursive public/cover/ minio/media/cover/"
echo ""

echo "4️⃣  Обновите код для poster images:"
echo "   Откройте VIDEO_OPTIMIZATION.md для инструкций"
echo ""

echo "5️⃣  Протестируйте сайт:"
echo "   npm run dev"
echo "   open http://localhost:5174"
echo ""

echo -e "${GREEN}✅ ГОТОВО!${NC}"
echo ""
