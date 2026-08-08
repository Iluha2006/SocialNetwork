# SocialNetwork

Full-stack social network with real-time messaging, audio/video calls, posts, friend system and monitoring.

## Предметная область

Проект представляет собой **полнофункциональную социальную сеть** — платформу для общения, публикации контента и поддержания социальных связей между пользователями. Система охватывает следующие предметные подсистемы:

- **Пользователи и аутентификация** — регистрация с подтверждением e-mail, вход/выход, OAuth-авторизация (Яндекс), отслеживание онлайн-статуса, блокировки.
- **Профили** — анкеты пользователей: аватар, фотогалерея, биография, карьера (Carer), контакты и настройки приватности (видимость профиля, друзей, изображений).
- **Социальные связи (Friendship)** — отправка/принятие/отклонение заявок в друзья, списки друзей, проверка статуса дружбы.
- **Публикации (Posts)** — создание постов с изображениями и видео, лента новостей, лайки, комментарии.
- **Обмен сообщениями (Messaging)** — личные чаты в реальном времени: текстовые, голосовые (AudioMessage) и файловые сообщения, темы оформления чатов, история переписки.
- **Аудио (WebRTC)** — peer-to-peer звонки с обменом SDP и ICE через WebSocket, история звонков.
- **Мониторинг** — метрики Prometheus, дашборды Grafana, панель очередей Horizon.

