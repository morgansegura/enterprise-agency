# CMS-Driven Page Rollout — step-by-step (living doc)

How every `apps/<tenant>` page becomes CMS-editable via the `<Blocks>` renderer,
with per-page SEO. Keep this current as pages are converted. Reference impl: cvfc.

## The recipe (per page)

1. **Screen → block-renderer with static fallback.** In
   `components/screen/<x>-screen/<x>-screen.tsx`: make the component `async`, add
   `const page = await getPage("<slug>")` (slug = route path, e.g. `about`,
   `programs/foundations`). Wrap the static composition:
   ```tsx
   {
     page?.layout?.length ? (
       <Blocks layout={page.layout} />
     ) : (
       <>…existing static JSX…</>
     );
   }
   ```
   Empty CMS → static fallback, so the site never breaks mid-migration. Keep
   `JsonLd`/breadcrumb schema OUTSIDE the wrapper (always render).
2. **SEO → CMS-driven.** In `app/<route>/page.tsx` replace the static `metadata`
   export with:
   ```tsx
   export function generateMetadata(): Promise<Metadata> {
     return metadataForPage({ slug, path, title, description }); // lib/seo
   }
   ```
   `metadataForPage` prefers `page.meta` (title/description/og image/noindex) and
   falls back to the passed defaults. Pages stay thin (`return <Screen/>`).
3. **Seed the page** in `apps/cms/src/seed/<tenant>.ts` via `upsertPage(slug,
title, LAYOUT, PAGE_META[slug])` — idempotent find-or-create, `_status:
'published'`, includes SEO `meta` (title 30–60 chars, description 120–160) so
   the CMS "SEO" panel goes green.
4. **Schema + types when new blocks were added:** run the CMS locally
   (`bun run dev`, push:true on non-prod → pushes to the SHARED DB) or just
   `bun run seed:cvfc` (the seed boots Payload with push enabled and pushes the
   new-block schema before writing). Then `bun --cwd apps/cms run generate:types`.
5. **Verify → commit → (push on request).** `bunx tsc --noEmit` in cms + cvfc,
   `bun run lint` in cvfc. Commit (no AI attribution). Push only when asked.

## Completeness mandate

**Every block the front-end renders must exist in the CMS layout** — when a page
is "done", the whole page is editable from the CMS, not just some sections. The
all-or-nothing wrapper means a partially-seeded page DROPS the unseeded sections,
so only flip a page to seeded once ALL its block types are supported AND seeded.

## Block inventory (cvfc)

Done: `hero`, `pageHero`, `welcomeBanner`, `iconCards`, `callout`, `mediaSplit`,
`statBand`, `portraitGrid`, `testimonialsSection`, `faqSection`.

Needed: `headingSection` (the `<Section><Heading eyebrow/heading/rich
description></Section>` pattern — used by 8 pages; needs rich-text),
`staffDirectory`, `adminDirectory`, `fieldGrid`, `testimonialWall`, `newsList`.

Rich-text: CMS already has a lexical `richText` block + `@payloadcms/richtext-lexical`.
cvfc needs `@payloadcms/richtext-lexical` added to render via `RichText` from
`@payloadcms/richtext-lexical/react` (feature body/description props take ReactNode).

## Images in the seed (OPEN DECISION)

Image-bearing blocks (`mediaSplit`, `portraitGrid`, hero) use an `upload` field.
The existing static sites reference external `chulavistafc.com` URLs. To seed them
either (a) upload to the media collection (R2-backed, manual/scripted), or (b) add
an optional `imageUrl` text escape-hatch on image blocks (fast migration; mapper
prefers upload, else URL; next/image still optimizes remote URLs). Decide before
seeding image-heavy pages (landing media-splits/portrait-grid, facilities, etc.).

## Status (cvfc)

| Page                                                                                  | Screen converted       | Seeded                                  | SEO meta | Notes                                                            |
| ------------------------------------------------------------------------------------- | ---------------------- | --------------------------------------- | -------- | ---------------------------------------------------------------- |
| `/` (home/landing)                                                                    | renderer wired (gated) | partial (hero/welcome/faq/testimonials) | —        | **missing blocks** — needs full layout seeded (+ image decision) |
| `/programs`                                                                           | ✅                     | ✅ pageHero+iconCards+callout           | ✅       | media-splits pending images                                      |
| `/about`                                                                              | ✅                     | ✅ pageHero+iconCards+callout           | ✅       | complete                                                         |
| programs detail (foundations, boys/girls/gk, coaching-opps)                           | —                      | —                                       | —        | need headingSection + rich-text                                  |
| about subpages (who-we-are, coaching-staff, administrators, facilities, testimonials) | —                      | —                                       | —        | need headingSection + staff/admin/field/testimonial blocks       |
| `/news`                                                                               | —                      | —                                       | —        | needs newsList + headingSection                                  |
| `/support`, `/sponsor`, `/partnerships`                                               | —                      | —                                       | —        | need headingSection                                              |
| `/evaluations`                                                                        | stays static           | —                                       | —        | bespoke programs grid (not block-able)                           |
| legal pages                                                                           | stays static           | —                                       | —        | LegalLayout                                                      |

## Gotchas

- Prod DB is used locally; the seed writes to the SHARED DB. Deployed CMS is
  `push:false`, so schema reaches it via the local seed/dev push.
- Deployed code can lag (check `git rev-list origin/main..HEAD`); an old deploy
  strips blocks it doesn't have registered → API looks "empty".
- PageSpeed: keep `experimental.inlineCss` + font `display:swap`/`preload` (see
  `project_pagespeed_inlinecss_lever`).
