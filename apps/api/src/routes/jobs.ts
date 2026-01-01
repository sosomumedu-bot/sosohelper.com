import { Router } from "express";
import { prisma } from "../db";
import { requireAuth, requireRole } from "./utils";
import { decryptString } from "../crypto";

export const jobsRouter = Router();

// Visible to helpers (so they can WhatsApp the employer)
jobsRouter.get("/", requireAuth, requireRole("HELPER"), async (req, res) => {
  type JobRow = {
    id: string;
    familyComposition: unknown;
    location: string;
    houseSize: string;
    separateRoom: boolean;
    weeklyOffDays: string[];
    tasks: string[];
    whatsapp: string;
    jobDescription: string | null;
    createdAt: Date;
  };

  const jobs = (await prisma.employerJob.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      familyComposition: true,
      location: true,
      houseSize: true,
      separateRoom: true,
      weeklyOffDays: true,
      tasks: true,
      whatsapp: true,
      jobDescription: true,
      createdAt: true
    }
  })) as unknown as JobRow[];

  const decrypted = jobs.map((j: JobRow) => {
    let whatsapp = j.whatsapp;
    try {
      whatsapp = decryptString(j.whatsapp);
    } catch {
      // fall back to stored value
    }
    return { ...j, whatsapp };
  });
  return res.json({ ok: true, jobs: decrypted });
});
