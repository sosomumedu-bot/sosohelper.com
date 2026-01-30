import { Router } from "express";
import { bookmarkSchema, employerJobSchema } from "@sosohelper/shared";
import { prisma } from "../db";
import { env } from "../env";
import { getAuthUser, requireAuth, requireRole, sendProblem } from "./utils";
import { decryptString, encryptString } from "../crypto";
import { isOnline } from "./presence";
import { HelperProfileApi, serializeHelperProfile } from "./serializers";

export const employersRouter = Router();

// Jobs
employersRouter.post("/me/jobs", requireAuth, requireRole("EMPLOYER"), async (req, res) => {
  const user = getAuthUser(req);
  const parsed = employerJobSchema.safeParse(req.body);
  if (!parsed.success) return sendProblem(res, 400, "Invalid input", parsed.error.flatten());

  const data = parsed.data;

  const job = await prisma.employerJob.create({
    data: {
      userId: user.id,
      familyComposition: data.familyComposition,
      location: data.location,
      houseSize: data.houseSize,
      separateRoom: data.separateRoom,
      weeklyOffDays: data.weeklyOffDays,
      tasks: data.tasks,
      whatsapp: encryptString(data.whatsapp),
      jobDescription: data.jobDescription || null
    }
  });

  return res.json({ ok: true, job });
});

employersRouter.get("/me/jobs", requireAuth, requireRole("EMPLOYER"), async (req, res) => {
  const user = getAuthUser(req);
  const jobs = await prisma.employerJob.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
  return res.json({ ok: true, jobs });
});

// Bookmarks
employersRouter.put("/me/bookmarks", requireAuth, requireRole("EMPLOYER"), async (req, res) => {
  const user = getAuthUser(req);
  const parsed = bookmarkSchema.safeParse(req.body);
  if (!parsed.success) return sendProblem(res, 400, "Invalid input", parsed.error.flatten());

  const { helperUserId, category } = parsed.data;

  const helper = await prisma.user.findUnique({ where: { id: helperUserId }, select: { role: true } });
  if (!helper || helper.role !== "HELPER") return sendProblem(res, 404, "Helper not found");

  const mappedCategory =
    category === "Contacted" ? "CONTACTED" : category === "Under Review" ? "UNDER_REVIEW" : "FAVORITE";

  const bookmark = await prisma.bookmark.upsert({
    where: { employerId_helperId: { employerId: user.id, helperId: helperUserId } },
    create: { employerId: user.id, helperId: helperUserId, category: mappedCategory },
    update: { category: mappedCategory }
  });

  return res.json({ ok: true, bookmark });
});

employersRouter.get("/me/bookmarks", requireAuth, requireRole("EMPLOYER"), async (req, res) => {
  const user = getAuthUser(req);
  type BookmarkRow = {
    helperId: string;
    category: string;
    helper: {
      id: string;
      lastActive: Date | null;
      whatsapp: string | null;
      helperProfile: HelperProfileApi | null;
    };
  };

  const bookmarks = (await prisma.bookmark.findMany({
    where: { employerId: user.id },
    include: {
      helper: {
        select: {
          id: true,
          lastActive: true,
          whatsapp: true,
          helperProfile: {
            include: {
              experienceDetails: { select: { value: true } },
              workedCountries: { select: { value: true } },
              personalityTraits: { select: { value: true } }
            }
          }
        }
      }
    },
    orderBy: { updatedAt: "desc" }
  })) as unknown as BookmarkRow[];

  const formatted = bookmarks
    .filter((b) => b.helper?.helperProfile)
    .map((b) => {
      const helper = b.helper;
      const online = isOnline(helper.lastActive, env.ONLINE_TTL_SECONDS);
      let whatsapp: string | null = null;
      try {
        whatsapp = helper.whatsapp ? decryptString(helper.whatsapp) : null;
      } catch {
        whatsapp = null;
      }

      return {
        ...b,
        helper: {
          id: helper.id,
          online,
          whatsapp,
          profile: serializeHelperProfile(helper.helperProfile as HelperProfileApi)
        }
      };
    });

  return res.json({ ok: true, bookmarks: formatted });
});

employersRouter.delete("/me/bookmarks/:helperUserId", requireAuth, requireRole("EMPLOYER"), async (req, res) => {
  const user = getAuthUser(req);
  const helperUserId = req.params.helperUserId;

  await prisma.bookmark.delete({
    where: { employerId_helperId: { employerId: user.id, helperId: helperUserId } }
  });

  return res.json({ ok: true });
});
