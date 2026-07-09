/** Per-site knobs. The new-site script fills these in; tweak as needed. */
export const site = {
  /** Display name (titles, OG, schema). */
  name: "Emily Green",
  /** Canonical production URL. */
  url: process.env.SITE_URL ?? "http://localhost:4012",
  /** Tenant slug in the central CMS — scopes every CMS query to this site. */
  tenantSlug: "emily-green",
  /** Central CMS base URL (Payload). */
  cmsUrl: process.env.CMS_URL ?? "http://localhost:4010",

  /** One-line tagline (OG/schema slogan). */
  tagline: "Honest Advice. Happy Homeowners.",
  /** ~155-char default meta description. */
  description:
    "Emily Green is a Boise-area mortgage broker with Churchill Mortgage, serving the Treasure Valley and lending across 11 states. Honest advice, personal guidance, and loans built around your goals.",
  /** Contact. */
  email: "hello@emilygreen.example",
  phone: "+1-888-562-6200",
  /** Physical office (NAP — keep identical everywhere). */
  address: {
    street: "3597 East Monarch Sky Ln, Suite 245",
    city: "Meridian",
    state: "ID",
    postalCode: "83646",
    country: "US",
  },
  /** Primary geo (for LocalBusiness geo). */
  geo: { lat: 43.6135, lng: -116.3915 },
  /** Areas served (cities + licensed states). */
  areaServed: [
    "Boise, ID",
    "Meridian, ID",
    "Eagle, ID",
    "Nampa, ID",
    "Treasure Valley",
    "Arizona",
    "California",
    "Florida",
    "Idaho",
    "Missouri",
    "New Mexico",
    "Nevada",
    "Oregon",
    "Texas",
    "Virginia",
    "Washington",
  ],
  /** The person behind the brand (Person schema + founder). */
  founder: {
    name: "Emily Meadow Green",
    jobTitle: "Mortgage Loan Originator",
    nmls: "1429849",
    alternateName: "The Mortgage Mama",
  },
  /** Regulated affiliation. */
  company: { name: "Churchill Mortgage Corporation", nmls: "1591" },
  /** Genuine aggregate rating (Birdeye reviews) — real numbers only. */
  rating: { value: 5, count: 125 },
  /** Brand color (OG image + theme-color). */
  themeColor: "#064952",
  /** Social + profile URLs (schema sameAs). */
  sameAs: [
    "https://www.facebook.com/emily.green.44788",
    "https://www.instagram.com/savingyougreen.themortgagemama",
    "https://www.linkedin.com/in/emilyshomeloans",
    "https://www.youtube.com/@savingyougreen",
  ],
  /** Twitter/X handle for cards (omit @ elsewhere). */
  twitter: "",
} as const;

export type SiteConfig = typeof site;
