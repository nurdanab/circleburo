#!/bin/bash

# ОПТИМИЗАЦИЯ ВИДЕО
# Сжимает видео файлы для лучшей производительности

set -e

PROJECTS_DIR="public/img/projects"
OPTIMIZED_DIR="${PROJECTS_DIR}/optimized"

# Проверка наличия ffmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg не найден. Установите: brew install ffmpeg"
    exit 1
fi

echo "🎥 Начинаем оптимизацию видео..."

# Создаём директорию для оптимизированных видео
mkdir -p "${OPTIMIZED_DIR}"

# Счётчик
count=0
total=$(find "${PROJECTS_DIR}" -maxdepth 1 -type f -name "*.webm" | wc -l | tr -d ' ')

echo "📁 Найдено ${total} видео для оптимизации"

# Обрабатываем каждое видео
for video in "${PROJECTS_DIR}"/*.webm; do
  # Проверяем существование файла
  [ -f "$video" ] || continue

  count=$((count + 1))
  filename=$(basename "$video")
  name="${filename%.*}"

  original_size=$(du -h "$video" | awk '{print $1}')
  echo ""
  echo "⚙️  [${count}/${total}] Обрабатываем: ${filename} (${original_size})"

  ffmpeg -i "$video" \
    -c:v libvpx-vp9 \
    -crf 35 \
    -b:v 0 \
    -vf "scale=-2:min(ih\,720)" \
    -cpu-used 2 \
    -row-mt 1 \
    -threads 0 \
    -tile-columns 2 \
    -tile-rows 1 \
    -frame-parallel 1 \
    -auto-alt-ref 1 \
    -lag-in-frames 25 \
    -an \
    "${OPTIMIZED_DIR}/${name}-opt.webm" \
    -y \
    -loglevel error

  optimized_size=$(du -h "${OPTIMIZED_DIR}/${name}-opt.webm" | awk '{print $1}')
  echo "  ✅ ${filename}: ${original_size} → ${optimized_size}"
done

echo ""
echo "✨ Готово! Оптимизировано ${count} видео"
