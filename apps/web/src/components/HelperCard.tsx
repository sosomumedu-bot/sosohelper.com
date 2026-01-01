import type { HelperProfileInput } from "@sosohelper/shared";

export function HelperCard({
  helper
}: {
  helper: { id: string; online: boolean; whatsapp: string | null; profile: any };
}) {
  const p = helper.profile as HelperProfileInput & { id?: string };

  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-start gap-3">
        <img
          src={p.photoUrl}
          alt="Helper photo"
          className="h-16 w-16 rounded object-cover"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate font-semibold">{p.countryOfOrigin}</div>
            <div className={helper.online ? "text-xs text-green-600" : "text-xs text-slate-500"}>
              {helper.online ? "Online" : "Offline"}
            </div>
          </div>
          <div className="mt-1 text-sm text-slate-700">
            Age: {p.ageRange} · Exp: {p.experienceYears}
          </div>
          <div className="mt-1 text-xs text-slate-600">
            Skills: {p.experienceDetails.slice(0, 3).join(", ")}{p.experienceDetails.length > 3 ? "…" : ""}
          </div>
          <div className="mt-2">
            <a
              className="inline-flex rounded bg-green-600 px-3 py-2 text-sm text-white"
              href={helper.whatsapp ? `https://wa.me/${helper.whatsapp.replace("+", "")}` : "#"}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
