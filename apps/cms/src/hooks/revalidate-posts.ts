import { revalidatePath } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from 'payload'

export const revalidatePosts: CollectionAfterChangeHook = ({ doc }) => {
  revalidatePath('/blog')
  if (doc?.slug) revalidatePath(`/blog/${doc.slug}`)
  return doc
}

export const revalidatePostsAfterDelete: CollectionAfterDeleteHook = ({
  doc,
}) => {
  revalidatePath('/blog')
  if (doc?.slug) revalidatePath(`/blog/${doc.slug}`)
  return doc
}
