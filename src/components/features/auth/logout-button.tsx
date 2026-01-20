'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

interface LogoutButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  showIcon?: boolean
}

export function LogoutButton({ variant = 'ghost', showIcon = true }: LogoutButtonProps) {
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <Button onClick={handleLogout} variant={variant} className="w-full justify-start">
      {showIcon && <LogOut className="w-4 h-4 mr-2" />}
      Sign out
    </Button>
  )
}
