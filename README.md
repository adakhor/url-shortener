# URL Shortener

MVP-сервис для сокращения ссылок с базовой аналитикой.

Приложение позволяет создавать короткие ссылки, перенаправлять пользователей на исходный URL и получать статистику.

## Стек

* **Backend:** Node.js + Express + TypeScript
* **Frontend:** React + TypeScript + Vite
* **Data:** PostgreSQL + Redis
* **Testing:** Jest + Supertest
* **Infrastructure:** Docker Compose + Nginx

## Возможности

* Создание коротких ссылок с шестизначным кодом из латинских букв и цифр.
* Валидация HTTP/HTTPS URL и обработка коллизий short code.
* Redirect на исходный URL с подсчётом переходов.
* Redis-кэширование оригинального URL на 1 час.
* Получение статистики по короткому коду.
* React-интерфейс для создания ссылок и просмотра статистики.
* API-тесты и запуск проекта через Docker Compose.

## Запуск через Docker

Для запуска требуется установленный Docker Desktop с поддержкой Docker Compose.

Из корневой директории проекта выполните:

```bash
docker compose up --build
```

Команда автоматически:

* создаст PostgreSQL и Redis;
* создаст и запустит backend;
* соберёт и запустит frontend;
* создаст базу данных и пользователя PostgreSQL;
* при первом создании базы выполнит `backend/db/init.sql`, который создаёт таблицу `urls` и пользователя необходимыми правами.

После запуска:

**Frontend:**
http://localhost:5173

**Backend API:**
http://localhost:3000

Остановить контейнеры:

```bash
docker compose down
```

Для полного удаления контейнеров **вместе с данными PostgreSQL**:

```bash
docker compose down -v
```

После этого следующий запуск через `docker compose up --build` создаст чистую базу заново.

## Локальный запуск

Для запуска без Docker необходимо предварительно иметь доступные PostgreSQL и Redis и настроить подключение к ним.

Backend использует переменные из `backend/.env`.

Frontend запускается через Vite, перенаправляя /api/* на backend.

## Переменные окружения

Для локального запуска создайте:

```text
backend/.env
```

на основе:

```text
backend/.env.example
```

Пример:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=url_shortener
DB_USER=url_app
DB_PASSWORD=your_password
REDIS_URL=redis://localhost:6379
```

Файл `.env` содержит локальные credentials и не добавляется в Git.

При запуске через Docker необходимые значения подключения передаются контейнерам через `docker-compose.yml`, поэтому отдельный `backend/.env` для Docker-запуска не требуется.

## API

### POST `/api/shorten`

Создание короткой ссылки.

Request:

```bash
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://example.com"}'
```

Response `201 Created`:

```json
{
  "shortCode": "Ab12xZ",
  "shortUrl": "http://localhost:3000/Ab12xZ"
}
```

Невалидный URL возвращает `400 Bad Request`.

### GET `/:shortCode`

Редирект на оригинальный URL.

Подставьте полученный `shortCode` в адрес запроса:

```bash
curl -i http://localhost:3000/Ab12xZ
```

Успешный запрос возвращает `302 Found` и заголовок `Location`.

При первом запросе оригинальный URL читается из PostgreSQL и сохраняется в Redis на 1 час. При последующих запросах URL берётся из Redis.

Если короткий код не существует, возвращается `404 Not Found`.

### GET `/api/stats/:shortCode`

Получение статистики по короткому коду.

Здесь используется **только short code**, например `Ab12xZ`:

```bash
curl -i http://localhost:3000/api/stats/Ab12xZ
```

Response:

```json
{
  "originalUrl": "https://example.com",
  "shortCode": "Ab12xZ",
  "clicks": 5,
  "createdAt": "2026-08-26T12:00:00.000Z"
}
```

Если короткий код не существует, возвращается `404 Not Found`.

## Тесты

Запустить API-тесты:

```bash
cd backend
npm test
```

Тесты написаны с использованием Jest и Supertest и покрывают основные сценарии создания ссылки, валидации, статистики и redirect.
