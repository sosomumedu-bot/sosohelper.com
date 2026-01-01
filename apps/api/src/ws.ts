import type http from "node:http";
import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "./env";
import { prisma } from "./db";

const authPayloadSchema = z.object({ sub: z.string().uuid(), role: z.enum(["HELPER", "EMPLOYER"]) });

export function attachWebSocket(server: http.Server) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (socket) => {
    let userId: string | null = null;

    socket.on("message", async (raw) => {
      try {
        const msg = JSON.parse(raw.toString());

        if (msg?.type === "auth" && typeof msg?.token === "string") {
          const payload = jwt.verify(msg.token, env.JWT_SECRET);
          const parsed = authPayloadSchema.parse(payload);
          userId = parsed.sub;

          await prisma.user.update({ where: { id: userId }, data: { onlineStatus: true, lastActive: new Date() } });

          socket.send(JSON.stringify({ type: "auth:ok" }));
          return;
        }

        if (msg?.type === "heartbeat" && userId) {
          await prisma.user.update({ where: { id: userId }, data: { onlineStatus: true, lastActive: new Date() } });
          socket.send(JSON.stringify({ type: "heartbeat:ok" }));
        }
      } catch {
        socket.send(JSON.stringify({ type: "error", message: "Bad message" }));
      }
    });

    socket.on("close", async () => {
      if (!userId) return;
      // Don't force offline; TTL-based online is more reliable.
      await prisma.user.update({ where: { id: userId }, data: { onlineStatus: false } });
    });
  });

  return wss;
}
