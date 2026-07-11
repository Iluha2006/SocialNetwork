
FROM php:8.4-fpm


RUN apt-get update && apt-get install -y \
    git \
    curl \
    vim \
    nano \
    
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libwebp-dev \
   
    libpq-dev \
    
    libzip-dev \
    
    libonig-dev \
    libxml2-dev \

    zip \
    unzip \
    procps \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


RUN docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
    && docker-php-ext-install -j$(nproc 2>/dev/null || echo 4) \
        bcmath \
        exif \
        mbstring \
        pcntl \
        zip \
        gd \
        pdo_pgsql \
    && docker-php-ext-enable gd pdo_pgsql \
    && pecl install redis && docker-php-ext-enable redis

# 🔥 3. Устанавливаем Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 🔥 4. Рабочая директория
WORKDIR /var/www/html

# 🔥 5. Копируем composer файлы и устанавливаем зависимости
COPY composer.json composer.lock* ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --ignore-platform-reqs

# 🔥 6. Копируем весь проект
COPY . .

# 🔥 7. Создаём директории и устанавливаем права
RUN mkdir -p \
        storage/framework/{sessions,views,cache} \
        storage/logs \
        storage/app/public \
        bootstrap/cache \
    && chown -R www-data:www-data \
        storage \
        bootstrap/cache \
    && chmod -R 775 \
        storage \
        bootstrap/cache

# 🔥 8. PHP-FPM слушает порт 9000
EXPOSE 9000

# 🔥 9. Запускаем PHP-FPM
CMD ["php-fpm"]