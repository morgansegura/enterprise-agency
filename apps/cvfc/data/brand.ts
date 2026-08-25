/**
 * Chula Vista FC brand guidelines — the content behind /brand.
 * Written for partners, sponsors, media, and club staff.
 *
 * ============================================================
 *  HOW TO UPDATE
 *  - Crest files      → edit components/layout/logo-icon, then
 *                       `bun run gen:brand-assets` (never hand-edit public/brand)
 *  - Colors / fonts   → keep in step with styles/tokens.css + fonts/index.ts
 *  - Policy wording   → /safeguarding and /link-policy are the authorities;
 *                       this page summarizes them, it does not replace them
 * ============================================================
 */

export type BrandAsset = {
  id: string;
  name: string;
  description: string;
  /** Preview file rendered on the page. */
  preview: string;
  /** Backdrop the preview sits on, so each variant is shown in its context. */
  surface: "light" | "dark" | "neutral";
  downloads: { label: string; href: string }[];
};

export type BrandColor = {
  id: string;
  name: string;
  hex: string;
  rgb: string;
  /** CSS custom property the site uses for this value. */
  token: string;
  role: string;
  /** Foreground the swatch label uses so it stays legible. */
  text: "light" | "dark";
  /** Contrast note — measured, not guessed. */
  contrast?: string;
};

export type BrandFont = {
  id: string;
  name: string;
  role: string;
  href: string;
  weights: string;
  stack: string;
  sample: string;
  /** Which CSS variable carries it. */
  token: string;
  /** Render the sample in this family. */
  family: "heading" | "base";
};

export type BrandRule = { id: string; text: string };

export type BrandSpec = {
  id: string;
  label: string;
  value: string;
  note?: string;
};

/* ------------------------------------------------------------------ assets */

export const BRAND_ASSETS: BrandAsset[] = [
  {
    id: "primary",
    name: "Primary crest",
    description:
      "The default mark. Use it on white, bone, and light photography wherever the full palette can reproduce.",
    preview: "/brand/cvfc-crest.svg",
    surface: "light",
    downloads: [
      { label: "SVG", href: "/brand/cvfc-crest.svg" },
      { label: "PNG 512", href: "/brand/cvfc-crest-512.png" },
      { label: "PNG 1024", href: "/brand/cvfc-crest-1024.png" },
      { label: "PNG 2048", href: "/brand/cvfc-crest-2048.png" },
    ],
  },
  {
    id: "on-dark",
    name: "On dark backgrounds",
    description:
      "The same crest, carrying the thin white keyline that keeps its edge from merging into navy or ink — the ring the header logo wears. The avatar is that crest on a navy tile, sized for profile pictures.",
    preview: "/brand/cvfc-crest-on-dark.svg",
    surface: "dark",
    downloads: [
      { label: "SVG", href: "/brand/cvfc-crest-on-dark.svg" },
      { label: "PNG 512", href: "/brand/cvfc-crest-on-dark-512.png" },
      { label: "PNG 1024", href: "/brand/cvfc-crest-on-dark-1024.png" },
      { label: "Avatar 1024", href: "/brand/cvfc-crest-avatar-1024.png" },
    ],
  },
  {
    id: "grayscale",
    name: "Grayscale crest",
    description:
      "For single-color printing, newsprint, and anywhere color can't reproduce. The separation between the rays, the ball, and the bay is preserved.",
    preview: "/brand/cvfc-crest-grayscale.svg",
    surface: "neutral",
    downloads: [
      { label: "SVG", href: "/brand/cvfc-crest-grayscale.svg" },
      { label: "PNG 1024", href: "/brand/cvfc-crest-grayscale-1024.png" },
    ],
  },
];

export const BRAND_KIT_HREF = "/brand/cvfc-brand-kit.zip";

/* ------------------------------------------------------------------- crest */

