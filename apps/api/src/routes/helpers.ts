import { Router } from "express";
import { helperProfileSchema, helperSearchSchema } from "@sosohelper/shared";
import { prisma } from "../db";
import { env } from "../env";
import { isOnline } from "./presence";
import { getAuthUser, requireAuth, requireRole, sendProblem } from "./utils";
import { decryptString, encryptString } from "../crypto";
import { HelperProfileApi, serializeHelperProfile } from "./serializers";

export const helpersRouter = Router();

helpersRouter.get("/me/profile", requireAuth, requireRole("HELPER"), async (req, res) => {
  const user = getAuthUser(req);
  const profile = (await prisma.helperProfile.findUnique({
    where: { userId: user.id },
    include: {
      experienceDetails: { select: { value: true } },
      workedCountries: { select: { value: true } },
      personalityTraits: { select: { value: true } }
    }
  })) as unknown as HelperProfileApi | null;
  return res.json({ ok: true, profile: profile ? serializeHelperProfile(profile) : null });
});

helpersRouter.put("/me/profile", requireAuth, requireRole("HELPER"), async (req, res) => {
  const user = getAuthUser(req);
  const parsed = helperProfileSchema.safeParse(req.body);
  if (!parsed.success) return sendProblem(res, 400, "Invalid input", parsed.error.flatten());

  const data = parsed.data;

  const profile = await prisma.helperProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      photoUrl: data.photoUrl,
      countryOfOrigin: data.countryOfOrigin,
      ageRange: data.ageRange,
      experienceYears: data.experienceYears,
      familySituation: data.familySituation,
      experienceDetails: { createMany: { data: data.experienceDetails.map((v) => ({ value: v })) } },
      workedCountries: { createMany: { data: data.workedCountries.map((v) => ({ value: v })) } },
      personalityTraits: { createMany: { data: data.personalityTraits.map((v) => ({ value: v })) } },
      contractEndDate: new Date(data.contractEndDate),
      availableStartDate: new Date(data.availableStartDate),
      previousContractType: data.previousContractType,
      bio: data.bio || null,
      recommendationLetterUrl: data.recommendationLetterUrl || null,
      facebookProfileLink: data.facebookProfileLink || null,
      cookingPhotosLink: data.cookingPhotosLink || null,
      videosLink: data.videosLink || null
    },
    update: {
      photoUrl: data.photoUrl,
      countryOfOrigin: data.countryOfOrigin,
      ageRange: data.ageRange,
      experienceYears: data.experienceYears,
      familySituation: data.familySituation,
      experienceDetails: {
        deleteMany: {},
        createMany: { data: data.experienceDetails.map((v) => ({ value: v })) }
      },
      workedCountries: {
        deleteMany: {},
        createMany: { data: data.workedCountries.map((v) => ({ value: v })) }
      },
      personalityTraits: {
        deleteMany: {},
        createMany: { data: data.personalityTraits.map((v) => ({ value: v })) }
      },
      contractEndDate: new Date(data.contractEndDate),
      availableStartDate: new Date(data.availableStartDate),
      previousContractType: data.previousContractType,
      bio: data.bio || null,
      recommendationLetterUrl: data.recommendationLetterUrl || null,
      facebookProfileLink: data.facebookProfileLink || null,
      cookingPhotosLink: data.cookingPhotosLink || null,
      videosLink: data.videosLink || null
    },
    include: {
      experienceDetails: { select: { value: true } },
      workedCountries: { select: { value: true } },
      personalityTraits: { select: { value: true } }
    }
  });

  // Store WhatsApp (encrypted) and mark helper as online
  await prisma.user.update({
    where: { id: user.id },
    data: {
      whatsapp: encryptString(data.whatsapp),
      lastActive: new Date(),
      onlineStatus: true
    }
  });

  return res.json({ ok: true, profile: serializeHelperProfile(profile as unknown as HelperProfileApi) });
});

