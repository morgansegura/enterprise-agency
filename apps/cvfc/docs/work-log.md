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

---

## How to use this for the monthly report

Pull each entry's **Evidence → Changed → Measure**. The report says what was
broken, what was done, and what moved — in that order. Anything without a
measure line is activity, not a result, and belongs lower in the report.
