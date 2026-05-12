import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Public routes accessible without authentication.
 * Everything else (currently just /dashboard and future user-scoped routes)
 * requires a logged-in user.
 */
const PUBLIC_PATHS = ["/", "/reference", "/genetics", "/litter-planner"];

/**
 * Auth-related paths — always accessible regardless of session state.
 */
const AUTH_PATH_PREFIX = "/auth";

/**
 * Determines whether a request pathname is treated as publicly accessible.
 *
 * @param pathname - The request pathname to check (e.g., request.nextUrl.pathname)
 * @returns `true` if the pathname is an auth route, an API route (`/api/*`), or matches a known public path; `false` otherwise.
 */
function isPublicPath(pathname: string): boolean {
  if (pathname.startsWith(AUTH_PATH_PREFIX)) return true;
  if (pathname.startsWith("/api/")) return true; // API has its own auth checks
  return PUBLIC_PATHS.includes(pathname);
}

/**
 * Refreshes Supabase session cookies for the incoming request and enforces authentication redirects for protected routes.
 *
 * @param request - The incoming `NextRequest`; used to read/write cookies and determine the requested pathname.
 * @returns A `NextResponse` that is either:
 *  - a redirect to `/auth/login` with a `next` query when an unauthenticated user requests a protected page,
 *  - a redirect to `/dashboard` when an authenticated user visits `/auth/login` or `/auth/sign-up`,
 *  - or a response preserving any updated Supabase cookies to keep client/server session state synchronized.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  // IMPORTANT: Do not run code between createServerClient and getClaims().
  // A simple mistake could make it very hard to debug random logouts.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const pathname = request.nextUrl.pathname;

  // Unauthenticated user trying to hit a protected page → /auth/login
  if (!user && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Authenticated user landing on login or sign-up → /dashboard
  if (
    user &&
    (pathname === "/auth/login" || pathname === "/auth/sign-up")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // IMPORTANT: Return supabaseResponse as-is. If you build a new response,
  // copy the cookies over or the browser & server sessions will desync.
  return supabaseResponse;
}
