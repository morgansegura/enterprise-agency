import type { CollectionConfig } from 'payload'
import { tenantScopedRead } from '../access/tenant-read'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: tenantScopedRead(),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    // Native Payload image editing (sharp): drag-to-set focal point + crop UI,
    // plus responsive sizes generated on upload (each honoring the crop/focal
    // point). Focal point lets the FE keep the right part centered when an
    // image is cropped to mobile.
    crop: true,
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300 },
      { name: 'card', width: 768 },
      { name: 'feature', width: 1600 },
      { name: 'og', width: 1200, height: 630 },
    ],
  },
}
