'use server'

import { getPayload } from 'payload'

import config from '@/payload.config'

/**
 * Upload an image into the Media collection via the Local API. Runs server-side
 * (no browser-cookie dependency) — this is a builder/dev surface; gate behind
 * auth before opening the builder to clients.
 */
export async function uploadMedia(formData: FormData) {
  const file = formData.get('file')
  if (!(file instanceof File)) return { error: 'No file provided' }
  try {
    const payload = await getPayload({ config: await config })
    const buffer = Buffer.from(await file.arrayBuffer())
    const doc = await payload.create({
      collection: 'media',
      data: { alt: file.name },
      file: {
        data: buffer,
        mimetype: file.type || 'application/octet-stream',
        name: file.name,
        size: file.size,
      },
      overrideAccess: true,
    })
    return {
      doc: {
        id: doc.id,
        url: doc.url ?? undefined,
        alt: doc.alt ?? undefined,
        width: doc.width ?? undefined,
        height: doc.height ?? undefined,
      },
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Upload failed' }
  }
}
