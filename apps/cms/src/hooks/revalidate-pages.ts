import { revalidatePath } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from 'payload'

/**
 * On publish: regenerate the page's static HTML on the next request
 * (on-demand ISR). Runs inside the Next server request (Payload's route
 * handler), so revalidatePath is valid here.
 */
export const revalidatePages: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
}) => {
  if (doc?.slug) revalidatePath(`/${doc.slug}`)
  if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
    revalidatePath(`/${previousDoc.slug}`)
  }
  return doc
}

export const revalidatePagesAfterDelete: CollectionAfterDeleteHook = ({
  doc,
}) => {
  if (doc?.slug) revalidatePath(`/${doc.slug}`)
  return doc
}
