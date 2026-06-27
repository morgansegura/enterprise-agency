import type { CollectionBeforeChangeHook, Payload } from 'payload'

const isHttpUrl = (v: unknown): v is string =>
  typeof v === 'string' && /^https?:\/\/\S+$/i.test(v.trim())

/** {upload field name, companion URL field name, optional alt source field}. */
export type ImageUrlPair = { image: string; url: string; alt?: string }

async function createMediaFromUrl(
  payload: Payload,
  url: string,
  alt: string,
): Promise<number | string | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`fetch failed (${res.status})`)
    const mimetype = res.headers.get('content-type') ?? ''
    if (!mimetype.startsWith('image/')) {
      throw new Error(`not an image (${mimetype || 'unknown type'})`)
    }
    const buffer = Buffer.from(await res.arrayBuffer())
    const name = url.split('/').pop()?.split('?')[0] || `import-${Date.now()}.jpg`
    const doc = await payload.create({
      collection: 'media',
      data: { alt },
      file: { data: buffer, mimetype, name, size: buffer.length },
      overrideAccess: true,
    })
    return doc.id
  } catch (err) {
    payload.logger?.warn(`imageUrl import skipped for "${url}": ${String(err)}`)
    return null
  }
}

function altFor(node: Record<string, unknown>, key?: string): string {
  const pick = (k?: string) => (k && typeof node[k] === 'string' ? (node[k] as string) : '')
  return (
    pick(key) ||
    pick('imageAlt') ||
    pick('alt') ||
    pick('heading') ||
    pick('name') ||
    pick('title') ||
    pick('author') ||
    'Imported image'
  )
}

async function walk(node: unknown, payload: Payload, pairs: ImageUrlPair[]): Promise<void> {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) {
    for (const item of node) await walk(item, payload, pairs)
    return
  }
  const obj = node as Record<string, unknown>
  for (const { image, url, alt } of pairs) {
    const u = obj[url]
    if (isHttpUrl(u) && !obj[image]) {
      const id = await createMediaFromUrl(payload, u.trim(), altFor(obj, alt))
      if (id != null) {
        obj[image] = id
        obj[url] = ''
      }
    }
  }
  for (const v of Object.values(obj)) {
    if (v && typeof v === 'object') await walk(v, payload, pairs)
  }
}

/**
 * `beforeChange` hook factory. For each {image, url} pair it deep-walks the doc
 * and imports any non-empty `url` INTO the Media library (so it gets the CDN,
 * crop, and responsive sizes), points the `image` upload at it, and clears the
 * url. One pass handles top-level fields AND nested blocks/arrays (page layout,
 * portrait people, hero slides). Best-effort (a bad URL is left for the FE to
 * render directly) and idempotent (once `image` is set, later saves skip it).
 */
export function importImageUrls(pairs: ImageUrlPair[]): CollectionBeforeChangeHook {
  return async ({ data, req }) => {
    await walk(data, req.payload, pairs)
    return data
  }
}
