import "./globals.css";
import { AppShell } from "@/components/AppShell";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 selection:bg-primary-100 selection:text-primary-700 font-sans" suppressHydrationWarning>
        <div className="mx-auto min-h-screen bg-white sm:max-w-md lg:max-w-lg xl:max-w-xl shadow-soft-xl">
          <AppShell>{children}</AppShell>
        </div>
      </body>
    </html>
  );
}
