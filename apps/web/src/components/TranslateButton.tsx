"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

export function TranslateButton({
  text,
  target,
  onTranslated
}: {
  text: string;
  target: "en" | "zh";
  onTranslated: (t: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="rounded border px-3 py-2 text-sm"
        disabled={loading || !text.trim()}
        onClick={async () => {
          setLoading(true);
          setError(null);
          try {
            const r = await apiFetch<{ translatedText: string }>("/translate", {
              method: "POST",
              body: { text, target }
            });
            onTranslated(r.translatedText);
          } catch (e: any) {
            setError(e?.message ?? "Translate failed");
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? "Translating..." : `Translate -> ${target === "zh" ? "Chinese" : "English"}`}
      </button>
      {error ? <div className="text-xs text-red-600">{error}</div> : null}
    </div>
  );
}
