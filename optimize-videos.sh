#!/bin/bash

# Скрипт для оптимизации видео файлов проекта
# Уменьшает разрешение до максимум 1080p и оптимизирует для веба

echo "🎬 Video Optimization Script"
echo "================================"
echo ""

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Директория с видео
VIDEO_DIR="public/img/projects"
BACKUP_DIR="${VIDEO_DIR}/originals"

# Создаем директорию для оригиналов если её нет
mkdir -p "$BACKUP_DIR"

# Функция для оптимизации одного видео
optimize_video() {
    local input_file="$1"
    local filename=$(basename "$input_file")
    local backup_file="${BACKUP_DIR}/${filename}.backup"
    local temp_file="${VIDEO_DIR}/${filename}.tmp.webm"

    echo -e "${YELLOW}Processing: ${filename}${NC}"

    # Получаем текущее разрешение
    local width=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of default=noprint_wrappers=1:nokey=1 "$input_file")
    local height=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of default=noprint_wrappers=1:nokey=1 "$input_file")

    echo "  Current size: ${width}x${height}"

    # Определяем нужно ли сжимать
    local max_dimension=$((width > height ? width : height))

    if [ "$max_dimension" -gt 1080 ]; then
        echo -e "  ${RED}Size too large! Optimizing...${NC}"

        # Создаем backup если его еще нет
        if [ ! -f "$backup_file" ]; then
            echo "  Creating backup..."
            cp "$input_file" "$backup_file"
        fi

        # Рассчитываем новое разрешение (макс 1080p с сохранением aspect ratio)
        local scale_filter
        if [ "$width" -gt "$height" ]; then
            # Горизонтальное или квадратное видео
            scale_filter="scale=1080:-2"
        else
            # Вертикальное видео
            scale_filter="scale=-2:1080"
        fi

        echo "  Compressing with ${scale_filter}..."

        # Оптимизируем видео
        ffmpeg -i "$input_file" \
            -c:v libvpx-vp9 \
            -crf 35 \
            -b:v 0 \
            -vf "$scale_filter" \
            -row-mt 1 \
            -tile-columns 2 \
            -threads 4 \
            -deadline good \
            -cpu-used 1 \
            -an \
            -y \
            "$temp_file" 2>&1 | grep -E '(frame=|error|Error)' || true

        if [ -f "$temp_file" ]; then
            # Получаем новое разрешение и размер
            local new_width=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of default=noprint_wrappers=1:nokey=1 "$temp_file")
            local new_height=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of default=noprint_wrappers=1:nokey=1 "$temp_file")
            local old_size=$(du -h "$input_file" | cut -f1)
            local new_size=$(du -h "$temp_file" | cut -f1)

            # Заменяем оригинал
            mv "$temp_file" "$input_file"

            echo -e "  ${GREEN}✓ Done!${NC}"
            echo "    Old: ${width}x${height} (${old_size})"
            echo "    New: ${new_width}x${new_height} (${new_size})"
        else
            echo -e "  ${RED}✗ Failed to optimize${NC}"
        fi
    else
        echo -e "  ${GREEN}✓ Size OK, no optimization needed${NC}"
    fi

    echo ""
}

# Список видео для оптимизации (только проблемные)
VIDEOS_TO_OPTIMIZE=(
    "${VIDEO_DIR}/motion-5.webm"  # 2160x3840 -> нужно сжать!
    "${VIDEO_DIR}/motion-2.webm"  # 2160x1080 -> нужно сжать!
    "${VIDEO_DIR}/motion-4.webm"  # 1920x1080 -> немного сжать
)

# Или оптимизировать все видео:
# VIDEOS_TO_OPTIMIZE=("${VIDEO_DIR}"/*.webm)

echo "Videos to optimize:"
for video in "${VIDEOS_TO_OPTIMIZE[@]}"; do
    if [ -f "$video" ]; then
        echo "  - $(basename "$video")"
    fi
done
echo ""

read -p "Continue? (y/N) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    for video in "${VIDEOS_TO_OPTIMIZE[@]}"; do
        if [ -f "$video" ]; then
            optimize_video "$video"
        else
            echo -e "${RED}File not found: $video${NC}"
        fi
    done

    echo ""
    echo -e "${GREEN}================================${NC}"
    echo -e "${GREEN}✓ Optimization complete!${NC}"
    echo ""
    echo "Backups saved to: $BACKUP_DIR"
    echo ""
    echo "Next steps:"
    echo "1. Test videos at: http://localhost:5175/test-videos.html"
    echo "2. Check the website to see if videos load"
    echo "3. If satisfied, you can delete backups"
else
    echo "Cancelled."
fi
