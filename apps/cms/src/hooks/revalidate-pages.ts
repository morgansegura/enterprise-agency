import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateFrontend } from '../lib/preview'

/** Route path for a page slug ("home" → "/"). */
const pathForSlug = (slug: string) => (slug && slug !== 'home' ? `/${slug}` : '/')

/**
 * On publish (or editing an already-published doc), refresh the live page. Draft
 * autosaves must NOT revalidate, or unpublished edits would replace the live
 * page.
 */
export const revalidatePages: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  const isPublished = doc?._status === 'published'
  const wasPublished = previousDoc?._status === 'published'
  if (!isPublished && !wasPublished) return doc

  const tenant = doc?.tenant ?? previousDoc?.tenant
  if (doc?.slug) await revalidateFrontend(pathForSlug(doc.slug), tenant, req)
  if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
    await revalidateFrontend(pathForSlug(previousDoc.slug), tenant, req)
  }
  return doc
}

export const revalidatePagesAfterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  if (doc?.slug) {
    await revalidateFrontend(pathForSlug(doc.slug), doc?.tenant, req)
  }
  return doc
}
