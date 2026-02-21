#!/bin/bash

# Circle Buro - Media Management Script
# Скрипт для управления медиа файлами в MinIO

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# MinIO Configuration
MINIO_ALIAS="circleminio"
BUCKET_NAME="circleburo"

print_status() { echo -e "${GREEN}✓${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_info() { echo -e "${BLUE}ℹ${NC} $1"; }

show_menu() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}Circle Buro - Media Management${NC}"
    echo -e "${BLUE}========================================${NC}\n"
    echo "1. Показать текущие файлы в бакете"
    echo "2. Показать размер бакета"
    echo "3. Очистить ВСЕ файлы из бакета"
    echo "4. Загрузить новые медиа из ./public"
    echo "5. Полная переустановка (очистить + загрузить)"
    echo "6. Проверить настройки MinIO"
    echo "0. Выход"
    echo ""
}

check_mc() {
    if ! command -v mc &> /dev/null; then
        print_error "MinIO Client (mc) не установлен!"
        print_info "Установите: wget https://dl.min.io/client/mc/release/linux-amd64/mc && chmod +x mc && mv mc /usr/local/bin/"
        exit 1
    fi
}

check_minio_connection() {
    print_info "Проверка подключения к MinIO..."
    if mc ls $MINIO_ALIAS/$BUCKET_NAME &> /dev/null; then
        print_status "Подключение успешно"
        return 0
    else
        print_error "Не удалось подключиться к MinIO"
        print_info "Настройте alias: mc alias set $MINIO_ALIAS http://localhost:9000 ACCESS_KEY SECRET_KEY"
        return 1
    fi
}

list_files() {
    print_info "Файлы в бакете $BUCKET_NAME:"
    mc ls --recursive $MINIO_ALIAS/$BUCKET_NAME | head -50
    echo ""
    TOTAL=$(mc ls --recursive $MINIO_ALIAS/$BUCKET_NAME | wc -l)
    print_info "Всего файлов: $TOTAL"
}

show_size() {
    print_info "Размер бакета $BUCKET_NAME:"
    mc du $MINIO_ALIAS/$BUCKET_NAME
}

clear_bucket() {
    print_warning "Это удалит ВСЕ файлы из бакета $BUCKET_NAME!"
    read -p "Вы уверены? (yes/no): " confirm

    if [ "$confirm" = "yes" ]; then
        print_info "Удаление файлов..."
        mc rm --recursive --force $MINIO_ALIAS/$BUCKET_NAME/
        print_status "Бакет очищен"
    else
        print_info "Операция отменена"
    fi
}

upload_media() {
    MEDIA_DIR="./public"

    if [ ! -d "$MEDIA_DIR" ]; then
        print_error "Директория $MEDIA_DIR не найдена!"
        print_info "Убедитесь, что вы находитесь в корне проекта"
        return 1
    fi

    print_info "Загрузка медиа из $MEDIA_DIR в $BUCKET_NAME..."

    # Загружаем с сохранением структуры директорий
    mc cp --recursive $MEDIA_DIR/ $MINIO_ALIAS/$BUCKET_NAME/

    print_status "Загрузка завершена!"
    show_size
}

full_reinstall() {
    print_warning "Это удалит ВСЕ старые файлы и загрузит новые!"
    read -p "Вы уверены? (yes/no): " confirm

    if [ "$confirm" = "yes" ]; then
        print_info "Шаг 1/2: Очистка бакета..."
        mc rm --recursive --force $MINIO_ALIAS/$BUCKET_NAME/ 2>/dev/null || true
        print_status "Бакет очищен"

        print_info "Шаг 2/2: Загрузка новых медиа..."
        upload_media

        print_status "Переустановка завершена!"
    else
        print_info "Операция отменена"
    fi
}

check_config() {
    print_info "Текущие настройки MinIO:"
    echo ""
    mc alias ls $MINIO_ALIAS 2>/dev/null || print_error "Alias $MINIO_ALIAS не настроен"
    echo ""
    print_info "Для настройки выполните:"
    echo "  mc alias set $MINIO_ALIAS http://localhost:9000 YOUR_ACCESS_KEY YOUR_SECRET_KEY"
}

# Main
check_mc

while true; do
    show_menu
    read -p "Выберите опцию: " choice

    case $choice in
        1) check_minio_connection && list_files ;;
        2) check_minio_connection && show_size ;;
        3) check_minio_connection && clear_bucket ;;
        4) check_minio_connection && upload_media ;;
        5) check_minio_connection && full_reinstall ;;
        6) check_config ;;
        0) echo -e "${GREEN}До свидания!${NC}"; exit 0 ;;
        *) print_error "Неверный выбор" ;;
    esac

    echo ""
    read -p "Нажмите Enter для продолжения..."
done
