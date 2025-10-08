#!/bin/bash

# ГЕНЕРАЦИЯ POSTER ИЗОБРАЖЕНИЙ ИЗ ВИДЕО
# Создаёт превью-картинки из первого кадра каждого видео

set -e

PROJECTS_DIR="public/img/projects"
POSTERS_DIR="${PROJECTS_DIR}/posters"

# Проверка наличия ffmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg не найден. Установите: brew install ffmpeg"
    exit 1
fi

echo "🎬 Генерация poster изображений из видео..."

# Создаём директорию для posters
mkdir -p "${POSTERS_DIR}"

# Счётчик
count=0
total=$(find "${PROJECTS_DIR}" -maxdepth 1 -type f -name "*.webm" | wc -l | tr -d ' ')

echo "📁 Найдено ${total} видео"

# Обрабатываем каждое видео
for video in "${PROJECTS_DIR}"/*.webm; do
  # Проверяем существование файла
  [ -f "$video" ] || continue

  count=$((count + 1))
  filename=$(basename "$video")
  name="${filename%.*}"

  echo ""
  echo "📸 [${count}/${total}] Создаём poster для: ${filename}"

  # Извлекаем кадр на 0.5 секунде (более интересный кадр, чем первый)
  # -ss 0.5 - позиция в секундах
  # -vframes 1 - один кадр
  # -vf scale=-2:720 - масштабируем до 720px высоты
  # -q:v 2 - качество JPEG (2-5, где 2 самое лучшее)

  ffmpeg -i "$video" \
    -ss 0.5 \
    -vframes 1 \
    -vf "scale=-2:720" \
    -q:v 2 \
    "${POSTERS_DIR}/${name}-poster.jpg" \
    -y \
    -loglevel error

  # Конвертируем в WebP для лучшего сжатия
  if command -v cwebp &> /dev/null; then
    cwebp -q 80 "${POSTERS_DIR}/${name}-poster.jpg" -o "${POSTERS_DIR}/${name}-poster.webp" 2>/dev/null
    
    jpg_size=$(du -h "${POSTERS_DIR}/${name}-poster.jpg" | awk '{print $1}')
    webp_size=$(du -h "${POSTERS_DIR}/${name}-poster.webp" | awk '{print $1}')
    
    echo "  ✅ JPG: ${jpg_size}, WebP: ${webp_size}"
  else
    echo "  ✅ Создан JPG poster (установите webp для оптимизации: brew install webp)"
  fi
done

echo ""
echo "✨ Готово! Создано poster'ов: ${count}"
echo "📂 Расположение: ${POSTERS_DIR}/"
echo ""
echo "📊 Статистика:"
if command -v du &> /dev/null; then
  total_size=$(du -sh "${POSTERS_DIR}" | awk '{print $1}')
  echo "   Общий размер: ${total_size}"
fi
echo ""
echo "💡 Файлы готовы к использованию в коде:"
echo "   <img src=\"/img/projects/posters/motion-1-poster.webp\" />"
