export type HelperProfileApi = {
  id: string;
  userId: string;
  photoUrl: string;
  countryOfOrigin: string;
  ageRange: string;
  experienceYears: string;
  experienceDetails: { value: string }[];
  workedCountries: { value: string }[];
  familySituation: string;
  personalityTraits: { value: string }[];
  contractEndDate: Date;
  availableStartDate: Date;
  previousContractType: string;
  bio: string | null;
  recommendationLetterUrl: string | null;
  facebookProfileLink: string | null;
  cookingPhotosLink: string | null;
  videosLink: string | null;
};

export function serializeHelperProfile(profile: HelperProfileApi) {
  return {
    photoUrl: profile.photoUrl,
    countryOfOrigin: profile.countryOfOrigin,
    ageRange: profile.ageRange,
    experienceYears: profile.experienceYears,
    experienceDetails: profile.experienceDetails.map((x) => x.value),
    workedCountries: profile.workedCountries.map((x) => x.value),
    familySituation: profile.familySituation,
    personalityTraits: profile.personalityTraits.map((x) => x.value),
    // Keep date format compatible with shared schema (YYYY-MM-DD)
    contractEndDate: profile.contractEndDate.toISOString().slice(0, 10),
    availableStartDate: profile.availableStartDate.toISOString().slice(0, 10),
    previousContractType: profile.previousContractType,
    bio: profile.bio ?? "",
    recommendationLetterUrl: profile.recommendationLetterUrl ?? "",
    facebookProfileLink: profile.facebookProfileLink ?? "",
    cookingPhotosLink: profile.cookingPhotosLink ?? "",
    videosLink: profile.videosLink ?? ""
  };
}
