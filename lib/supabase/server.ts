import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Create and return a Supabase server-side client wired to Next.js cookies.
 *
 * The returned client is configured with NEXT_PUBLIC_SUPABASE_URL and
 * NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY and uses the current Next.js cookie
 * store for request-scoped authentication. If writing cookies back to the
 * store fails (for example when called from a Server Component), those
 * failures are silently ignored.
 *
 * @returns A Supabase server-side client instance configured with the app URL,
 * publishable key, and a Next.js cookie adapter
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
