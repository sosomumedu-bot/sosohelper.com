import "./globals.css";
import { AppShell } from "@/components/AppShell";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900" suppressHydrationWarning>
        <div className="mx-auto max-w-md p-4">
          <AppShell>{children}</AppShell>
        </div>
      </body>
    </html>
  );
}
