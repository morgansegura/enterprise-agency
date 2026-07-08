# Building a Site — Playbook

The concrete, current process for building a client FE in this monorepo. Refined
on cvfc → emily-green. Follow it top to bottom. Companion docs handle the later
phases (growth layer, CMS, SEO, deploy); this is the day-1 build loop.

**Two lanes.** The client/owner owns **brand** (logo, images, fonts, color
tokens). Claude owns **structure + code** (chrome, blocks, wiring). Never
overwrite the owner's logo/assets/tokens/fonts — if you must read one before an
edit, read it, don't clobber it.

**Non-negotiable on every site (build for it from block #1, not at the end):**

- **SEO + AEO + GEO** best-in-class — per `~/.claude/seo-aeo-geo-aio-standards.md`.
  Semantic HTML + **live text, never text-as-image** (headings are real `<h1>`/
  `<h2>`); one `<h1>` per page; per-route metadata + OG; JSON-LD (Organization,
  WebSite, LocalBusiness/Person, FAQPage, BreadcrumbList, Service); `robots.ts`
  (block-training/allow-search), `sitemap.ts`, `llms.txt`; Q&A-shaped, lead-with-
  the-answer content for answer engines.
- **100% Google PageSpeed** (all four columns, mobile + desktop). Proven levers:
  `next/image` everywhere with correct `sizes` + `priority` only on the LCP image;
  `experimental.inlineCss` + font `display:"swap"`/`preload` (killed cvfc mobile
  render-block, 62→99 — see `project_pagespeed_inlinecss_lever`); defer GTM/
  analytics off the critical path; ship the live-preview lib only inside the CMS
  iframe (code-split); serve media from the CDN. Verify on the built HTML/live
  URL, not stale PSI.

---

## 0. Scaffold

```bash
bun run new-site <name> --display "<Display Name>" --tenant <slug> --port <n>
cd apps/<name> && bun install   # (run bun install at the repo root)
```

Creates `apps/<name>` from `templates/site`: Next 16 + React 19 + Tailwind v4,
local UI primitives, `Section`/screen skeleton, the `generate` scaffolder, and a
3-tier token system (`styles/tokens.css`). Pick a **free port** (cms=4010,
cvfc=4011, …).

Template already handles (don't re-fix): `scripts/generate.cjs` is `.cjs`
(the app is `type:module`, so a `.js` CommonJS script crashes), and `prettier`
is a per-app devDependency (so the editor's format-on-save resolves it).

---

## 1. Shared library wiring (`@wf/ui`)

If the site needs a shared primitive the template lacks (the **mobile Drawer**
does — it only lives in `@wf/ui`), consume the lib like cvfc:

- `package.json`: `"@wf/ui": "workspace:*"`
- `next.config.ts`: `transpilePackages: ["@wf/ui"]`

**Rule:** shared _mechanics_ (primitives, hooks, types) live in `@wf/ui` — keep
it MINIMAL, extract one at a time, don't break other sites. Per-site _skins_
(the actual header/footer/block markup + CSS) live in the app.

---

## 2. Brand — tokens + fonts (owner-driven; you wire, they set values)

- **`styles/tokens.css`** — override the `:root` brand vars (`--primary`,
  `--secondary`, `--accent`, backgrounds, `--radius`) + brand color aliases. The
  `@theme inline` block already maps them to utilities (`bg-primary`,
  `text-muted-foreground`, `rounded-lg`…). Set once → cascades everywhere.
- **`fonts/index.ts`** — `--font-base` (body) + `--font-heading` (display serif).
  Wire BOTH vars on `<html>` in `app/layout.tsx`:
  `className={cn(fontBase.variable, fontHeading.variable)}`.

Because everything downstream is **token-driven**, chrome and blocks adopt the
brand automatically once tokens land — no rework.

---

## 3. Chrome first

Build `components/layout/`: `header` + `header-nav` → `mobile-nav` (right-side
Drawer + accordion) → `footer` + `footer-nav` → `section`. Per-site skins on
`@wf/ui` primitives (`Drawer`, `Accordion`, `Button`) + shared
`useHeaderVisibility` hook + `TMenuItem` type. Mock nav in `lib/menu.ts`. Wire
`<Header/>{children}<Footer/>` into `app/layout.tsx`. Token-driven throughout.

---

## 4. Blocks — one at a time, top-down. METHODICAL, NOT BESPOKE.

Show me the design, then build **one block**, add its mock, drop it in the
screen. Per block:

1. **Generate** the folder — never hand-create:
   ```bash
   bun run generate component feature/<name>
   ```
2. **Build from the design system**, not from scratch: a `<Section>` wrapper +
   existing UI primitives (`Heading`, `Text`, `Eyebrow`, `Button`) + `next/image`.
   Styling = a few **token-driven named classes** via `@apply` in the block's
   `.css` (e.g. `.hero-heading { @apply text-(--primary); }`). No utility soup in
   JSX, no one-off markup. If a class repeats, extract it.
3. **Mock-first + Payload-aligned.** Content lives in
   `data/mocks/<screen>.mock.ts` — one entry per block, shaped like the Payload
   block output so the CMS is a drop-in:
   - field names = the intended Payload block field names (`heading`, `subtitle`…)
   - images as **`{ url, alt }`** (a populated Payload upload's shape — `url`,
     not `src`)

   ```ts
   export function Hero({ content = mock.hero }: { content?: HeroBlock }) { … }
   ```

   Wiring the CMS later is then just:
   `cmsOverlay(mock.<block>, <block>FromPage(page))` — same shape from both
   sources, mock as the permanent fallback.

   **Options are flat fields on the block, not a separate prop.** Presentation
   toggles (`imagePosition`, `background`, `align`, …) go on the SAME block
   object — because Payload models a block as one flat set of fields (content +
   `select` config together). Keep the single `content` prop; read options with
   defaults and map them to `Section`/layout (`<Section bg={content.background ??
"default"}>`). A separate `options` prop would force the CMS resolver to split
   Payload's flat block, breaking the drop-in. Rule: if the client would ever
   toggle it → flat field on the block; if it's dev-only/structural → keep it out
   of the block shape entirely.

4. **Compose** into the thin screen (`page.tsx` → `<LandingScreen/>` → stacked
   `<Section>`/blocks). Screens are pure composition — no logic, no markup soup.
5. **Verify** (`tsc` + `lint`), then **hold the commit** so the owner can check
   it in dev (they run the server on the site's port). Never push.

---

## 5+. Later phases

- **Growth layer** (day-1, non-negotiable): SEO/AEO/GEO infra —
  `docs/growth-layer-setup.md`.
- **CMS integration** (one central Payload, many tenants): per-section pattern
  `<block>FromPage(page)` + `cmsOverlay` + seed; see the runbook memory
  `project_new_site_runbook`. Schema changes need a **migration** (shared
  multi-tenant DB — see `project_shared_cms_decision`).
- **SEO offensive** + **deploy** (Render CMS + Vercel FE): `docs/client-build-playbook.md`.

---

## Principles (why the above)

- **Methodical, not bespoke** — generator + primitives + tokens. Consistency
  makes blocks composable and the next site faster.
- **Mock-first** — the site renders from in-code mocks; mocks are the permanent
  fallback; the CMS overrides when edited; aim for _everything_ editable.
- **Payload-shaped mocks** — so the CMS drops in with zero reshaping.
- **Owner owns brand, Claude owns code** — don't clobber logo/assets/tokens.
- **FE never hard-depends on the CMS at runtime** — mock fallback keeps sites up
  if the CMS is down.
- **Verify before commit, never push, no AI attribution.**
