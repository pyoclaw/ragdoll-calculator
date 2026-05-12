import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/db/client";
import { logout } from "@/app/actions/auth";

export const metadata = {
  title: "Dashboard — Ragdoll Breeder Tools",
};

export default async function DashboardPage() {
  // Defense in depth: proxy already redirects, but verify here too.
  // (Per Next.js auth guide: security checks belong close to data, not just middleware.)
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const displayName =
    (user.user_metadata?.name as string | undefined) ?? user.email;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {displayName}
            </h1>
            <p className="text-gray-600 mt-1">{user.email}</p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              Sign out
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-3xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600 mt-1">Cats registered</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-3xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600 mt-1">Crosses planned</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-3xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600 mt-1">Litters recorded</div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Get started
          </h2>
          <p className="text-sm text-gray-700 mb-4">
            Your account is set up. Cat registration and saved crosses are
            coming soon — for now, head to the calculator to start planning.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/genetics"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
            >
              Open Calculator
            </Link>
            <Link
              href="/litter-planner"
              className="px-4 py-2 bg-white border border-gray-300 text-gray-800 text-sm font-medium rounded hover:bg-gray-50 transition"
            >
              Plan a Litter
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
