# CVFC work log

What was done, when, and why — kept as the work happens so the monthly report
is a summary rather than an act of recollection. Newest month first.

Each entry says what changed, the evidence that prompted it, and what to
measure afterwards. The "measure" line is what makes the report a result
rather than a list of activity.

---

## October 2026

### Dead-click fixes — homepage (Oct 12)

**Evidence.** Microsoft Clarity flagged dead clicks at **20.3% of sessions and
rising 54.6%**. The 30-day dead-tap heatmap on the homepage named the elements:

| Element                                           | Dead taps (30d) |
| ------------------------------------------------- | --------------- |
| Hero headline, "CUP CHAMPIONS / BUILT TO COMPETE" | 8 (13.3%)       |
| "SPECIALTY TRAINING" pill tag                     | 5 (8.3%)        |
| `IMG.portrait-card-image` (staff photos)          | 5               |
| `IMG.media-split-image`                           | 5               |
| `#logo-icon` circle and path (footer logo)        | 4               |

**Changed.**

- **Footer logo now links home.** It was a bare SVG with no anchor, so every
  visitor who tapped it to get back to the homepage got nothing.
- **Media-split photos now link to the section's own primary button.** The
  photo and its pill-shaped tags read as interactive — the tags are
  rounded-full, bold, uppercase — so taps go where the section's button goes
  instead of nowhere. Tags themselves are now `pointer-events-none` so they
  never swallow the tap.
- **Staff portrait cards link to the section's CTA** where one exists, so a tap
  on a coach's photo reaches the staff page.

**Not changed.** Hero headline taps (8) are left alone: there is no obvious
destination, and people often tap large text with no intent to navigate.
Revisit if it stays high after the rest settle.

**Measure.** Clarity dead clicks, 30 days after deploy, against the 20.3%
baseline recorded 12 Oct 2026.

### Audit sweep — indexing and headings (Oct 12)

**Evidence.** Ran the CauseVisible audit engine against the live site. The site
scores well — performance 85, SEO 100, accessibility 97, best practices 100, and
real visitors are in Google's FAST band (LCP 1.2s, CLS 0.00, FCP 1.1s). Five
findings; three were real.

**Changed.**

- **`/preview` was publicly crawlable.** robots.ts allowed everything except
  `/api/`, so the CMS live-preview surface was open to search engines — and it
  was inheriting the homepage title, which is what surfaced as a duplicate-title
  warning. It is now disallowed in robots.txt _and_ carries `robots: { index:
false }`, because robots.txt only asks a crawler not to fetch a page; a linked
  page can still be indexed without it.
- **`/about/administrators` had no H1.** The screen used the shared `Heading`
  component, which defaults to `h2`. Added `headingAs="h1"`.

**Dismissed as false positives.** "Missing Contact page" — CVFC has no contact
page by design; `/evaluations#register` and per-audience mailto links are the
contact surface. "GA4 not detected" and "Clarity not detected" — both load
through the GTM container, which a source scan cannot see.

**Still open.** No accessibility statement (a content page, worth writing).
Donation platform not detected on `/support` — worth confirming the give flow is
machine-readable.

**Measure.** Re-run the audit after deploy; expect the duplicate-title and H1
findings to clear. Confirm `/preview` drops out of Search Console's indexed pages.

---

## How to use this for the monthly report

Pull each entry's **Evidence → Changed → Measure**. The report says what was
broken, what was done, and what moved — in that order. Anything without a
measure line is activity, not a result, and belongs lower in the report.
