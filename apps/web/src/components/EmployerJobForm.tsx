"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  employerJobSchema,
  HK_AREAS,
  HOUSE_SIZES,
  WEEK_DAYS,
  JOB_TASKS
} from "@sosohelper/shared";
import type { z } from "zod";
import { apiFetch } from "@/lib/api";
import { useState } from "react";
import { TranslateButton } from "./TranslateButton";

type FormData = z.infer<typeof employerJobSchema>;

function CheckboxGroup({
  options,
  values,
  onChange
}: {
  options: readonly string[];
  values: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt) => {
        const checked = values.includes(opt);
        return (
          <label key={opt} className="flex items-center gap-2 rounded border p-2 text-sm cursor-pointer hover:bg-slate-50">
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

export function EmployerJobForm({ token, onSuccess }: { token: string; onSuccess: () => void }) {
  const [status, setStatus] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(employerJobSchema),
    defaultValues: {
      familyComposition: {
        childrenCount: 0,
        childrenAgeRanges: []
      },
      location: "Central",
      houseSize: "Medium",
      separateRoom: false,
      weeklyOffDays: ["Sunday"],
      tasks: ["Housework"],
      whatsapp: "+852",
      jobDescription: ""
    }
  });

  const jobDesc = watch("jobDescription") ?? "";

  const onSubmit = async (data: FormData) => {
    setStatus(null);
    try {
      await apiFetch("/employers/me/jobs", {
        method: "POST",
        token,
        body: data
      });
      setStatus("Job posted successfully!");
      reset();
      onSuccess();
    } catch (e: any) {
      setStatus(e?.message ?? "Failed to post job");
    }
  };

  return (
    <form className="space-y-6 border rounded-lg p-4 bg-white shadow-sm" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-lg font-bold">Post a New Job</h2>

      {/* Family Composition */}
      <div className="space-y-3 p-3 bg-slate-50 rounded border">
        <label className="text-sm font-semibold block">Family Composition</label>
        
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-600">Number of Children</label>
          <input
            type="number"
            className="w-full rounded border px-3 py-2"
            {...register("familyComposition.childrenCount", { valueAsNumber: true })}
          />
          {errors.familyComposition?.childrenCount && (
            <div className="text-xs text-red-600">{errors.familyComposition.childrenCount.message}</div>
          )}
        </div>

        <div className="flex flex-col gap-1">
           <label className="text-xs text-slate-600">Children Age Ranges (if any)</label>
           <CheckboxGroup
             options={["0-2", "3-5", "6-12", "13-17"]}
             values={watch("familyComposition.childrenAgeRanges") || []}
             onChange={(next) => setValue("familyComposition.childrenAgeRanges", next as any)}
           />
        </div>
      </div>

      {/* Location & House */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold block mb-1">Location</label>
          <select className="w-full rounded border px-3 py-2" {...register("location")}>
            {HK_AREAS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold block mb-1">House Size</label>
          <select className="w-full rounded border px-3 py-2" {...register("houseSize")}>
            {HOUSE_SIZES.map((s) => (
               <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 rounded border p-3 hover:bg-slate-50 cursor-pointer">
          <input type="checkbox" {...register("separateRoom")} />
          <span className="font-semibold text-sm">Separate Room Provided?</span>
        </label>
      </div>

      {/* Weekly Off Days */}
      <div>
        <label className="text-sm font-semibold block mb-2">Weekly Off Days</label>
        <CheckboxGroup
          options={WEEK_DAYS}
          values={watch("weeklyOffDays") as any}
          onChange={(next) => setValue("weeklyOffDays", next as any, { shouldValidate: true })}
        />
        {errors.weeklyOffDays && <div className="text-xs text-red-600">{errors.weeklyOffDays.message as any}</div>}
      </div>

      {/* Tasks */}
      <div>
        <label className="text-sm font-semibold block mb-2">Required Tasks</label>
        <CheckboxGroup
          options={JOB_TASKS}
          values={watch("tasks") as any}
          onChange={(next) => setValue("tasks", next as any, { shouldValidate: true })}
        />
         {errors.tasks && <div className="text-xs text-red-600">{errors.tasks.message as any}</div>}
      </div>

      {/* Whatsapp */}
      <div>
        <label className="text-sm font-semibold block mb-1">WhatsApp Contact</label>
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="+85291234567"
          {...register("whatsapp")}
        />
        {errors.whatsapp && <div className="text-xs text-red-600">{errors.whatsapp.message}</div>}
      </div>

      {/* Description */}
      <div className="rounded border p-3">
        <div className="flex items-center justify-between gap-3 mb-2">
          <label className="text-sm font-semibold">Job Description (Optional)</label>
          <TranslateButton
            text={jobDesc}
            target="zh"
            onTranslated={(t) => setValue("jobDescription", t, { shouldValidate: true })}
          />
        </div>
        <textarea
          className="w-full rounded border px-3 py-2"
          rows={3}
          {...register("jobDescription")}
          placeholder="E.g. We are a friendly family of 4 looking for..."
        />
        {errors.jobDescription && <div className="text-xs text-red-600">{errors.jobDescription.message}</div>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-300"
      >
        {isSubmitting ? "Posting..." : "Post Job"}
      </button>

      {status && (
        <div className={`text-sm p-2 rounded ${status.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {status}
        </div>
      )}
    </form>
  );
}
