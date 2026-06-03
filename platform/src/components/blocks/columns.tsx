import type { ComponentConfig } from '@puckeditor/core'

import { styleField } from './shared'

/** Layout primitive: 2–3 column drop zones (Puck slots) for nested layouts. */
export const columnsConfig = {
  label: 'Columns',
  fields: {
    columns: {
      type: 'select',
      label: 'Columns',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
      ],
    },
    gap: {
      type: 'select',
      label: 'Gap',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
      ],
    },
    col1: { type: 'slot' },
    col2: { type: 'slot' },
    col3: { type: 'slot' },
    style: styleField,
  },
  defaultProps: { columns: '2', gap: 'md' },
  render: ({ id, columns, gap, col1: Col1, col2: Col2, col3: Col3 }) => {
    const n = columns === '3' ? 3 : 2
    return (
      <section className="block columns" data-el={id}>
        <div className="columns-grid" data-cols={n} data-gap={gap}>
          <div className="column">
            <Col1 />
          </div>
          <div className="column">
            <Col2 />
          </div>
          {n >= 3 ? (
            <div className="column">
              <Col3 />
            </div>
          ) : null}
        </div>
      </section>
    )
  },
} satisfies ComponentConfig
