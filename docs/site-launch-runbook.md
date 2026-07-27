# Site Launch Runbook

The repeatable, start-to-finish checklist for taking a WF client site live on its
real domain. Written from the CVFC launch (2026-07) — every step here is a gotcha
we actually hit. Do these **in order**. Each site is a Next.js FE on **Vercel** +
the shared Payload **CMS** on Render.

> Legend: **[you]** = manual action in a dashboard · **[code]** = repo change +
> deploy · ⚠️ = the step most likely to be forgotten.

---

## 0. Pre-flight (before touching DNS)

- [ ] **[code]** ⚠️ **Audit for hardcoded old-domain assets.** Grep the FE for the
      _current live site's_ domain — images/links often point at the old host
      (e.g. `chulavistafc.com/wp-content/...`). The moment DNS moves, those 404.
      Rehost to R2/CDN or `public/`, or the launch ships broken images.
      `bash
    grep -rn "<olddomain>/wp-content\|<olddomain>/uploads" apps/<site>
    `
- [ ] **[you]** Confirm all content is on the **CDN/CMS**, not the old site
      (crawl the `*.vercel.app` build and count image hosts).
- [ ] **[code]** Add **301 redirects** for the old URL structure in
      `next.config.ts` `redirects()` — old indexed URLs + backlinks must not 404.
      Pull the full old-URL list from **GSC → Indexing → Pages**.

## 1. Vercel environment variables

Set on **Vercel → project → Settings → Environment Variables (Production)**, then
**redeploy** — most of these bake in at build time, so _setting alone does
nothing without a new deploy_.

- [ ] ⚠️ **`SITE_URL`** = `https://www.<domain>.com` — the canonical prod URL.
      Drives sitemap, canonicals, OG, JSON-LD. **This is the #1 missed step** — if
      left as the `*.vercel.app` URL, Google indexes the wrong host and you leak
      ranking signals. Use the **canonical host** (see DNS: if apex→www, use `www`).
- [ ] **`NEXT_PUBLIC_GTM_ID`** = `GTM-XXXXXXX` — GTM won't load without it (it's
      `NEXT_PUBLIC_*`, so also build-time → redeploy).
- [ ] **`CMS_URL`** = the Render CMS base URL.
- [ ] **`RESEND_FROM`** = `Client Name <noreply@<domain>.com>` — else transactional
      email only reaches the Resend account owner. See
      [reference: Resend setup](../.claude/... or team notes).
- [ ] **`PREVIEW_SECRET`**, **`REVALIDATE_SECRET`**, tenant keys as the site needs.

## 2. DNS cutover — the email-safe way

Website = apex `A` + `www` `CNAME`. Email = `MX` + `TXT` (SPF/DKIM/DMARC).

- [ ] **[you]** In **Vercel → Domains**, add `<domain>.com` + `www.<domain>.com`.
      Copy the **exact** A IP + `www` CNAME target it shows — these are now
      **project-specific** (A may be `76.76.21.21` _or_ `216.150.1.1`; CNAME may be
      a `…vercel-dns-016.com` value, not the universal one).
- [ ] **[you]** At the DNS host, edit **only**: apex `@` `A` → Vercel IP; `www`
      `CNAME` → Vercel target. Delete stale `@` A records to the old host.
- [ ] ⚠️ **Leave every `MX` and mail `TXT`/`CNAME` untouched** (SPF, DMARC, Resend
      `resend._domainkey`/`send`, AWeber, Mailchimp `k*._domainkey`).
- [ ] ⚠️ **NEVER switch to the registrar/Vercel nameservers** — that moves ALL DNS
      and drops every email record. If NS were already moved, **recreate all MX +
      SPF + DKIM records** in the new zone (the old host's "DNS history/restore"
      shows the values) or email dies.
- [ ] Note the **canonical host**: Vercel usually sets apex `308 → www`, so `www`
      is canonical → that's what `SITE_URL` should be.

## 3. Post-cutover — point everything at the real domain

- [ ] ⚠️ **`SITE_URL`** set + redeployed (Step 1) — verify the **sitemap** now lists
      `www.<domain>.com`, not `*.vercel.app`:
      `bash
    curl -s https://www.<domain>.com/sitemap.xml | grep -oE "https://[a-z.]+/" | sort -u
    `
- [ ] **[you]** Set the **CMS tenant `domain`** to `https://www.<domain>.com`
      (Payload → Tenants) — live-preview + cross-deploy revalidation resolve per
      tenant from this field.
- [ ] Verify `robots.txt`, `sitemap.xml`, `llms.txt`, `og-image` all reachable on
      the real domain.
- [ ] Old URLs 301 correctly (`curl -I https://www.<domain>.com/<old-path>`).

## 4. Analytics

- [ ] **[you]** GA4 property created → copy **Measurement ID** `G-XXXXXXXX`.
- [ ] **[you]** In **GTM**, add a **Google Tag** (not "GA4 Event") with that Tag ID,
      trigger **Initialization – All Pages** → **Submit/Publish** the container.
- [ ] Don't hardcode `gtag.js` — GA4 lives _inside_ GTM (double-counts otherwise).
- [ ] Verify: visit the site, accept the cookie banner, check **GA4 → Realtime**.
- [ ] Consent: the site ships Consent Mode v2 default-deny; GTM "consent rate"
      warnings for a privacy-first setup are expected, not a bug.

## 5. Search engine notification

- [ ] **[you]** **GSC:** verify the domain → submit the sitemap → **URL Inspection →
      Request Indexing** on the homepage + top pages (crawled in hours–days).
- [ ] **[you]** **Bing Webmaster Tools:** submit the sitemap.
- [ ] **[code/you]** **IndexNow** (Bing/Copilot, instant): key file in `public/` +
      `bun run indexnow` after content deploys. Google doesn't support IndexNow.

## 6. Final verification

- [ ] `https://www.<domain>.com` + apex redirect both resolve over HTTPS.
- [ ] `www` is the single canonical (or apex — just pick one and be consistent).
- [ ] Images load (no old-host 404s), forms send email, cookie banner gates GTM.
- [ ] Sitemap/robots/llms on the real domain; canonicals = real domain.
- [ ] GA4 Realtime shows your own visit.

---

## The three most-missed steps (learn from CVFC)

1. **`SITE_URL` left as `*.vercel.app`** → sitemap + canonicals point at the wrong
   host → Google indexes the vercel URL. Always update + redeploy after cutover.
2. **Env var set but not redeployed** → build-time vars (`SITE_URL`,
   `NEXT_PUBLIC_GTM_ID`, `RESEND_FROM`) do nothing until a new deploy.
3. **Moving nameservers dropped the email records** → recreate MX/SPF/DKIM, or
   email silently breaks. Prefer editing A/CNAME in place; never move NS.

Related: `docs/growth-layer-setup.md`, `apps/cvfc/docs/seo-strategy.md`.
