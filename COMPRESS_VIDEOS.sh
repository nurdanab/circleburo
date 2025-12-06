#!/bin/bash

# Скрипт для сжатия больших видео файлов
# Автор: Claude Code
# Использование: bash COMPRESS_VIDEOS.sh

set -e

echo "🎥 Начинаем сжатие видео файлов..."
echo ""

# Проверяем наличие FFmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ FFmpeg не установлен!"
    echo "Установите FFmpeg:"
    echo "  macOS: brew install ffmpeg"
    echo "  Linux: sudo apt-get install ffmpeg"
    exit 1
fi

# Создаем резервную копию
mkdir -p public/videos/backup
echo "📦 Создаем резервные копии..."

# Функция сжатия видео
compress_video() {
    local input=$1
    local output=$2
    local crf=${3:-28}  # Quality (18-28, lower = better quality)

    echo "🔄 Сжимаем: $(basename $input)"
    echo "   Параметры: CRF=$crf, Preset=slow, FastStart=yes"

    ffmpeg -i "$input" \
        -c:v libx264 \
        -crf $crf \
        -preset slow \
        -movflags +faststart \
        -vf "scale='min(1920,iw)':-2" \
        -c:a aac \
        -b:a 128k \
        -y \
        "$output" 2>&1 | grep -E "Duration|time=" || true

    # Показываем результат
    original_size=$(du -h "$input" | cut -f1)
    compressed_size=$(du -h "$output" | cut -f1)
    echo "   ✅ $original_size → $compressed_size"
    echo ""
}

# Сжимаем arc-video2.mp4 (183 MB → ~5-10 MB)
echo "========================================="
echo "1/3: arc-video2.mp4 (183 MB → ~5-10 MB)"
echo "========================================="
if [ -f "public/videos/arc-video2.mp4" ]; then
    cp public/videos/arc-video2.mp4 public/videos/backup/arc-video2-original.mp4
    compress_video \
        "public/videos/arc-video2.mp4" \
        "public/videos/arc-video2-compressed.mp4" \
        30  # Higher CRF = more compression
    mv public/videos/arc-video2-compressed.mp4 public/videos/arc-video2.mp4
else
    echo "⚠️  arc-video2.mp4 не найден"
fi

# Сжимаем arc-video1.mp4 (51 MB → ~3-5 MB)
echo "========================================="
echo "2/3: arc-video1.mp4 (51 MB → ~3-5 MB)"
echo "========================================="
if [ -f "public/videos/arc-video1.mp4" ]; then
    cp public/videos/arc-video1.mp4 public/videos/backup/arc-video1-original.mp4
    compress_video \
        "public/videos/arc-video1.mp4" \
        "public/videos/arc-video1-compressed.mp4" \
        28
    mv public/videos/arc-video1-compressed.mp4 public/videos/arc-video1.mp4
else
    echo "⚠️  arc-video1.mp4 не найден"
fi

# Сжимаем arc-video3.mp4 (40 MB → ~3-5 MB)
echo "========================================="
echo "3/3: arc-video3.mp4 (40 MB → ~3-5 MB)"
echo "========================================="
if [ -f "public/videos/arc-video3.mp4" ]; then
    cp public/videos/arc-video3.mp4 public/videos/backup/arc-video3-original.mp4
    compress_video \
        "public/videos/arc-video3.mp4" \
        "public/videos/arc-video3-compressed.mp4" \
        28
    mv public/videos/arc-video3-compressed.mp4 public/videos/arc-video3.mp4
else
    echo "⚠️  arc-video3.mp4 не найден"
fi

# Сжимаем motion-circle.mp4 (15 MB → ~2-3 MB)
echo "========================================="
echo "4/4: motion-circle.mp4 (15 MB → ~2-3 MB)"
echo "========================================="
if [ -f "public/videos/motion-circle.mp4" ]; then
    cp public/videos/motion-circle.mp4 public/videos/backup/motion-circle-original.mp4
    compress_video \
        "public/videos/motion-circle.mp4" \
        "public/videos/motion-circle-compressed.mp4" \
        28
    mv public/videos/motion-circle-compressed.mp4 public/videos/motion-circle.mp4
else
    echo "⚠️  motion-circle.mp4 не найден"
fi

echo ""
echo "========================================="
echo "✅ ГОТОВО!"
echo "========================================="
echo ""
echo "📊 Размеры ДО и ПОСЛЕ:"
echo ""
ls -lh public/videos/backup/*-original.mp4 2>/dev/null | awk '{print "  ❌ "$9": "$5" (оригинал)"}'
echo ""
ls -lh public/videos/*.mp4 2>/dev/null | grep -v backup | awk '{print "  ✅ "$9": "$5" (сжатый)"}'
echo ""
echo "🚀 Следующие шаги:"
echo "  1. Проверьте качество видео в браузере"
echo "  2. Загрузите на CDN: npm run upload-media"
echo "  3. Протестируйте загрузку сайта"
echo ""
echo "💾 Оригиналы сохранены в: public/videos/backup/"
echo ""
