import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../env";

export type AuthUser = { id: string; role: "HELPER" | "EMPLOYER" };

export function sendProblem(res: Response, status: number, message: string, details?: unknown) {
  return res.status(status).json({ ok: false, error: { message, details } });
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.header("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;
  if (!token) return sendProblem(res, 401, "Missing bearer token");

  try {
    console.log("Verifying token with secret starting:", env.JWT_SECRET.slice(0, 5));
    const payload = jwt.verify(token, env.JWT_SECRET);
    const parsed = z
      .object({ sub: z.string().uuid(), role: z.enum(["HELPER", "EMPLOYER"]) })
      .parse(payload);
    (req as any).user = { id: parsed.sub, role: parsed.role } satisfies AuthUser;
    return next();
  } catch (e) {
    console.error("Auth failed:", e);
    return sendProblem(res, 401, "Invalid token");
  }
}

export function requireRole(role: AuthUser["role"]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as AuthUser | undefined;
    if (!user) return sendProblem(res, 401, "Not authenticated");
    if (user.role !== role) return sendProblem(res, 403, `Requires role ${role}`);
    return next();
  };
}

export function getAuthUser(req: Request): AuthUser {
  const user = (req as any).user as AuthUser | undefined;
  if (!user) throw new Error("Auth user missing");
  return user;
}
