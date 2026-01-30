import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Shield, Star, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-slate-50 py-20 md:py-32 overflow-hidden">
        <div className="container relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Find the Perfect <span className="text-primary">Helper</span> <br className="hidden md:block" />
            for Your Family
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Browse through thousands of verified profiles, read reviews, and connect directly with the best domestic helpers in Hong Kong.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/helpers">Find a Helper</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link href="/auth/register">I'm a Helper</Link>
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              Verified Profiles
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Direct Contact
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              Top Rated
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose SosoHelper?</h2>
          <p className="text-muted-foreground">We make it easy and safe to find the right help.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
            <p className="text-muted-foreground">Filter helpers by nationality, experience, skills, and availability to find your ideal match.</p>
          </div>
          
          <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-muted-foreground">Your data is safe with us. We ensure a secure platform for both employers and helpers.</p>
          </div>

          <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Review System</h3>
            <p className="text-muted-foreground">Read honest reviews from other employers to help you make informed decisions.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container">
        <div className="bg-primary rounded-2xl p-8 md:p-16 text-center text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to find your next helper?</h2>
          <p className="text-lg opacity-90 mb-10 max-w-xl mx-auto">
            Join thousands of happy families in Hong Kong who found their perfect helper through SosoHelper.
          </p>
          <Button size="lg" variant="secondary" className="px-10" asChild>
            <Link href="/auth/register">Get Started Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}