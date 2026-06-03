import type { ComponentConfig } from '@puckeditor/core'

import type { BlockData } from '@/lib/generate-css'

import { alignOptions, styleField } from './shared'

type Plan = {
  id?: string
  name?: string
  price?: string
  period?: string
  description?: string
  features?: string
  ctaLabel?: string
  ctaHref?: string
  featured?: string
}

export function Pricing({ id, heading, intro, columns, items, align }: BlockData) {
  const list = Array.isArray(items) ? (items as Plan[]) : []
  return (
    <section className={`block pricing b-${id}`} data-el={id} data-align={align}>
      {heading ? <h2 className="pricing-heading">{String(heading)}</h2> : null}
      {intro ? <p className="pricing-intro">{String(intro)}</p> : null}
      <div className="pricing-grid" data-cols={String(columns ?? '3')}>
        {list.map((plan, i) => {
          const features = (plan.features ?? '')
            .split('\n')
            .map((f) => f.trim())
            .filter(Boolean)
          return (
            <div
              className="pricing-plan"
              data-featured={plan.featured === 'yes' ? 'true' : undefined}
              key={plan.id ?? i}
            >
              {plan.name ? <h3 className="pricing-name">{plan.name}</h3> : null}
              {plan.price ? (
                <p className="pricing-price">
                  {plan.price}
                  {plan.period ? <span className="pricing-period">{plan.period}</span> : null}
                </p>
              ) : null}
              {plan.description ? <p className="pricing-desc">{plan.description}</p> : null}
              {features.length ? (
                <ul className="pricing-features">
                  {features.map((f, fi) => (
                    <li className="pricing-feature" key={fi}>
                      {f}
                    </li>
                  ))}
                </ul>
              ) : null}
              {plan.ctaLabel && plan.ctaHref ? (
                <a className="button pricing-cta" href={plan.ctaHref}>
                  {plan.ctaLabel}
                </a>
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export const pricingConfig = {
  label: 'Pricing',
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
        name: { type: 'text' },
        price: { type: 'text' },
        period: { type: 'text' },
        description: { type: 'textarea' },
        features: {
          type: 'textarea',
          label: 'Features (one per line)',
        },
        ctaLabel: { type: 'text' },
        ctaHref: { type: 'text' },
        featured: {
          type: 'select',
          label: 'Highlight this plan',
          options: [
            { label: 'No', value: 'no' },
            { label: 'Yes', value: 'yes' },
          ],
        },
      },
    },
    align: { type: 'select', options: alignOptions },
    style: styleField,
  },
  defaultProps: { columns: '3', items: [], align: 'center' },
  render: (props) => <Pricing {...props} />,
} satisfies ComponentConfig
