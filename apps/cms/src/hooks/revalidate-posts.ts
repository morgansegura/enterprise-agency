import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

/** Best-effort: no-ops outside a Next request context (e.g. the seed script). */
function safeRevalidate(path: string) {
  try {
    revalidatePath(path)
  } catch {
    // Not in a Next request (seed/CLI) — no page cache to revalidate.
  }
}

export const revalidatePosts: CollectionAfterChangeHook = ({ doc }) => {
  safeRevalidate('/blog')
  if (doc?.slug) safeRevalidate(`/blog/${doc.slug}`)
  return doc
}

export const revalidatePostsAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  safeRevalidate('/blog')
  if (doc?.slug) safeRevalidate(`/blog/${doc.slug}`)
  return doc
}
