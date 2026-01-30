import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Search, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SosoHelper - Connect with Top Helpers",
  description: "The premier platform for connecting foreign helpers with Hong Kong employers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  SosoHelper
                </span>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link href="/helpers" className="transition-colors hover:text-primary">Find Helpers</Link>
              <Link href="/jobs" className="transition-colors hover:text-primary">Browse Jobs</Link>
              <Link href="/about" className="transition-colors hover:text-primary">About Us</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login text-sm font-medium">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t bg-slate-50">
          <div className="container py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="col-span-2">
                <span className="text-xl font-bold text-primary">SosoHelper</span>
                <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                  Empowering households in Hong Kong by connecting them with dedicated and skilled helpers.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Platform</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/helpers">Browse Helpers</Link></li>
                  <li><Link href="/jobs">Post a Job</Link></li>
                  <li><Link href="/pricing">Pricing</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/faq">FAQs</Link></li>
                  <li><Link href="/contact">Contact Us</Link></li>
                  <li><Link href="/terms">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} SosoHelper. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}