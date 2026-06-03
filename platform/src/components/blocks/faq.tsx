import type { ComponentConfig } from '@puckeditor/core'

import { JsonLd } from '@/components/seo/json-ld'
import type { BlockData } from '@/lib/generate-css'

import { styleField } from './shared'

export function Faq({ id, heading, items }: BlockData) {
  const list = (Array.isArray(items) ? items : []) as {
    question?: string
    answer?: string
  }[]
  const qa = list.filter((q) => q.question && q.answer)
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qa.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer },
    })),
  }
  return (
    <section className={`block faq b-${id}`} data-el={id}>
      {heading ? <h2 className="content-heading">{String(heading)}</h2> : null}
      <div className="faq-list">
        {list.map((q, i) => (
          <details className="faq-item" key={i}>
            <summary className="faq-q">{q.question}</summary>
            <div className="faq-a">{q.answer}</div>
          </details>
        ))}
      </div>
      {qa.length ? <JsonLd data={ld} /> : null}
    </section>
  )
}

export const faqConfig = {
  label: 'FAQ',
  fields: {
    heading: { type: 'text' },
    items: {
      type: 'array',
      arrayFields: {
        question: { type: 'text' },
        answer: { type: 'textarea' },
      },
    },
    style: styleField,
  },
  defaultProps: {
    heading: 'Frequently asked questions',
    items: [{ question: 'Ask a question?', answer: 'Provide the answer here.' }],
  },
  render: (props) => <Faq {...props} />,
} satisfies ComponentConfig
