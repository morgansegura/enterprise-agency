import { getPayload, type Where } from 'payload'

import config from '@/payload.config'

export type StaffMember = {
  id: string
  name: string
  role: string
  group: string
  bio: string
  email: string
  photo: { url?: string; alt?: string } | null
}

/**
 * Tenant-scoped staff fetch for data-bound blocks. `group` (optional) narrows
 * to one section, e.g. "Coaching Staff". Sorted by the collection's `order`.
 */
export async function getStaff(tenantId: string | number, group?: string): Promise<StaffMember[]> {
  const payload = await getPayload({ config: await config })
  const where: Where =
    group && group !== 'all'
      ? { and: [{ tenant: { equals: tenantId } }, { group: { equals: group } }] }
      : { tenant: { equals: tenantId } }

  const { docs } = await payload.find({
    collection: 'staff',
    where,
    sort: 'order',
    limit: 200,
    depth: 1,
    overrideAccess: true,
  })

  return docs.map((d) => {
    const photo = (d as { photo?: { url?: string; alt?: string } | null }).photo
    return {
      id: String(d.id),
      name: (d as { name?: string }).name ?? '',
      role: (d as { role?: string }).role ?? '',
      group: (d as { group?: string }).group ?? '',
      bio: (d as { bio?: string }).bio ?? '',
      email: (d as { email?: string }).email ?? '',
      photo: photo && typeof photo === 'object' ? { url: photo.url, alt: photo.alt } : null,
    }
  })
}
