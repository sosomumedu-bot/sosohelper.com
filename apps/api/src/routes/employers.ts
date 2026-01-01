import { Router } from "express";
import { bookmarkSchema, employerJobSchema } from "@sosohelper/shared";
import { prisma } from "../db";
import { getAuthUser, requireAuth, requireRole, sendProblem } from "./utils";
import { encryptString } from "../crypto";

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
  const bookmarks = await prisma.bookmark.findMany({
    where: { employerId: user.id },
    include: {
      helper: { select: { id: true, helperProfile: true, lastActive: true, onlineStatus: true } }
    },
    orderBy: { updatedAt: "desc" }
  });
  return res.json({ ok: true, bookmarks });
});

employersRouter.delete("/me/bookmarks/:helperUserId", requireAuth, requireRole("EMPLOYER"), async (req, res) => {
  const user = getAuthUser(req);
  const helperUserId = req.params.helperUserId;

  await prisma.bookmark.delete({
    where: { employerId_helperId: { employerId: user.id, helperId: helperUserId } }
  });

  return res.json({ ok: true });
});
