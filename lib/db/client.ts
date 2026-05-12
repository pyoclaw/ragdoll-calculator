/**
 * Supabase client initialization for the application
 * Provides both client-side and server-side clients
 */

import { createBrowserClient } from "@supabase/ssr";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Browser/Client-side Supabase client
 * Used in client components and browser JavaScript
 */
export function createClient() {
  const cookieStore = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return cookieStore;
}

/**
 * Server-side Supabase client helper
 * Used in API routes and server actions
 */
export async function createServerSideClient() {
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
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Get the current user from the server-side session
 */
export async function getCurrentUser() {
  const client = await createServerSideClient();
  const {
    data: { session },
  } = await client.auth.getSession();

  return session?.user || null;
}
