#!/bin/bash

# ========================================
# Комплексная оптимизация всех медиа
# Изображения: PNG/JPG → WebP
# Видео: MP4 → Сжатый MP4
# ========================================

set -e

echo "🎨 Комплексная оптимизация медиа для Circle Buro"
echo "=================================================="
echo ""

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Проверка FFmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}❌ FFmpeg не установлен!${NC}"
    echo "Установите: brew install ffmpeg"
    exit 1
fi

echo -e "${GREEN}✅ FFmpeg установлен${NC}"
echo ""

# Создаем папки для оптимизированных файлов
mkdir -p public/optimized/{videos,img,cover}
mkdir -p public/backup/{videos,img,cover}

# ========================================
# ФУНКЦИЯ: Сжатие изображений PNG/JPG → WebP
# ========================================
optimize_image() {
    local input=$1
    local output=$2
    local quality=${3:-85}

    echo -e "${YELLOW}🖼️  Оптимизация: $(basename $input)${NC}"

    # Используем FFmpeg для конвертации в WebP
    ffmpeg -i "$input" \
        -c:v libwebp \
        -quality $quality \
        -y \
        "$output" 2>&1 | grep -E "Output|Stream" | head -2 || true

    original_size=$(du -h "$input" | cut -f1)
    optimized_size=$(du -h "$output" | cut -f1)
    echo -e "   ${GREEN}✅ $original_size → $optimized_size${NC}"
}

# ========================================
# ФУНКЦИЯ: Сжатие видео
# ========================================
optimize_video() {
    local input=$1
    local output=$2
    local crf=${3:-28}
    local max_width=${4:-1920}

    echo -e "${YELLOW}🎥 Сжатие видео: $(basename $input)${NC}"
    echo "   CRF=$crf, Max Width=${max_width}px"

    ffmpeg -i "$input" \
        -c:v libx264 \
        -crf $crf \
        -preset slow \
        -movflags +faststart \
        -vf "scale='min($max_width,iw)':-2" \
        -c:a aac \
        -b:a 128k \
        -y \
        "$output" 2>&1 | grep -E "Duration|time=|bitrate" | tail -3 || true

    original_size=$(du -h "$input" | cut -f1)
    optimized_size=$(du -h "$output" | cut -f1)
    echo -e "   ${GREEN}✅ $original_size → $optimized_size${NC}"
    echo ""
}

# ========================================
# 1. ОПТИМИЗАЦИЯ ИЗОБРАЖЕНИЙ
# ========================================
echo "========================================="
echo "1️⃣  ОПТИМИЗАЦИЯ ИЗОБРАЖЕНИЙ"
echo "========================================="
echo ""

total_images=0
optimized_images=0

