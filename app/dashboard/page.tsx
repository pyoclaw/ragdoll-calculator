import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Dashboard — Ragdoll Breeder Tools",
};

/**
 * Render the dashboard page for an authenticated user.
 *
 * Enforces authentication and redirects to `/auth/login` when the user's claims are missing or invalid.
 *
 * @returns A JSX element representing the dashboard UI that greets the user (by name or email), displays the user's email, shows three metric cards (Cats registered, Crosses planned, Litters recorded), and provides navigation links to the genetics calculator and litter planner.
 */
export default async function DashboardPage() {
  // Defense in depth: proxy already redirects unauthed users away from
  // /dashboard, but verify here too per the Next.js auth guide
  // ("security checks belong close to data, not just middleware").
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const claims = data.claims;
  const displayName =
    (claims.user_metadata?.name as string | undefined) ??
    (claims.email as string | undefined) ??
    "there";

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {displayName}
            </h1>
            <p className="text-gray-600 mt-1">{claims.email as string}</p>
          </div>
          <LogoutButton />
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
            <Link href="/genetics" className={buttonVariants()}>
              Open Calculator
            </Link>
            <Link
              href="/litter-planner"
              className={buttonVariants({ variant: "outline" })}
            >
              Plan a Litter
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
