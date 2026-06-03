import type { ComponentConfig } from '@puckeditor/core'

import type { BlockData } from '@/lib/generate-css'

import { alignOptions, styleField } from './shared'

export function Stats({ id, heading, items, align }: BlockData) {
  const list = (Array.isArray(items) ? items : []) as {
    value?: string
    label?: string
  }[]
  return (
    <section className={`block stats b-${id}`} data-el={id} data-align={align}>
      {heading ? <h2 className="content-heading">{String(heading)}</h2> : null}
      <div className="stats-grid">
        {list.map((s, i) => (
          <div className="stat" key={i}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export const statsConfig = {
  label: 'Stats',
  fields: {
    heading: { type: 'text' },
    items: {
      type: 'array',
      arrayFields: { value: { type: 'text' }, label: { type: 'text' } },
    },
    align: { type: 'select', options: alignOptions },
    style: styleField,
  },
  defaultProps: {
    heading: '',
    items: [
      { value: '100+', label: 'Clients' },
      { value: '12 yrs', label: 'Experience' },
      { value: '4.9★', label: 'Rating' },
    ],
    align: 'center',
  },
  render: (props) => <Stats {...props} />,
} satisfies ComponentConfig
