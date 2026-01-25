"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";

type Role = "HELPER" | "EMPLOYER";
type StoredUser = { id: string; role: Role };

function parseStoredUser(raw: string | null): StoredUser | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "id" in parsed &&
      "role" in parsed &&
      typeof (parsed as any).id === "string" &&
      ((parsed as any).role === "HELPER" || (parsed as any).role === "EMPLOYER")
    ) {
      return { id: (parsed as any).id, role: (parsed as any).role };
    }
    return null;
  } catch {
    return null;
  }
}

function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

function isAuthErrorMessage(message: unknown): boolean {
  if (typeof message !== "string") return false;
  return message.includes("Invalid token") || message.includes("Missing bearer token");
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setUser(parseStoredUser(localStorage.getItem("user")));
  }, [pathname]);

  useEffect(() => {
    if (!token) return;

    const ping = async () => {
      try {
        await apiFetch<{ ttlSeconds: number }>("/presence/heartbeat", { method: "POST", token });
      } catch (e: any) {
        if (isAuthErrorMessage(e?.message)) {
          clearAuth();
          setToken(null);
          setUser(null);
          if (!pathname.startsWith("/auth")) router.push("/auth/login");
        }
      }
    };

    ping();
    const intervalId = setInterval(ping, 45_000);
    return () => clearInterval(intervalId);
  }, [pathname, router, token]);

  const navItems = useMemo(() => {
    if (user?.role === "EMPLOYER") {
      return [
        { href: "/employer/search", label: "Search Helpers" },
        { href: "/employer/jobs", label: "My Jobs" },
        { href: "/employer/bookmarks", label: "Bookmarks" }
      ];
    }
    if (user?.role === "HELPER") {
      return [
        { href: "/helper/profile", label: "My Profile" },
        { href: "/helper/jobs", label: "Browse Jobs" }
      ];
    }
    return [];
  }, [user?.role]);

  function logout() {
    clearAuth();
    setToken(null);
    setUser(null);
    router.push("/");
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="mb-4 rounded border bg-white">
        <div className="flex items-center justify-between px-3 py-2">
          <Link href="/" className="font-bold">
            SosoHelper
          </Link>

          {user ? (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="rounded bg-slate-100 px-2 py-1">{user.role}</span>
              <button
                type="button"
                onClick={logout}
                className="rounded px-2 py-1 hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <Link href="/auth/login" className="text-slate-700 hover:underline">
                Log In
              </Link>
              <Link href="/auth/signup" className="rounded bg-blue-600 px-3 py-1.5 text-white">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {navItems.length ? (
          <nav className="flex gap-1 border-t px-1 py-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex-1 rounded px-3 py-2 text-center text-sm",
                  isActive(item.href) ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>

      {children}
    </>
  );
}

