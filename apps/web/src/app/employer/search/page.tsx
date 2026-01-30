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
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Users, 
  Globe, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";

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
  const [showFilters, setShowFilters] = useState(false);

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
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-pink-500" />
          Find Your Helper
        </h1>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Toggle filters"
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 ${showFilters ? 'block' : 'hidden lg:block'}`}>
        <div className="p-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" />
                Country of Origin
              </label>
              <select 
                className="w-full h-11 rounded-xl border-slate-200 bg-slate-50 px-3 text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all" 
                value={countryOfOrigin} 
                onChange={(e) => setCountryOfOrigin(e.target.value)}
                aria-label="Country of Origin"
              >
                <option value="">Any Country</option>
                {COUNTRIES_OF_ORIGIN.map((c: string) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                Age Range
              </label>
              <select 
                className="w-full h-11 rounded-xl border-slate-200 bg-slate-50 px-3 text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all" 
                value={ageRange} 
                onChange={(e) => setAgeRange(e.target.value)}
                aria-label="Age Range"
              >
                <option value="">Any Age</option>
                {AGE_RANGES.map((a: string) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                Experience
              </label>
              <select 
                className="w-full h-11 rounded-xl border-slate-200 bg-slate-50 px-3 text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all" 
                value={experienceYears} 
                onChange={(e) => setExperienceYears(e.target.value)}
                aria-label="Experience Years"
              >
                <option value="">Any Experience</option>
                {EXPERIENCE_YEARS.map((y: string) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-slate-400" />
              Required Skills
            </label>
            <div className="flex flex-wrap gap-2">
              {EXPERIENCE_DETAILS.map((s: string) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggle(experienceDetails, s, setExperienceDetails)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    experienceDetails.includes(s)
                      ? "bg-pink-100 text-pink-700 ring-2 ring-pink-500 ring-inset"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={onlineOnly} 
                onChange={(e) => setOnlineOnly(e.target.checked)} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
              <span className="ml-3 text-sm font-medium text-slate-700">Online only</span>
            </label>

            <button 
              type="button" 
              className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-slate-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              onClick={search}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              Search
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-100" />
          ))
        ) : helpers.length === 0 ? (
          <div className="col-span-full py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center space-y-3">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <div className="space-y-1">
              <p className="text-slate-900 font-semibold text-lg">No helpers found</p>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">Try broadening your search criteria or checking for online users.</p>
            </div>
          </div>
        ) : (
          helpers.map((h: any) => (
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
