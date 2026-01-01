# SosoHelper

Multi-platform platform (Web, WeChat Mini Program, iOS, Android) that connects foreign helpers with Hong Kong employers.

This repo is a **monorepo**:
- `apps/api`: Node.js + Express API (auth, helper profiles, employer jobs, bookmarks, translate, online presence)
- `apps/web`: Next.js web app (mobile-first)
- `apps/mobile`: Expo React Native app (iOS/Android)
- `apps/miniapp`: Taro app (WeChat Mini Program)
- `packages/shared`: Shared enums + Zod validation schemas + types

## Prereqs
- Node.js 20+
- `pnpm`
- Postgres (recommended) or swap DB provider (see `apps/api/prisma/schema.prisma`)

## Quick start (API + Web)
1) Install deps:

```bash
cd SosoHelper
pnpm install
```

2) Configure API env:
- Copy `apps/api/.env.example` to `apps/api/.env`
- Fill values

3) Start Postgres (example using Docker):

```bash
docker compose -f apps/api/docker-compose.yml up -d
```

4) Init DB:

```bash
pnpm --filter @sosohelper/api prisma:generate
pnpm --filter @sosohelper/api db:push
```

5) Run dev servers:

```bash
pnpm --filter @sosohelper/api dev
pnpm --filter @sosohelper/web dev
```

## Development guide (step-by-step)
See `apps/api/DEV_GUIDE.md` for backend-first build order and platform notes.
