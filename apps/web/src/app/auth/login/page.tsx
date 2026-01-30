"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiFetch } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Auto-redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === "EMPLOYER") {
          router.push("/employer/search");
        } else {
          router.push("/helper/profile");
        }
      } catch (e) {
        // Invalid user data, ignore
        localStorage.clear();
      }
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ token: string; user: { id: string; role: string } }>(
        "/auth/login",
        {
          method: "POST",
          body: data,
        }
      );

      if (res.ok) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        
        // Redirect based on role
        if (res.user.role === "EMPLOYER") {
          router.push("/employer/search");
        } else {
          router.push("/helper/profile");
        }
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full py-12 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-soft-lg p-8 md:p-10 border border-slate-100 animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 mt-1">Log in to your SosoHelper account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm border border-red-100 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              className={`w-full px-4 py-3 rounded-2xl border bg-slate-50 outline-none transition-all focus:ring-4 focus:ring-primary-100 ${
                errors.email ? 'border-red-300' : 'border-slate-200 focus:border-primary-400'
              }`}
              {...register("email")}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label>
              <button type="button" className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors">Forgot password?</button>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-2xl border bg-slate-50 outline-none transition-all focus:ring-4 focus:ring-primary-100 ${
                errors.password ? 'border-red-300' : 'border-slate-200 focus:border-primary-400'
              }`}
              {...register("password")}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-primary-200 hover:bg-primary-700 hover:shadow-primary-300 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : "Log In"}
          </button>
        </form>

        <div className="mt-8 text-center text-slate-600 text-sm">
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/auth/signup")}
            className="text-primary-600 font-bold hover:text-primary-700 transition-colors"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
