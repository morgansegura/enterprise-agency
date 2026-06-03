import type { ComponentConfig } from '@puckeditor/core'

import type { BlockData } from '@/lib/generate-css'
import { MediaField } from '@/components/puck/media-field'

import { alignOptions, styleField } from './shared'

export function ImageView({ id, image, caption, width, align }: BlockData) {
  const img = image as
    | { url?: string; alt?: string; width?: number; height?: number }
    | null
    | undefined
  if (!img?.url) return null
  return (
    <section
      className={`block image-block b-${id}`}
      data-el={id}
      data-align={align}
      data-width={width}
    >
      <figure className="image-figure">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="image-img"
          src={img.url}
          alt={img.alt ?? ''}
          width={img.width}
          height={img.height}
          loading="lazy"
        />
        {caption ? (
          <figcaption className="image-caption">{String(caption)}</figcaption>
        ) : null}
      </figure>
    </section>
  )
}

export const imageConfig = {
  label: 'Image',
  fields: {
    image: { type: 'custom', label: 'Image', render: MediaField },
    caption: { type: 'text' },
    width: {
      type: 'select',
      options: [
        { label: 'Container', value: 'container' },
        { label: 'Full bleed', value: 'full' },
      ],
    },
    align: { type: 'select', options: alignOptions },
    style: styleField,
  },
  defaultProps: { width: 'container', align: 'center' },
  render: (props) => <ImageView {...props} />,
} satisfies ComponentConfig
