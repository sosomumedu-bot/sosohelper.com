# SosoHelper development guide

This guide is backend-first because everything else (web/mobile/miniapp) depends on the same API + schema.

## 1) Backend: API + Database

### 1.1 Start database

This repo originally started with Postgres, but **BaoTa MySQL 8.0** is a great long-term choice for WordPress+BaoTa servers.

If you use **BaoTa MySQL**:
- Create a database in BaoTa (Database → Add) e.g. `sosohelper`
- Create a user and grant privileges to that DB

If you use **Postgres** (optional):
From `apps/api/`:

```bash
docker compose up -d
```

### 1.2 Configure env
Copy `apps/api/.env.example` → `apps/api/.env` and set:
- `JWT_SECRET`: >= 16 chars
- `DATA_ENCRYPTION_KEY`: 32 bytes (base64 recommended)
- `DATABASE_URL`: points to your database (MySQL or Postgres)

### 1.3 Install deps + init Prisma
From repo root:

```bash
pnpm install
pnpm --filter @sosohelper/api prisma:generate
pnpm --filter @sosohelper/api db:push
```

### 1.4 Run API

```bash
pnpm --filter @sosohelper/api dev
```

Health check:
- `GET http://localhost:4000/health`

## 2) Auth flow (current MVP)

- `POST /auth/signup` with `{ role, email, password }`
- `POST /auth/login` returns a JWT
- Paste the JWT into the web/mobile shells (this is intentionally simple for now).

## 3) Helper profile

Helpers (role `HELPER`):
- `PUT /helpers/me/profile` (validated by shared Zod schema)
- `GET /helpers/me/profile`

## 4) Employer: Search helpers (online-first ranking)

Employers (role `EMPLOYER`):
- `GET /helpers/search?...`

Sorting:
1) `onlineStatus` (true first)
2) `lastActive` (most recent first)

Online is refreshed via:
- `POST /presence/heartbeat` (recommended every 30–60 seconds)
- or WS `/ws` messages (see `apps/api/src/ws.ts`)

## 5) Employer: Jobs + Bookmarks

- `POST /employers/me/jobs`
- `GET /employers/me/jobs`
- Helpers can view jobs: `GET /jobs`

Bookmarks:
- `PUT /employers/me/bookmarks` (category: Contacted / Under Review / Favorite)
- `GET /employers/me/bookmarks`

## 6) Translation

- `POST /translate` with `{ text, target }`
- Configure `GOOGLE_TRANSLATE_API_KEY` in `apps/api/.env`.

The web form includes a Translate button for optional free text fields.

## 7) Web app

From repo root:

```bash
pnpm --filter @sosohelper/web dev
```

Set `apps/web/.env.local` from `.env.example` if needed.

## 8) Mobile app (Expo)

From repo root:

```bash
pnpm --filter @sosohelper/mobile dev
```

Set `apps/mobile/.env` if needed.

## 9) WeChat Mini Program (Taro)

From repo root:

```bash
pnpm --filter @sosohelper/miniapp dev:weapp
```

Then import `apps/miniapp/dist` into WeChat DevTools.

## Production notes / challenges

- WhatsApp verification: needs a provider (Twilio WhatsApp / Meta Cloud API). Current MVP uses email+password.
- Uploads: for production use S3/GCS + signed URLs + malware scanning; avoid direct uploads to API servers.
- Data protection: encrypt/limit access to WhatsApp numbers; implement consent + retention policies.
- Scalability: add pagination + indexes; use CDN for photos; rate-limit login/search.
- Offline support: mobile shell caches last job list via AsyncStorage; extend similarly for helper cards.

---

# 宝塔（BT 面板）部署（零基础步骤）

下面步骤假设你已经有宝塔 + Nginx（WordPress 继续正常运行），并且你要把 SosoHelper 当成“独立网站 + 独立 API”部署。

## A. 先搞清楚：你不需要在宝塔装 GitLab

宝塔软件商店里你看到的：Gitlab 中文社区版 / gitlab_ce / gogs / gh_proxy 都是“自建代码托管平台/代理”，不是你电脑上常说的“git 命令”。

零基础建议：先不用 Git，直接用宝塔文件管理器上传代码压缩包即可。

