# Smart Swachh Track (prototype)

This repository contains a Vite/React prototype (`artifacts/swachhtrack`) and an Express + Drizzle (Postgres) backend (`artifacts/api-server`) generated from the OpenAPI spec in `lib/api-spec/openapi.yaml`.

## Backend (API server)

### Prerequisites

- Node.js + `pnpm`
- Docker Desktop (for local Postgres)

### 1) Start Postgres

```bash
docker compose up -d
```

### 2) Configure environment

Copy `.env.example` to `.env` and adjust if needed:

- `PORT` (default `3001`)
- `DATABASE_URL` (default `postgres://swachh:swachh@localhost:5432/swachhtrack`)
- `JWT_SECRET` (required for `/api/auth/*`)
- `HF_API_TOKEN` (optional, enables Hugging Face vision models)
- `HF_WASTE_MODEL` (optional, defaults to `prithivMLmods/Augmented-Waste-Classifier-SigLIP2`)
- `HF_FAKE_IMAGE_MODEL` (optional, defaults to `capcheck/ai-image-detection`)
- `HF_FAKE_IMAGE_THRESHOLD` (optional, defaults to `0.8`)

### 3) Install dependencies

```bash
pnpm install
```

### 4) Create tables (Drizzle)

PowerShell example:

```powershell
$env:DATABASE_URL="postgres://swachh:swachh@localhost:5432/swachhtrack"
pnpm -C .\lib\db push
```

### 5) Run the API server

PowerShell example:

```powershell
$env:PORT="3001"
$env:DATABASE_URL="postgres://swachh:swachh@localhost:5432/swachhtrack"
$env:JWT_SECRET="dev-secret"
pnpm -C .\artifacts\api-server dev
```

API base path is `http://localhost:3001/api`.

## Database notes

- The backend uses **Postgres** via Drizzle (`lib/db`).
- Tables are defined in `lib/db/src/schema/*`.
- To apply schema changes locally, re-run `pnpm -C .\lib\db push`.

### Quick API smoke test (optional)

PowerShell (Windows) examples.

Signup:

```powershell
curl.exe -X POST "http://localhost:3001/api/auth/signup" `
  -H "content-type: application/json" `
  -d '{"name":"Test User","email":"test@example.com","phone":"9999999999","password":"test1234","city":"Mumbai"}'
```

Classify + verify (paste the returned `sessionId` and `user.id`):

```powershell
curl.exe -X POST "http://localhost:3001/api/waste/classify" `
  -H "content-type: application/json" `
  -d '{"imageBase64":"data:image/png;base64,AAAA","userId":"<userId>"}'

curl.exe -X POST "http://localhost:3001/api/waste/verify" `
  -H "content-type: application/json" `
  -d '{"sessionId":"<sessionId>","imageBase64":"data:image/png;base64,BBBB","userId":"<userId>"}'
```

## Frontend (prototype UI)

```bash
pnpm -C artifacts/swachhtrack dev
```

> Note: the `Auth` page now calls the real backend endpoints (`/api/auth/signup`, `/api/auth/login`).

## Deployment (single-service)

The API server can also serve the frontend in production (one deployable web service + one Postgres database).

- **Build**: build frontend (`artifacts/swachhtrack`) and backend (`artifacts/api-server`)
- **Run**: start the API server with `NODE_ENV=production` (it will serve the built UI)

### Deploy on Render (recommended)

This repo includes `render.yaml` (Blueprint) and a `Dockerfile`.

- Push this repo to GitHub.
- In Render, choose **New → Blueprint** and select your repo.
- Render will create:
  - a web service (Docker)
  - a Postgres database
- After deploy finishes, your **deployable link** is the Render web service URL (shown in the dashboard).

Environment variables required at runtime:

- `DATABASE_URL` (Render sets this automatically via the Blueprint)
- `JWT_SECRET` (Render generates this via the Blueprint)
- `HF_API_TOKEN` (set this in Render to enable ML classification + fake-image detection)

