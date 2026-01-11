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
    <div className="flex flex-col gap-6 py-12">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-slate-500">Log in to your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input
            id="email"
            type="email"
            placeholder="email@example.com"
            className={`p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
            {...register("email")}
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <button type="button" className="text-xs text-blue-600 hover:underline">Forgot password?</button>
          </div>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className={`p-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-slate-300'}`}
            {...register("password")}
          />
          {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <div className="text-center text-sm">
        Don't have an account?{" "}
        <button
          onClick={() => router.push("/auth/signup")}
          className="text-blue-600 hover:underline"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
