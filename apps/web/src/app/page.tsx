import Link from "next/link";
import { ArrowRight, ShieldCheck, Users, Search, Heart, Star, Zap, MessageCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="-m-4 flex flex-col pb-20 bg-slate-50/50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-500 to-indigo-600 px-6 pt-24 pb-36 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-[120px]"></div>
          <div className="absolute top-1/2 -right-32 w-[35rem] h-[35rem] bg-primary-200 rounded-full blur-[140px]"></div>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-8 shadow-sm animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-primary-50">Hong Kong's Modern Helper Platform</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl mb-6 text-balance leading-[1.1] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Hire Domestic Help <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-primary-100">With Confidence.</span>
          </h1>
          <p className="text-lg text-primary-50/80 leading-relaxed mb-10 text-balance max-w-lg mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            The simple, verified, and direct way to connect with thousands of qualified helpers in Hong Kong.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link href="/auth/signup" className="group flex items-center justify-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary-900/20 hover:bg-primary-50 transition-all active:scale-[0.98]">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/auth/login" className="flex items-center justify-center bg-primary-400/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all active:scale-[0.98]">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section className="px-5 relative z-20 -mt-16">
        <div className="grid gap-6 max-w-4xl mx-auto">
          {/* Employer Card */}
          <Link 
            href="/employer/search"
            className="group relative overflow-hidden bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-soft-xl active:scale-[0.99] transition-all hover:shadow-soft-2xl hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
                <Users size={120} strokeWidth={2.5} />
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 shadow-inner">
                <Users size={32} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight sm:text-2xl">I am an Employer</h3>
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    <ArrowRight size={18} strokeWidth={3} />
                  </div>
                </div>
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed">Browse thousands of verified helper profiles and find the perfect match for your family today.</p>
              </div>
            </div>
          </Link>

          {/* Helper Card */}
          <Link 
            href="/helper/profile"
            className="group relative overflow-hidden bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-soft-xl active:scale-[0.99] transition-all hover:shadow-soft-2xl hover:-translate-y-1"
          >
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
                <Zap size={120} strokeWidth={2.5} />
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-inner">
                <Zap size={32} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight sm:text-2xl">I am a Helper</h3>
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <ArrowRight size={18} strokeWidth={3} />
                  </div>
                </div>
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed">Create your professional profile, showcase your skills, and connect directly with great employers.</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Trust Section */}
      <section className="mt-20 px-6">
        <div className="text-center mb-12">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary-500 mb-3">The Soso Advantage</h2>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl mb-4">Why Thousands Trust Us</h3>
          <div className="h-1.5 w-12 bg-primary-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid gap-6 max-w-5xl mx-auto">
          {[
            { icon: ShieldCheck, title: "Verified Profiles", desc: "Every profile undergoes strict identity and document verification for your safety.", color: "text-blue-600", bg: "bg-blue-50" },
            { icon: MessageCircle, title: "Direct Contact", desc: "No expensive agency fees. Chat directly and securely with your future match.", color: "text-primary-600", bg: "bg-primary-50" },
            { icon: Zap, title: "Fast Hiring", desc: "Our advanced matching system helps you find the right person in as little as 3 days.", color: "text-orange-600", bg: "bg-orange-50" },
          ].map((feature, i) => (
            <div key={i} className="group flex gap-5 bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-soft transition-all hover:shadow-soft-lg">
              <div className={`h-12 w-12 shrink-0 rounded-xl ${feature.bg} flex items-center justify-center ${feature.color} shadow-sm group-hover:scale-110 transition-transform`}>
                <feature.icon size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">{feature.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Statistics Section */}
      <section className="mt-24 mb-12 px-8 py-16 bg-slate-900 -mx-4 text-center">
        <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto">
          <div>
            <div className="text-4xl font-black text-white mb-1">5k+</div>
            <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Active Helpers</div>
          </div>
          <div>
            <div className="text-4xl font-black text-white mb-1">3k+</div>
            <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Happy Families</div>
          </div>
        </div>
      </section>

      {/* Quick Footer Links */}
      <footer className="px-6 py-12 text-center bg-white mt-12">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-bold text-slate-400 mb-8">
          <Link href="/helper/jobs" className="hover:text-primary-600 transition-colors">Browse Jobs</Link>
          <Link href="/employer/jobs" className="hover:text-primary-600 transition-colors">Post a Job</Link>
          <Link href="/employer/bookmarks" className="hover:text-primary-600 transition-colors">Bookmarks</Link>
        </div>
        <p className="text-xs font-medium text-slate-300">© 2026 SosoHelper HK. All rights reserved.</p>
      </footer>
    </div>
  );
}
