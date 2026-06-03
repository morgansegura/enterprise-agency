import type { ComponentConfig } from '@puckeditor/core'

import type { BlockData } from '@/lib/generate-css'

import { alignOptions, bgOptions, styleField } from './shared'

export function Cta({
  id,
  heading,
  body,
  buttonLabel,
  buttonHref,
  align,
  background,
}: BlockData) {
  return (
    <section
      className={`block cta b-${id}`}
      data-el={id}
      data-align={align}
      data-bg={background}
    >
      {heading ? <h2 className="content-heading">{String(heading)}</h2> : null}
      {body ? <p className="content-body">{String(body)}</p> : null}
      {buttonLabel && buttonHref ? (
        <a className="button" href={String(buttonHref)}>
          {String(buttonLabel)}
        </a>
      ) : null}
    </section>
  )
}

export const ctaConfig = {
  fields: {
    heading: { type: 'text' },
    body: { type: 'textarea' },
    buttonLabel: { type: 'text' },
    buttonHref: { type: 'text' },
    align: { type: 'select', options: alignOptions },
    background: { type: 'select', options: bgOptions },
    style: styleField,
  },
  defaultProps: {
    heading: 'Ready to start?',
    buttonLabel: 'Get in touch',
    buttonHref: '#',
    align: 'center',
    background: 'brand',
  },
  render: (props) => <Cta {...props} />,
} satisfies ComponentConfig
