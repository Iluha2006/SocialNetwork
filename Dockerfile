FROM php:8.2-fpm


RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev


RUN apt-get clean && rm -rf /var/lib/apt/lists/*

RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y \
        git \
        zlib1g-dev \
        unzip \
    && cd /tmp \
    && mkdir librdkafka \
    && cd librdkafka \
    && git clone --depth=1 https://github.com/edenhill/librdkafka.git . \
    && ./configure \
    && make \
    && make install \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install -j$(nproc) zip \
    && pecl install rdkafka \
    && docker-php-ext-enable rdkafka

RUN docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd


COPY --from=composer:latest /usr/bin/composer /usr/bin/composer


WORKDIR /var/www/html


COPY . .


RUN chown -R www-data:www-data /var/www/html/storage
RUN chmod -R 775 /var/www/html/storage


RUN composer install --no-dev --optimize-autoloader

EXPOSE 9000
CMD ["php-fpm"]
