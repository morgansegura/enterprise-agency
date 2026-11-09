# U7–U9 tryouts campaign (December 2026)

A Search campaign on the Ad Grant that sends families to `/tryouts` until signups
close, and counts each signup as a conversion.

| File                        | What it is                                               |
| --------------------------- | -------------------------------------------------------- |
| `build-tryouts-campaign.py` | Builds the campaign and checks it against Ad Grant rules |
| `cvfc-tryouts-campaign.csv` | The campaign, for Google Ads Editor                      |
| `cvfc-gtm-tryouts.json`     | The `tryout_signup` GA4 event, for GTM                   |

## The campaign

- **CVFC - U7-U9 Tryouts Dec 2026**: $40 a day, Maximize conversions, San
  Diego County, English. It imports **paused**.
- **Four ad groups:** Kids Tryouts, By Age, Girls and Boys. Girls and Boys open
  the form with that tryout already chosen (`/tryouts?player=girls`).
- **The ads say "free"**: the club confirmed the tryouts are free.

The Ad Grant allows $329 a day, and the five always-on campaigns already add
up to that. While this campaign runs, take $40 from **CVFC - Player
Evaluations** (155 → 115), and put it back after December 7.

## Setting it up

Steps 1–3 were done on November 9, 2026.

### 1. Google Ads: the conversion (done)

**Tryout signup**, filed under **Submit lead form** (an account default goal,
so every campaign counts it without per-campaign settings). Conversion ID
`18459221351`, label `P30ICL2ylbUdEOe6heJE`. Same value for each conversion,
counted once per click, 90-day window.

### 2. GTM (done)

`cvfc-gtm-tryouts.json` imported with **Merge** (never Overwrite, which
replaces the whole container) and published as version 6, "Tryout signup: GA4
event and Google Ads conversion". It added the `CE - tryout_signup` trigger,
the `DLV - age_group` variable, the GA4 event tag and the Google Ads
conversion tag.

### 3. GA4: make it a key event (after the first signup)

GA4 only lets an event be marked once it has arrived. After the first tryout
signup: GA4 → **Admin** → **Events** → **Recent events** → star
`tryout_signup`.

### 4. Google Ads Editor: the campaign

1. **Get recent account changes** first.
2. **Account** → **Import** → **From file** → `cvfc-tryouts-campaign.csv`.
   Use Ads Editor: the Google Ads website's bulk upload expects a different
   layout and rejects this file.
3. On the new campaign, set the **End date** to **December 7, 2026**. The
   account runs on Eastern time, and boys signups close December 7.
4. Lower **CVFC - Player Evaluations** to $115 a day.
5. **Post**, then enable the campaign in Google Ads.

### After December 7

The campaign ends itself. Put **CVFC - Player Evaluations** back to $155 a day.
Next season: change the dates and headlines in `build-tryouts-campaign.py`,
run it, and import again.
