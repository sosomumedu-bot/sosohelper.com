"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  const [countryOfOrigin, setCountryOfOrigin] = useState<string>("");
  const [ageRange, setAgeRange] = useState<string>("");
  const [experienceYears, setExperienceYears] = useState<string>("");
  const [experienceDetails, setExperienceDetails] = useState<string[]>([]);
  const [personalityTraits, setPersonalityTraits] = useState<string[]>([]);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [helpers, setHelpers] = useState<any[]>([]);
  const [bookmarkedSet, setBookmarkedSet] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
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
    const t = localStorage.getItem("token");
    if (!t) {
      router.push("/auth/login");
      return;
    }
    setToken(t);
  }, [router]);

  useEffect(() => {
    if (token) {
      search();
      loadBookmarks();
    }
  }, [token, query]); // Auto-search when token or filters change

  async function loadBookmarks() {
    try {
      const r = await apiFetch<{ bookmarks: any[] }>("/employers/me/bookmarks", { token });
      // bookmarks have { helperId }
      const ids = new Set(r.bookmarks.map((b) => b.helperId));
      setBookmarkedSet(ids);
    } catch (e: any) {
      console.error("Failed to load bookmarks", e);
      if (e.message?.includes("401") || e.message?.includes("Unauthorized") || e.message?.includes("Invalid token")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/auth/login");
      }
    }
  }

  async function toggleBookmark(helperId: string) {
    if (!token) return;
    const isBookmarked = bookmarkedSet.has(helperId);
    try {
      // Optimistic update
      setBookmarkedSet((prev) => {
        const next = new Set(prev);
        if (isBookmarked) next.delete(helperId);
        else next.add(helperId);
        return next;
      });

      if (isBookmarked) {
        await apiFetch(`/employers/me/bookmarks/${helperId}`, { method: "DELETE", token });
      } else {
        await apiFetch("/employers/me/bookmarks", {
          method: "PUT",
          token,
          body: { helperUserId: helperId, category: "Favorite" }
        });
      }
    } catch (e) {
      console.error("Failed to toggle bookmark", e);
      // Revert on error? For MVP, ignore or could reload.
    }
  }

  async function search() {
    console.log("Search initiated. Token:", !!token, "Query:", query);
    if (!token) {
      console.log("No token, aborting search");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching helpers...");
      const r = await apiFetch<{ helpers: any[] }>(`/helpers/search?${query}`, { token });
      console.log("Helpers fetched:", r.helpers.length);
      setHelpers(r.helpers);
      setLoading(false);
    } catch (e: any) {
      console.error("Search error:", e);
      setLoading(false);
      if (e.message?.includes("401") || e.message?.includes("Unauthorized") || e.message?.includes("Invalid token")) {
         localStorage.removeItem("token");
         localStorage.removeItem("user");
         router.push("/auth/login");
         return;
      }
      setError(e?.message ?? "Search failed");
    }
  }

  function toggle(list: string[], value: string, set: (next: string[]) => void) {
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  return (
    <main className="space-y-4">
      <h1 className="text-xl font-bold">Search Helpers</h1>

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
        {loading ? (
          <div className="text-center py-8 text-slate-500">Loading helpers...</div>
        ) : helpers.length === 0 ? (
          <div className="rounded border border-dashed p-8 text-center text-slate-500">
            <p>No helpers found matching your criteria.</p>
            <p className="text-xs mt-1">Try adjusting the filters.</p>
          </div>
        ) : (
          helpers.map((h) => (
            <HelperCard
              key={h.id}
              helper={h}
              isBookmarked={bookmarkedSet.has(h.id)}
              onToggleBookmark={() => toggleBookmark(h.id)}
            />
          ))
        )}
      </div>
    </main>
  );
}
