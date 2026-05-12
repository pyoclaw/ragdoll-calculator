import { type EmailOtpType } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

import { createClient } from '@/lib/supabase/server'

/**
 * Handle email OTP confirmation and redirect the user based on verification outcome.
 *
 * Reads `token_hash`, `type`, and optional `next` from the request URL; treats `next` as a same-site
 * root-relative path (falls back to `/` if absent or unsafe). Verifies the OTP via the Supabase
 * server client and redirects to the sanitized `next` on success. On verification failure or when
 * required query parameters are missing, redirects to `/auth/error` with an error message.
 *
 * @param request - Incoming NextRequest containing the `token_hash`, `type`, and optional `next` query parameters
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const _next = searchParams.get('next')
  const next = _next?.startsWith('/') ? _next : '/'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // redirect user to specified redirect URL or root of app
      redirect(next)
    } else {
      // redirect the user to an error page with some instructions
      redirect(`/auth/error?error=${error?.message}`)
    }
  }

  // redirect the user to an error page with some instructions
  redirect(`/auth/error?error=No token hash or type`)
}
