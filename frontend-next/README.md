# CIRCLE Creative Buro

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** SCSS Modules
- **Animation:** Framer Motion
- **Package Manager:** pnpm

## Features

## Project Structure

```
app/
├── (dashboard)/          # Роутинг группа для страниц
│   ├── about/           # О нас
│   ├── contact/         # Контакты
│   └── services/        # Услуги
├── components/
│   ├── shared/          # Секции страниц
│   │   ├── about/
│   │   ├── home/
│   │   └── services/
│   └── ui/              # UI компоненты
│       ├── calendar/
│       ├── footer/
│       ├── header/
│       └── success-calendar/
├── styles/
│   ├── base/            # Глобальные стили
│   └── shared/          # Миксины, переменные
└── layout.tsx
```

## Getting Started

```bash
# Установка зависимостей
pnpm install

# Запуск dev сервера
pnpm dev

# Сборка для продакшена
pnpm build

# Запуск продакшен сервера
pnpm start

# Линтинг
pnpm lint
```