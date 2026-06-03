# Component contract

> **Design in code, assemble in the builder, store in the CMS.**

Every builder block is a **hand-crafted, token-driven component registered with a
schema**. We do _not_ build a generic "tune any CSS property" editor — infinite
knobs trend toward sameness. Uniqueness comes from hand-built components +
per-tenant tokens + variants + a custom-code escape hatch. Constraint is the
feature.

The reference implementation is **`src/components/blocks/staff-directory.tsx`**
(+ its CSS in `src/app/(frontend)/blocks.css`). New blocks follow its shape.

## A block = four parts

1. **Bespoke render** — a real React component with its own CSS. This is where
   design/uniqueness lives. Markup uses semantic classes (`.staff-card`) +
   `data-*` hooks (`data-variant`, `data-cols`, `data-align`); **no inline
   styles** (clean published output). Renders purely from props so it works in
   both the live RSC render and the editor canvas.

2. **Component-scoped tokens** — every design value is consumed as
   `var(--<block>-<thing>, <default>)`, never hardcoded:

   ```css
   .staff-photo {
     width: var(--staff-photo-size, 8rem);
     border-radius: var(--staff-photo-radius, 9999px);
   }
   .staff-role {
     color: var(--staff-role-color, var(--primary));
   }
   ```

   The default lives in the fallback. A **tenant theme** can override the token
   at `.page` scope (theme `<style>` is injected after `blocks.css`, so it
   wins) — fine-tuning per client _without forking the component_. This is the
   3-tier token system: primitives → semantic → **component**.

3. **Variants** — a `variant` select that sets `data-variant`; variant CSS
   **re-tunes the same tokens** and relayouts. One component, distinct looks:

   ```css
   .staff-directory[data-variant='list'] {
     --staff-photo-size: 4rem;
   }
   .staff-directory[data-variant='list'] .staff-card {
     display: flex;
     align-items: center;
   }
   ```

   Variants are the primary uniqueness lever; the per-element style panel
   (`styleField`) is the _last-10%_ fine-tune, not the primary design tool.

4. **Schema + optional data-binding** — a Puck `ComponentConfig` (`fields`,
   `defaultProps`, `render`) registered in `registry.ts`. Content props
   (text/media/arrays) and a few style props/variants — _not_ raw CSS.

   For **data-bound** blocks, add `resolveData` that reads a tenant-scoped
   fetcher from `metadata`:

   ```ts
   resolveData: async ({ props }, { metadata }) => {
     const items = await metadata?.fetchStaff?.(props.group)
     return items ? { props: { ...props, items }, readOnly: { items: true } } : { props }
   }
   ```

   The live site hydrates server-side via `resolveAllData(data, config, metadata)`
   in `PageView` (SSR/SEO-correct); the editor hydrates the same way through
   Puck `metadata`. Structured content lives in a Payload collection
   (`src/collections/Staff.ts`), not in `data/*.ts` files.

## Checklist for a new block

- [ ] `src/components/blocks/<name>.tsx` — pure render + `<name>Config`
- [ ] All design values are `var(--<name>-*, default)` (no hardcoded magic numbers)
- [ ] `style: styleField` included; semantic classes + `data-*`, no inline styles
- [ ] `variant` field where >1 layout makes sense
- [ ] CSS in `blocks.css` (token defaults as fallbacks + variant blocks)
- [ ] Registered in `registry.ts`
- [ ] Data-bound? add a collection + `lib/<name>.ts` fetcher + `resolveData` +
      wire the fetcher into `PageView`'s `metadata`
- [ ] `tsc` + `lint` + `prettier` clean

## How uniqueness is achieved (the four levers)

1. **Per-tenant tokens** — brand colors/fonts/scale + component-token overrides.
2. **Variants** — different layouts from one component.
3. **Per-element overrides** — the `styleField` panel for the final touches.
4. **Custom-code block** — escape hatch for truly one-off sections (planned).

The block library grows out of **real client builds** (e.g. rebuilding CVFC):
hand-build a section, lift its values to component tokens, give it a schema —
it becomes a reusable, themeable, data-bound block.
