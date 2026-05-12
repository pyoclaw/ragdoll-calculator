/**
 * Supabase auth callback handler.
 *
 * Email confirmation links and OAuth redirects land here with a `code`
 * query param. We exchange it for a session cookie via the SSR client,
 * then redirect to the dashboard (or wherever the user was headed).
 */

import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/client";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";

  if (!code) {
    // No code = malformed link. Send them to login with an error hint.
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`
    );
  }

  return NextResponse.redirect(`${origin}${redirectTo}`);
}
