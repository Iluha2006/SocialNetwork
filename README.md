# SocialNetwork

Full-stack social network with real-time messaging, audio/video calls, posts, friend system and monitoring.

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
- Audio messages (record, send, play)
- Chat background themes
- Chat history management (update, delete messages, clear chat)

### Friends
- Send / accept / reject / cancel friend requests
- Friends list
- Friendship status check

### Audio/Video Calls
- WebRTC peer-to-peer calls (audio and video)
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

### Prerequisites
- Docker & Docker Compose

### Launch

```bash
git clone https://github.com/Iluha2006/SocialNetwork.git
cd SocialNetwork
docker compose up -d
```

### Available Services

| Service | URL |
|---------|-----|
| Application | http://localhost:8088 |
| Frontend (Vite) | http://localhost:5173 |
| Horizon Dashboard | http://localhost:8088/horizon |
| MinIO Console | http://localhost:9001 |
| Grafana | http://localhost:3000 |
| Prometheus | http://localhost:9091 |
| Reverb WebSocket | http://localhost:6001 |

### Default Credentials

| Service | Login | Password |
|---------|-------|----------|
| Database | postgres | 23paer2007 |
| MinIO | minio124 | minio1235 |
| Grafana | admin | admin |

## Domain Model

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
  php        # PHP 8.4 FPM (port 9000)
  nginx      # Reverse proxy (ports 8088/8077)
  postgres   # PostgreSQL 16 (port 5433)
  redis      # Redis 7
  storage    # MinIO S3 (ports 9000/9001)
  node       # Vite dev server (port 5173)
  horizon    # Queue worker + dashboard
  reverb     # WebSocket server (port 6001)
  cloudflared # Cloudflare tunnel
  prometheus  # Metrics collection (port 9091)
  grafana     # Dashboards (port 3000)
  node-exporter # System metrics (port 9102)
```

## Development

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f horizon
docker compose logs -f reverb

# Run migrations
docker exec laravel_php php artisan migrate

# Horizon dashboard
open http://localhost:8088/horizon

# Grafana dashboard
open http://localhost:3000
```

## License

MIT
