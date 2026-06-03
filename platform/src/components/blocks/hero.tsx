import type { ComponentConfig } from '@puckeditor/core'

import type { BlockData } from '@/lib/generate-css'
import { MediaField } from '@/components/puck/media-field'

import { alignOptions, bgOptions, styleField } from './shared'

export function Hero({
  id,
  eyebrow,
  heading,
  subheading,
  buttonLabel,
  buttonHref,
  image,
  variant,
  headingWeight,
  align,
  background,
}: BlockData) {
  const v = typeof variant === 'string' ? variant : 'centered'
  const img = image as
    | { url?: string; alt?: string; width?: number; height?: number }
    | null
    | undefined
  const hasImg = Boolean(img?.url)
  const showSplit = v === 'split' && hasImg
  const showFull = v === 'full' && hasImg

  return (
    <section
      className={`block hero b-${id}`}
      data-el={id}
      data-variant={v}
      data-align={align}
      data-bg={background}
      data-weight={headingWeight ? String(headingWeight) : undefined}
    >
      {showFull ? (
        <div className="hero-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hero-bg-img" src={img!.url} alt={img!.alt ?? ''} />
        </div>
      ) : null}
      <div className="hero-inner">
        <div className="hero-content">
          {eyebrow ? <p className="hero-eyebrow">{String(eyebrow)}</p> : null}
          {heading ? <h1 className="hero-heading">{String(heading)}</h1> : null}
          {subheading ? <p className="hero-sub">{String(subheading)}</p> : null}
          {buttonLabel && buttonHref ? (
            <a className="button hero-cta" href={String(buttonHref)}>
              {String(buttonLabel)}
            </a>
          ) : null}
        </div>
        {showSplit ? (
          <div className="hero-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="hero-img"
              src={img!.url}
              alt={img!.alt ?? ''}
              width={img!.width}
              height={img!.height}
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}

export const heroConfig = {
  fields: {
    eyebrow: { type: 'text' },
    heading: { type: 'text' },
    subheading: { type: 'textarea' },
    buttonLabel: { type: 'text' },
    buttonHref: { type: 'text' },
    image: {
      type: 'custom',
      label: 'Image (Split / Full variants)',
      render: MediaField,
    },
    variant: {
      type: 'select',
      label: 'Layout variant',
      options: [
        { label: 'Centered', value: 'centered' },
        { label: 'Split (image beside)', value: 'split' },
        { label: 'Full bleed (image behind)', value: 'full' },
      ],
    },
    headingWeight: {
      type: 'select',
      label: 'Heading weight',
      options: [
        { label: 'Normal', value: 'normal' },
        { label: 'Medium', value: 'medium' },
        { label: 'Semibold', value: 'semibold' },
        { label: 'Bold', value: 'bold' },
      ],
    },
    align: { type: 'select', options: alignOptions },
    background: { type: 'select', options: bgOptions },
    style: styleField,
  },
  defaultProps: {
    heading: 'Your headline here',
    variant: 'centered',
    headingWeight: 'semibold',
    align: 'center',
    background: 'brand',
  },
  render: (props) => <Hero {...props} />,
} satisfies ComponentConfig