Целевая аудитория — конечные пользователи интернета, желающие общаться, делиться контентом и поддерживать социальные связи в реальном времени. Технически проект реализован по паттерну **CQRS** (см. раздел [Architecture](#architecture)).

## Описание проекта

SocialNetwork — это full-stack приложение, сочетающее:

- **Laravel 11 (PHP 8.4)** бэкенд с архитектурой CQRS: команды/запросы, обработчики, сервисы и репозитории, типобезопасные DTO (Spatie Data).
- **React 19 (Vite + Redux Toolkit + Tailwind CSS 4)** фронтенд.
- **Реальное время** на базе Laravel Reverb (WebSocket) и Laravel Echo.
- **Очереди** через Laravel Horizon (Redis) для обработки медиа, отправки e-mail и broadcast-событий.
- **Хранение файлов** в S3-совместимом объектном хранилище MinIO.
- **Мониторинг** через Prometheus, Grafana и Node Exporter.
- **Деплой** в Docker Compose (12 сервисов) с Nginx.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Laravel 11, PHP 8.4, PostgreSQL 16, Redis 7 |
| **Frontend** | React 19, Vite, Redux Toolkit, Tailwind CSS 4, React Router 7 |
| **Real-time** | Laravel Reverb (WebSocket), Laravel Echo |
| **Auth** | Laravel Sanctum, Yandex OAuth (Socialite) |
| **Queue** | Laravel Horizon (Redis) |
| **Storage** | MinIO (S3-compatible) |
| **Calls** | WebRTC (peer-to-peer audio/video) |
| **Monitoring** | Prometheus, Grafana, Node Exporter |
| **Infrastructure** | Docker, Nginx, Cloudflare Tunnel |

## Features

### Users & Authentication
- Registration with email verification (queued)
- Login / Logout (Sanctum token in HttpOnly cookie)
- Yandex OAuth social login
- Online/offline status tracking (real-time)
- User blocking

### Profile
- Public/private profile with avatar
- Photo gallery (upload, browse)
- Bio, career info (Carer), contacts
- Privacy settings (profile visibility, friends visibility, images visibility)

### Posts & Feed
- Create posts with images/videos (processed via queue jobs)
- News feed with all posts
- Like/unlike with toggle
- Comments

### Messaging
- Text messages with real-time delivery (WebSocket)
- File and image attachments in chat
- Chat background themes
- Chat history management (update, delete messages, clear chat)

### Friends
- Send / accept / reject / cancel friend requests
- Friends list
- Friendship status check

### Audio звонки
- WebRTC peer-to-peer calls (audio )
- ICE candidate exchange via WebSocket
- Call states: initiate, accept, reject, end
- Call history

### Monitoring
- Prometheus metrics endpoint (`/metrics`)
- Grafana dashboard with request rate, error rate, response time percentiles
- Horizon queue dashboard at `/horizon`
- Node Exporter system metrics

## Architecture

The project follows **CQRS (Command Query Responsibility Segregation)** pattern:

```
app/
  Commands/          # Write operations
  Queries/           # Read operations
  Handlers/
    Commands/        # Command handlers
    Queries/         # Query handlers
  Services/          # Business logic
  Repositories/      # Data access layer
  Contracts/         # Interface definitions
  Data/              # Spatie Data Transfer Objects
  Jobs/              # Queued jobs
  Events/            # Broadcast events
  Middleware/        # HTTP middleware
```

- **CommandBus** dispatches commands to their handlers
- **QueryBus** dispatches queries to their handlers
- Services are registered as singletons via `ModuleServiceProvider`
- DTOs (Spatie Data) ensure type-safe data transfer

## Project Structure

```
SocialNetwork/
├── app/
│   ├── Commands/             # CQRS commands
│   ├── Contracts/            # Interfaces (CacheService, ProfileService, LikePost)
│   ├── Data/                 # Spatie DTOs (UserData, ProfileData, PostData, ...)
│   ├── Events/               # Broadcast events (PrivateMessage, IncomingCall, ...)
│   ├── Handlers/             # Command & Query handlers
│   ├── Http/
│   │   ├── Controllers/      # API controllers
│   │   └── Middleware/       # PrometheusMetrics, Auth
│   ├── Jobs/                 # Queue jobs (media processing, email, audio)
│   ├── Models/               # 20 Eloquent models
│   ├── Providers/            # App, Horizon, Prometheus, Telescope providers
│   ├── Queries/              # CQRS queries
│   └── Services/             # Business logic services
├── config/
│   ├── horizon.php           # Horizon queue config
│   └── prometheus.php        # Prometheus metrics config
├── database/
│   ├── migrations/           # Database migrations
│   └── seeders/              # Database seeders
├── docker/                   # Docker configs
├── grafana/
│   ├── dashboards/           # Grafana dashboard JSON
│   └── provisioning/         # Auto-provisioned datasources & dashboards
├── prometheus.yml            # Prometheus scrape config
├── resources/
│   └── js/                   # React frontend
│       ├── Pages/            # Page components
│       ├── components/       # UI components
│       ├── store/            # Redux slices
│       ├── api/              # API layer (Axios)
│       ├── hooks/            # Custom hooks (WebRTC, WebSocket, chat)
│       └── WebRTC/           # Peer connection logic
├── routes/
│   ├── web.php               # All routes
│   └── channels.php          # Broadcast channel definitions
├── docker-compose.yml        # 12 Docker services
├── Dockerfile                # PHP 8.4 FPM image
├── Dockerfile.nginx          # Nginx with SSL
├── nginx.conf                # Reverse proxy config
└── vite.config.js            # Vite build config
```

## Getting Started

Полная инструкция по установке зависимостей, настройке окружения, запуску через Docker, миграциям и наполнению базы данных.

### Требования (Prerequisites)

- **Docker** 24+ и **Docker Compose** v2
- **Git**
- Для локальной разработки (вне Docker): **PHP 8.4**, **Composer 2**, **Node.js 22**, **npm**

### Шаг 1. Клонирование репозитория

```bash
git clone https://github.com/Iluha2006/SocialNetwork.git
cd SocialNetwork
```

### Шаг 2. Конфигурация окружения

```bash
cp .env.example .env
```

Заполните в `.env` обязательные переменные:

| Переменная | Описание |
|-----------|----------|
| `APP_NAME` | Название приложения |
| `APP_URL` | Публичный URL приложения |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` | Параметры подключения к PostgreSQL |
| `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD` | Учётные данные MinIO (S3-хранилище) |
| `REVERB_APP_ID`, `REVERB_APP_KEY`, `REVERB_APP_SECRET` | Ключи WebSocket-сервера Reverb |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_BUCKET` | Доступ к S3-хранилищу |
| `YANDEX_CLIENT_ID`, `YANDEX_CLIENT_SECRET` | Данные приложения Яндекс OAuth |

> Значения `POSTGRES_*` и `MINIO_ROOT_*` должны совпадать с теми, что задаются в `docker-compose.yml` через `${...}` подстановку из `.env`.

### Шаг 3. Установка зависимостей

> ⚠️ Внутри Docker-контейнеров зависимости устанавливаются автоматически: образ `php` выполняет `composer install --no-dev` на этапе сборки (`Dockerfile`), а контейнер `node` запускает `npm install && npm run build`. Локальная установка нужна только для разработки вне Docker или для `vendor/` на хосте.

```bash
# PHP-зависимости (Laravel и пакеты)
composer install

# Фронтенд-зависимости (React, Vite, Tailwind и др.)
npm install
```

### Шаг 4. Запуск приложения через Docker

```bash
docker compose up -d
```

После запуска всех контейнеров проверьте статус:

```bash
docker compose ps
```

Первичная сборка образов может занять несколько минут. Дождитесь, пока сервисы `php`, `nginx`, `postgres`, `redis`, `storage`, `node`, `horizon`, `reverb` перейдут в состояние `running`/`healthy`.

### Шаг 5. Ключ приложения и миграции

```bash
# Сгенерировать ключ приложения (если APP_KEY пустой)
docker compose exec php php artisan key:generate

# Применить миграции базы данных
docker compose exec php php artisan migrate

# Наполнить базу тестовыми данными (пользователи, посты, комментарии) — опционально
docker compose exec php php artisan db:seed
```

Отдельные сидеры:

```bash
docker compose exec php php artisan db:seed --class=RoleSeeder
docker compose exec php php artisan db:seed --class=UserSeeder
docker compose exec php php artisan db:seed --class=PostSeeder
docker compose exec php php artisan db:seed --class=CommentSeeder
```

### Шаг 6. OAuth-ключи (Laravel Passport)

Авторизация построена на Laravel Passport. При первом запуске сгенерируйте ключи и клиенты:

```bash
docker compose exec php php artisan passport:install
```

### Шаг 7. Сборка фронтенда

Контейнер `node` автоматически выполняет `npm install && npm run build` при старте. Для режима разработки с горячей перезагрузкой запустите Vite на хосте:

```bash
npm run dev
```

### Проверка работоспособности

1. Откройте приложение в браузере: http://localhost (или http://localhost:8088, если вы изменили маппинг портов)
2. Проверьте сервисы из таблицы ниже
3. Зарегистрируйте нового пользователя через `/auth/register`

### Сброс и перезапуск

```bash
# Остановить все сервисы
docker compose down

# Полный сброс (удаление томов БД, MinIO, Grafana)
docker compose down -v

# Пересобрать образы с нуля
docker compose up -d --build
```

### Available Services

| Service | URL |
|---------|-----|
| Application | http://localhost |
| Frontend (Vite dev) | http://localhost:5173 |
| Horizon Dashboard | http://localhost/horizon |
| MinIO Console | http://localhost:9001 |
| Grafana | http://localhost:3000 |
| Prometheus | http://localhost:9091 |
| Reverb WebSocket | http://localhost:6001 |

> Приложение доступно на порту 80/443 (`docker-compose.yml` маппит `nginx` на `0.0.0.0:80:80`). Если порт 80 занят, измените маппинг в `docker-compose.yml`, например `"8088:80"`.



### Entities

```
User ──┬── Profile ──┬── ContactProfile
       │             ├── Carer
       │             ├── PrivacySetting
       │             └── ImageProfile (gallery)
       ├── Post ──┬── CommentPost
       │          ├── LikesPost
       │          └── FileMessage (media)
       ├── Message ── FileMessage (attachments)
       ├── AudioMessage
       ├── Call
       ├── Friendship ── FriendRequest
       ├── Block
       ├── ImagesBacround (chat background)
       └── OAuthProvider
```

### Key Relationships

| Entity | Description |
|--------|-------------|
| **User** | Core entity. Has profile, posts, messages, friends, calls. Tracks online status. |
| **Profile** | Public-facing profile. Links to user, friends, career, contacts, privacy settings. |
| **Post** | User-generated content with images/videos. Supports likes and comments. |
| **Message** | Chat messages between two users. Supports text, file, and image content. |
| **AudioMessage** | Voice messages stored in S3. |
| **Call** | WebRTC call record with SDP offer/answer, ICE candidates, status lifecycle. |
| **Friendship** | Bidirectional friend relationship (two rows per pair). |
| **FriendRequest** | Friend request with pending/accepted/rejected states. |
| **Block** | User blocking (blocker/blocked). |
| **PrivacySetting** | Per-user visibility controls (public/friends/private). |

## API Reference

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login |
| POST | `/auth/logout` | Logout |
| GET | `/auth/yandex/redirect` | Yandex OAuth redirect |
| POST | `/auth/yandex/callback` | Yandex OAuth callback |
| GET | `/user` | Get current user |
| GET | `/user/check` | Check auth status |

### Email Verification

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/email/verification-notification` | Send verification email |
| GET | `/email/verification-status` | Check verification status |
| GET | `/email/verify/{id}/{hash}` | Verify email |
| POST | `/email/resend` | Resend verification |

### Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | List profiles |
| GET | `/profile/{id}` | Show profile |
| PUT | `/profile/update/{id}` | Update profile |
| DELETE | `/profiles/{id}` | Delete profile |
| POST | `/update-avatar` | Update avatar |
| POST | `/profiles/{userId}/block` | Block user |
| POST | `/profiles/{userId}/unblock` | Unblock user |
| GET | `/blocked-users` | List blocked users |
| GET | `/profiles/{id}/friends` | Get profile friends |
| GET | `/profiles/{id}/images` | Get profile images |

### Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts` | Get all posts |
| POST | `/posts` | Create post |
| GET | `/posts/user/{userId}` | Get user posts |
| POST | `/posts/{postId}/like` | Toggle like |
| DELETE | `/posts/{postId}/like` | Remove like |
| GET | `/posts/{postId}/likes/count` | Like count |
| GET | `/posts/{postId}/likes/history` | Like history |
| GET | `/posts/{post}/comments` | Get comments |
| POST | `/posts/{post}/comments` | Add comment |
| DELETE | `/comments/{commentId}` | Delete comment |

### Messages

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/messages/send/{id}` | Send message |
| GET | `/messages/conversation/{userId}` | Get conversation |
| PUT | `/messages/chat/{messageId}` | Update message |
| DELETE | `/messages/{messageId}` | Delete message |
| GET | `/messages/mess-chats` | Get chat list |
| DELETE | `/messages/chat/{userId}` | Delete chat |
| GET | `/files/{userId}` | Get shared files |

### Audio Messages

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/audio/messages` | List audio messages |
| POST | `/audio/send-message` | Send voice message |
| GET | `/audio/conversation/{otherUserId}` | Get audio conversation |
| DELETE | `/audio/delete/{messageId}` | Delete audio message |

### Friends

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/friend/send` | Send request |
| POST | `/friend/accept/{requestId}` | Accept request |
| POST | `/friend/reject/{requestId}` | Reject request |
| POST | `/friend/cancel/{requestId}` | Cancel request |
| GET | `/friend/{profileId}` | Get requests |
| GET | `/friends/{profileId}` | Get friends list |
| DELETE | `/friends/{profileId}/{friendId}` | Remove friend |
| GET | `/friends/check/{profileId}/{friendId}` | Check friendship |
| GET | `/friends/status/{profileId}/{otherProfileId}` | Get status |

### Calls

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/calls/initiate` | Initiate call |
| POST | `/calls/accept/{call}` | Accept call |
| POST | `/calls/reject/{call}` | Reject call |
| POST | `/calls/end/{call}` | End call |
| POST | `/calls/ice-candidate/{call}` | Send ICE candidate |
| GET | `/calls/status/{call}` | Get call status |
| GET | `/calls/historycals` | Call history |

### Privacy

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/privacy-settings` | Get settings |
| POST | `/privacy-settings` | Update settings |
| GET | `/profile/{userId}/privacy-check` | Check profile visibility |
| GET | `/profile/{userId}/friends/privacy` | Check friends visibility |
| GET | `/profile/{userId}/images/privacy` | Check images visibility |

### Other

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST/PUT/DELETE | `/contacts/*` | CRUD contacts |
| GET/POST/PUT | `/api/carers/*` | CRUD career info |
| GET/POST/DELETE | `/images/*` | CRUD profile images |
| GET/POST/DELETE | `/chat-background/*` | Chat backgrounds |
| GET/POST | `/online-status/*` | Online status |
| GET | `/metrics` | Prometheus metrics |

## Real-time Events

All events broadcast via Laravel Reverb (WebSocket):

| Event | Channel | Direction |
|-------|---------|-----------|
| `PrivateMessage` | `chat.{id1}.{id2}` | New chat message |
| `AudioMessageSent` | `audio.{receiver_id}` | Voice message |
| `OnlineUser` | `online-users` | Online/offline status |
| `MessageDeleted` | `messages` | Message deletion |
| `IncomingCall` | `call.{receiver_id}` | Incoming call |
| `CallAccepted` | `call-accept.{caller_id}` | Call accepted |
| `CallRejected` | `call-reject.{caller_id}` | Call rejected |
| `CallEnded` | `call-end.{id1}.{id2}` | Call ended |
| `WebRTCOffer` | `user.{toUserId}` | SDP offer |
| `WebRTCIceCandidate` | `user.{toUserId}` | ICE candidate |
| `Answer` | `user.{toUserId}` | SDP answer |

## Queue Jobs

Managed by Laravel Horizon (queues: `default`, `media`, `broadcast`):

| Job | Queue | Purpose |
|-----|-------|---------|
| `ProcessPostMediaJob` | media | Move post images/videos from temp to permanent S3 path |
| `ProcessProfileImageUploadJob` | media | Move profile photo to permanent S3 path |
| `ProcessAvatarUploadJob` | media | Upload avatar to S3, delete old |
| `SendAudioMessage` | broadcast | Broadcast audio message event to receiver |
| `SendVerificationEmail` | default | Send email verification notification |

## Docker Services

```yaml
services:
  php          # PHP 8.4 FPM (internal port 9000)
  nginx        # Reverse proxy (ports 80/443)
  postgres     # PostgreSQL 16 (port 5433)
  redis        # Redis 7 (port 6380)
  storage      # MinIO S3 (ports 9000/9001)
  minio-init   # One-time bucket initialization (social-media)
  node         # Vite build + dev server (port 5173)
  horizon      # Queue worker + dashboard
  reverb       # WebSocket server (port 6001)
  node-exporter # System metrics (port 9102)
  prometheus   # Metrics collection (port 9091)
  grafana      # Dashboards (port 3000)
```

## Development

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f horizon
docker compose logs -f reverb

# Run migrations (inside the php container)
docker compose exec php php artisan migrate

# Rollback migrations
docker compose exec php php artisan migrate:rollback

# Refresh migrations and seed
docker compose exec php php artisan migrate:fresh --seed

# Generate OAuth keys
docker compose exec php php artisan passport:install

# Run tests
docker compose exec php php artisan test

# Horizon dashboard
open http://localhost/horizon

# Grafana dashboard
open http://localhost:3000
```

## Production Deployment

Для продакшена используется отдельный файл `docker-compose.prod.yml` с исходным кодом, "запечённым" в образы (без bind-mounts). Миграции выполняются автоматически при старте контейнера `php`.

```bash
cp .env.prod.example .env.prod   # заполните реальные значения
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

Особенности прод-конфигурации:

| Особенность | Описание |
|------------|----------|
| Автомиграции | `php artisan migrate --force` выполняется при старте контейнера `php` |
| `scheduler` | Сервис `php artisan schedule:work` для планировщика |
| Кэширование | `php artisan optimize` (config/route/view cache) |
| Безопасность | Наружу открыты только `nginx` (80/443) и `reverb` (6001); Postgres, Redis, MinIO — внутри сети Docker |
| Мониторинг | Prometheus/Grafana/node-exporter закомментированы — раскомментируйте при необходимости |

Полезные прод-команды:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml ps
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f php
docker compose --env-file .env.prod -f docker-compose.prod.yml exec php php artisan migrate --force
docker compose --env-file .env.prod -f docker-compose.prod.yml exec php php artisan db:seed
```


