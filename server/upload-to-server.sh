#!/bin/bash

# Circle Buro - Upload Media to Server
# Скрипт для загрузки медиа файлов на сервер

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✓${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_info() { echo -e "${BLUE}ℹ${NC} $1"; }

# Configuration - ИЗМЕНИТЕ ЭТИ ЗНАЧЕНИЯ
SERVER_USER="root"
SERVER_HOST="your-server-ip"
SERVER_PATH="~/media-upload"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Circle Buro - Upload Media to Server${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if public directory exists
if [ ! -d "./public" ]; then
    print_error "Директория ./public не найдена!"
    print_info "Запустите скрипт из корня проекта"
    exit 1
fi

# Show what will be uploaded
print_info "Медиа файлы для загрузки:"
du -sh ./public/
echo ""

print_info "Структура директорий:"
ls -la ./public/
echo ""

read -p "Введите SSH хост (user@host): " SSH_TARGET

if [ -z "$SSH_TARGET" ]; then
    print_error "SSH хост не указан!"
    exit 1
fi

print_info "Создание директории на сервере..."
ssh $SSH_TARGET "mkdir -p ~/media-upload"

print_info "Загрузка файлов (это может занять время)..."
rsync -avz --progress ./public/ $SSH_TARGET:~/media-upload/public/

print_status "Файлы загружены в ~/media-upload/public/"
echo ""

print_info "Теперь на сервере выполните:"
echo "  cd ~/media-upload"
echo "  ./manage-media.sh"
echo ""
print_info "Или загрузите напрямую в MinIO:"
echo "  mc cp --recursive ~/media-upload/public/ circleminio/circleburo/"
