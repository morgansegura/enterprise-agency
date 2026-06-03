import type { Config } from '@puckeditor/core'
import type { ReactNode } from 'react'

import { componentConfigs } from '@/components/blocks/registry'

/**
 * Puck visual-builder config. Components are assembled from the blocks registry
 * (each component is self-contained in src/components/blocks/<name>). Root wraps
 * content in `.page` so the canvas + published output share theme styles.
 */
export const puckConfig: Config = {
  root: {
    render: ({ children }: { children: ReactNode }) => (
      <div className="page">{children}</div>
    ),
  },
  components: componentConfigs as Config['components'],
}