# Оптимизируем PNG файлы в img/
if ls public/img/*.png &> /dev/null; then
    for img in public/img/*.png; do
        [ -f "$img" ] || continue

        filename=$(basename "$img" .png)

        # Пропускаем иконки и манифесты
        if [[ "$filename" == *"favicon"* ]] || [[ "$filename" == *"manifest"* ]] || [[ "$filename" == *"apple-touch"* ]]; then
            echo "⏭️  Пропускаем: $filename (системный файл)"
            continue
        fi

        total_images=$((total_images + 1))

        # Создаем резервную копию
        cp "$img" "public/backup/img/${filename}.png"

        # Конвертируем в WebP
        optimize_image "$img" "public/optimized/img/${filename}.webp" 85
        optimized_images=$((optimized_images + 1))
    done
fi

# Оптимизируем JPG/JPEG файлы
for ext in jpg jpeg; do
    if ls public/img/*.$ext &> /dev/null; then
        for img in public/img/*.$ext; do
            [ -f "$img" ] || continue

            filename=$(basename "$img" .$ext)
            total_images=$((total_images + 1))

            cp "$img" "public/backup/img/${filename}.$ext"
            optimize_image "$img" "public/optimized/img/${filename}.webp" 85
            optimized_images=$((optimized_images + 1))
        done
    fi
done

# Оптимизируем изображения в cover/
for ext in png jpg jpeg; do
    if ls public/cover/*.$ext &> /dev/null; then
        for img in public/cover/*.$ext; do
            [ -f "$img" ] || continue

            filename=$(basename "$img" .$ext)
            total_images=$((total_images + 1))

            cp "$img" "public/backup/cover/${filename}.$ext"
            optimize_image "$img" "public/optimized/cover/${filename}.webp" 90
            optimized_images=$((optimized_images + 1))
        done
    fi
done

echo ""
echo -e "${GREEN}✅ Оптимизировано изображений: $optimized_images/$total_images${NC}"
echo ""

# ========================================
# 2. ОПТИМИЗАЦИЯ ВИДЕО
# ========================================
echo "========================================="
echo "2️⃣  ОПТИМИЗАЦИЯ ВИДЕО"
echo "========================================="
echo ""

total_videos=0
optimized_videos=0

# Оптимизируем видео в videos/
if ls public/videos/*.mp4 &> /dev/null; then
    for video in public/videos/*.mp4; do
        [ -f "$video" ] || continue

        filename=$(basename "$video" .mp4)
        total_videos=$((total_videos + 1))

        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

        # Создаем резервную копию
        cp "$video" "public/backup/videos/${filename}.mp4"

        # Определяем уровень сжатия в зависимости от размера
        size_mb=$(du -m "$video" | cut -f1)

        if [ $size_mb -gt 100 ]; then
            # Очень большие файлы (>100MB) - агрессивное сжатие
            echo -e "${RED}⚠️  Большой файл: ${size_mb}MB - агрессивное сжатие${NC}"
            optimize_video "$video" "public/optimized/videos/${filename}.mp4" 30 1920
        elif [ $size_mb -gt 20 ]; then
            # Средние файлы (>20MB) - среднее сжатие
            echo -e "${YELLOW}⚠️  Средний файл: ${size_mb}MB - среднее сжатие${NC}"
            optimize_video "$video" "public/optimized/videos/${filename}.mp4" 28 1920
        else
            # Маленькие файлы (<20MB) - легкое сжатие
            echo "✅ Небольшой файл: ${size_mb}MB - легкое сжатие"
            optimize_video "$video" "public/optimized/videos/${filename}.mp4" 26 1920
        fi

        optimized_videos=$((optimized_videos + 1))
    done
fi

# Оптимизируем видео в cover/
if ls public/cover/*.mp4 &> /dev/null; then
    for video in public/cover/*.mp4; do
        [ -f "$video" ] || continue

        filename=$(basename "$video" .mp4)
        total_videos=$((total_videos + 1))

        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

        cp "$video" "public/backup/cover/${filename}.mp4"

        # Cover видео обычно короткие, средняя оптимизация
        optimize_video "$video" "public/optimized/cover/${filename}.mp4" 28 1920
        optimized_videos=$((optimized_videos + 1))
    done
fi

echo ""
echo -e "${GREEN}✅ Оптимизировано видео: $optimized_videos/$total_videos${NC}"
echo ""

# ========================================
# 3. СОЗДАНИЕ POSTER IMAGES
# ========================================
echo "========================================="
echo "3️⃣  СОЗДАНИЕ POSTER IMAGES"
echo "========================================="
echo ""

total_posters=0

# Создаем poster для оптимизированных видео
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

    poster_size=$(du -h "$poster" | cut -f1)
    echo -e "   ${GREEN}✅ Создан poster: $poster_size${NC}"
    total_posters=$((total_posters + 1))
done

echo ""
echo -e "${GREEN}✅ Создано poster изображений: $total_posters${NC}"
echo ""

# ========================================
# 4. ФИНАЛЬНЫЙ ОТЧЕТ
# ========================================
echo "========================================="
echo "📊 ФИНАЛЬНЫЙ ОТЧЕТ"
echo "========================================="
echo ""

echo "Оригинальные файлы сохранены в: public/backup/"
echo "Оптимизированные файлы в: public/optimized/"
echo ""

# Подсчет экономии места
original_size=$(du -sh public/backup/ 2>/dev/null | cut -f1 || echo "0")
optimized_size=$(du -sh public/optimized/ 2>/dev/null | cut -f1 || echo "0")

echo -e "${RED}❌ Оригиналы: $original_size${NC}"
echo -e "${GREEN}✅ Оптимизированные: $optimized_size${NC}"
echo ""

echo "========================================="
echo "🚀 СЛЕДУЮЩИЕ ШАГИ"
echo "========================================="
echo ""
echo "1. ✅ Проверьте качество файлов в public/optimized/"
echo ""
echo "2. 📝 Обновите код для использования WebP:"
echo "   - Замените .png на .webp в getMediaUrl()"
echo "   - Или используйте <picture> с fallback"
echo ""
echo "3. 🔄 Замените файлы (если качество OK):"
echo "   rm -rf public/videos/*.mp4 public/img/*.png public/img/*.jpg"
echo "   cp -r public/optimized/videos/* public/videos/"
echo "   cp -r public/optimized/img/* public/img/"
echo "   cp -r public/optimized/cover/* public/cover/"
echo ""
echo "4. ☁️  Загрузите на CDN:"
echo "   npm run upload-media"
echo ""
echo "5. 🧪 Протестируйте сайт"
echo ""

echo -e "${GREEN}✅ ГОТОВО!${NC}"
echo ""
