#!/bin/bash

SSL_DIR="./ssl"
mkdir -p "$SSL_DIR"

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "$SSL_DIR/nginx.key" \
  -out "$SSL_DIR/nginx.crt" \
  -subj "/C=RU/ST=Moscow/L=Moscow/O=Social/CN=social.test"

chmod 600 "$SSL_DIR/nginx.key"

echo "SSL certificates generated in $SSL_DIR/"
echo "  - $SSL_DIR/nginx.crt"
echo "  - $SSL_DIR/nginx.key"
