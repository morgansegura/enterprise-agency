import type { ComponentConfig } from '@puckeditor/core'

import { CarouselClient } from '@/components/carousel/carousel'
import { MediaField } from '@/components/puck/media-field'

import { styleField } from './shared'

export const carouselConfig = {
  label: 'Carousel',
  fields: {
    slides: {
      type: 'array',
      arrayFields: {
        image: { type: 'custom', label: 'Image', render: MediaField },
        caption: { type: 'text' },
      },
    },
    style: styleField,
  },
  defaultProps: { slides: [] },
  render: (props) => (
    <section className="block carousel-block" data-el={props.id}>
      <CarouselClient slides={props.slides ?? []} />
    </section>
  ),
} satisfies ComponentConfig
