# Client Build Playbook — Foundation → Ranking Offensive

The end-to-end, repeatable process for **every** client site: build it
best-in-class, launch it, and make it **actively climb SEO/AEO/GEO and displace
competitors**. Ranking is the product, not a side effect. (Mandate:
"sites must claw to the top and push competitors down" — Morgan, 2026-06-19.)

> Phases 0–1 are the _foundation_ (table stakes — necessary, not differentiating;
> every serious competitor has them). Phases 2–8 are the _offensive_ — what
> actually outranks rivals. Do not stop at Phase 1.

---

## Phase 0 — Scaffold & stack

Use the generators (`new-site`, `gen:block`/`gen:component`/etc.) and WF
conventions. Shared `@wf/ui`, per-site `apps/<tenant>`, central Payload CMS.
See `~/.claude/scaffold-baseline.md` + the project scaffolding memory.

## Phase 1 — Technical foundation (table stakes)

The growth layer — **see `docs/growth-layer-setup.md`**: SEO/AEO/GEO infra
(schema/JSON-LD, llms.txt, AI-crawler robots, sitemap, OG, per-route metadata),
analytics + Consent Mode v2, favicon, Core Web Vitals → ~100. Necessary to be
_in the game_; it does not win the game.

## Phase 2 — Competitive teardown (per client, BEFORE writing content)

- Identify the category incumbents — who ranks now for the money queries.
- Gap analysis: their content depth, schema, local presence, backlinks, weaknesses.
- Find **the wedge** — the angle this client wins on.
  - _cvfc example:_ incumbents Surf, Albion (named in `data/faq.ts`). Wedge =
    **local since 1982 · ~$800–2k vs $8k+ · bilingual · MLS NEXT access**.
- Output: a **target query map** (money + long-tail) and the positioning angle.
  cvfc's battleground queries are already in `siteConfig.keywords`.

## Phase 3 — Content & topical authority (the #1 ranking lever in 2026)

- **Pillar + cluster** per money topic: one pillar page + 5–15 supporting articles.
- Comprehensive, **original**, and **cited** (inline source attribution every
  150–200 words). Original data > rehashed content.
- Internal linking across the cluster.
- **E-E-A-T**: named authors with credentials, first-person experience framing.

## Phase 4 — AEO/GEO shaping (be the source AI quotes, not the competitor)

- **Lead with the answer** — a 40–60 word direct answer opening each section.
- Question-based H2/H3s; **FAQPage** schema (honest, sparing); **DefinedTerm**
  glossaries (lifted verbatim by AI engines).
- Publish original stats/research (Perplexity weights this heavily).
- `llms.txt` accurate, with the "for AI assistants" guidance block.

## Phase 5 — Local SEO (local-service clients: cvfc, fox-hvac, …)

- **Google Business Profile**: claim, full categories, posts, photos, Q&A.
- **NAP consistency** everywhere; `LocalBusiness` schema.
- **Per-city / service-area pages** targeting "<service> <city>" queries.
- **Reviews** — collect + genuine `Review`/`AggregateRating` schema.
- Local citations / directories.

## Phase 6 — Entity & authority

- Wikidata entry; consistent `sameAs`; directory + industry listings; earned
  mentions/backlinks. Cross-platform name/handle consistency (AI verifies entity).

## Phase 7 — Launch checklist

Run the pre-launch checklist in `~/.claude/seo-aeo-geo-aio-standards.md`, plus:

- Submit sitemap to **Google Search Console + Bing Webmaster Tools**.
- GBP live; OG card tested; consent gating analytics; `verify` green.

## Phase 8 — Ongoing offensive (the campaign — never "done")

- **Monitor**: GSC, rank tracking, **Share of Answer** (is the brand cited by
  ChatGPT/Perplexity/Google AI Overviews?), competitor movements.
- **Freshness**: update content + steady publish cadence.
- **Iterate**: close the gaps monitoring reveals; expand winning clusters.

---

## Per-client artifacts to produce

Competitive teardown · target query map · content calendar · local-setup
checklist · monitoring dashboard. These live with each `apps/<tenant>`.

## The discipline

Every client ships **Phase 0–1 at launch** and runs **Phase 2–8 as a sustained
campaign**. Technical perfection is the floor; authority + local + AI-citation +
relentless iteration are how we push competitors down.
