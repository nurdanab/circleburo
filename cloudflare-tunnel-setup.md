# Настройка CloudFlare Tunnel для MinIO

## Шаг 1: Подключитесь к вашему серверу
```bash
ssh user@78.109.18.11
```

## Шаг 2: Установите cloudflared
```bash
# Скачать последнюю версию
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared

# Дать права на выполнение
chmod +x cloudflared

# Переместить в системную папку
sudo mv cloudflared /usr/local/bin/

# Проверить установку
cloudflared --version
```

## Шаг 3: Авторизация в CloudFlare
```bash
cloudflared tunnel login
```
Это откроет URL в терминале. Скопируйте его и откройте в браузере на вашем компьютере.

## Шаг 4: Создать туннель
```bash
# Создать туннель с именем "minio"
cloudflared tunnel create minio

# Запомните Tunnel ID который будет показан!
```

## Шаг 5: Настроить DNS
```bash
# Привязать домен к туннелю
cloudflared tunnel route dns minio minio.circleburo.kz
```

## Шаг 6: Создать конфигурационный файл
```bash
# Создать папку для конфига
sudo mkdir -p /etc/cloudflared

# Создать конфиг (откроется редактор)
sudo nano /etc/cloudflared/config.yml
```

Вставьте в файл (замените TUNNEL_ID на ваш ID из шага 4):
```yaml
tunnel: TUNNEL_ID
credentials-file: /root/.cloudflared/TUNNEL_ID.json

ingress:
  - hostname: minio.circleburo.kz
    service: http://localhost:9000
  - service: http_status:404
```

Сохраните: Ctrl+O, Enter, Ctrl+X

## Шаг 7: Установить как системный сервис
```bash
# Установить как сервис
sudo cloudflared service install

# Запустить сервис
sudo systemctl start cloudflared

# Включить автозапуск
sudo systemctl enable cloudflared

# Проверить статус
sudo systemctl status cloudflared
```

## Шаг 8: Проверить работу
```bash
# Проверить что туннель работает
curl -I https://minio.circleburo.kz/media/videos/motion-circle.mp4
```

Должен вернуть HTTP/2 200

---

## Troubleshooting

Если что-то не работает:

```bash
# Посмотреть логи
sudo journalctl -u cloudflared -f

# Перезапустить сервис
sudo systemctl restart cloudflared

# Проверить что MinIO работает локально
curl -I http://localhost:9000/media/videos/motion-circle.mp4
```

## После успешной настройки

Напишите мне "готово" и я обновлю конфигурацию проекта для использования HTTPS URL!
