/**
 * Single source of truth for site-level metadata, branding, and contact.
 *
 * `url` comes from `site.config.ts` (env `SITE_URL`) so canonical, schema,
 * sitemap, and robots all resolve to one base — no drift.
 */

import { site } from "@/site.config";

export const siteConfig = {
  name: "Chula Vista FC",
  legalName: "Chula Vista Fútbol Club",
  shortName: "CVFC",
  tagline: "Shaping Players. Inspiring Futures.",
  motto: "Passion. Unity. Respect. Attitude.",
  description:
    "Chula Vista FC is a youth soccer club in the South Bay of San Diego, California. Founded in 1982, CVFC develops players through MLS NEXT, Elite Academy, DPL, NPL, and the Southwest Premier League — guided by passion, unity, respect, and attitude.",
  shortDescription:
    "South Bay youth soccer club since 1982 — MLS NEXT, Elite Academy, DPL, NPL.",
  url: site.url,
  locale: "en_US",
  foundingDate: "1982",
  /** Federal Tax ID — public via IRS Pub 78, ProPublica, Candid. Surfaced on /support for donor verification. */
  ein: "20-3786129",
  ogImage: "/og-image.png",
  geo: {
    region: "US-CA",
    placename: "Chula Vista",
    position: "32.6540;-116.9668",
    icbm: "32.6540, -116.9668",
    latitude: 32.654,
    longitude: -116.9668,
  },
  address: {
    streetAddress: "925 Hake Pl, #A3",
    addressLocality: "Chula Vista",
    addressRegion: "CA",
    postalCode: "91914",
    addressCountry: "US",
  },
  contact: {
    phone: "+1-619-764-6505",
    email: "contact@chulavistafc.com",
  },
  social: {
    facebook: "https://www.facebook.com/chulavistafc/",
    instagram: "https://www.instagram.com/chulavistafc/",
    twitter: "https://twitter.com/chulavistafc",
    youtube: "https://www.youtube.com/chulavistafc",
  },
  keywords: [
    "best soccer club San Diego",
    "best youth soccer club San Diego",
    "best player development soccer club San Diego",
    "top soccer club South County San Diego",
    "MLS NEXT San Diego",
    "MLS NEXT clubs San Diego",
    "Elite Academy soccer San Diego",
    "affordable MLS NEXT San Diego",
    "non-profit youth soccer San Diego",
    "youth soccer tryouts San Diego",
    "youth soccer tryouts Chula Vista",
    "youth soccer Chula Vista",
    "competitive soccer San Diego",
    "kids soccer Chula Vista",
    "youth soccer Bonita",
    "youth soccer Eastlake",
    "youth soccer Otay Ranch",
    "youth soccer South Bay San Diego",
    "DPL girls soccer SoCal",
    "Girls Academy San Diego",
    "youth goalkeeper training San Diego",
    "youth goalkeeper training Chula Vista",
    "Mini Maestros soccer",
    "Southwest Premier League",
    "Surf alternative San Diego",
    "Albion alternative San Diego",
    "Chula Vista FC",
    "CVFC",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
