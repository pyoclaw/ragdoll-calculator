/**
 * Supabase client factories using @supabase/ssr.
 *
 * Two clients exist because they handle cookies differently:
 *  - Browser client: reads/writes cookies via document.cookie
 *  - Server client: reads cookies from the request, writes via Next.js cookies() API
 *
 * Always use the server client in Server Components, Server Actions, and Route Handlers.
 */

import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Browser-side Supabase client.
 * Safe to call in Client Components. Returns a singleton-like instance per render.
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Server-side Supabase client.
 * Use in Server Components, Server Actions, and Route Handlers.
 * Note: Next.js 16's cookies() is async — must be awaited.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // setAll throws when called from a Server Component (cookies are
            // read-only there). Safe to ignore as long as proxy.ts handles
            // session refresh on every request.
          }
        },
      },
    }
  );
}

/**
 * Get the currently authenticated user from the server-side session.
 * Returns null if no session exists.
 *
 * Per Supabase docs, prefer getUser() over getSession() in server code
 * because getSession() reads from cookies without revalidating.
 */
export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
