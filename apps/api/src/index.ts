import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import http from "node:http";

import { env } from "./env.js";
import { authRouter } from "./routes/auth.js";
import { helpersRouter } from "./routes/helpers.js";
import { employersRouter } from "./routes/employers.js";
import { jobsRouter } from "./routes/jobs.js";
import { presenceRouter } from "./routes/presence.js";
import { translateRouter } from "./routes/translate.js";
import { attachWebSocket } from "./ws.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN.includes(",") ? env.CORS_ORIGIN.split(",").map((s) => s.trim()) : env.CORS_ORIGIN,
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRouter);
app.use("/helpers", helpersRouter);
app.use("/employers", employersRouter);
app.use("/jobs", jobsRouter);
app.use("/presence", presenceRouter);
app.use("/translate", translateRouter);

app.use((err: any, _req: any, res: any, _next: any) => {
  // Last-resort error boundary
  return res.status(500).json({ ok: false, error: { message: "Internal error" } });
});

const server = http.createServer(app);
attachWebSocket(server);

server.listen(env.PORT, "0.0.0.0", () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://0.0.0.0:${env.PORT}`);
  // eslint-disable-next-line no-console
  console.log(`WS listening on ws://0.0.0.0:${env.PORT}/ws`);
});
