import { Router } from "express";
import fetch from "node-fetch";
import { translateSchema } from "@sosohelper/shared";
import { env } from "../env";
import { sendProblem } from "./utils";

export const translateRouter = Router();

translateRouter.post("/", async (req, res) => {
  const parsed = translateSchema.safeParse(req.body);
  if (!parsed.success) return sendProblem(res, 400, "Invalid input", parsed.error.flatten());

  if (!env.GOOGLE_TRANSLATE_API_KEY) {
    return sendProblem(res, 501, "Translation not configured", {
      hint: "Set GOOGLE_TRANSLATE_API_KEY in apps/api/.env"
    });
  }

  const { text, target, source } = parsed.data;

  const params = new URLSearchParams();
  params.set("q", text);
  params.set("target", target);
  if (source) params.set("source", source);
  params.set("key", env.GOOGLE_TRANSLATE_API_KEY);

  const r = await fetch(`https://translation.googleapis.com/language/translate/v2?${params.toString()}`);
  if (!r.ok) {
    const body = await r.text();
    return sendProblem(res, 502, "Translate API error", { status: r.status, body });
  }

  const json = (await r.json()) as any;
  const translatedText = json?.data?.translations?.[0]?.translatedText;
  if (typeof translatedText !== "string") return sendProblem(res, 502, "Unexpected translate response");

  return res.json({ ok: true, translatedText });
});
