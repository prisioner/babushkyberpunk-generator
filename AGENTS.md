# AGENTS.md

## Project
Babushkiberpunk Generator

Статический генератор для НРИ «Бабушкиберпанк» на React + Vite + TypeScript.
Проект публикуется через GitHub Pages и работает без бэкенда, базы данных и внешних API.

## Main goals
Сделать простой, понятный и поддерживаемый генератор:
1. Генератор бабушки
2. Генератор приключения
3. Частушки

## Hard constraints
- Полностью статический сайт
- Никаких API, серверов, БД
- Минимум зависимостей
- Не использовать UI-фреймворки
- Не использовать глобальный state management
- Не использовать роутинг

## Architecture
- data (src/data)
- logic (src/lib)
- UI (src/components)
- features (src/features)

## State
- useState / useReducer
- без Redux/MobX/Zustand

## Roll logic
- rollD6
- rollD66
- findByKey
- findByRange

## Styling
- CSS variables
- без перегрузки

## Codex rules
Перед изменениями:
1. План
2. Файлы
3. Подтверждение

## Done
- работает в статике
- данные из JSON
- читаемый код
