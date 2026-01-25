import Link from "next/link";

export default function Page() {
  return (
    <main className="space-y-4">
      <h1 className="text-xl font-bold">SosoHelper</h1>
      <p className="text-sm text-slate-700">
        Connect foreign helpers with Hong Kong employers.
      </p>

      <div className="grid gap-3">
        <Link className="rounded border px-4 py-3 bg-blue-600 text-white text-center font-medium" href="/auth/signup">
          Get Started / Sign Up
        </Link>
        <Link className="rounded border px-4 py-3 text-center font-medium" href="/auth/login">
          Log In
        </Link>
        <hr className="my-2" />
        <Link className="rounded border px-4 py-3" href="/helper/profile">
          Helper: Create / Edit Profile
        </Link>
        <Link className="rounded border px-4 py-3" href="/helper/jobs">
          Helper: Browse Jobs
        </Link>
        <Link className="rounded border px-4 py-3" href="/employer/search">
          Employer: Search Helpers
        </Link>
        <Link className="rounded border px-4 py-3" href="/employer/jobs">
          Employer: Post / Manage Jobs
        </Link>
        <Link className="rounded border px-4 py-3" href="/employer/bookmarks">
          Employer: My Bookmarks
        </Link>
      </div>
    </main>
  );
}
