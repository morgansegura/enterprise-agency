import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

/**
 * Best-effort `revalidatePath`. Inside the Next server (Payload's route handler)
 * it triggers on-demand ISR; run from a standalone script (e.g. the seed) there
 * is no static-generation store, so it throws — swallow that, nothing to ISR.
 */
function safeRevalidate(path: string) {
  try {
    revalidatePath(path)
  } catch {
    // Not in a Next request context (seed/CLI) — no page cache to revalidate.
  }
}

/**
 * On publish: regenerate the page's static HTML on the next request
 * (on-demand ISR). Runs inside the Next server request (Payload's route
 * handler), so revalidatePath is valid here.
 */
export const revalidatePages: CollectionAfterChangeHook = ({ doc, previousDoc }) => {
  if (doc?.slug) safeRevalidate(`/${doc.slug}`)
  if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
    safeRevalidate(`/${previousDoc.slug}`)
  }
  return doc
}

export const revalidatePagesAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  if (doc?.slug) safeRevalidate(`/${doc.slug}`)
  return doc
}
