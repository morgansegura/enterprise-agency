import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateFrontend } from '../lib/preview'

/**
 * On publish, refresh the news index + the post's page on the tenant's FE (a
 * separate deployment — the CMS's own revalidatePath can't reach it). Skip draft
 * autosaves so unpublished edits don't hit the live site.
 */
export const revalidatePosts: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  const isPublished = doc?._status === 'published'
  const wasPublished = previousDoc?._status === 'published'
  if (!isPublished && !wasPublished) return doc

  const tenant = doc?.tenant ?? previousDoc?.tenant
  await revalidateFrontend('/news', tenant, req)
  if (doc?.slug) await revalidateFrontend(`/news/${doc.slug}`, tenant, req)
  return doc
}

export const revalidatePostsAfterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await revalidateFrontend('/news', doc?.tenant, req)
  if (doc?.slug) await revalidateFrontend(`/news/${doc.slug}`, doc?.tenant, req)
  return doc
}
