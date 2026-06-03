'use server'

import { headers as getHeaders } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'
import type { Data } from '@puckeditor/core'

import config from '@/payload.config'

/**
 * Write a page's Puck layout as a draft or published. Authenticates with the
 * admin session (super-admin) and carries over the page's existing tenant
 * (required by the multi-tenant plugin). Publishing revalidates the live path.
 */
async function writePage(id: string, data: Data, publish: boolean) {
  const payload = await getPayload({ config: await config })
  const { user } = await payload.auth({ headers: await getHeaders() })
  const existing = await payload.findByID({
    collection: 'pages',
    id,
    depth: 0,
    draft: true,
    overrideAccess: true,
  })

  const page = await payload.update({
    collection: 'pages',
    id,
    user: user ?? undefined,
    draft: !publish,
    data: {
      puckData: data as never,
      tenant: existing?.tenant as never,
      ...(publish ? { _status: 'published' as const } : {}),
    },
  })

  if (publish && page?.slug) revalidatePath(`/${page.slug}`)
}

export async function saveDraft(id: string, data: Data) {
  await writePage(id, data, false)
}

export async function publishPage(id: string, data: Data) {
  await writePage(id, data, true)
}

export type PageSettings = {
  title: string
  slug: string
  metaTitle?: string
  metaDescription?: string
  metaImage?: number | string | null
}

/**
 * Update a page's structured fields (title, slug, SEO) from the in-builder
 * settings drawer — no trip to the admin. Saved as a draft (keeps the existing
 * tenant + published version untouched until the layout is published).
 */
export async function savePageSettings(
  id: string,
  settings: PageSettings,
): Promise<{ error?: string }> {
  const payload = await getPayload({ config: await config })
  const { user } = await payload.auth({ headers: await getHeaders() })
  const existing = await payload.findByID({
    collection: 'pages',
    id,
    depth: 0,
    draft: true,
    overrideAccess: true,
  })

  try {
    await payload.update({
      collection: 'pages',
      id,
      user: user ?? undefined,
      draft: true,
      data: {
        title: settings.title,
        slug: settings.slug,
        tenant: existing?.tenant as never,
        meta: {
          title: settings.metaTitle || undefined,
          description: settings.metaDescription || undefined,
          image: settings.metaImage ?? undefined,
        } as never,
      },
    })
    return {}
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Could not save settings.'
    return {
      error: /unique|duplicate/i.test(msg)
        ? `The slug “${settings.slug}” is already used by another page for this tenant.`
        : msg,
    }
  }
}
