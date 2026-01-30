"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { 
  Search, 
  Bookmark, 
  User, 
  Menu, 
  X, 
  Home,
  ChevronRight
} from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Browse Helpers", icon: Search },
    { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans antialiased text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <h1 className="font-bold text-xl tracking-tight hidden sm:block">SosoHelper</h1>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  isActive(link.href)
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="w-px h-4 bg-slate-200 mx-2" />
            <Link 
              href="/login" 
              className="ml-2 px-5 py-2 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-all active:scale-95 shadow-md shadow-slate-200"
            >
              Login
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden bg-white pt-20 px-4">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={clsx(
                  "flex items-center justify-between p-4 rounded-2xl text-lg font-medium transition-all",
                  isActive(link.href)
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-600 active:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <link.icon size={20} />
                  {link.label}
                </div>
                <ChevronRight size={18} className="opacity-40" />
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 flex items-center justify-center p-4 rounded-2xl bg-slate-900 text-white font-bold text-lg"
            >
              Login
            </Link>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-auto py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-[10px] font-bold text-slate-400">SH</div>
            <span>&copy; 2024 SosoHelper. All rights reserved.</span>
          </div>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-indigo-600 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}