import type { ComponentConfig } from '@puckeditor/core'

import { heroConfig } from './hero'
import { contentConfig } from './content'
import { ctaConfig } from './cta'
import { featuresConfig } from './features'
import { imageConfig } from './image'
import { columnsConfig } from './columns'
import { formConfig } from './form'
import { statsConfig } from './stats'
import { faqConfig } from './faq'
import { testimonialsConfig } from './testimonials'
import { logoStripConfig } from './logo-strip'
import { mediaSplitConfig } from './media-split'
import { carouselConfig } from './carousel'
import { galleryConfig } from './gallery'
import { teamConfig } from './team'
import { pricingConfig } from './pricing'
import { staffDirectoryConfig } from './staff-directory'
import { codeConfig } from './code'

/** Every builder component. Adding a component = drop its file + register here. */
export const componentConfigs: Record<string, ComponentConfig> = {
  Hero: heroConfig,
  Content: contentConfig,
  Cta: ctaConfig,
  Features: featuresConfig,
  Image: imageConfig,
  Columns: columnsConfig,
  Form: formConfig,
  Stats: statsConfig,
  Faq: faqConfig,
  Testimonials: testimonialsConfig,
  LogoStrip: logoStripConfig,
  MediaSplit: mediaSplitConfig,
  Carousel: carouselConfig,
  Gallery: galleryConfig,
  Team: teamConfig,
  Pricing: pricingConfig,
  StaffDirectory: staffDirectoryConfig,
  Code: codeConfig,
}
