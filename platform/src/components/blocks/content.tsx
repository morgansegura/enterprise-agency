import type { ComponentConfig } from '@puckeditor/core'

import type { BlockData } from '@/lib/generate-css'

import { alignOptions, styleField } from './shared'

export function Content({ id, heading, body, align }: BlockData) {
  return (
    <section className={`block content b-${id}`} data-el={id} data-align={align}>
      {heading ? <h2 className="content-heading">{String(heading)}</h2> : null}
      {body ? <p className="content-body">{String(body)}</p> : null}
    </section>
  )
}

export const contentConfig = {
  fields: {
    heading: { type: 'text' },
    body: { type: 'textarea' },
    align: { type: 'select', options: alignOptions },
    style: styleField,
  },
  defaultProps: { heading: 'Section heading', align: 'left' },
  render: (props) => <Content {...props} />,
} satisfies ComponentConfig
