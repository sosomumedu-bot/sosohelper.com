export const COUNTRIES_OF_ORIGIN = [
  "Philippines",
  "Indonesia",
  "Thailand",
  "Sri Lanka",
  "Nepal",
  "Vietnam",
  "Myanmar",
  "Other"
] as const;
export type CountryOfOrigin = (typeof COUNTRIES_OF_ORIGIN)[number];

export const AGE_RANGES = ["18-25", "26-35", "36-45", "46-55", "56+"] as const;
export type AgeRange = (typeof AGE_RANGES)[number];

export const EXPERIENCE_YEARS = ["0-1", "2-3", "4-5", "6-8", "9+"] as const;
export type ExperienceYears = (typeof EXPERIENCE_YEARS)[number];

export const EXPERIENCE_DETAILS = [
  "Childcare",
  "Elderly care",
  "Cooking",
  "Cleaning",
  "Driving",
  "Gardening"
] as const;
export type ExperienceDetail = (typeof EXPERIENCE_DETAILS)[number];

export const WORKED_COUNTRIES = [
  "Hong Kong",
  "Singapore",
  "UAE",
  "Saudi Arabia",
  "Qatar",
  "Malaysia",
  "Taiwan",
  "Other"
] as const;
export type WorkedCountry = (typeof WORKED_COUNTRIES)[number];

export const FAMILY_SITUATIONS = [
  "Single",
  "Married",
  "Married with children",
  "Single parent"
] as const;
export type FamilySituation = (typeof FAMILY_SITUATIONS)[number];

export const PERSONALITY_TRAITS = [
  "Friendly",
  "Hardworking",
  "Patient",
  "Honest",
  "Calm",
  "Good with kids",
  "Good with elderly"
] as const;
export type PersonalityTrait = (typeof PERSONALITY_TRAITS)[number];

export const CONTRACT_TYPES = ["Finished Contract", "Break Contract"] as const;
export type ContractType = (typeof CONTRACT_TYPES)[number];

export const HK_AREAS = ["Central", "Kowloon", "New Territories", "Hong Kong Island", "Other"] as const;
export type HkArea = (typeof HK_AREAS)[number];

export const HOUSE_SIZES = ["Small", "Medium", "Large"] as const;
export type HouseSize = (typeof HOUSE_SIZES)[number];

export const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
] as const;
export type WeekDay = (typeof WEEK_DAYS)[number];

export const JOB_TASKS = [
  "Housework",
  "Childcare",
  "Elderly care",
  "Driving",
  "Gardening"
] as const;
export type JobTask = (typeof JOB_TASKS)[number];

export const BOOKMARK_CATEGORIES = ["Contacted", "Under Review", "Favorite"] as const;
export type BookmarkCategory = (typeof BOOKMARK_CATEGORIES)[number];
