# 如何将 SosoHelper 更新推送到宝塔服务器

此项目已配置 Git 联动。目标服务器目录：`/www/wwwroot/sosohelper.com`

## 推送方法

在 VS Code 终端中运行：

```bash
git push production main
```
(注意：这里可能是 `main` 本地分支，如果是旧项目可能是 `master`，请根据当前分支调整)

或者在 VS Code 左侧 Source Control 界面中：
1. 提交更改。
2. 点击 `...` -> `Push to...` -> `production`。

## 注意

这只会同步**源代码**。如果这是一个 Node.js 项目（Next.js/NestJS），同步后您可能需要在宝塔面板中：
1. 打开终端或 Node 项目管理器。
2. 运行安装依赖：`pnpm install` 或 `npm install`。
3. 运行构建：`pnpm build` 或 `npm run build`。
4. 重启服务：`pm2 reload all` 或在宝塔中重启项目。

如果不进行构建和重启，仅仅同步代码是不会生效的。
