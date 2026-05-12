'use client'

import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

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
