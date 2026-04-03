# Архитектура Backend (Start Kit)

## Структура модулей

```
app/
├── Contracts/                 # Интерфейсы для DI
│   ├── Cache/
│   │   ├── CacheServiceInterface.php
│   │   └── CacheableInterface.php
│   └── Profile/
│       ├── ProfileServiceInterface.php
│       └── PrivateProfileServiceInterface.php
│
├── Modules/                   # Бизнес-модули
│   ├── Profile/
│   │   └── Services/
│   │       ├── ProfileService.php
│   │       └── PrivateProfileService.php
│   └── Post/
│       └── Services/
│           └── PostService.php
│
├── Services/
│   └── Cache/                 # Сервисы кеширования
│       ├── CacheService.php
│       └── MessageCacheService.php
│
├── Support/
│   └── Traits/
│       └── Cacheable.php      # Trait для сервисов с кешированием
│
├── Http/
│   └── Resources/             # JSON API Resources
│       ├── Profile/
│       ├── Post/
│       ├── Image/
│       └── BlockedUser/
│
├── Jobs/
│   ├── Media/                 # Очереди для медиа-операций
│   │   ├── ProcessAvatarUploadJob.php
│   │   ├── ProcessProfileImageUploadJob.php
│   │   └── ProcessPostMediaJob.php
│   └── SendAudioMessage.php
│
└── Providers/
    └── ModuleServiceProvider.php  # DI привязки
```

## Dependency Injection (DI)

Интерфейсы привязаны к реализациям в `ModuleServiceProvider`:

- `CacheServiceInterface` → `CacheService`
- `ProfileServiceInterface` → `ProfileService`
- `PrivateProfileServiceInterface` → `PrivateProfileService`

Контроллеры получают зависимости через конструктор:

```php
public function __construct(
    private readonly ProfileServiceInterface $profileService
) {}
```

## Шаблон кеширования (Cacheable)

Сервисы используют trait `Cacheable`:

```php
use App\Support\Traits\Cacheable;

class ProfileService implements ProfileServiceInterface
{
    use Cacheable;

    public function show(int $id): array
    {
        return $this->remember("profile:{$id}", 3600, fn () => /* ... */);
    }
}
```

Методы: `remember()`, `forget()`, `invalidateProfileCache()`, `invalidateProfileListCache()`.

## HTTP Resources (JSON)

Форматирование API через Resources:

- `ProfileResource` / `ProfileCollection`
- `PostResource` / `PostCollection`
- `ImageResource`
- `BlockedUserResource`

## Очереди (Queues)

Тяжёлые операции выполняются через Jobs:

| Job | Описание |
|-----|----------|
| `ProcessPostMediaJob` | Загрузка видео/изображений поста в S3 (при наличии video) |
| `ProcessAvatarUploadJob` | Аватар (опционально) |
| `ProcessProfileImageUploadJob` | Фото профиля (опционально) |
| `SendAudioMessage` | Отправка аудиосообщения |

Запуск воркера:
```bash
php artisan queue:work
```

Миграция для очередей:
```bash
php artisan queue:table
php artisan migrate
```
