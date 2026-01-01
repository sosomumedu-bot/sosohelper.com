import { Router } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../db.js";
import { env } from "../env.js";
import { sendProblem } from "./utils.js";
import { encryptString } from "../crypto.js";

export const authRouter = Router();

const signupSchema = z.object({
  role: z.enum(["HELPER", "EMPLOYER"]),
  email: z.string().trim().email(),
  password: z.string().min(8),
  whatsapp: z.string().trim().optional(),
  languagePreference: z.enum(["en", "zh"]).optional()
});

authRouter.post("/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return sendProblem(res, 400, "Invalid input", parsed.error.flatten());

  const { role, email, password, whatsapp, languagePreference } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return sendProblem(res, 409, "Email already registered");

  const passwordHash = await argon2.hash(password);

  const user = await prisma.user.create({
    data: {
      role,
      email,
      passwordHash,
      whatsapp: whatsapp ? encryptString(whatsapp) : null,
      languagePreference: languagePreference || "en"
    },
    select: { id: true, role: true }
  });

  const token = jwt.sign({ role: user.role }, env.JWT_SECRET, { subject: user.id, expiresIn: "14d" });
  return res.json({ ok: true, token, user });
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1)
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return sendProblem(res, 400, "Invalid input", parsed.error.flatten());

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return sendProblem(res, 401, "Invalid credentials");

  const ok = await argon2.verify(user.passwordHash, password);
  if (!ok) return sendProblem(res, 401, "Invalid credentials");

  const token = jwt.sign({ role: user.role }, env.JWT_SECRET, { subject: user.id, expiresIn: "14d" });
  return res.json({ ok: true, token, user: { id: user.id, role: user.role } });
});
