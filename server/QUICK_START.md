# 🚀 Quick Start Guide

## Что это?

Это полная замена Supabase - все работает на вашем сервере NovaCloud.

---

## ⚡ Быстрый старт (5 минут)

### 1️⃣ На вашем сервере NovaCloud

```bash
# Установить Docker (если еще нет)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Загрузить папку server на сервер
# Используйте FileZilla, SCP или git

# Перейти в папку
cd /home/user/circle-buro-backend

# Скопировать .env.example в .env
cp .env.example .env

# Отредактировать .env (вставить ваши ключи)
nano .env
```

### 2️⃣ Заполнить .env

```bash
DB_PASSWORD=create_strong_password_here
TELEGRAM_BOT_TOKEN=copy_from_netlify
TELEGRAM_CHAT_ID=copy_from_netlify
ADMIN_PASSWORD=copy_from_netlify
G_CAL_ID=copy_from_netlify
G_CAL_SERVICE_ACCOUNT_KEY=copy_from_netlify
CORS_ORIGIN=https://your-site.netlify.app
```

### 3️⃣ Запустить

```bash
# Запустить все сервисы
docker-compose up -d

# Проверить логи
docker-compose logs -f

# Когда увидите "Database connected successfully" - готово!
```

### 4️⃣ Экспортировать данные из Supabase

```bash
# На локальном компьютере
cd server/scripts
npm install
VITE_SUPABASE_URL=your_url VITE_SUPABASE_ANON_KEY=your_key node export-from-supabase.js

# Загрузить data/import-data.sql на сервер
# На сервере:
docker exec -i circle-buro-db psql -U circle_user -d circle_buro < data/import-data.sql
```

### 5️⃣ Обновить Frontend

**Вариант A: Простой (без изменения кода)**

В Netlify Environment Variables:
```bash
# Заменить
VITE_SUPABASE_URL → удалить
VITE_SUPABASE_ANON_KEY → удалить

# Добавить
VITE_API_URL=http://your-server-ip:3000
```

Скопировать новый клиент:
```bash
# В папке проекта
cp server/frontend-client/apiClient.js src/supabaseClient.js
```

Изменить первую строку src/supabaseClient.js:
```javascript
// Добавить в начало файла:
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

**Вариант B: Правильный (с переименованием)**

1. Скопировать файл:
```bash
cp server/frontend-client/apiClient.js src/apiClient.js
```

2. Заменить импорты во всех файлах:
```javascript
// Было:
import { supabase } from './supabaseClient';

// Стало:
import { supabase } from './apiClient';
```

Файлы для изменения:
- `src/sections/SectionTwelve.jsx`
- `src/pages/AdminPage.jsx`

### 6️⃣ Деплой

```bash
# Собрать и задеплоить
npm run build
netlify deploy --prod

# Или через Netlify UI (автоматически после push в git)
```

---

## ✅ Проверить что работает

### Backend
```bash
curl http://your-server-ip:3000/health
# Должен вернуть: {"status":"ok","timestamp":"..."}
```

### Database
```bash
docker exec circle-buro-db psql -U circle_user -d circle_buro -c "SELECT COUNT(*) FROM leads;"
```

### Frontend
Откройте сайт и попробуйте:
1. Забронировать встречу
2. Зайти в админ панель
3. Изменить статус встречи

---

## 🔥 Возможные проблемы

### Backend не запускается
```bash
# Смотреть логи
docker-compose logs backend

# Перезапустить
docker-compose restart backend
```

### Не могу подключиться к API
```bash
# Проверить firewall
sudo ufw allow 3000/tcp
sudo ufw reload

# Или открыть порт в NovaCloud панели управления
```

### CORS ошибка
```bash
# Проверить что CORS_ORIGIN в .env совпадает с URL вашего сайта
nano .env
# Изменить CORS_ORIGIN
docker-compose restart backend
```

---

## 📊 Что дальше?

### Настроить SSL (HTTPS)
```bash
# Установить Certbot
sudo apt install certbot

# Получить сертификат
sudo certbot certonly --standalone -d api.your-domain.com

# Раскомментировать HTTPS секцию в nginx/nginx.conf
```

### Настроить автобэкапы
```bash
# Создать скрипт
nano /home/user/backup.sh

# Вставить:
#!/bin/bash
docker exec circle-buro-db pg_dump -U circle_user circle_buro > backup_$(date +%Y%m%d).sql

# Сделать исполняемым
chmod +x /home/user/backup.sh

# Добавить в cron (каждый день в 2 ночи)
crontab -e
# Добавить: 0 2 * * * /home/user/backup.sh
```

---

## 💰 Преимущества

✅ **Скорость**: Все в Казахстане - быстрее для казахстанских пользователей
✅ **Контроль**: Полный доступ к данным и серверу
✅ **Цена**: Платите только за сервер (~$10/месяц вместо Supabase + Netlify)
✅ **Масштабируемость**: Легко увеличить ресурсы сервера

---

## 📞 Помощь

Проблемы? Проверьте:
1. `docker-compose logs -f` - логи
2. `docker-compose ps` - статус контейнеров
3. `.env` - правильность переменных окружения

---

Готово! Теперь ваш сайт работает полностью на вашем сервере! 🎉
