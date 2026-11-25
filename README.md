# anxin-starter — 安心行 車行專案範本

新的車行／派車專案從這裡開始。照著用，外觀、元件、架構就會跟其他安心行專案一致。
完整規範：[安心行 車行全局設計規範](https://claude.ai/artifact/3Qz41buLMzSVxdEz6GLt7j)

## 內容

```
tokens/                 共用設計 token（唯一來源）
  tokens.css            CSS 變數：品牌、中性、語意、車趟狀態、字型、圓角
  tailwind-preset.js    Tailwind 3 舊專案用
  tokens.ts             Expo / React Native 用
  app_tokens.dart       Flutter 用
frontend/               React 19 + TS + Vite 6 + Tailwind 4 + shadcn/ui 風格元件
  src/styles/brand.css  ← 新專案只改這裡的品牌色
  src/components/ui/    基礎元件（Button、Card、Input、Field、Table、Dialog）
  src/components/       AppShell、Feedback（toast / confirm）、StatusChip
  src/api/              每個資源一個檔，共用 lib/api.ts
  src/pages/            登入、車趟列表、元件範例
backend/                FastAPI + SQLAlchemy 2 async + Alembic + uv + PyJWT
  app/api/v1/           每個資源一個 router
  app/api/deps.py       登入、權限、車行範圍（多租戶）
  app/core/             config、database、security
  app/models/           一張表一個檔
  app/schemas/ services/
docker-compose.yml      開發用 Postgres + Redis
docker-compose.prod.yml 正式環境
deploy.sh               部署到 vps156（含遷移、映像確認、健康檢查）
.github/workflows/ci.yml
```

## 開新專案

1. 複製整個資料夾（不含 `node_modules`、`.venv`），改名後 `git init`。
2. 全域把 `anxin-starter` 換成新專案名（`docker-compose*.yml`、`deploy.sh`、兩個 `package.json`／`pyproject.toml`）。
3. 改 `docker-compose.yml` 的對外 port，避免跟其他專案撞；同步改 `backend/.env.example`。
4. 改 `frontend/src/styles/brand.css` 的 `--brand`、`--cta`，以及 `AppShell.tsx` 的 `APP_NAME`、`NAV`。
5. 換掉 `public/favicon.svg`。
6. 刪掉範例的 `Trip`（model、schema、service、router、前端 TripsPage），或改成自己的業務表。

## 本機開發

```bash
docker compose up -d                      # Postgres :5442、Redis :6389
cd backend
cp .env.example .env
uv sync
uv run alembic upgrade head
uv run python -m scripts.seed_demo        # 示範帳號 demo / demo1234
uv run uvicorn app.main:app --reload      # :8000

cd ../frontend
npm install
npm run dev                               # :5173，/api 自動轉到 :8000
```

先打開「元件範例」頁確認品牌色和元件長相。

## 檢查

```bash
cd backend  && uv run ruff check . && uv run ruff format --check . && uv run pytest
cd frontend && npm run lint && npm test && npm run build
```

## 規則摘要

- 顏色只用 token：`bg-brand`、`text-danger`、`bg-trip-departed-soft`…，頁面不寫 `#hex` 或 `blue-600`。
- 車趟狀態一律用 `<StatusChip status="departed" />`；狀態名稱前後端與司機 App 一致：assigned／departed／onboard／done／alert。
- 通知與確認只用 `toast.success()`、`await confirm({...})`（`components/Feedback.tsx`）。
- 強調色叫 `cta`（不叫 accent，因為 shadcn 的 accent 是 hover 淺底）。用 shadcn CLI 加元件時，`primary`、`muted`、`destructive` 等名稱已對到 token。
- API：`/api/v1/<複數資源>`、JSON snake_case、錯誤 `{ "detail": "中文訊息" }`、列表 `{ items, total }` 搭配 `limit`／`offset`／`q`。
- 時間存 UTC、傳 ISO 8601 含時區，顯示用台北時區（`lib/format.ts`）。
- 多租戶：業務表掛 `carrier_id`（`CarrierScopedMixin`），業務 API 用 `CurrentCarrier` 拿車行並放進每個查詢。
- SSE／長連線端點不要一直持有資料庫 session（wherecar-hub 曾因此連線池耗盡）。
- 正式環境沒設 `JWT_SECRET` 會拒絕啟動。

## 舊專案套用 token

Tailwind 3 專案：把 `tokens/` 複製進去，`index.css` 最上方 `@import './tokens/tokens.css'`，
`tailwind.config.js` 加 `presets: [require('./tokens/tailwind-preset.js')]`（ESM 用 import），再覆寫 `--brand`／`--cta`。
之後改到哪個頁面，就把那頁的寫死顏色換成 token。
