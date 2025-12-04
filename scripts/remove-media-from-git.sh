#!/bin/bash
# Скрипт для удаления медиа из Git и Git LFS

echo "🗑️  Удаление медиа из Git репозитория..."
echo ""

# Шаг 1: Удалить файлы из Git (но оставить локально)
echo "1️⃣  Удаление медиа из Git индекса (файлы останутся локально)..."
git rm -r --cached public/img/ public/videos/ public/cover/ public/fonts/ 2>/dev/null || true

# Шаг 2: Вернуть важные иконки
echo "2️⃣  Возвращаем важные иконки и манифесты..."
git add -f public/img/favicon*.png public/img/favicon.ico public/img/favicon.svg 2>/dev/null || true
git add -f public/img/apple-touch-icon.png public/img/web-app-manifest-*.png 2>/dev/null || true
git add -f public/img/circle-fill.webp public/img/circle-fill.ico 2>/dev/null || true

# Шаг 3: Удалить Git LFS конфигурацию
echo "3️⃣  Удаление Git LFS конфигурации..."
if [ -f .gitattributes ]; then
  rm .gitattributes
  echo "   ✓ .gitattributes удален"
fi

# Шаг 4: Показать статус
echo ""
echo "✅ Готово! Проверьте статус:"
git status

echo ""
echo "📊 Размер репозитория:"
du -sh .git

echo ""
echo "⚠️  ВАЖНО: Следующие шаги:"
echo "1. Проверьте git status"
echo "2. Закоммитьте изменения:"
echo "   git add ."
echo "   git commit -m '🗑️ Remove media from git (now using MinIO)'"
echo "3. Отправьте в репозиторий:"
echo "   git push origin main"
echo ""
echo "💡 Если хотите очистить историю Git (опционально):"
echo "   git filter-repo --path public/img/ --invert-paths"
echo "   git filter-repo --path public/videos/ --invert-paths"
echo "   git filter-repo --path public/cover/ --invert-paths"
echo "   (Требует установки git-filter-repo: brew install git-filter-repo)"
