#!/bin/bash

# ОПТИМИЗАЦИЯ ИЗОБРАЖЕНИЙ
# Создаёт responsive версии изображений для разных размеров экранов

set -e

PROJECTS_DIR="public/img/projects"
OPTIMIZED_DIR="${PROJECTS_DIR}/optimized"

# Проверка наличия cwebp
if ! command -v cwebp &> /dev/null; then
    echo "❌ cwebp не найден. Установите: brew install webp"
    exit 1
fi

echo "🎨 Начинаем оптимизацию изображений..."

# Создаём директорию для оптимизированных изображений
mkdir -p "${OPTIMIZED_DIR}"

# Счётчик
count=0
total=$(find "${PROJECTS_DIR}" -maxdepth 1 -type f \( -name "*.webp" -o -name "*.jpg" -o -name "*.png" \) | wc -l | tr -d ' ')

echo "📁 Найдено ${total} изображений для оптимизации"

# Обрабатываем каждое изображение
for img in "${PROJECTS_DIR}"/*.{webp,jpg,png}; do
  # Проверяем существование файла
  [ -f "$img" ] || continue

  count=$((count + 1))
  filename=$(basename "$img")
  name="${filename%.*}"

  echo "⚙️  [${count}/${total}] Обрабатываем: ${filename}"

  # Создаём 3 версии: мобильная (400px), планшет (800px), десктоп (1200px)

  # Мобильная версия - 400px ширина, качество 70
  cwebp -q 70 -resize 400 0 "$img" -o "${OPTIMIZED_DIR}/${name}-400.webp" 2>/dev/null || echo "  ⚠️  Ошибка при создании 400px"

  # Планшет - 800px ширина, качество 75
  cwebp -q 75 -resize 800 0 "$img" -o "${OPTIMIZED_DIR}/${name}-800.webp" 2>/dev/null || echo "  ⚠️  Ошибка при создании 800px"

  # Десктоп - 1200px ширина, качество 80
  cwebp -q 80 -resize 1200 0 "$img" -o "${OPTIMIZED_DIR}/${name}-1200.webp" 2>/dev/null || echo "  ⚠️  Ошибка при создании 1200px"

  echo "  ✅ Создано 3 версии для ${filename}"
done

echo ""
echo "✨ Готово! Создано $(ls -1 ${OPTIMIZED_DIR} | wc -l | tr -d ' ') оптимизированных изображений"
echo "📊 Размер оригинальных файлов: $(du -sh ${PROJECTS_DIR}/*.{webp,jpg,png} 2>/dev/null | awk '{total+=$1} END {print total}') KB"
echo "📊 Размер оптимизированных: $(du -sh ${OPTIMIZED_DIR} | awk '{print $1}')"
echo ""
echo "💡 Использование в коде:"
echo '<img'
echo '  srcSet="/img/projects/optimized/case1-400.webp 400w,'
echo '         /img/projects/optimized/case1-800.webp 800w,'
echo '         /img/projects/optimized/case1-1200.webp 1200w"'
echo '  sizes="(max-width: 768px) 400px, (max-width: 1200px) 800px, 1200px"'
echo '  loading="lazy"'
echo '/>'
