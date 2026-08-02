#!/bin/bash

SSL_DIR="./ssl"
mkdir -p "$SSL_DIR"

openssl req -x509 -nodes -days 825 -newkey rsa:2048 \
  -keyout "$SSL_DIR/nginx.key" \
  -out "$SSL_DIR/nginx.crt" \
  -subj "/C=RU/ST=Moscow/L=Moscow/O=Social/CN=social.com" \
  -addext "subjectAltName=DNS:social.com,DNS:www.social.com,DNS:app.social.com,DNS:api.social.com,DNS:l.social.com,DNS:stage.social.com,DNS:social.test,DNS:localhost,IP:127.0.0.1,IP:192.168.0.151"

chmod 600 "$SSL_DIR/nginx.key"

echo "SSL certificates generated in $SSL_DIR/"
echo "  - $SSL_DIR/nginx.crt"
echo "  - $SSL_DIR/nginx.key"
