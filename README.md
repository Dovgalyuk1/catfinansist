# CATFINANSIST — $CATFIN

Статический сайт (HTML/CSS/JS, без сборки) под мем-токен $CATFIN.

## Деплой
Просто залить содержимое папки как статические файлы (GitHub → Vercel: Import repo, Vercel сам определит статический сайт, build command не нужен).

## Что вписать при запуске
Открой `script.js`, объект `CONFIG` в начале файла:
- `CA` — контракт токена (как заминтите)
- `CHAIN` — сеть (для DexScreener)
- `CHART_URL`, `BUY_URL`, `X_URL`, `TELEGRAM_URL` — реальные ссылки

Всё остальное (копирование CA, live-цена/капа/объём/изменение с DexScreener) подключится само.
