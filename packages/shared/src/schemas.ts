import { z } from "zod";
import {
  AGE_RANGES,
  BOOKMARK_CATEGORIES,
  CONTRACT_TYPES,
  COUNTRIES_OF_ORIGIN,
  EXPERIENCE_DETAILS,
  EXPERIENCE_YEARS,
  FAMILY_SITUATIONS,
  HK_AREAS,
  HOUSE_SIZES,
  JOB_TASKS,
  PERSONALITY_TRAITS,
  WEEK_DAYS,
  WORKED_COUNTRIES
} from "./enums";

export const whatsappSchema = z
  .string()
  .trim()
  // E.164-ish: +852xxxxxxxx, +63..., etc.
  .regex(/^\+[1-9]\d{7,14}$/, "WhatsApp must be in international format like +85291234567");

export const urlOptional = z.string().trim().url().optional().or(z.literal(""));

export const helperProfileSchema = z.object({
  photoUrl: z.string().trim().url(),
  countryOfOrigin: z.enum(COUNTRIES_OF_ORIGIN),
  ageRange: z.enum(AGE_RANGES),
  experienceYears: z.enum(EXPERIENCE_YEARS),
  experienceDetails: z.array(z.enum(EXPERIENCE_DETAILS)).min(1),
  workedCountries: z.array(z.enum(WORKED_COUNTRIES)).min(1),
  familySituation: z.enum(FAMILY_SITUATIONS),
  personalityTraits: z.array(z.enum(PERSONALITY_TRAITS)).min(1),
  whatsapp: whatsappSchema,
  contractEndDate: z.string().date(),
  availableStartDate: z.string().date(),
  previousContractType: z.enum(CONTRACT_TYPES),

  // Optional free text (kept optional to minimize typing)
  bio: z.string().trim().max(800).optional().or(z.literal("")),

  recommendationLetterUrl: z.string().trim().url().optional().or(z.literal("")),
  facebookProfileLink: urlOptional,
  cookingPhotosLink: urlOptional,
  videosLink: urlOptional
});

export const helperSearchSchema = z.object({
  countryOfOrigin: z.enum(COUNTRIES_OF_ORIGIN).optional(),
  ageRange: z.enum(AGE_RANGES).optional(),
  experienceYears: z.enum(EXPERIENCE_YEARS).optional(),
  experienceDetails: z.array(z.enum(EXPERIENCE_DETAILS)).optional(),
  personalityTraits: z.array(z.enum(PERSONALITY_TRAITS)).optional(),
  availableFrom: z.string().date().optional(),
  availableTo: z.string().date().optional(),
  onlineOnly: z.coerce.boolean().optional()
});

export const employerJobSchema = z.object({
  familyComposition: z.object({
    childrenCount: z.number().int().min(0).max(10),
    childrenAgeRanges: z.array(z.enum(["0-2", "3-5", "6-12", "13-17"] as const)).optional().default([])
  }),
  location: z.enum(HK_AREAS),
  houseSize: z.enum(HOUSE_SIZES),
  separateRoom: z.boolean(),
  weeklyOffDays: z.array(z.enum(WEEK_DAYS)).min(1),
  tasks: z.array(z.enum(JOB_TASKS)).min(1),
  whatsapp: whatsappSchema,

  // Optional description to support Translate button
  jobDescription: z.string().trim().max(1200).optional().or(z.literal(""))
});

export const bookmarkSchema = z.object({
  helperUserId: z.string().uuid(),
  category: z.enum(BOOKMARK_CATEGORIES)
});

export const translateSchema = z.object({
  text: z.string().min(1).max(5000),
  target: z.enum(["en", "zh"] as const),
  source: z.enum(["en", "zh"] as const).optional()
});
