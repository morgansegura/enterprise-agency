import type { ComponentConfig } from '@puckeditor/core'

import type { BlockData } from '@/lib/generate-css'
import { MediaField } from '@/components/puck/media-field'

import { styleField } from './shared'

type GalleryImage = {
  id?: string
  image?: {
    url?: string
    alt?: string
    width?: number
    height?: number
  } | null
}

export function Gallery({ id, heading, intro, columns, items }: BlockData) {
  const list = Array.isArray(items) ? (items as GalleryImage[]) : []
  return (
    <section className={`block gallery b-${id}`} data-el={id}>
      {heading ? <h2 className="gallery-heading">{String(heading)}</h2> : null}
      {intro ? <p className="gallery-intro">{String(intro)}</p> : null}
      <div className="gallery-grid" data-cols={String(columns ?? '3')}>
        {list.map((item, i) => {
          const img = item?.image
          if (!img?.url) return null
          return (
            <figure className="gallery-item" key={item.id ?? i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="gallery-img"
                src={img.url}
                alt={img.alt ?? ''}
                width={img.width}
                height={img.height}
                loading="lazy"
              />
            </figure>
          )
        })}
      </div>
    </section>
  )
}

export const galleryConfig = {
  label: 'Gallery',
  fields: {
    heading: { type: 'text' },
    intro: { type: 'textarea' },
    columns: {
      type: 'select',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
    },
    items: {
      type: 'array',
      arrayFields: {
        image: { type: 'custom', label: 'Image', render: MediaField },
      },
    },
    style: styleField,
  },
  defaultProps: { columns: '3', items: [] },
  render: (props) => <Gallery {...props} />,
} satisfies ComponentConfig