export const CREST_SPECS: BrandSpec[] = [
  {
    id: "clear-space",
    label: "Clear space",
    value: "25% of the crest's width on every side",
    note: "Nothing — type, photo edges, partner logos, page margins — enters that ring.",
  },
  {
    id: "min-size",
    label: "Minimum size",
    value: "40 px on screen · 0.5 in (13 mm) in print",
    note: "Below that, 'FÚTBOL CLUB' and the 1982 date close up and stop reading.",
  },
  {
    id: "file-choice",
    label: "Which file to use",
    value: "SVG wherever it is accepted; PNG when it isn't",
    note: "SVG stays sharp at any size and prints cleanly. Reach for PNG only in tools that reject vectors.",
  },
  {
    id: "backgrounds",
    label: "Backgrounds",
    value: "Primary on light, keylined crest on dark",
    note: "The dark-background file differs by one thin white ring — nothing else changes. Over photography, place the crest on a calm area or add a scrim, never straight onto a busy image.",
  },
  {
    id: "source",
    label: "Where files come from",
    value: "This page only",
    note: "Every file here is generated from the crest the website itself renders. Screenshots and re-traced copies drift.",
  },
];

export type BrandMisuse = {
  id: string;
  /** Drives the CSS that demonstrates the violation. */
  variant:
    | "recolor"
    | "stretch"
    | "rotate"
    | "effects"
    | "crop"
    | "low-contrast";
  caption: string;
};

export const CREST_MISUSE: BrandMisuse[] = [
  {
    id: "recolor",
    variant: "recolor",
    caption: "Don't recolor the crest, or tint it to match a layout.",
  },
  {
    id: "stretch",
    variant: "stretch",
    caption: "Don't stretch or squash it. Scale both dimensions together.",
  },
  {
    id: "rotate",
    variant: "rotate",
    caption: "Don't rotate the crest. It sits level, always.",
  },
  {
    id: "effects",
    variant: "effects",
    caption: "Don't add shadows, glows, outlines, or bevels.",
  },
  {
    id: "crop",
    variant: "crop",
    caption: "Don't crop the ring or lift an element out on its own.",
  },
  {
    id: "low-contrast",
    variant: "low-contrast",
    caption:
      "Don't place it on a color it can't hold its edge against — use white, bone, or the keylined crest on navy.",
  },
];

/** The violations that have no picture — stated plainly under the grid. */
export const CREST_ALSO =
  "Don't re-typeset \u201cChula Vista\u201d or \u201cFÚTBOL CLUB\u201d, don't rebuild the crest by hand, don't merge it into another logo, and don't screenshot it from this website \u2014 download the file.";

/* ------------------------------------------------------------------ naming */

export const NAMING_SPECS: BrandSpec[] = [
  {
    id: "first",
    label: "First mention",
    value: "Chula Vista FC",
    note: "How the club is known publicly. Use it the first time in any piece of writing.",
  },
  {
    id: "short",
    label: "After that",
    value: "CVFC",
    note: "Fine on second reference, in headlines, and where space is tight.",
  },
  {
    id: "full",
    label: "Full name",
    value: "Chula Vista Fútbol Club",
    note: "Keep the accent on the ú. Use it in formal writing, programs, and ceremonies.",
  },
  {
    id: "legal",
    label: "Legal name (paperwork)",
    value: "Chula Vista Youth Soccer League",
    note: "The IRS-registered name. Use it on grant applications, donation receipts, and anything tax-related.",
  },
  {
    id: "tagline",
    label: "Tagline",
    value: "Shaping Players. Inspiring Futures.",
    note: "Set as written, with the periods. Don't translate or reword it without asking.",
  },
  {
    id: "values",
    label: "Club values",
    value: "Passion. Unity. Respect. Attitude.",
    note: "Four words, in that order.",
  },
  {
    id: "founded",
    label: "Founded",
    value: "1982",
    note: "South County's longest-running competitive club. The year appears in the crest — keep the two consistent.",
  },
  {
    id: "avoid",
    label: "Common mistakes",
    value: "Chula Vista F.C. · CV FC · Chula Vista Football Club · the CVFC",
    note: "None of these are the club's name.",
  },
];

/* ------------------------------------------------------------------ colors */

