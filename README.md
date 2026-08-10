# Task Manager

Небольшое приложение для управления задачами. Выполнено как тестовое задание на позицию Junior Frontend Developer.

## Возможности

- просмотр списка задач (название, статус, дата создания);
- состояния загрузки, ошибки с кнопкой «Повторить» и пустого списка.

## Запуск

```bash
npm install
npm run dev
```

`npm run dev` одновременно запускает клиент (Vite, http://localhost:5173) и мок-сервер API (json-server, http://localhost:3001). Запросы приложения к `/api/*` проксируются на мок-сервер через конфигурацию Vite.

## Скрипты

| Команда | Действие |
|---|---|
| `npm run dev` | Клиент + мок-сервер одновременно |
| `npm run dev:client` | Только клиент (Vite) |
| `npm run server` | Только мок-сервер (json-server, порт 3001) |
| `npm run lint` | Проверка ESLint |
| `npm run format` | Форматирование Prettier |
| `npm run build` | Продакшн-сборка |

## Технологии

React, TypeScript (strict), Vite, TanStack Query, json-server. Качество кода — ESLint + Prettier.