helpersRouter.get("/:userId/profile", requireAuth, requireRole("EMPLOYER"), async (req, res) => {
  const helperId = req.params.userId;

  const helper = await prisma.user.findUnique({
    where: { id: helperId },
    select: {
      id: true,
      role: true,
      lastActive: true,
      onlineStatus: true,
      whatsapp: true,
      helperProfile: {
        include: {
          experienceDetails: { select: { value: true } },
          workedCountries: { select: { value: true } },
          personalityTraits: { select: { value: true } }
        }
      }
    }
  });

  if (!helper || helper.role !== "HELPER") return sendProblem(res, 404, "Helper not found");

  const online = isOnline(helper.lastActive, env.ONLINE_TTL_SECONDS);
  let whatsapp: string | null = null;
  try {
    whatsapp = helper.whatsapp ? decryptString(helper.whatsapp) : null;
  } catch {
    whatsapp = null;
  }
  return res.json({
    ok: true,
    helper: {
      id: helper.id,
      online,
      whatsapp,
      profile: helper.helperProfile ? serializeHelperProfile(helper.helperProfile as unknown as HelperProfileApi) : null
    }
  });
});

function parseStringArray(value: unknown): string[] | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

helpersRouter.get("/search", requireAuth, requireRole("EMPLOYER"), async (req, res) => {
  console.log("GET /search hit", req.query);
  const onlineThreshold = new Date(Date.now() - env.ONLINE_TTL_SECONDS * 1000);
  const input = {
    countryOfOrigin: typeof req.query.countryOfOrigin === "string" ? req.query.countryOfOrigin : undefined,
    ageRange: typeof req.query.ageRange === "string" ? req.query.ageRange : undefined,
    experienceYears: typeof req.query.experienceYears === "string" ? req.query.experienceYears : undefined,
    experienceDetails: parseStringArray(req.query.experienceDetails),
    personalityTraits: parseStringArray(req.query.personalityTraits),
    availableFrom: typeof req.query.availableFrom === "string" ? req.query.availableFrom : undefined,
    availableTo: typeof req.query.availableTo === "string" ? req.query.availableTo : undefined,
    onlineOnly: req.query.onlineOnly
  };

  const parsed = helperSearchSchema.safeParse(input);
  if (!parsed.success) return sendProblem(res, 400, "Invalid filters", parsed.error.flatten());

  const f = parsed.data;

  type HelperSearchRow = {
    id: string;
    lastActive: Date | null;
    onlineStatus: boolean;
    whatsapp: string | null;
    helperProfile: HelperProfileApi | null;
  };

  const andClauses: any[] = [];
  if (f.experienceDetails?.length) {
    for (const v of f.experienceDetails) {
      andClauses.push({ experienceDetails: { some: { value: v } } });
    }
  }
  if (f.personalityTraits?.length) {
    for (const v of f.personalityTraits) {
      andClauses.push({ personalityTraits: { some: { value: v } } });
    }
  }

  const users = (await prisma.user.findMany({
    where: {
      role: "HELPER",
      ...(f.onlineOnly ? { lastActive: { gte: onlineThreshold } } : {}),
      helperProfile: {
        is: {
          ...(f.countryOfOrigin ? { countryOfOrigin: f.countryOfOrigin } : {}),
          ...(f.ageRange ? { ageRange: f.ageRange } : {}),
          ...(f.experienceYears ? { experienceYears: f.experienceYears } : {}),
          ...(andClauses.length ? { AND: andClauses } : {}),
          ...(f.availableFrom || f.availableTo
            ? {
                availableStartDate: {
                  ...(f.availableFrom ? { gte: new Date(f.availableFrom) } : {}),
                  ...(f.availableTo ? { lte: new Date(f.availableTo) } : {})
                }
              }
            : {})
        }
      }
    },
    select: {
      id: true,
      lastActive: true,
      onlineStatus: true,
      whatsapp: true,
      helperProfile: {
        include: {
          experienceDetails: { select: { value: true } },
          workedCountries: { select: { value: true } },
          personalityTraits: { select: { value: true } }
        }
      }
    },
    // Sort by lastActive (TTL-driven online), then stable by updatedAt
    orderBy: [{ lastActive: "desc" }, { updatedAt: "desc" }],
    take: 100
  })) as unknown as HelperSearchRow[];

  const result = users
    .filter((u: HelperSearchRow) => u.helperProfile)
    .map((u: HelperSearchRow) => ({
      id: u.id,
      online: isOnline(u.lastActive, env.ONLINE_TTL_SECONDS),
      whatsapp: (() => {
        try {
          return u.whatsapp ? decryptString(u.whatsapp) : null;
        } catch {
          return null;
        }
      })(),
      profile: serializeHelperProfile(u.helperProfile as HelperProfileApi)
    }));

  console.log("Search returning helpers count:", result.length);
  return res.json({ ok: true, helpers: result });
});
