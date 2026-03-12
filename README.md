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

## Deployment (Vercel)

This repo is configured to deploy **both**:

- the **frontend** (static build from `artifacts/swachhtrack/dist/public`)
- the **API** (serverless function in `api/index.ts`, mounting the existing Express routes)

via `vercel.json`.

### Steps

1. In Vercel, click **Add New → Project** and import your GitHub repo.
2. In Vercel → **Project Settings → Environment Variables**, set:
   - `DATABASE_URL` (your Postgres connection string; use a hosted Postgres like Neon/Supabase)
   - `JWT_SECRET` (any long random string)
   - `HF_API_TOKEN` (optional, enables Hugging Face classification + fake-image detection)
3. Deploy.
4. Create DB tables (one-time) by running Drizzle push against your hosted DB:

```powershell
$env:DATABASE_URL="<YOUR_HOSTED_DATABASE_URL>"
pnpm -C .\lib\db push
```

Your web app link is the Vercel deployment URL shown in the Vercel dashboard.

