import type { BlockData } from '@/lib/generate-css'

import { Hero } from '@/components/blocks/hero'
import { Content } from '@/components/blocks/content'
import { Cta } from '@/components/blocks/cta'
import { Features } from '@/components/blocks/features'
import { ImageView } from '@/components/blocks/image'
import { RichTextView } from '@/components/blocks/rich-text'

/** Renders the form-based blocks layout (pages without Puck data). */
export function RenderBlocks({ blocks }: { blocks: BlockData[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.blockType) {
          case 'hero':
            return <Hero key={b.id ?? i} {...b} />
          case 'content':
            return <Content key={b.id ?? i} {...b} />
          case 'richText':
            return <RichTextView key={b.id ?? i} {...b} />
          case 'cta':
            return <Cta key={b.id ?? i} {...b} />
          case 'features':
            return <Features key={b.id ?? i} {...b} />
          case 'image':
            return <ImageView key={b.id ?? i} {...b} />
          default:
            return null
        }
      })}
    </>
  )
}