export const BRAND_COLORS: BrandColor[] = [
  {
    id: "midnight",
    name: "Midnight Navy",
    hex: "#061c48",
    rgb: "6, 28, 72",
    token: "--color-midnight",
    role: "The primary brand color. Dark sections, body copy, and the default on light backgrounds.",
    text: "light",
    contrast: "16.6:1 with white — passes AA and AAA at any size.",
  },
  {
    id: "dusk",
    name: "Dusk Navy",
    hex: "#141d45",
    rgb: "20, 29, 69",
    token: "--color-dusk",
    role: "The navy inside the crest. Also used for deep panels that sit next to midnight.",
    text: "light",
  },
  {
    id: "gold",
    name: "Club Gold",
    hex: "#a08629",
    rgb: "160, 134, 41",
    token: "--color-gold",
    role: "The accent. Rules, eyebrows, and buttons — never long passages of text.",
    text: "light",
    contrast:
      "3.5:1 on white — too low for small text. Use navy on gold (4.7:1) instead.",
  },
  {
    id: "gold-bright",
    name: "Bright Gold",
    hex: "#b59f59",
    rgb: "181, 159, 89",
    token: "--color-gold-bright",
    role: "The crest's gold, and the accent that carries on dark backgrounds.",
    text: "dark",
    contrast: "6.4:1 on midnight navy — passes AA on dark.",
  },
  {
    id: "bone",
    name: "Bone",
    hex: "#f7f5ee",
    rgb: "247, 245, 238",
    token: "--color-bone",
    role: "The warm off-white behind alternating sections. Softer than pure white.",
    text: "dark",
  },
  {
    id: "ink",
    name: "Ink",
    hex: "#0a0e2a",
    rgb: "10, 14, 42",
    token: "--color-ink",
    role: "The deepest background, for full-bleed moments and the footer.",
    text: "light",
  },
  {
    id: "sky",
    name: "Crest Sky",
    hex: "#0284c7",
    rgb: "2, 132, 199",
    token: "—",
    role: "The keyline inside the crest. It belongs to the crest only — don't use it in layouts.",
    text: "light",
  },
];

/* -------------------------------------------------------------- typography */

export const BRAND_FONTS: BrandFont[] = [
  {
    id: "heading",
    name: "Google Sans Flex",
    role: "Headlines, section headings, and the crest-adjacent wordmark.",
    href: "https://fonts.google.com/specimen/Google+Sans+Flex",
    weights: "500 Medium · 600 Semibold · 700 Bold",
    stack: "var(--font-heading), system-ui, sans-serif",
    sample: "Shaping Players. Inspiring Futures.",
    token: "--font-heading",
    family: "heading",
  },
  {
    id: "base",
    name: "Geist",
    role: "Body copy, navigation, captions, buttons, and forms.",
    href: "https://fonts.google.com/specimen/Geist",
    weights: "400 Regular · 500 Medium · 600 Semibold",
    stack: "var(--font-base), system-ui, sans-serif",
    sample:
      "Founded in 1982, Chula Vista FC develops players from Mini Maestros through MLS NEXT.",
    token: "--font-base",
    family: "base",
  },
];

export const TYPE_SPECS: BrandSpec[] = [
  {
    id: "free",
    label: "Licensing",
    value: "Both families are free on Google Fonts",
    note: "Open source, licensed for print, web, and product. No purchase, no seat count.",
  },
  {
    id: "pairing",
    label: "Pairing",
    value: "Google Sans Flex for headings, Geist for everything else",
    note: "Don't set body copy in the heading face, and don't introduce a third family.",
  },
  {
    id: "case",
    label: "Case",
    value: "Sentence case for headings; uppercase reserved for eyebrows",
    note: "Eyebrows carry wide letter-spacing (0.25em). Body copy is never uppercase.",
  },
  {
    id: "fallback",
    label: "If you can't install them",
    value: "system-ui, then any grotesque sans",
    note: "Arial and Helvetica are acceptable substitutes in office documents.",
  },
];

/* ------------------------------------------------------------------- voice */

export const VOICE_DO: BrandRule[] = [
  {
    id: "development",
    text: "Lead with player development and the pathway — that is what the club sells.",
  },
  {
    id: "specific",
    text: "Be specific: name the league, the age group, the year, the result.",
  },
  {
    id: "plain",
    text: "Write for a parent deciding where to take their child. Plain English, short sentences.",
  },
  {
    id: "bilingual",
    text: "Treat Spanish and English as equals — not a translation bolted on at the end.",
  },
  {
    id: "nonprofit",
    text: "Say the club is a 501(c)(3) nonprofit wherever money is discussed.",
  },
];

