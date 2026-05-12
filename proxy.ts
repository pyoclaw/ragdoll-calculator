/**
 * Next.js 16 Proxy (renamed from Middleware).
 *
 * Refreshes the Supabase auth session on every request so cookies stay
 * in sync. Without this, expired tokens persist and Server Components
 * see stale auth state.
 *
 * Per Supabase docs, the proxy must:
 *  1. Construct a server client bound to request + response cookies
 *  2. Call supabase.auth.getUser() — this triggers refresh if needed
 *  3. Return the response so updated cookies propagate to the browser
 *
 * Do NOT add data fetching here — runs on every request including prefetches.
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Mutate request so getUser() sees updated cookies
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          // Recreate the response with the mutated request
          response = NextResponse.next({ request });
          // Forward refreshed cookies to the browser
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  // IMPORTANT: getUser() must run between client creation and response return.
  // It revalidates the JWT and refreshes the session if needed.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Optimistic redirect: gate /dashboard for unauthenticated users.
  // (Real authorization checks happen in the Data Access Layer.)
  const path = request.nextUrl.pathname;
  if (!user && path.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", path);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login/signup pages
  if (user && (path === "/login" || path === "/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Skip statics, images, and favicon. Run on everything else so auth cookies
  // stay fresh across the app.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
