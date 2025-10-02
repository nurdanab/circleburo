#!/bin/bash

# Скрипт для оптимизации видео файлов WebM
# Требует установленный FFmpeg: brew install ffmpeg

set -e

echo "🎬 Оптимизация видео файлов..."

# Директория с видео
VIDEO_DIR="public/img/projects"
BACKUP_DIR="public/img/projects/originals"

# Создаем директорию для бэкапов если её нет
mkdir -p "$BACKUP_DIR"

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Проверка наличия ffmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}❌ FFmpeg не найден. Установите его: brew install ffmpeg${NC}"
    exit 1
fi

echo -e "${YELLOW}📂 Обработка директории: $VIDEO_DIR${NC}"

# Счетчик файлов
count=0
total_original_size=0
total_optimized_size=0

# Функция для конвертации размера в байты
to_bytes() {
    size=$1
    if [[ $size =~ M$ ]]; then
        echo $(echo "${size%M} * 1024 * 1024" | bc | cut -d. -f1)
    elif [[ $size =~ K$ ]]; then
        echo $(echo "${size%K} * 1024" | bc | cut -d. -f1)
    else
        echo "$size"
    fi
}

# Обрабатываем все .webm файлы
for video in "$VIDEO_DIR"/*.webm; do
    if [ -f "$video" ]; then
        filename=$(basename "$video")

        # Пропускаем уже оптимизированные файлы
        if [[ $filename == *"-optimized.webm" ]]; then
            continue
        fi

        # Получаем размер оригинала
        original_size=$(du -h "$video" | cut -f1)
        original_bytes=$(du -b "$video" | cut -f1)

        echo -e "\n${YELLOW}🔄 Обработка: $filename${NC}"
        echo "   Оригинальный размер: $original_size"

        # Создаем бэкап если его еще нет
        if [ ! -f "$BACKUP_DIR/$filename" ]; then
            cp "$video" "$BACKUP_DIR/$filename"
            echo "   ✅ Бэкап создан: $BACKUP_DIR/$filename"
        fi

        # Временный файл
        temp_file="${video%.webm}-temp.webm"

        # Оптимизация с FFmpeg
        # CRF 32-35 для сильного сжатия (хорошее качество)
        # -b:v 500k - максимальный битрейт 500kbps
        # -deadline good - баланс скорости/качества
        # -cpu-used 2 - скорость кодирования

        ffmpeg -i "$video" \
            -c:v libvpx-vp9 \
            -crf 33 \
            -b:v 500k \
            -maxrate 600k \
            -bufsize 1000k \
            -deadline good \
            -cpu-used 2 \
            -row-mt 1 \
            -threads 4 \
            -tile-columns 2 \
            -frame-parallel 1 \
            -auto-alt-ref 1 \
            -lag-in-frames 25 \
            -g 240 \
            -an \
            -pass 1 \
            -f webm \
            /dev/null \
            -y 2>/dev/null

        ffmpeg -i "$video" \
            -c:v libvpx-vp9 \
            -crf 33 \
            -b:v 500k \
            -maxrate 600k \
            -bufsize 1000k \
            -deadline good \
            -cpu-used 2 \
            -row-mt 1 \
            -threads 4 \
            -tile-columns 2 \
            -frame-parallel 1 \
            -auto-alt-ref 1 \
            -lag-in-frames 25 \
            -g 240 \
            -an \
            -pass 2 \
            "$temp_file" \
            -y 2>/dev/null

        # Удаляем временные файлы pass
        rm -f ffmpeg2pass-0.log

        # Получаем размер оптимизированного файла
        optimized_size=$(du -h "$temp_file" | cut -f1)
        optimized_bytes=$(du -b "$temp_file" | cut -f1)

        # Вычисляем экономию
        saved_bytes=$((original_bytes - optimized_bytes))
        saved_percent=$(echo "scale=1; ($saved_bytes * 100) / $original_bytes" | bc)

        echo "   Оптимизированный размер: $optimized_size"
        echo -e "   ${GREEN}💾 Экономия: $saved_percent% (~$(du -h <<< $saved_bytes | cut -f1))${NC}"

        # Заменяем оригинальный файл
        mv "$temp_file" "$video"

        # Обновляем счетчики
        count=$((count + 1))
        total_original_size=$((total_original_size + original_bytes))
        total_optimized_size=$((total_optimized_size + optimized_bytes))
    fi
done

# Итоговая статистика
if [ $count -gt 0 ]; then
    total_saved=$((total_original_size - total_optimized_size))
    total_saved_percent=$(echo "scale=1; ($total_saved * 100) / $total_original_size" | bc)

    echo -e "\n${GREEN}✅ Оптимизация завершена!${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📊 Статистика:"
    echo "   Обработано файлов: $count"
    echo "   Исходный размер: $(numfmt --to=iec-i --suffix=B $total_original_size)"
    echo "   Итоговый размер: $(numfmt --to=iec-i --suffix=B $total_optimized_size)"
    echo -e "   ${GREEN}💾 Общая экономия: $total_saved_percent% (~$(numfmt --to=iec-i --suffix=B $total_saved))${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "💡 Бэкапы сохранены в: $BACKUP_DIR"
else
    echo -e "${YELLOW}⚠️  Видео файлы не найдены или уже оптимизированы${NC}"
fi

echo ""
echo "🎯 Рекомендации:"
echo "   1. Проверьте качество оптимизированных видео"
echo "   2. Запустите npm run build для создания production сборки"
echo "   3. Проверьте размер бандлов после изменений"
