#!/bin/bash

# АГРЕССИВНОЕ сжатие видео для максимальной производительности
# Целевой размер: < 500KB для каждого видео

echo "🎬 AGGRESSIVE Video Compression"
echo "================================"
echo "Target: < 500KB per video"
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

VIDEO_DIR="public/img/projects"
BACKUP_DIR="${VIDEO_DIR}/backups-original"

# Создаем backup директорию
mkdir -p "$BACKUP_DIR"

compress_video() {
    local input_file="$1"
    local filename=$(basename "$input_file")
    local backup_file="${BACKUP_DIR}/${filename}"
    local temp_file="${VIDEO_DIR}/${filename}.tmp.webm"

    echo -e "${YELLOW}Processing: ${filename}${NC}"

    # Backup если еще нет
    if [ ! -f "$backup_file" ]; then
        echo "  Creating backup..."
        cp "$input_file" "$backup_file"
    fi

    # Получаем текущий размер
    local current_size=$(du -h "$input_file" | cut -f1)
    local current_bytes=$(stat -f%z "$input_file" 2>/dev/null || stat -c%s "$input_file")
    local target_bytes=$((500 * 1024)) # 500KB

    echo "  Current size: $current_size"

    if [ "$current_bytes" -gt "$target_bytes" ]; then
        echo -e "  ${RED}Size too large! Compressing to ~500KB...${NC}"

        # Получаем разрешение
        local width=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of default=noprint_wrappers=1:nokey=1 "$input_file")
        local height=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of default=noprint_wrappers=1:nokey=1 "$input_file")

        # Целевое разрешение: макс 720p для десктопа, 480p для вертикальных
        local scale_filter
        if [ "$width" -gt "$height" ]; then
            # Горизонтальное
            if [ "$width" -gt 720 ]; then
                scale_filter="scale=720:-2"
            else
                scale_filter="scale=$width:-2"
            fi
        else
            # Вертикальное
            if [ "$height" -gt 720 ]; then
                scale_filter="scale=-2:720"
            else
                scale_filter="scale=-2:$height"
            fi
        fi

        echo "  Scale: ${scale_filter}"
        echo "  Encoding with CRF 40 (high compression)..."

        # АГРЕССИВНОЕ сжатие
        ffmpeg -i "$input_file" \
            -c:v libvpx-vp9 \
            -crf 40 \
            -b:v 0 \
            -vf "$scale_filter" \
            -row-mt 1 \
            -tile-columns 2 \
            -threads 4 \
            -deadline good \
            -cpu-used 2 \
            -g 240 \
            -an \
            -y \
            "$temp_file" 2>&1 | grep -E '(frame=|error|Error)' || true

        if [ -f "$temp_file" ]; then
            local new_size=$(du -h "$temp_file" | cut -f1)
            local new_bytes=$(stat -f%z "$temp_file" 2>/dev/null || stat -c%s "$temp_file")
            local new_width=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of default=noprint_wrappers=1:nokey=1 "$temp_file")
            local new_height=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of default=noprint_wrappers=1:nokey=1 "$temp_file")

            # Проверяем размер
            if [ "$new_bytes" -gt "$target_bytes" ]; then
                echo -e "  ${YELLOW}⚠ Still > 500KB ($new_size), trying CRF 45...${NC}"

                # Еще более агрессивное сжатие
                ffmpeg -i "$input_file" \
                    -c:v libvpx-vp9 \
                    -crf 45 \
                    -b:v 0 \
                    -vf "$scale_filter" \
                    -row-mt 1 \
                    -deadline good \
                    -cpu-used 3 \
                    -g 240 \
                    -an \
                    -y \
                    "$temp_file" 2>&1 | grep -E '(frame=|error)' || true

                new_size=$(du -h "$temp_file" | cut -f1)
                new_width=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of default=noprint_wrappers=1:nokey=1 "$temp_file")
                new_height=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of default=noprint_wrappers=1:nokey=1 "$temp_file")
            fi

            mv "$temp_file" "$input_file"

            echo -e "  ${GREEN}✓ Done!${NC}"
            echo "    Old: ${width}x${height} ($current_size)"
            echo "    New: ${new_width}x${new_height} ($new_size)"
        else
            echo -e "  ${RED}✗ Failed${NC}"
        fi
    else
        echo -e "  ${GREEN}✓ Size OK${NC}"
    fi

    echo ""
}

# Список всех видео
VIDEOS=(
    "${VIDEO_DIR}/motion-1.webm"
    "${VIDEO_DIR}/motion-2.webm"
    "${VIDEO_DIR}/motion-3.webm"
    "${VIDEO_DIR}/motion-4.webm"
    "${VIDEO_DIR}/motion-5.webm"
    "${VIDEO_DIR}/prod1.webm"
    "${VIDEO_DIR}/prod2.webm"
    "${VIDEO_DIR}/prod3.webm"
    "${VIDEO_DIR}/prod4.webm"
    "${VIDEO_DIR}/prod5.webm"
)

echo "Videos to compress:"
for video in "${VIDEOS[@]}"; do
    if [ -f "$video" ]; then
        size=$(du -h "$video" | cut -f1)
        echo "  - $(basename "$video") ($size)"
    fi
done
echo ""

read -p "Continue? (y/N) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    for video in "${VIDEOS[@]}"; do
        if [ -f "$video" ]; then
            compress_video "$video"
        fi
    done

    echo ""
    echo -e "${GREEN}================================${NC}"
    echo -e "${GREEN}✓ Compression complete!${NC}"
    echo ""
    echo "Results:"
    for video in "${VIDEOS[@]}"; do
        if [ -f "$video" ]; then
            size=$(du -h "$video" | cut -f1)
            bytes=$(stat -f%z "$video" 2>/dev/null || stat -c%s "$video")
            if [ "$bytes" -lt 524288 ]; then  # < 512KB
                echo -e "  ${GREEN}✓$(basename "$video"): $size${NC}"
            else
                echo -e "  ${YELLOW}⚠ $(basename "$video"): $size${NC}"
            fi
        fi
    done
    echo ""
    echo "Backups: $BACKUP_DIR"
else
    echo "Cancelled."
fi
