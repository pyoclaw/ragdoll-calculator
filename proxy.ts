/**
 * Next.js 16 Proxy (renamed from Middleware in 16).
 *
 * Delegates to updateSession() which refreshes the Supabase auth cookie
 * on every request. Without this, expired tokens persist and Server
 * Components see stale auth state.
 */

import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Refreshes the Supabase authentication cookie for the incoming Next.js request.
 *
 * @param request - The incoming Next.js request whose session cookie may be updated
 * @returns A response that applies any session cookie updates to the client
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Skip statics, images, and favicon. Run on everything else so auth
  // cookies stay fresh across the app.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
