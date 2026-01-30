"use client";

import { apiFetch } from "@/lib/api";
import { HK_AREAS, JOB_TASKS } from "@sosohelper/shared";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Job = {
  id: string;
  familyComposition: { childrenCount: number; childrenAgeRanges?: string[] };
  location: string;
  houseSize: string;
  separateRoom: boolean;
  weeklyOffDays: string[];
  tasks: string[];
  whatsapp: string;
  jobDescription: string | null;
  createdAt: string;
};

function toWhatsAppUrl(whatsapp: string) {
  const digits = whatsapp.replace(/[^\d]/g, "");
  return digits ? `https://wa.me/${digits}` : "#";
}

export default function Page() {
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [location, setLocation] = useState<string>("");
  const [tasks, setTasks] = useState<string[]>([]);

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
    loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function loadJobs() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ jobs: Job[] }>("/jobs", { token });
      setJobs(res.jobs || []);
    } catch (e: any) {
      const msg = e?.message ?? "Failed to load jobs";
      if (msg.includes("Invalid token") || msg.includes("Missing bearer token")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/auth/login");
        return;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      if (location && j.location !== location) return false;
      if (tasks.length && !tasks.every((t) => j.tasks.includes(t))) return false;
      return true;
    });
  }, [jobs, location, tasks]);

  function toggleTask(value: string) {
    setTasks((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
  }

  return (
    <main className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Browse Jobs</h1>
          <p className="text-sm text-slate-600">Contact employers directly via WhatsApp.</p>
        </div>
        <button
          type="button"
          onClick={loadJobs}
          className="rounded border px-3 py-2 text-sm hover:bg-slate-50"
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3 rounded border p-3">
        <div>
          <div className="text-sm font-semibold">Location</div>
          <select
            className="mt-1 w-full rounded border px-3 py-2"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Any</option>
            {HK_AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="text-sm font-semibold">Tasks</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {JOB_TASKS.map((t) => (
              <button
                key={t}
                type="button"
                className={
                  tasks.includes(t)
                    ? "rounded border bg-slate-900 px-3 py-2 text-sm text-white"
                    : "rounded border px-3 py-2 text-sm"
                }
                onClick={() => toggleTask(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="w-full rounded bg-slate-900 px-4 py-3 text-white"
          onClick={() => {
            setLocation("");
            setTasks([]);
          }}
        >
          Clear filters
        </button>
      </div>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      {loading ? (
        <div className="text-center py-8 text-slate-500">Loading jobs...</div>
      ) : filteredJobs.length === 0 ? (
        <div className="rounded border border-dashed p-8 text-center text-slate-500">
          <p>No jobs found.</p>
          <p className="text-xs mt-1">Try clearing filters or come back later.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="rounded border p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <div className="font-bold text-lg truncate">
                    {job.location} - {job.houseSize} House
                  </div>
                  <div className="text-xs text-slate-500">
                    Posted on {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <a
                  className="shrink-0 inline-flex rounded bg-green-600 px-3 py-2 text-sm text-white"
                  href={toWhatsAppUrl(job.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </div>

              <div className="mt-3 grid gap-1 text-sm text-slate-700">
                <div>
                  <span className="font-semibold">Family:</span> {job.familyComposition?.childrenCount ?? 0} Children
                </div>
                <div>
                  <span className="font-semibold">Off day:</span> {job.weeklyOffDays.join(", ")}
                </div>
                <div>
                  <span className="font-semibold">Tasks:</span> {job.tasks.join(", ")}
                </div>
                <div>
                  <span className="font-semibold">Accommodation:</span>{" "}
                  {job.separateRoom ? "Separate room" : "No separate room"}
                </div>
              </div>

              {job.jobDescription ? (
                <div className="mt-3 border-t pt-3 text-sm text-slate-600 whitespace-pre-wrap">
                  {job.jobDescription}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
