# SosoHelper Structure Documentation

本文档专为 AI Agent 设计，用于快速理解 SosoHelper (Monorepo) 项目的结构。

## 1. 核心架构

这是一个基于 pnpm workspace 的 Monorepo 项目，服务于多平台（Web, 小程序, App）。

*   **包管理器**: pnpm
*   **启动命令**: `pnpm dev` (根目录) -> 同时启动 API 和 Web
*   **数据库**: PostgreSQL (Prisma ORM)

## 2. 应用目录 (Apps)
路径: `apps/`

### A. `apps/api` (后端核心)
*   **技术栈**: Node.js, Express, Prisma.
*   **端口**: 4000
*   **关键文件**:
    *   `prisma/schema.prisma`: 数据库模型定义。
    *   `src/routes/`: API 路由定义。
    *   `src/services/`: 业务逻辑。

### B. `apps/web` (Web 前端)
*   **技术栈**: Next.js (React).
*   **端口**: 3001
*   **描述**: SosoHelper 的 Web 界面，采用 Mobile-first 设计。
*   **关键依赖**: 调用 `apps/api` 提供的接口。

### C. 其他端
*   `apps/miniapp`: 微信小程序 (Taro).
*   `apps/mobile`: iOS/Android App (React Native Expo).

## 3. 共享包 (Packages)
路径: `packages/`

*   **`packages/shared`**:
    *   被 `apps/` 下的多个项目共同引用。
    *   包含：TypeScript 类型定义 (Types), Zod 验证 Schema, 共享枚举 (Enums)。
    *   **注意**: 修改这里的代码会影响所有端。

## 4. Agent 工作指南
*   **新增 API 接口**:
    1.  在 `packages/shared` 定义请求/响应类型。
    2.  在 `apps/api/src/routes` 添加路由。
    3.  在 `apps/api/src/services` 实现逻辑。
*   **修改数据库**:
    1.  修改 `apps/api/prisma/schema.prisma`。
    2.  运行 `pnpm --filter @sosohelper/api prisma:generate`。