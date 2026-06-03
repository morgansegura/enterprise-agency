import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import type { BlockData } from '@/lib/generate-css'

/** Form-CMS only (not in the visual builder). */
export function RichTextView({ id, content, align }: BlockData) {
  if (!content) return null
  return (
    <section className={`block richtext-block b-${id}`} data-align={align}>
      <div className="richtext">
        <RichText
          data={content as React.ComponentProps<typeof RichText>['data']}
        />
      </div>
    </section>
  )
}
