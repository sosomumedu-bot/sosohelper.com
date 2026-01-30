import React from "react";
import type { HelperProfileInput } from "@sosohelper/shared";
import { MessageCircle, Star, ShieldCheck, MapPin, Calendar, ArrowRight } from "lucide-react";
import clsx from "clsx";

export function HelperCard({
  helper,
  isBookmarked,
  onToggleBookmark
}: {
  helper: { id: string; online: boolean; whatsapp: string | null; profile: any };
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}) {
  const p = helper.profile as HelperProfileInput & { id?: string };

  return (
    <div className="group glass-card hover:border-primary-300 hover:shadow-soft-2xl transition-all duration-300 active:scale-[0.99] cursor-pointer overflow-hidden border-slate-200/60 p-5 relative">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        {/* Photo Section */}
        <div className="relative flex-shrink-0 mx-auto sm:mx-0">
          <div className="h-32 w-32 rounded-[2.5rem] overflow-hidden ring-4 ring-slate-50 group-hover:ring-primary-50 transition-all shadow-inner bg-slate-100">
            <img
              src={p.photoUrl || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop"}
              alt="Helper photo"
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </div>
          <div className={clsx(
            "absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-4 border-white shadow-soft flex items-center justify-center",
            helper.online ? "bg-emerald-500" : "bg-slate-300"
          )}>
            {helper.online && (
              <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20" />
            )}
            <div className="w-2 h-2 rounded-full bg-white opacity-40"></div>
          </div>
        </div>

        {/* Content Section */}
        <div className="min-w-0 flex-1 flex flex-col h-full py-1">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <h3 className="truncate font-black text-2xl text-slate-900 tracking-tight leading-none uppercase">
                {p.countryOfOrigin}
              </h3>
              <div className="flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary-100/50 shadow-sm">
                <ShieldCheck size={10} strokeWidth={4} />
                <span>Verified</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm mb-5">
            <div className="flex items-center gap-2 text-slate-500">
              <div className="w-7 h-7 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100/50 shadow-sm">
                <Calendar size={14} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-slate-600 uppercase tracking-tighter">{p.ageRange} yrs</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <div className="w-7 h-7 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100/50 shadow-sm">
                <Star size={14} className="fill-amber-500" strokeWidth={2.5} />
              </div>
              <span className="font-black text-slate-800 uppercase tracking-tighter">{p.experienceYears} Years Exp</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {p.experienceDetails.slice(0, 3).map((skill: string, i: number) => (
              <span key={i} className="px-3.5 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-[11px] font-black uppercase tracking-wide border border-slate-100/60 transition-all group-hover:bg-white group-hover:text-primary-600 group-hover:border-primary-100 group-hover:shadow-sm">
                {skill}
              </span>
            ))}
            {p.experienceDetails.length > 3 && (
              <span className="px-3 py-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-widest flex items-center">
                +{p.experienceDetails.length - 3} MORE
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-auto">
            <a
              className="flex-1 flex items-center justify-center gap-2 rounded-[1.25rem] bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 text-sm font-black uppercase tracking-widest transition-all active:scale-[0.96] shadow-xl shadow-emerald-200 hover:shadow-emerald-300"
              href={helper.whatsapp ? `https://wa.me/${helper.whatsapp.replace("+", "")}` : "#"}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} strokeWidth={2.5} />
              <span>Message Now</span>
            </a>
            
            <button 
              className="flex items-center justify-center w-14 h-14 rounded-[1.25rem] border border-slate-200 text-slate-400 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 transition-all active:scale-90 bg-white shadow-sm"
              title="View location"
            >
              <MapPin size={22} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Bookmark Button */}
        {onToggleBookmark && (
          <button
            onClick={onToggleBookmark}
            className={clsx(
              "absolute top-5 right-5 p-2.5 rounded-2xl transition-all active:scale-75 shadow-sm border",
              isBookmarked 
                ? "bg-amber-50 text-amber-500 border-amber-100" 
                : "bg-white text-slate-300 border-slate-100 hover:text-amber-400 hover:border-amber-100 hover:bg-amber-50"
            )}
            title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <Star size={20} className={isBookmarked ? "fill-amber-500" : ""} />
          </button>
        )}
      </div>
    </div>
  );
}
