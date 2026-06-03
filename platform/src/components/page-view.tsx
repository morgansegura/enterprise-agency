import { Render, resolveAllData } from '@puckeditor/core/rsc'
import type { Data } from '@puckeditor/core'

import { RenderBlocks } from '@/components/render-blocks'
import { RefreshOnSave } from '@/components/refresh-on-save'
import { type BlockData } from '@/lib/generate-css'
import { puckConfig } from '@/lib/puck-config'
import { generatePuckCSS } from '@/lib/puck-css'
import { getStaff } from '@/lib/staff'
import { generateThemeCSS, googleFontsHref, type TenantTheme } from '@/lib/theme'

/**
 * Shared page renderer: per-tenant theme vars + fonts, per-element Puck styles,
 * live-preview listener, and content. Renders the Puck visual layout when
 * present, else the form-based blocks. One renderer; styling via tokens +
 * data attributes + scoped CSS (no inline styles).
 *
 * Data-bound blocks (StaffDirectory, …) are hydrated server-side via
 * `resolveAllData` — their `resolveData` pulls from the tenant-scoped fetchers
 * passed in `metadata`, so the live HTML is fully rendered (SSR/SEO-correct).
 */
export async function PageView({
  layout,
  theme,
  puckData,
  tenantId,
}: {
  layout: BlockData[]
  theme?: TenantTheme
  puckData?: unknown
  tenantId?: string | number
}) {
  const themeCSS = generateThemeCSS(theme)
  const fontsHref = googleFontsHref(theme)
  const puck = puckData as { content?: { props?: Record<string, unknown> }[] } | null | undefined
  const usePuck = Array.isArray(puck?.content) && puck.content.length > 0
  const puckCSS = usePuck ? generatePuckCSS(puck?.content) : ''

  const metadata =
    tenantId != null ? { fetchStaff: (group?: string) => getStaff(tenantId, group) } : {}
  const resolved =
    usePuck && tenantId != null
      ? await resolveAllData(puck as unknown as Data, puckConfig, metadata)
      : (puck as unknown as Data)

  return (
    <>
      {fontsHref ? <link rel="stylesheet" href={fontsHref} /> : null}
      {themeCSS ? <style id="theme-styles" dangerouslySetInnerHTML={{ __html: themeCSS }} /> : null}
      {puckCSS ? <style id="puck-styles" dangerouslySetInnerHTML={{ __html: puckCSS }} /> : null}
      <RefreshOnSave />
      <main className="page">
        {usePuck ? (
          <Render config={puckConfig} data={resolved} />
        ) : (
          <RenderBlocks blocks={layout} />
        )}
      </main>
    </>
  )
}