export const VOICE_DONT: BrandRule[] = [
  {
    id: "competitors",
    text: "Name another club to make CVFC look better, or imply a rival is worse. The club wins on its own merits.",
  },
  {
    id: "promises",
    text: "Promise outcomes — scholarships, college placement, or professional contracts are earned, never guaranteed.",
  },
  {
    id: "elite",
    text: "Use 'elite' as a stand-in for expensive. It describes a level of play, not a price.",
  },
  {
    id: "stats",
    text: "Invent or round up numbers. If the club hasn't published it, don't print it.",
  },
  {
    id: "hype",
    text: "Turn one player's story into a guarantee for the next family.",
  },
];

/* ----------------------------------------------------------------- imagery */

export const IMAGERY_DO: BrandRule[] = [
  {
    id: "supplied",
    text: "Use photography the club supplies, and credit it as 'Photo: Chula Vista FC'.",
  },
  {
    id: "real",
    text: "Show real training, real matches, real families from the South Bay.",
  },
  {
    id: "legible",
    text: "Keep the crest legible where it appears on kit — don't crop it in half.",
  },
  {
    id: "remove",
    text: "Pull an image promptly when the club asks you to. Families can withdraw consent at any time.",
  },
];

export const IMAGERY_DONT: BrandRule[] = [
  {
    id: "advertising",
    text: "Use a minor's image in advertising, or in any way that implies a commercial endorsement.",
  },
  {
    id: "identifying",
    text: "Pair a player's full name with their school, neighborhood, or schedule.",
  },
  {
    id: "alter",
    text: "Alter the kit, the crest, or a sponsor mark inside a photograph.",
  },
  {
    id: "generated",
    text: "Present AI-generated or stock 'players' as Chula Vista FC.",
  },
];

/* ------------------------------------------------------- partners & rights */

export const PARTNER_DO: BrandRule[] = [
  {
    id: "separate",
    text: "Set partner logos beside the crest with at least one crest-width between them.",
  },
  {
    id: "weight",
    text: "Balance the marks by visual weight, not by matching their literal heights.",
  },
  {
    id: "wording",
    text: "Use the agreed wording — 'Official Partner of Chula Vista FC' or 'Proud Sponsor of Chula Vista FC'.",
  },
  {
    id: "approve",
    text: "Send artwork for approval before it is printed, installed, or published.",
  },
];

export const PARTNER_DONT: BrandRule[] = [
  {
    id: "lockup",
    text: "Combine the crest and your logo into a single new mark.",
  },
  {
    id: "endorse",
    text: "Suggest the club, its coaches, or its players endorse a product or service.",
  },
  {
    id: "expired",
    text: "Keep using club marks after an agreement ends.",
  },
  {
    id: "assume",
    text: "Assume permission. Use of the club's name and marks requires written consent.",
  },
];

export const IDENTITY_SPECS: BrandSpec[] = [
  {
    id: "status",
    label: "Tax status",
    value: "501(c)(3) nonprofit organization",
    note: "Donations are tax-deductible to the extent allowed by law.",
  },
  {
    id: "ein",
    label: "EIN",
    value: "95-3683491",
    note: "Verifiable through IRS Pub 78, ProPublica, and Candid.",
  },
  {
    id: "receipts",
    label: "Name on receipts and grants",
    value: "Chula Vista Youth Soccer League",
    note: "The registered name attached to the EIN. Public-facing materials still say Chula Vista FC.",
  },
  {
    id: "address",
    label: "Mailing address",
    value: "925 Hale Pl, #A3, Chula Vista, CA 91914",
    note: "Use this exact form everywhere — directories, invoices, and listings included.",
  },
  {
    id: "permission",
    label: "Permission to use the marks",
    value: "Required in writing",
    note: "Current partners, sponsors, and media working with the club may use the files here as described. Anything else, ask first.",
  },
];
