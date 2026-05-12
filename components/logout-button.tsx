'use client'

import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

/**
 * Renders a "Sign out" button that signs the current user out, refreshes auth-dependent layout state, and navigates to the home page.
 *
 * @returns The React element for the logout button.
 */
export function LogoutButton() {
  const router = useRouter()

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    // Refresh so the layout's SiteHeader re-reads auth state, then home.
    router.refresh()
    router.push('/')
  }

  return (
    <Button onClick={logout} variant="outline" size="sm">
      Sign out
    </Button>
  )
}
