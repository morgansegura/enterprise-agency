'use server'

import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Create a draft page for a tenant and jump straight into the builder. Returns
 * an error string on failure (e.g. duplicate slug); on success it redirects.
 */
export async function createPage(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const title = String(formData.get('title') ?? '').trim()
  const rawSlug = String(formData.get('slug') ?? '').trim()
  const tenant = String(formData.get('tenant') ?? '').trim()
  const slug = slugify(rawSlug || title)

  if (!title) return { error: 'Title is required.' }
  if (!slug) return { error: 'A URL slug is required.' }
  if (!tenant) return { error: 'Pick a tenant.' }

  const payload = await getPayload({ config: await config })
  const { user } = await payload.auth({ headers: await getHeaders() })
  if (!user) redirect('/admin/login?redirect=/builder')

  let newId: string | number
  try {
    const page = await payload.create({
      collection: 'pages',
      user,
      draft: true,
      data: {
        title,
        slug,
        tenant: Number(tenant) as never,
        _status: 'draft' as never,
      },
    })
    newId = page.id
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Could not create the page.'
    return {
      error: /unique|duplicate/i.test(msg)
        ? `A page with slug “${slug}” already exists for that tenant.`
        : msg,
    }
  }

  redirect(`/builder/${newId}`)
}
