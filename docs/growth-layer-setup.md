# Growth Layer Setup — SEO / AEO / GEO / PageSpeed

A step-by-step playbook for giving any WF client site the full professional
discoverability toolkit. Every site ships this on day one. Worked example:
`apps/cvfc`.

> **Terminology**
> **SEO** = Google/Bing ranking · **AEO** = answer engines (snippets, AI
> Overviews, voice) · **GEO** = being cited by generative AI (ChatGPT,
> Perplexity, Claude) · **CWV** = Core Web Vitals (PageSpeed).
> In 2026 these are distinct: ranking on Google ≠ being cited by ChatGPT.

---

## What the growth layer is

A fixed set of files + manual config that makes a site discoverable and
citable:

| Concern                                    | Delivered by                                     |
| ------------------------------------------ | ------------------------------------------------ |
| Org identity (one source of truth)         | `lib/site-config.ts`                             |
| Structured data (JSON-LD)                  | `lib/schema.ts` + `components/seo/json-ld.tsx`   |
| Page metadata (title/OG/Twitter/canonical) | `app/layout.tsx` defaults + per-route `metadata` |
| Crawler rules                              | `app/robots.ts`                                  |
| URL inventory                              | `app/sitemap.ts`                                 |
| AI-assistant briefing                      | `public/llms.txt`                                |
| Social share image                         | `app/opengraph-image.tsx`                        |
| Analytics + consent _(Wave 2)_             | `components/analytics/*`, cookie consent         |
| Speed / CWV _(Wave 3)_                     | `next/image`, font tuning                        |

---

## Part A — Code (per site)

### 1. Fill the site config — `lib/site-config.ts`

One object, `siteConfig`, holds every org fact: `name`, `legalName`,
`tagline`, `description`, `shortDescription`, `foundingDate`, `ein`,
`address`, `geo`, `contact`, `social`, `keywords`, `ogImage`.

> **`url` is not hardcoded here.** It comes from `site.config.ts`
> (`env SITE_URL`). This keeps canonical, schema, sitemap, and robots all
> pointed at one base. Do **not** reintroduce `NEXT_PUBLIC_SITE_URL`.

### 2. Schema builders — `lib/schema.ts`

Pure functions returning JSON-LD objects (each includes `@context`):
`organizationSchema()` (pick the right `@type` — `SportsOrganization`,
`LocalBusiness`, `NonprofitOrganization`…), `websiteSchema()` (with
`SearchAction`), `localBusinessSchema()`, `breadcrumbSchema(items)`,
`newsArticleSchema(post)`, `faqPageSchema(items)`. Adapt `@type` and
`areaServed`/`memberOf`/`knowsAbout` to the client's vertical.

### 3. Mount global schema — `app/layout.tsx`

Render once at the root, inside `<body>`:

```tsx
<JsonLd data={[organizationSchema(), websiteSchema()]} />
```

These two belong site-wide. Page-specific schemas (`Breadcrumb`, `FAQPage`,
`NewsArticle`) are rendered inside the relevant screen/route.

### 4. Default metadata — `app/layout.tsx`

Export `metadata` + `viewport` built from `siteConfig`:

- `metadataBase: new URL(siteConfig.url)` — makes relative canonicals work.
- `title.default` + `title.template` (`%s — <name>`).
- `description`, `keywords`, `openGraph`, `twitter`.
- `robots` **gated to production** (`VERCEL_ENV === "production"`); previews
  stay `noindex`.
- `viewport.themeColor`.
- Leave OG/Twitter `images` out — the file-based `opengraph-image.tsx`
  (step 8) injects them into every route automatically.

### 5. Crawler rules — `app/robots.ts`

2026 "block training, allow search" posture:

- **Block** training crawlers (GPTBot, ClaudeBot, CCBot, Google-Extended,
  Bytespider, Meta-ExternalAgent, Amazonbot, Applebot-Extended, …).
- **Allow** search-time bots that cite back (OAI-SearchBot, PerplexityBot,
  Claude-User/Claude-SearchBot, DuckAssistBot, Bingbot, Applebot, …).
- **Non-production → disallow all** (so previews never get indexed).
- Reference `sitemap` + `host`.

### 6. URL inventory — `app/sitemap.ts`

Static route list + dynamic entries (e.g. news posts via the same data
source the routes use). Set `priority` / `changeFrequency` per route.

### 7. AI briefing — `public/llms.txt`

Markdown the standard sections: one-paragraph summary, labeled facts,
Mission, Programs/Services, "How to engage", **"What we don't do"** (stops AI
inventing claims), "How to verify", Contact, **"For AI assistants"** (how to
summarize + cite). Served at `/llms.txt`.

### 8. Social card — `app/opengraph-image.tsx`

Branded **1200×630** via `next/og` `ImageResponse` — no binary asset, renders
on demand, auto-applies to every route. (A route can override with its own
`opengraph-image`.) Satori rule: any `<div>` with multiple children needs
`display: flex`.

### 9. Per-route metadata

Every `page.tsx` exports `metadata` (or `generateMetadata` for dynamic
routes) with a route-specific `title` + `description` and a relative
`alternates.canonical`. The layout's `metadataBase` resolves it.

### 10. Analytics + consent — _Wave 2 (done)_

- `components/analytics/consent-defaults.tsx` — Consent Mode v2 **default-deny**
  (raw inline `<head>` script; runs before GTM).
- `components/analytics/gtm.tsx` — GTM loader + `<noscript>`, gated on
  `NEXT_PUBLIC_GTM_ID` (unset → analytics off, but ready).
