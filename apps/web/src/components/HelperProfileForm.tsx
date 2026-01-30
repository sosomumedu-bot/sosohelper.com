"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AGE_RANGES,
  CONTRACT_TYPES,
  COUNTRIES_OF_ORIGIN,
  EXPERIENCE_DETAILS,
  EXPERIENCE_YEARS,
  FAMILY_SITUATIONS,
  PERSONALITY_TRAITS,
  WORKED_COUNTRIES,
  helperProfileSchema
} from "@sosohelper/shared";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { TranslateButton } from "./TranslateButton";
import { apiFetch } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof helperProfileSchema>;

function CheckboxGroup({
  name,
  options,
  values,
  onChange
}: {
  name: string;
  options: readonly string[];
  values: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt) => {
        const checked = values.includes(opt);
        return (
          <label key={opt} className="flex items-center gap-2 rounded border p-2 text-sm">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => {
                if (e.target.checked) onChange([...values, opt]);
                else onChange(values.filter((v) => v !== opt));
              }}
            />
            <span>{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

export function HelperProfileForm() {
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      router.push("/auth/login");
      return;
    }
    setToken(t);
  }, [router]);

  useEffect(() => {
    if (!token) return;
    // Load existing profile
    apiFetch<{ profile: any }>("/helpers/me/profile", { token })
      .then((res) => {
        if (res.profile) {
          // Merge defaults just in case
          reset({ ...defaults, ...res.profile });
        }
      })
      .catch((e) => {
        if (e.message?.includes("401") || e.message?.includes("Unauthorized") || e.message?.includes("Invalid token")) {
          // Token is invalid, clear it so user can login again
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/auth/login");
          return;
        }
        // Warning or ignore if 404 (not created yet)
        console.warn("Failed to load profile", e);
      });
  }, [token, router]);

  const defaults: FormData = useMemo(
    () => ({
      photoUrl: "https://placehold.co/256x256",
      countryOfOrigin: "Philippines",
      ageRange: "26-35",
      experienceYears: "2-3",
      experienceDetails: ["Cleaning"],
      workedCountries: ["Hong Kong"],
      familySituation: "Single",
      personalityTraits: ["Hardworking"],
      whatsapp: "+85291234567",
      contractEndDate: new Date().toISOString().slice(0, 10),
      availableStartDate: new Date().toISOString().slice(0, 10),
      previousContractType: "Finished Contract",
      bio: "",
      recommendationLetterUrl: "",
      facebookProfileLink: "",
      cookingPhotosLink: "",
      videosLink: ""
    }),
    []
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(helperProfileSchema),
    defaultValues: defaults
  });

  const bio = watch("bio") ?? "";

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (data) => {
        setStatus(null);
        try {
          await apiFetch<{ profile: any }>("/helpers/me/profile", {
            method: "PUT",
            token,
            body: data
          });
          setStatus("Saved");
        } catch (e: any) {
          setStatus(e?.message ?? "Save failed");
        }
      })}
    >
      <div>
        <label className="text-sm font-semibold">Front-facing photo URL</label>
        <input className="mt-1 w-full rounded border px-3 py-2" {...register("photoUrl")} />
        {errors.photoUrl ? <div className="text-xs text-red-600">{errors.photoUrl.message}</div> : null}
      </div>

      <div>
        <label className="text-sm font-semibold">Country of origin</label>
        <select className="mt-1 w-full rounded border px-3 py-2" {...register("countryOfOrigin")}>
          {COUNTRIES_OF_ORIGIN.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold">Age</label>
        <select className="mt-1 w-full rounded border px-3 py-2" {...register("ageRange")}>
          {AGE_RANGES.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold">Years of work experience</label>
        <select className="mt-1 w-full rounded border px-3 py-2" {...register("experienceYears")}>
          {EXPERIENCE_YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="text-sm font-semibold">Work experience details</div>
        <CheckboxGroup
          name="experienceDetails"
          options={EXPERIENCE_DETAILS}
          values={watch("experienceDetails") as any}
          onChange={(next) => setValue("experienceDetails", next as any, { shouldValidate: true })}
        />
        {errors.experienceDetails ? (
          <div className="text-xs text-red-600">{errors.experienceDetails.message as any}</div>
        ) : null}
      </div>

      <div>
        <div className="text-sm font-semibold">Countries worked in</div>
        <CheckboxGroup
          name="workedCountries"
          options={WORKED_COUNTRIES}
          values={watch("workedCountries") as any}
          onChange={(next) => setValue("workedCountries", next as any, { shouldValidate: true })}
        />
      </div>

      <div>
        <label className="text-sm font-semibold">Family situation</label>
        <select className="mt-1 w-full rounded border px-3 py-2" {...register("familySituation")}>
          {FAMILY_SITUATIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="text-sm font-semibold">Personality traits</div>
        <CheckboxGroup
          name="personalityTraits"
          options={PERSONALITY_TRAITS}
          values={watch("personalityTraits") as any}
          onChange={(next) => setValue("personalityTraits", next as any, { shouldValidate: true })}
        />
      </div>

      <div>
        <label className="text-sm font-semibold">WhatsApp contact</label>
        <input className="mt-1 w-full rounded border px-3 py-2" {...register("whatsapp")} placeholder="+85291234567" />
        {errors.whatsapp ? <div className="text-xs text-red-600">{errors.whatsapp.message}</div> : null}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-semibold">Contract end date</label>
          <input className="mt-1 w-full rounded border px-3 py-2" type="date" {...register("contractEndDate")} />
        </div>
        <div>
          <label className="text-sm font-semibold">Available start date</label>
          <input className="mt-1 w-full rounded border px-3 py-2" type="date" {...register("availableStartDate")} />
        </div>
      </div>

      <div>
        <div className="text-sm font-semibold">Previous contract type</div>
        <div className="mt-2 flex flex-col gap-2">
          {CONTRACT_TYPES.map((t) => (
            <label key={t} className="flex items-center gap-2 rounded border p-2 text-sm">
              <input type="radio" value={t} {...register("previousContractType")} />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="rounded border p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold">Bio (optional)</div>
          <TranslateButton
            text={bio}
            target="zh"
            onTranslated={(t) => setValue("bio", t, { shouldValidate: true })}
          />
        </div>
        <textarea className="mt-2 w-full rounded border px-3 py-2" rows={3} {...register("bio")} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded bg-slate-900 px-4 py-3 text-white"
      >
        {isSubmitting ? "Saving..." : "Save profile"}
      </button>

      {status ? <div className="text-sm">{status}</div> : null}
    </form>
  );
}
