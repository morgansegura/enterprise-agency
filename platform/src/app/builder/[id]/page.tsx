import type { Data } from '@puckeditor/core'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'

import { BuilderClient } from './builder-client'
import type { InitialSettings } from './page-settings'

export default async function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config: await config })

  // Builder requires the same admin session as the CMS (shared cookie, same host).
  const { user } = await payload.auth({ headers: await getHeaders() })
  if (!user) {
    redirect(`/admin/login?redirect=${encodeURIComponent(`/builder/${id}`)}`)
  }

  const page = await payload
    .findByID({ collection: 'pages', id, draft: true, depth: 1 })
    .catch(() => null)

  const data = ((page?.puckData as Data) ?? { content: [], root: {} }) as Data

  const title = (page as { title?: string } | null)?.title ?? 'Untitled page'
  const slug = (page as { slug?: string } | null)?.slug ?? ''
  const tenant = (
    page as {
      tenant?: { id?: string | number; domain?: string | null } | number | string | null
    } | null
  )?.tenant
  const domain = tenant && typeof tenant === 'object' ? tenant.domain : null
  const tenantId = tenant && typeof tenant === 'object' ? tenant.id : (tenant ?? undefined)
  const path = slug === 'home' ? '' : slug
  const viewUrl = domain ? `http://${domain}/${path}` : `/${path}`

  const meta = (
    page as {
      meta?: {
        title?: string | null
        description?: string | null
        image?: { id?: string | number; url?: string; alt?: string } | number | string | null
      }
    } | null
  )?.meta
  const metaImage =
    meta?.image && typeof meta.image === 'object' && meta.image.id != null
      ? {
          id: meta.image.id,
          url: meta.image.url,
          alt: meta.image.alt,
        }
      : null

  const settings: InitialSettings = {
    title,
    slug,
    metaTitle: meta?.title ?? '',
    metaDescription: meta?.description ?? '',
    metaImage,
  }

  return (
    <BuilderClient
      id={String(id)}
      data={data}
      settings={settings}
      viewUrl={viewUrl}
      tenantId={tenantId != null ? String(tenantId) : ''}
    />
  )
}