如果你以后想用 git clone：需要在服务器系统里安装 git（SSH 执行）：
- Debian/Ubuntu：`apt update && apt install -y git`
- CentOS/RHEL：`yum install -y git`

## B. 推荐的域名规划（不影响 WordPress）

- WordPress：保持原域名不变
- SosoHelper Web（Next.js）：建议用二级域名，例如 `sosohelper.你的域名`
- SosoHelper API（Express）：建议用二级域名，例如 `api.sosohelper.你的域名`

## C. 上传代码到服务器

1) 在宝塔：文件 → 进入 `/www/wwwroot/`
2) 新建目录：`/www/wwwroot/sosohelper/`
3) 把本地的 `SosoHelper` 文件夹打包成 zip（只要 monorepo 这一层即可）
4) 宝塔文件管理器上传 zip 到 `/www/wwwroot/sosohelper/`
5) 在宝塔里解压

最终目录形态应该类似：
- `/www/wwwroot/sosohelper/apps/api`
- `/www/wwwroot/sosohelper/apps/web`
- `/www/wwwroot/sosohelper/packages/shared`

## D. 数据库（Postgres）

本项目当前默认使用 PostgreSQL（Prisma schema 里写死了）。零基础最省事的做法是：用 Docker 跑一个 Postgres。

1) 宝塔软件商店安装：Docker 管理器（如果没有 Docker，请先装这个）
2) SSH 进入：`/www/wwwroot/sosohelper/apps/api`
3) 启动 Postgres：`docker compose up -d`

如果你坚持只用宝塔 MySQL，需要把 Prisma 改成 MySQL（需要改代码/迁移）。

## E. 配置环境变量（必须）

### E1) API 环境变量

1) 复制 `/www/wwwroot/sosohelper/apps/api/.env.example` 为 `/www/wwwroot/sosohelper/apps/api/.env`
2) 编辑 `.env`：
- `JWT_SECRET`：至少 16 位
- `DATA_ENCRYPTION_KEY`：32 bytes（推荐 base64）
  生成示例：`node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- `DATABASE_URL`：指向你的 Postgres
- `CORS_ORIGIN`：填你的 Web 域名，例如 `https://sosohelper.你的域名`

### E2) Web 环境变量

1) 复制 `/www/wwwroot/sosohelper/apps/web/.env.example` 为 `/www/wwwroot/sosohelper/apps/web/.env.local`
2) 设置 `NEXT_PUBLIC_API_URL=https://api.sosohelper.你的域名`

## F. 安装依赖 + 初始化数据库

1) SSH 进入 `/www/wwwroot/sosohelper`
2) 安装依赖：`corepack pnpm install`
3) Prisma 生成客户端：`corepack pnpm --filter @sosohelper/api prisma:generate`
4) 创建/更新表结构：`corepack pnpm --filter @sosohelper/api db:push`

## G. 用 PM2 启动（生产方式）

### G1) 构建

- API 构建：`corepack pnpm --filter @sosohelper/api build`
- Web 构建：`corepack pnpm --filter @sosohelper/web build`

### G2) 启动 API（端口 4000）

在 `/www/wwwroot/sosohelper/apps/api`：

`pm2 start dist/index.js --name soso-api --cwd /www/wwwroot/sosohelper/apps/api`

### G3) 启动 Web（端口 3000）

在 `/www/wwwroot/sosohelper`：

`pm2 start "corepack pnpm --filter @sosohelper/web start" --name soso-web --cwd /www/wwwroot/sosohelper`

保存并设置开机自启（按 pm2 输出提示执行）：
- `pm2 save`
- `pm2 startup`

## H. 宝塔 Nginx 反向代理（让外网访问）

你需要创建两个站点并开启 SSL：

1) 站点一：`sosohelper.你的域名`
	- 反向代理 → 目标 URL：`http://127.0.0.1:3000`

2) 站点二：`api.sosohelper.你的域名`
	- 反向代理 → 目标 URL：`http://127.0.0.1:4000`

建议：不要在安全组/防火墙对外开放 3000/4000，只开放 80/443。

## I. 验证

1) 浏览器打开 `https://api.sosohelper.你的域名/health` 应该返回 `{ ok: true }`
2) 浏览器打开 `https://sosohelper.你的域名` 应该能看到首页

