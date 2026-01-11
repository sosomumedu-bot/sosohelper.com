"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiFetch } from "@/lib/api";
import { whatsappSchema } from "@sosohelper/shared";

const signupSchema = z.object({
  role: z.enum(["EMPLOYER", "HELPER"], {
    required_error: "Please select a role",
  }),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  whatsapp: whatsappSchema.optional().or(z.literal("")),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "EMPLOYER",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ token: string; user: { id: string; role: string } }>(
        "/auth/signup",
        {
          method: "POST",
          body: {
            ...data,
            whatsapp: data.whatsapp || undefined,
          },
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
      setError(err.message || "Something went wrong during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create an Account</h1>
        <p className="text-slate-500">Join SosoHelper today</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">I am a...</label>
          <div className="grid grid-cols-2 gap-2">
            <label className={`flex items-center justify-center p-3 border rounded-md cursor-pointer transition-all ${selectedRole === 'EMPLOYER' ? 'bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'} ${errors.role ? 'border-red-500' : ''}`}>
              <input
                type="radio"
                value="EMPLOYER"
                {...register("role")}
                className="sr-only"
              />
              <span className="text-sm font-medium">Employer</span>
            </label>
            <label className={`flex items-center justify-center p-3 border rounded-md cursor-pointer transition-all ${selectedRole === 'HELPER' ? 'bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'} ${errors.role ? 'border-red-500' : ''}`}>
              <input
                type="radio"
                value="HELPER"
                {...register("role")}
                className="sr-only"
              />
              <span className="text-sm font-medium">Helper</span>
            </label>
          </div>
          {errors.role && <p className="text-red-500 text-xs">{errors.role.message}</p>}
        </div>

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
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Min 8 characters"
            className={`p-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-slate-300'}`}
            {...register("password")}
          />
          {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="whatsapp" className="text-sm font-medium">WhatsApp (Optional)</label>
          <input
            id="whatsapp"
            type="text"
            placeholder="+85291234567"
            className={`p-2 border rounded-md ${errors.whatsapp ? 'border-red-500' : 'border-slate-300'}`}
            {...register("whatsapp")}
          />
          <p className="text-slate-400 text-[10px]">Include country code, e.g., +852</p>
          {errors.whatsapp && <p className="text-red-500 text-xs">{errors.whatsapp.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <button
          onClick={() => router.push("/auth/login")}
          className="text-blue-600 hover:underline"
        >
          Log In
        </button>
      </div>
    </div>
  );
}
