# U7–U9 tryouts campaign (December 2026)

A Search campaign on the Ad Grant that sends families to `/tryouts` until the
last tryout, and counts each signup as a conversion.

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
- **No "free" in the ads** until the club confirms tryouts are free.

The Ad Grant allows $329 a day, and the five always-on campaigns already add
up to that. While this campaign runs, take $40 from **CVFC - Player
Evaluations** (155 → 115), and put it back after December 8.

## Setting it up

### 1. GTM: the signup event

1. GTM → **Admin** → **Import Container** → choose `cvfc-gtm-tryouts.json`.
2. Workspace: **Existing**. Option: **Merge** → **Overwrite conflicting tags,
   triggers and variables**. It adds one tag, one trigger and the
   `DLV - age_group` variable; the other two variables are unchanged copies.
3. **Preview** on `https://www.chulavistafc.com/tryouts` to see it load, then
   **Submit** → publish as "Tryout signup event".

### 2. GA4: make it a key event

GA4 → **Admin** → **Key events** → **New key event** → `tryout_signup`.

### 3. Google Ads: the conversion

1. **Goals** → **Conversions** → **New conversion action** → **Website** →
   **Add a conversion action manually**.
2. Name **Tryout signup**, category **Sign-up**, **Don't use a value**, count
   **One**.
3. Choose **Use Google Tag Manager** and copy the **Conversion label**.
4. Add a **Google Ads Conversion Tracking** tag in GTM, with conversion ID
   `18459221351`, that label, and the trigger `CE - tryout_signup`. Publish.

### 4. Google Ads Editor: the campaign

1. **Get recent account changes** first.
2. **Account** → **Import** → **From file** → `cvfc-tryouts-campaign.csv`.
3. On the new campaign, set the **End date** to **December 8, 2026**.
4. Lower **CVFC - Player Evaluations** to $115 a day.
5. **Post**, then enable the campaign in Google Ads.

### After December 8

The campaign ends itself. Put **CVFC - Player Evaluations** back to $155 a day.
Next season: change the dates and headlines in `build-tryouts-campaign.py`,
run it, and import again.
