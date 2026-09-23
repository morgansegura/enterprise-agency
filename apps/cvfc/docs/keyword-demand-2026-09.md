# CVFC search demand — September 2026

Source: Google Keyword Planner, run from the Ad Grant account (173-069-6644),
San Diego County + Tijuana, Sep 2025 – Aug 2026. Two exports (English seeds, and
a second pass with geo seeds) merged: **995 unique keywords, 728 targetable**.
Raw CSVs: `docs/keywords/` in the repo root.

**Caveat on precision:** a grant account with no spend history sees bucketed
volumes (10–100, 100–1K, 1K–10K), not exact numbers, and the month-by-month
columns came back empty. Treat every figure as an order of magnitude.

---

## The five findings that should drive the plan

**1. The market is a long tail, not a head.** A handful of terms sit at ~500/mo;
hundreds sit at ~50/mo. Total realistic parent-intent demand in San Diego County
is low thousands of searches a month. The Ad Grant will not spend $10k/mo
against it — expect hundreds to low thousands of dollars. The upside is that
almost everything is **Low** competition and cheap to win.

**2. "Near me" dominates, and ads/pages don't win it.** soccer clubs near me,
club soccer teams near me, soccer teams near me (each ~500/mo, top-of-page bids
up to $11.33 — the most expensive terms in the set), plus dozens of 50/mo
variants. Google answers these with the local 3-pack, ranked on proximity,
review count and profile completeness. **The Google Business Profile is the
only lever here, and it is currently empty (zero reviews).**

**3. "San Diego" head terms are winnable and the site is not built for them.**
All ~500/mo, all Low competition:
`youth soccer san diego` · `soccer club san diego` · `youth soccer leagues san diego` ·
`soccer leagues san diego` · `soccer academy san diego` · `soccer camps san diego`
The site positions around the South Bay. Nothing targets San Diego as a whole.
This is the gap behind "I want San Diego, not just the South Bay".

**4. Geo-modified searches are tiny — stop building city pages.**
`youth soccer chula vista` 50/mo · `soccer el cajon` 50/mo · `soccer eastlake`,
`soccer bonita`, `soccer national city` all unmeasurable. The six existing area
pages are enough; more would chase demand that isn't there. Local intent flows
through "near me" instead (see #2).

**5. Level/league terms are the biggest legitimate prize.**
`mls next` 5,000/mo · `socal soccer league` 5,000/mo · `ecnl soccer` 500 ·
`npl soccer` 500 · `elite academy soccer` · `dpl soccer`. CVFC genuinely plays
in these. Today they are lines on program pages, not pages that own the terms.

### Secondary clusters worth pages

- **Goalkeeper** — 36 keywords, ~1,350/mo (`goalkeeper training near me`,
  `youth goalkeeper training`, `goalkeeper coaching`). CVFC has a real GK
  pathway; almost no club builds a page for this.
- **Seasonal leagues and camps** — `youth summer soccer camps`,
  `winter soccer near me`, `spring/fall soccer leagues near me`,
  `soccer camps san diego` (500/mo). Only publish if the club actually runs
  these — confirm before writing.
- **Age-specific** — `soccer programs for 4/6/7/8/10 year olds`, each its own
  50/mo search. Foundations covers 4–9 in one block and matches none of them
  precisely; add per-age sections with the ages in the headings.

### Spanish

The Spanish-language run returned almost no Spanish keyword strings, because the
seeds were English. Real signal either way: Spanish-speaking families in San
Diego largely search in English. Re-run with Spanish seeds before investing in
Spanish pages.

---

## Build order

| #   | Work                                                        | Targets                                                                                   | Why first                                 |
| --- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------- |
| 1   | GBP: description, photos, categories, posts, **50 reviews** | every "near me" term                                                                      | Only lever for the biggest cluster; free  |
| 2   | San Diego pillar page                                       | `youth soccer san diego`, `soccer club san diego`, `soccer academy san diego` (~2,000/mo) | Head terms with no page today             |
| 3   | `/guides/mls-next-san-diego`                                | `mls next` (5,000/mo)                                                                     | Largest single term CVFC can honestly own |
| 4   | `/guides/youth-soccer-leagues-explained`                    | socal league, ecnl, npl, dpl, elite academy (~7,000/mo)                                   | One page, many terms, AEO-shaped          |
| 5   | Expand goalkeeper page                                      | ~1,350/mo                                                                                 | Real differentiator, unclaimed            |
| 6   | Per-age sections on Foundations                             | age queries                                                                               | Cheap, matches exact phrasing             |
| 7   | `/fields/hoover-high-school`, `/fields/ofarrell-charter`    | central SD presence                                                                       | Supports #1 and #2, honest local claim    |
| 8   | Ads: add the league/level and goalkeeper keywords           | above                                                                                     | Same targets, paid and organic together   |

**Not doing:** more city/neighborhood pages (#4 above), and no fake or
unstaffed Business Profile locations.
