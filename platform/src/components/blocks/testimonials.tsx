import type { ComponentConfig } from '@puckeditor/core'

import type { BlockData } from '@/lib/generate-css'

import { alignOptions, styleField } from './shared'

export function Testimonials({ id, heading, items, columns, align }: BlockData) {
  const list = (Array.isArray(items) ? items : []) as {
    quote?: string
    author?: string
    role?: string
  }[]
  return (
    <section
      className={`block testimonials b-${id}`}
      data-el={id}
      data-align={align}
    >
      {heading ? <h2 className="content-heading">{String(heading)}</h2> : null}
      <div className="testimonials-grid" data-cols={String(columns ?? '2')}>
        {list.map((t, i) => (
          <figure className="testimonial" key={i}>
            <blockquote className="testimonial-quote">{t.quote}</blockquote>
            <figcaption className="testimonial-author">
              {t.author}
              {t.role ? <span className="testimonial-role"> — {t.role}</span> : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export const testimonialsConfig = {
  label: 'Testimonials',
  fields: {
    heading: { type: 'text' },
    items: {
      type: 'array',
      arrayFields: {
        quote: { type: 'textarea' },
        author: { type: 'text' },
        role: { type: 'text' },
      },
    },
    columns: {
      type: 'select',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
      ],
    },
    align: { type: 'select', options: alignOptions },
    style: styleField,
  },
  defaultProps: {
    heading: 'What people say',
    columns: '2',
    items: [{ quote: 'A glowing review.', author: 'Jane Doe', role: 'CEO' }],
    align: 'left',
  },
  render: (props) => <Testimonials {...props} />,
} satisfies ComponentConfig
