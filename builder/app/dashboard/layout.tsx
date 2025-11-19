'use client'

import { AuthGuard } from '@/components/auth/auth-guard'

/**
 * Dashboard Layout - Protected by authentication
 *
 * Enterprise practices:
 * - Auth guard ensures only authenticated users can access
 * - Automatic redirect to login if not authenticated
 * - Loading state during auth check
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireAuth={true}>
      {children}
    </AuthGuard>
  )
}
