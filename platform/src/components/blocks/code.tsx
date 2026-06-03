import type { ComponentConfig } from '@puckeditor/core'

import type { BlockData } from '@/lib/generate-css'

import { styleField } from './shared'

/**
 * Custom-code block — the escape hatch (uniqueness lever #4 in the component
 * contract). For truly one-off sections the registered blocks can't express:
 * author raw HTML + scoped CSS. Renders in both the canvas and the live site.
 *
 * SECURITY: content is injected with dangerouslySetInnerHTML. This is safe only
 * because the builder is currently single-agency-admin (trusted author). Before
 * opening the builder to clients, gate this block behind a permission/tier
 * (see project_client_self_serve_gating) or sanitize.
 */
export function CodeBlock({ id, html, css }: BlockData) {
  const cssStr = typeof css === 'string' ? css : ''
  const htmlStr = typeof html === 'string' ? html : ''
  return (
    <section className={`block code-block b-${id}`} data-el={id}>
      {cssStr ? <style dangerouslySetInnerHTML={{ __html: cssStr }} /> : null}
      {htmlStr ? (
        <div className="code-block-content" dangerouslySetInnerHTML={{ __html: htmlStr }} />
      ) : (
        <p className="code-block-empty">Custom code block — add HTML/CSS in the panel.</p>
      )}
    </section>
  )
}

export const codeConfig = {
  label: 'Custom Code',
  fields: {
    html: {
      type: 'textarea',
      label: 'HTML',
    },
    css: {
      type: 'textarea',
      label: 'CSS (scope selectors to your markup)',
    },
    style: styleField,
  },
  defaultProps: { html: '', css: '' },
  render: (props) => <CodeBlock {...props} />,
} satisfies ComponentConfig
