import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'

import { BuilderDashboard, type DashPage, type DashTenant } from './dashboard'

export const dynamic = 'force-dynamic'

export default async function BuilderHome() {
  const payload = await getPayload({ config: await config })
  const { user } = await payload.auth({ headers: await getHeaders() })
  if (!user) redirect('/admin/login?redirect=/builder')

  const [pagesRes, tenantsRes] = await Promise.all([
    payload.find({
      collection: 'pages',
      depth: 0,
      limit: 500,
      draft: true,
      sort: '-updatedAt',
      overrideAccess: true,
    }),
    payload.find({
      collection: 'tenants',
      depth: 0,
      limit: 100,
      sort: 'name',
      overrideAccess: true,
    }),
  ])

  const tenants: DashTenant[] = tenantsRes.docs.map((t) => ({
    id: String(t.id),
    name: (t as { name?: string }).name ?? `Tenant ${t.id}`,
    domain: (t as { domain?: string | null }).domain ?? null,
  }))

  const pages: DashPage[] = pagesRes.docs.map((p) => {
    const tenant = (p as { tenant?: number | string | { id?: number | string } }).tenant
    const tenantId = tenant && typeof tenant === 'object' ? tenant.id : tenant
    return {
      id: String(p.id),
      title: (p as { title?: string }).title ?? '(untitled)',
      slug: (p as { slug?: string }).slug ?? '',
      status: (p as { _status?: string })._status === 'published' ? 'published' : 'draft',
      tenantId: tenantId != null ? String(tenantId) : null,
    }
  })

  return <BuilderDashboard pages={pages} tenants={tenants} user={user.email ?? ''} />
}
