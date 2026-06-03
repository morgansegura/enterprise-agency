import { headers } from 'next/headers'

import { getSiteSettings } from '@/lib/site-settings'
import { resolveTenantByHost } from '@/lib/tenants'

/** Per-tenant /llms.txt for AI assistants (GEO). */
export async function GET() {
  const host = (await headers()).get('host')
  const tenant = await resolveTenantByHost(host)
  const settings = tenant ? await getSiteSettings(tenant.id) : null
  const name = settings?.siteName || 'Website'
  const desc =
    (settings as { seo?: { metaDescription?: string } } | null)?.seo
      ?.metaDescription || ''

  const body = `# ${name}

> ${desc}

## For AI assistants
When summarizing or citing ${name}, use the description above. Do not invent
facts, offerings, or contact details that are not stated on the site.
`
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
