import type { CollectionBeforeChangeHook } from 'payload'

const isHttpUrl = (v: unknown): v is string =>
  typeof v === 'string' && /^https?:\/\/\S+$/i.test(v.trim())

async function fetchToFile(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`fetch failed (${res.status})`)
  const mimetype = res.headers.get('content-type') ?? ''
  if (!mimetype.startsWith('image/')) {
    throw new Error(`not an image (${mimetype || 'unknown type'})`)
  }
  const buffer = Buffer.from(await res.arrayBuffer())
  const name = url.split('/').pop()?.split('?')[0] || `import-${Date.now()}.jpg`
  return { data: buffer, mimetype, name, size: buffer.length }
}

/**
 * When a layout block has an `imageUrl` set (and no managed `image` chosen),
 * pull that remote image INTO the Media library — so it gets the CDN, crop, and
 * responsive sizes like any upload — then point the block's `image` upload at it
 * and clear `imageUrl`. Best-effort: a failed fetch leaves `imageUrl` untouched
 * so the FE still renders it directly. Idempotent: once imported, `image` is set
 * so later saves skip it.
 */
export const importBlockImageUrls: CollectionBeforeChangeHook = async ({ data, req }) => {
  const layout = (data as { layout?: Record<string, unknown>[] }).layout
  if (!Array.isArray(layout)) return data

  for (const block of layout) {
    const imageUrl = block?.imageUrl
    if (!isHttpUrl(imageUrl) || block.image) continue
    try {
      const file = await fetchToFile(imageUrl.trim())
      const doc = await req.payload.create({
        collection: 'media',
        data: {
          alt: (block.imageAlt as string) || (block.heading as string) || 'Imported image',
        },
        file,
        overrideAccess: true,
      })
      block.image = doc.id
      block.imageUrl = ''
    } catch (err) {
      req.payload.logger?.warn(`imageUrl import skipped for "${String(imageUrl)}": ${String(err)}`)
    }
  }
  return data
}
