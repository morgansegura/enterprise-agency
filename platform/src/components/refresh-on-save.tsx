'use client'

import { RefreshRouteOnSave as PayloadRefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import React from 'react'

/**
 * Renders nothing — listens for Payload Live Preview postMessage events and
 * refreshes the (server-rendered) route on save, so the admin's Live Preview
 * iframe shows the real published output. One renderer, no preview fork.
 */
export function RefreshOnSave() {
  const router = useRouter()
  return (
    <PayloadRefreshRouteOnSave
      refresh={() => router.refresh()}
      serverURL={process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4010'}
    />
  )
}
