"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { HelperCard } from "@/components/HelperCard";

export default function Page() {
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  const [bookmarks, setBookmarks] = useState<any[]>([]);
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
      // Optimistic URL
      setBookmarks((prev) => prev.filter((b) => b.helperId !== helperId));
      await apiFetch(`/employers/me/bookmarks/${helperId}`, { method: "DELETE", token });
    } catch (e) {
      console.error("Failed to remove bookmark", e);
      loadBookmarks(); // Revert
    }
  }

  return (
    <main className="space-y-6">
      <h1 className="text-xl font-bold">My Bookmarks</h1>

      {loading ? (
        <div className="text-slate-500 text-sm">Loading...</div>
      ) : bookmarks.length === 0 ? (
        <div className="rounded border border-dashed p-8 text-center text-slate-500">
          <p>You haven't bookmarked any helpers yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((b) => (
            <div key={b.helperId} className="relative">
              <HelperCard
                helper={b.helper}
                isBookmarked={true}
                onToggleBookmark={() => removeBookmark(b.helperId)}
              />
              <div className="absolute top-3 right-12 px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-500 font-medium tracking-wide">
                {b.category}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
