/**
 * Site header / nav. Server Component that reads current auth state to show
 * Sign In vs. Dashboard. Layout calls revalidatePath after login/logout so
 * this updates after auth state changes.
 *
 * Note: this is UI state only. Real authorization is enforced in the proxy
 * (redirect) and in individual page/route handlers (getCurrentUser checks).
 */

import Link from "next/link";
import { getCurrentUser } from "@/lib/db/client";

export async function SiteHeader() {
  const user = await getCurrentUser();
  const isAuthed = user !== null;

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
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 transition"
            >
              Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 transition"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 transition"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
