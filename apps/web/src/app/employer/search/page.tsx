"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  AGE_RANGES,
  COUNTRIES_OF_ORIGIN,
  EXPERIENCE_DETAILS,
  EXPERIENCE_YEARS,
  PERSONALITY_TRAITS
} from "@sosohelper/shared";
import { HelperCard } from "@/components/HelperCard";

function toParamArray(v: string[]) {
  return v.length ? v.join(",") : undefined;
}

export default function Page() {
  const [token, setToken] = useState<string>("");
  const [countryOfOrigin, setCountryOfOrigin] = useState<string>("");
  const [ageRange, setAgeRange] = useState<string>("");
  const [experienceYears, setExperienceYears] = useState<string>("");
  const [experienceDetails, setExperienceDetails] = useState<string[]>([]);
  const [personalityTraits, setPersonalityTraits] = useState<string[]>([]);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [helpers, setHelpers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (countryOfOrigin) params.set("countryOfOrigin", countryOfOrigin);
    if (ageRange) params.set("ageRange", ageRange);
    if (experienceYears) params.set("experienceYears", experienceYears);
    const ed = toParamArray(experienceDetails);
    const pt = toParamArray(personalityTraits);
    if (ed) params.set("experienceDetails", ed);
    if (pt) params.set("personalityTraits", pt);
    if (onlineOnly) params.set("onlineOnly", "true");
    return params.toString();
  }, [ageRange, countryOfOrigin, experienceDetails, experienceYears, onlineOnly, personalityTraits]);

  useEffect(() => {
    // no auto-fetch without token
  }, []);

  async function search() {
    setError(null);
    try {
      const r = await apiFetch<{ helpers: any[] }>(`/helpers/search?${query}`, { token });
      setHelpers(r.helpers);
    } catch (e: any) {
      setError(e?.message ?? "Search failed");
    }
  }

  function toggle(list: string[], value: string, set: (next: string[]) => void) {
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  return (
    <main className="space-y-4">
      <h1 className="text-xl font-bold">Search Helpers</h1>

      <div className="rounded border p-3">
        <div className="text-sm font-semibold">Auth token</div>
        <input
          className="mt-2 w-full rounded border px-3 py-2"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste JWT from /auth/login (employer)"
        />
      </div>

      <div className="space-y-3 rounded border p-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-sm font-semibold">Country</div>
            <select className="mt-1 w-full rounded border px-3 py-2" value={countryOfOrigin} onChange={(e) => setCountryOfOrigin(e.target.value)}>
              <option value="">Any</option>
              {COUNTRIES_OF_ORIGIN.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="text-sm font-semibold">Age</div>
            <select className="mt-1 w-full rounded border px-3 py-2" value={ageRange} onChange={(e) => setAgeRange(e.target.value)}>
              <option value="">Any</option>
              {AGE_RANGES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold">Experience</div>
          <select className="mt-1 w-full rounded border px-3 py-2" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)}>
            <option value="">Any</option>
            {EXPERIENCE_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="text-sm font-semibold">Skills</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {EXPERIENCE_DETAILS.map((s) => (
              <button
                key={s}
                type="button"
                className={
                  experienceDetails.includes(s)
                    ? "rounded border bg-slate-900 px-3 py-2 text-sm text-white"
                    : "rounded border px-3 py-2 text-sm"
                }
                onClick={() => toggle(experienceDetails, s, setExperienceDetails)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold">Personality</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {PERSONALITY_TRAITS.map((t) => (
              <button
                key={t}
                type="button"
                className={
                  personalityTraits.includes(t)
                    ? "rounded border bg-slate-900 px-3 py-2 text-sm text-white"
                    : "rounded border px-3 py-2 text-sm"
                }
                onClick={() => toggle(personalityTraits, t, setPersonalityTraits)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={onlineOnly} onChange={(e) => setOnlineOnly(e.target.checked)} />
          Online only
        </label>

        <button type="button" className="w-full rounded bg-slate-900 px-4 py-3 text-white" onClick={search}>
          Search
        </button>

        {error ? <div className="text-sm text-red-600">{error}</div> : null}
      </div>

      <div className="space-y-3">
        {helpers.map((h) => (
          <HelperCard key={h.id} helper={h} />
        ))}
      </div>
    </main>
  );
}
