import { createBrowserClient } from '@supabase/ssr'

/**
 * Create a Supabase browser client configured from NEXT_PUBLIC environment variables.
 *
 * @returns A Supabase browser client initialized with `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
