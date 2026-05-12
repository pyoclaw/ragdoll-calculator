/**
 * Site header / nav. Server Component that reads current auth state via
 * Supabase JWT claims and shows Sign In vs. Dashboard accordingly.
 *
 * Auth state is enforced in proxy.ts and individual page handlers — this
 * is UI state only.
 */

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";

export async function SiteHeader() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const isAuthed = data?.claims != null;

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">🐱</span>
          </div>
          <Link href="/" className="text-xl font-bold text-gray-900">
            Ragdoll Breeder Tools
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/reference"
            className="text-gray-700 hover:text-gray-900 transition"
          >
            Reference
          </Link>
          <Link
            href="/genetics"
            className="text-gray-700 hover:text-gray-900 transition"
          >
            Calculator
          </Link>
          <Link
            href="/litter-planner"
            className="text-gray-700 hover:text-gray-900 transition"
          >
            Litter Planner
          </Link>

          {isAuthed ? (
            <Link href="/dashboard" className={buttonVariants()}>
              Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="text-gray-700 hover:text-gray-900 transition"
              >
                Sign in
              </Link>
              <Link href="/auth/sign-up" className={buttonVariants()}>
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
