import { z } from "zod";
import { bookmarkSchema, employerJobSchema, helperProfileSchema, helperSearchSchema, translateSchema } from "./schemas";

export type HelperProfileInput = z.infer<typeof helperProfileSchema>;
export type HelperSearchInput = z.infer<typeof helperSearchSchema>;
export type EmployerJobInput = z.infer<typeof employerJobSchema>;
export type BookmarkInput = z.infer<typeof bookmarkSchema>;
export type TranslateInput = z.infer<typeof translateSchema>;
