"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { HelperCard } from "@/components/HelperCard";

interface Bookmark {
  helperId: string;
  category?: string;
  helper: any;
}

export default function Page() {
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

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
      loadBookmarks();
    }
  }, [token]);

  async function loadBookmarks() {
    setLoading(true);
    try {
      const res = await apiFetch<{ bookmarks: any[] }>("/employers/me/bookmarks", { token });
      setBookmarks(res.bookmarks || []);
    } catch (e) {
      console.error("Failed to load bookmarks", e);
    } finally {
      setLoading(false);
    }
  }

  async function removeBookmark(helperId: string) {
    if (!token) return;
    try {
      // Optimistic Update
      setBookmarks((prev: Bookmark[]) => prev.filter((b: Bookmark) => b.helperId !== helperId));
      await apiFetch(`/employers/me/bookmarks/${helperId}`, { method: "DELETE", token });
    } catch (e) {
      console.error("Failed to remove bookmark", e);
      loadBookmarks(); // Revert
    }
  }

  return (
    <main className="max-w-2xl mx-auto py-4">
      <div className="mb-6 px-4 sm:px-0">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Saved Helpers</h1>
        <p className="text-slate-500 text-sm mt-1">Keep track of candidates you're interested in.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm animate-pulse">Loading your bookmarks...</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm mx-4 sm:mx-0">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h3 className="text-slate-900 font-semibold mb-1">No bookmarked helpers</h3>
          <p className="text-slate-500 text-sm max-w-[240px] mx-auto mb-6">
            When you find a helper you like, save them here for quick access later.
          </p>
          <button 
            onClick={() => router.push("/employer/search")}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Start Searching
          </button>
        </div>
      ) : (
        <div className="px-4 sm:px-0 space-y-4">
          {bookmarks.map((b: Bookmark) => (
            <div key={b.helperId} className="relative group">
              <HelperCard
                helper={b.helper}
                isBookmarked={true}
                onToggleBookmark={() => removeBookmark(b.helperId)}
              />
              {b.category && (
                <div className="absolute top-4 right-14 px-2 py-0.5 rounded-full bg-indigo-50 text-[10px] text-indigo-600 font-bold uppercase tracking-wider border border-indigo-100">
                  {b.category}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
