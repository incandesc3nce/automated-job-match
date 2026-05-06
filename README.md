# Automated Job Match

Данный проект представляет собой автоматизированную систему подбора вакансий с использованием LLM и NLP. Система позволяет создать свое резюме и получить подборку актуальных вакансий, соответствующих вашему профилю.

## Функциональность

- Аутентификация и регистрация пользователей
- Создание и редактирование резюме
- Получение персонализированных рекомендаций по вакансиям
- Просмотр и отклик на вакансии

## Архитектура проекта

Проект построен на событийной сервис-ориентированной архитектуре, что обеспечивает гибкость, масштабируемость и независимость от других компонентов системы. Основные компоненты расположены в папке `apps` и включают:

- [**Website**](apps/website/README.md): Веб-интерфейс для взаимодействия пользователей с системой и API.
- [**API**](apps/api/README.md): RESTful API для обработки запросов от веб-интерфейса и взаимодействия с другими сервисами.
- [**LLM Worker**](/apps/llm-worker/README.md): Сервис для векторизации текста и генерации рекомендаций с помощью LLM.
- [**Scraper**](/apps/scraper/README.md): Сервис для сбора данных о вакансиях с различных источников.

Также используются переиспользуемые библиотеки, которые находятся в папке `packages`, такие как [`db`](/packages/db/README.md) для работы с базой данных PostgreSQL и Drizzle ORM, [`redis`](/packages/redis/README.md) для взаимодействия с Redis, [`auth`](/packages/auth/README.md) для аутентификации и [`queue`](/packages/queue/README.md) для очередей в BullMQ.

Сервисы взаимодействуют друг с другом через Redis pub/sub и BullMQ для обмена данными и оповещений.

## Технологии

[![TypeScript](https://go-skill-icons.vercel.app/api/icons?i=ts)](https://www.typescriptlang.org/)
[![Bun](https://go-skill-icons.vercel.app/api/icons?i=bun)](https://bun.sh/)
[![Docker](https://go-skill-icons.vercel.app/api/icons?i=docker)](https://www.docker.com/)

[![React](https://go-skill-icons.vercel.app/api/icons?i=react)](https://reactjs.org/)
[![Next.js](https://go-skill-icons.vercel.app/api/icons?i=nextjs)](https://nextjs.org/)
[![Tailwind CSS](https://go-skill-icons.vercel.app/api/icons?i=tailwind)](https://tailwindcss.com/)
[![shadcn/ui](https://go-skill-icons.vercel.app/api/icons?i=shadcn)](https://ui.shadcn.com/)

[![Hono](https://go-skill-icons.vercel.app/api/icons?i=hono)](https://hono.dev/)
[![PostgreSQL](https://go-skill-icons.vercel.app/api/icons?i=postgresql)](https://www.postgresql.org/)
[![Drizzle ORM](https://go-skill-icons.vercel.app/api/icons?i=drizzle)](https://orm.drizzle.team/)
[![Redis](https://go-skill-icons.vercel.app/api/icons?i=redis)](https://redis.io/)

## Локальный запуск проекта

1. Убедитесь, что у вас установлены Docker и Docker Compose.
2. Создайте `.env` файлы в папке `docker/env` по примеру из `docker/env-example`. `localhost` замените на соответствующие названия сервисов, указанные в `docker-compose.yml` (например, `api` для API, `db` для PostgreSQL и `redis` для Redis).
3. В корне проекта запустите команду для поднятия всех необходимых сервисов:

```bash
docker-compose -f docker-compose.yml up -d --build
```

4. После запуска всех сервисов, вы можете получить доступ к веб-интерфейсу по адресу `http://localhost:3000` и API по адресу `http://localhost:5000`.

Для запуска сервисов [**Website**](apps/website/README.md), [**API**](apps/api/README.md), [**LLM Worker**](/apps/llm-worker/README.md) и [**Scraper**](/apps/scraper/README.md) перейдите в соответствующие директории в папке `apps` и следуйте инструкциям по локальной разработке, описанным в их README файлах.

Для запуска интерфейса для администрирования базой данных PostgreSQL, установите зависимости в папке `packages/db` и запустите Drizzle Studio, следуя инструкциям в [README для db](packages/db/README.md).

## Вклад в проект

Любой вклад в проект приветствуется! Если у вас есть идеи по улучшению функциональности, оптимизации производительности или исправлению ошибок, пожалуйста, создайте pull request или откройте issue для обсуждения.

Также вы можете создать свой fork проекта и работать над своими изменениями, а затем предложить их для включения в основной репозиторий.

Если вам понравился проект, не забудьте поставить звезду⭐ на GitHub и поделиться им с другими! Спасибо за интерес к проекту и ваш вклад!

## Лицензия

This project is licensed under [GNU GPL v3](LICENSE)

© incandesc3nce 2026. All rights reserved.
