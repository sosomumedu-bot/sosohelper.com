import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().default(4000),
  JWT_SECRET: z.string().min(16),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  ONLINE_TTL_SECONDS: z.coerce.number().int().default(180),
  DATABASE_URL: z.string().min(1),
  DATA_ENCRYPTION_KEY: z.string().min(32),
  GOOGLE_TRANSLATE_API_KEY: z.string().optional()
});

export const env = envSchema.parse(process.env);
