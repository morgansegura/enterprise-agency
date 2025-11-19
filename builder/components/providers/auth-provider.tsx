'use client'

import { useEffect } from 'react'
import { initializeAuth } from '@/lib/auth'
import { useAuthStore } from '@/lib/stores/auth-store'
import { logger } from '@/lib/logger'

/**
 * Auth Provider - Initializes authentication on app load
 *
 * Enterprise practices:
 * - Validates session via HTTP-only cookies
 * - Handles token refresh automatically
 * - Updates Zustand store with current user
 * - Provides loading state during initialization
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuthStore()

  useEffect(() => {
    // Initialize auth on mount
    initializeAuth().catch((error: Error) => {
      logger.error('Failed to initialize auth', error)
    })
  }, [])

  // Show loading state during initial auth check
  if (isLoading) {
    return (
      <div className="auth-provider-loading">
        <div className="auth-provider-spinner">Loading...</div>
      </div>
    )
  }

  return <>{children}</>
}
