import type { ComponentConfig } from '@puckeditor/core'

import type { BlockData } from '@/lib/generate-css'

import { alignOptions, styleField } from './shared'

export function Features({
  id,
  heading,
  intro,
  columns,
  items,
  align,
}: BlockData) {
  const list = Array.isArray(items) ? items : []
  return (
    <section
      className={`block features b-${id}`}
      data-el={id}
      data-align={align}
    >
      {heading ? <h2 className="features-heading">{String(heading)}</h2> : null}
      {intro ? <p className="features-intro">{String(intro)}</p> : null}
      <div className="features-grid" data-cols={String(columns ?? '3')}>
        {list.map((item, i) => {
          const it = item as {
            id?: string
            title?: string
            description?: string
          }
          return (
            <div className="feature-item" key={it.id ?? i}>
              {it.title ? <h3 className="feature-title">{it.title}</h3> : null}
              {it.description ? (
                <p className="feature-desc">{it.description}</p>
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export const featuresConfig = {
  fields: {
    heading: { type: 'text' },
    intro: { type: 'textarea' },
    columns: {
      type: 'select',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
      ],
    },
    items: {
      type: 'array',
      arrayFields: {
        title: { type: 'text' },
        description: { type: 'textarea' },
      },
    },
    align: { type: 'select', options: alignOptions },
    style: styleField,
  },
  defaultProps: { columns: '3', items: [], align: 'left' },
  render: (props) => <Features {...props} />,
} satisfies ComponentConfig
