import crypto from "node:crypto";
import { env } from "./env";

function getKey(): Buffer {
  // Accept raw text or base64; base64 recommended.
  // If it's not valid base64, treat as utf8.
  const maybeB64 = env.DATA_ENCRYPTION_KEY;
  const buf = Buffer.from(maybeB64, "base64");
  if (buf.length === 32) return buf;

  const utf8 = Buffer.from(maybeB64, "utf8");
  if (utf8.length === 32) return utf8;

  throw new Error("DATA_ENCRYPTION_KEY must be 32 bytes (base64 or raw)");
}

export function encryptString(plain: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64")}.${tag.toString("base64")}.${ciphertext.toString("base64")}`;
}

export function decryptString(enc: string): string {
  const key = getKey();
  const [ivB64, tagB64, ctB64] = enc.split(".");
  if (!ivB64 || !tagB64 || !ctB64) throw new Error("Bad ciphertext format");
  const iv = Buffer.from(ivB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const ciphertext = Buffer.from(ctB64, "base64");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plain.toString("utf8");
}
