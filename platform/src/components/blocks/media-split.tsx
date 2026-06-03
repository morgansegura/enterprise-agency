import type { ComponentConfig } from '@puckeditor/core'

import { MediaField } from '@/components/puck/media-field'
import type { BlockData } from '@/lib/generate-css'

import { styleField } from './shared'

export function MediaSplit({ id, heading, body, image, imagePosition }: BlockData) {
  const img =
    image && typeof image === 'object'
      ? (image as { url?: string; alt?: string })
      : null
  return (
    <section
      className={`block media-split b-${id}`}
      data-el={id}
      data-image-position={imagePosition}
    >
      <div className="media-split-grid">
        <div className="media-split-text">
          {heading ? <h2 className="content-heading">{String(heading)}</h2> : null}
          {body ? <p className="content-body">{String(body)}</p> : null}
        </div>
        {img?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="media-split-img" src={img.url} alt={img.alt ?? ''} />
        ) : null}
      </div>
    </section>
  )
}

export const mediaSplitConfig = {
  label: 'Media + Text',
  fields: {
    heading: { type: 'text' },
    body: { type: 'textarea' },
    image: { type: 'custom', label: 'Image', render: MediaField },
    imagePosition: {
      type: 'select',
      options: [
        { label: 'Image right', value: 'right' },
        { label: 'Image left', value: 'left' },
      ],
    },
    style: styleField,
  },
  defaultProps: { heading: 'A headline', imagePosition: 'right' },
  render: (props) => <MediaSplit {...props} />,
} satisfies ComponentConfig
