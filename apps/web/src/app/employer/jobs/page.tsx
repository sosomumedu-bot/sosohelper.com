"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { EmployerJobForm } from "@/components/EmployerJobForm";

export default function Page() {
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
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
      loadJobs();
    }
  }, [token]);

  async function loadJobs() {
    setLoading(true);
    try {
      const res = await apiFetch<{ jobs: any[] }>("/employers/me/jobs", { token });
      setJobs(res.jobs || []);
    } catch (e) {
      console.error("Failed to load jobs", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">My Jobs</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white font-medium hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Post New Job"}
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <EmployerJobForm
            token={token}
            onSuccess={() => {
              setShowForm(false);
              loadJobs();
            }}
          />
        </div>
      )}

      {loading ? (
        <div className="text-slate-500 text-sm">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="rounded border border-dashed p-8 text-center text-slate-500">
          <p>You haven't posted any jobs yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-2 text-blue-600 hover:underline text-sm font-medium"
          >
            Post your first job
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="rounded border p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{job.location} · {job.houseSize} House</h3>
                  <div className="text-xs text-slate-500">
                    Posted on {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-slate-100 px-2 py-1 rounded text-xs font-medium text-slate-600">
                  {job.status || "OPEN"}
                </div>
              </div>
              
              <div className="text-sm text-slate-700 space-y-1 mb-3">
                <p><strong>Family:</strong> {job.familyComposition?.childrenCount || 0} Children</p>
                <p><strong>Off Day:</strong> {job.weeklyOffDays.join(", ")}</p>
                <p><strong>Tasks:</strong> {job.tasks.join(", ")}</p>
              </div>

              {job.jobDescription && (
                <p className="text-sm text-slate-600 border-t pt-2 mt-2">
                  {job.jobDescription}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
