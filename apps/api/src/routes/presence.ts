import { Router } from "express";
import { prisma } from "../db";
import { env } from "../env";
import { getAuthUser, requireAuth, sendProblem } from "./utils";

export const presenceRouter = Router();

presenceRouter.post("/heartbeat", requireAuth, async (req, res) => {
  const user = getAuthUser(req);
  const now = new Date();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastActive: now,
      onlineStatus: true
    },
    select: { id: true }
  });

  return res.json({ ok: true, ttlSeconds: env.ONLINE_TTL_SECONDS });
});

export function isOnline(lastActive: Date | null, ttlSeconds: number): boolean {
  if (!lastActive) return false;
  return Date.now() - lastActive.getTime() <= ttlSeconds * 1000;
}
