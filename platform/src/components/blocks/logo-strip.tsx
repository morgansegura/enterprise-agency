import type { ComponentConfig } from '@puckeditor/core'

import { MediaField } from '@/components/puck/media-field'
import type { BlockData } from '@/lib/generate-css'

import { styleField } from './shared'

export function LogoStrip({ id, heading, logos }: BlockData) {
  const list = (Array.isArray(logos) ? logos : []) as {
    image?: { url?: string; alt?: string } | null
  }[]
  return (
    <section className={`block logo-strip b-${id}`} data-el={id}>
      {heading ? <p className="logo-strip-heading">{String(heading)}</p> : null}
      <div className="logo-strip-row">
        {list.map((l, i) => {
          const img = l.image && typeof l.image === 'object' ? l.image : null
          return img?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="logo-strip-img"
              key={i}
              src={img.url}
              alt={img.alt ?? ''}
            />
          ) : null
        })}
      </div>
    </section>
  )
}

export const logoStripConfig = {
  label: 'Logo Strip',
  fields: {
    heading: { type: 'text' },
    logos: {
      type: 'array',
      arrayFields: {
        image: { type: 'custom', label: 'Logo', render: MediaField },
      },
    },
    style: styleField,
  },
  defaultProps: { heading: 'Trusted by', logos: [] },
  render: (props) => <LogoStrip {...props} />,
} satisfies ComponentConfig
