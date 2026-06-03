import { ImageResponse } from 'next/og'
import { headers } from 'next/headers'

import { getSiteSettings } from '@/lib/site-settings'
import { resolveTenantByHost } from '@/lib/tenants'

/** Per-tenant branded OG image (1200×630). Optional ?title= overrides. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title')
  const host = (await headers()).get('host')
  const tenant = await resolveTenantByHost(host)
  const settings = tenant ? await getSiteSettings(tenant.id) : null
  const siteName = settings?.siteName || 'Web & Funnel'
  const theme = (tenant as { theme?: { primary?: string; secondary?: string } } | null)
    ?.theme
  const bg = theme?.primary || '#1a3f56'
  const accent = theme?.secondary || '#ac8365'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: bg,
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', width: 80, height: 8, background: accent, marginBottom: 32 }} />
        <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1 }}>
          {title || siteName}
        </div>
        {title ? (
          <div style={{ fontSize: 32, opacity: 0.85, marginTop: 24 }}>
            {siteName}
          </div>
        ) : null}
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