- `lib/consent-config.ts` — **the per-client editable surface**: banner/modal
  copy + categories + policy link. Architected to move into CMS
  `SiteSettings.consent` per tenant (different clients, different legal needs).
- `lib/cookie-consent.ts` — versioned localStorage via `useSyncExternalStore`;
  maps choices → `gtag('consent','update')`.
- `components/cookie-consent/` — Provider + Banner (accept/reject/customize) +
  Preferences modal (base-ui `Switch`) + footer re-open trigger. Wired in
  `app/layout.tsx` and the footer.

### 11. PageSpeed / CWV — _done (cvfc: 99 mobile / 98 desktop Performance)_

The high-impact levers (these moved cvfc from 63→99 mobile — apply to every site):

- **Defer GTM off the critical path** — load GTM on first interaction or ~4s
  idle (not `afterInteractive`). Analytics JS (~hundreds of KB) is the single
  biggest mobile-Performance hit once a GTM ID is set; deferring recovers it.
  Consent Mode defaults already block pre-consent firing regardless of timing.
- **Single prioritized LCP image** — hero carousels mount **only the active
  slide's image** (`priority` on slide 0); deferring the other slides gives the
  LCP image a clean `fetchpriority=high` preload and cuts mobile payload 3×.
- `next.config.ts` → `images.formats: ["image/avif","image/webp"]`; all images
  (hero, welcome, media-split, portrait-grid, field-grid) on `next/image`.
- Fonts already optimal via `next/font` (self-hosted, `display:swap`).
- **CDN images**: serve content images from R2 (edge CDN), not a slow external
  host through the optimizer — kills cross-origin LCP latency. Happens naturally
  once the hero is CMS-driven.
- Targets met: LCP, INP, CLS all green; CLS 0.

### 12. Agentic Browsing (2026 Lighthouse category)

- `llms.txt` must follow the **llmstxt.org spec**: `# H1` + `> blockquote`
  summary + `##` sections containing **markdown link lists**
  (`- [name](url): notes`). Prose-only sections fail the audit. (cvfc: 2/3 → 3/3.)

### 13. Accessibility note

- Brand gold (`#a08629`) fails WCAG AA contrast as small text on white and as
  white-on-gold buttons (~3.4:1). Per client, decide: navy text on gold buttons
  (passes), and a deeper gold or navy for small gold text. Lighthouse flags it.

---

## Part B — Manual setup (human — the part that isn't code)

These are the steps a person must do by hand for each deploy:

1. **Vercel env vars** (Project → Settings → Environment Variables), set for
   **Production _and_ Preview**, marked Sensitive:
   - `SITE_URL` — canonical base, e.g. `https://www.example.com` (until the
     domain is wired, use the `*.vercel.app` URL). **Single source of truth.**
   - `CMS_URL` — the Payload base, e.g. `https://cms.example.com`.
   - `PREVIEW_SECRET` — **must exactly match** the CMS's `PREVIEW_SECRET`.
   - `NEXT_PUBLIC_GTM_ID` _(optional)_ — GTM container id. Until it's set, no
     analytics load (Consent Mode + banner are still active).
   - Note: `NEXT_PUBLIC_SITE_URL` is intentionally **not** used.
   - The same `SITE_URL` for Prod + Preview is fine — previews emit the prod
     canonical on purpose (and stay `noindex` via the robots gate).

2. **CMS side** (Payload): set `PREVIEW_SECRET` (match the FE) and the
   frontend base (`FRONTEND_URL` in dev / tenant `domain` in prod) so Live
   Preview resolves.

3. **Domain / DNS:** point the production domain at Vercel; set `SITE_URL` to
   it. Until then everything runs on `*.vercel.app`.

4. **Post-deploy (do once per site):**
   - **Google Search Console** — verify the property, submit `/sitemap.xml`.
   - **Bing Webmaster Tools** — verify, submit sitemap.
   - **Test the OG card** — Facebook Sharing Debugger + LinkedIn Post
     Inspector (forces a re-scrape).
   - **PageSpeed Insights** — confirm LCP/INP/CLS in the green.
   - _(Wave 2)_ Add GA4/GTM IDs as env vars; confirm the consent banner gates
     analytics.

---

## Verification checklist

Run `bun run dev` (or check the deploy) and confirm:

- [ ] `/robots.txt` — prod allows search bots, blocks training bots; preview disallows all
- [ ] `/sitemap.xml` — every route present, absolute URLs on the right base
- [ ] `/llms.txt` — loads, facts accurate
- [ ] `/opengraph-image` — renders the 1200×630 card
- [ ] Homepage `<head>` — Organization + WebSite JSON-LD present
- [ ] Each route — unique `<title>` + meta description + canonical
- [ ] `bun run typecheck && bun run lint` — clean

---

## Repeat for a new site (the fast path)

1. Scaffold the site from the template.
2. Fill `lib/site-config.ts` with the new org's facts.
3. Adapt `lib/schema.ts` `@type`s + `areaServed`/`memberOf` to the vertical.
4. Copy `robots.ts`, `sitemap.ts`, `opengraph-image.tsx`, `public/llms.txt`;
   update the route list + llms.txt copy.
5. Set Vercel env (`SITE_URL`, `CMS_URL`, `PREVIEW_SECRET`).
6. Deploy → submit to Google Search Console + Bing → test OG card.

The end state is a generator that stamps steps 2–4; until then this doc is the
checklist.
