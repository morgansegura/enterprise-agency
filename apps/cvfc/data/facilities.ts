/**
 * CVFC facilities — training grounds and match-day venues across
 * Chula Vista and South San Diego. Powers /about/facilities.
 *
 * ============================================================
 *  HOW TO UPDATE
 *  - Confirmed venue   → fill in real name, address, image, mapsUrl
 *  - Add a venue       → push a new entry below
 *  - Decommission      → set status: "retired" (soft delete)
 *
 *  Eventually this file goes away — CMS serves the same shape via API.
 *  Entries marked `placeholder: true` are scaffolds for client review.
 * ============================================================
 */

export type FacilityTier = "featured" | "park";

export type FacilityRole =
  | "primary"
  | "match-day"
  | "specialty"
  | "partner"
  | "park";

export type FacilityStatus = "active" | "seasonal" | "retired";

export type Facility = {
  id: string;
  name: string;
  /** Layout group: "featured" → MediaSplit row, "park" → compact grid card. */
  tier: FacilityTier;
  role: FacilityRole;
  roleLabel: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  description: string;
  uses: string[];
  features: string[];
  image?: {
    src: string;
    alt: string;
    /** Where this image came from — track provenance so we can credit, swap, or remove. */
    credit?: { source: string; url?: string };
  };
  mapsUrl: string;
  status?: FacilityStatus;
  /** Internal flag — true when entry is awaiting verified data from the club. */
  placeholder?: boolean;
};

export const FACILITIES: Facility[] = [
  {
    id: "vca",
    name: "Victory Christian Academy",
    tier: "featured",
    role: "primary",
    roleLabel: "Primary Training Venue",
    address: {
      street: "810 Buena Vista Way",
      city: "Chula Vista",
      state: "CA",
      zip: "91910",
    },
    description:
      "Victory Christian Academy anchors the CVFC week — a dedicated soccer environment with full-size pitches, lighting for evening sessions, and the kind of professional training surface our top-tier teams need. MLS NEXT, MLS NEXT Academy, Elite Academy, DPL, and NPL programs train here.",
    uses: ["MLS NEXT", "MLS NEXT Academy", "Elite Academy", "DPL", "NPL"],
    features: [
      "Full-size 11v11 pitches",
      "Evening lighting",
      "Professional surface",
    ],
    image: {
      src: "/media/image/facilities/dv7-soccer-center.webp",
      alt: "Victory Christian Academy field",
      credit: {
        source:
          "chulavistafc.com (downloaded — original at /wp-content/uploads/2023/11/IMG_4496.webp)",
        url: "https://chulavistafc.com/",
      },
    },
    mapsUrl:
      "https://www.google.com/maps/search/810+Buena+Vista+Way,+Chula+Vista,+CA+91910",
  },
  {
    id: "hoover-hs",
    name: "Hoover High School",
    tier: "featured",
    role: "match-day",
    roleLabel: "Match-Day Venue",
    address: {
      street: "4474 El Cajon Blvd",
      city: "San Diego",
      state: "CA",
      zip: "92115",
    },
    description:
      "Hoover High School hosts CVFC match days across multiple pathways. Regulation pitches, spectator access, and the kind of game-day environment that makes a Saturday match feel like one.",
    uses: ["Match Day", "MLS NEXT", "DPL", "NPL", "First Team"],
    features: ["Regulation pitches", "Spectator access", "Match-day amenities"],
    image: {
      src: "/media/image/facilities/hoover-high-school.jpg",
      alt: "Hoover High School field",
      credit: {
        source: "Facilitron — Hoover High School Field listing (downloaded)",
        url: "https://facilities.facilitron.com/5ec58382db6bf800c7f9a8b0",
      },
    },
    mapsUrl: "https://www.google.com/maps/search/Hoover+High+School+San+Diego",
  },
  {
    id: "indoor-training-center",
    name: "Indoor Training Center",
    tier: "featured",
    role: "specialty",
    roleLabel: "Indoor Training Facility",
    address: {
      street: "925 Hake Pl, #A3",
      city: "Chula Vista",
      state: "CA",
      zip: "91914",
    },
    description:
      "CVFC's indoor training facility — a year-round specialty environment for technical work, small-sided sessions, goalkeeper sessions, and bad-weather days. Indoor turf and tight space sharpens first touch and decision speed in a way outdoor pitches can't replicate.",
    uses: [
      "Indoor Training",
      "Goalkeeper Specialty",
      "Foundations",
      "Pathway Teams",
    ],
    features: [
      "Indoor turf",
      "Year-round availability",
      "Small-sided training",
    ],
    image: {
      src: "/media/image/facilities/futbol-training-center.jpg",
      alt: "Indoor Training Center indoor facility",
      credit: {
        source:
          "chulavistafc.com (downloaded — original at /wp-content/uploads/2023/03/b149978d-121a-4977-85c5-82cc7d2af120.jpg)",
        url: "https://chulavistafc.com/",
      },
    },
    mapsUrl:
      "https://www.google.com/maps/place/925+Hale+Pl,+Chula+Vista,+CA+91914/@32.6510202,-116.9652353,1295m/data=!3m2!1e3!4b1!4m6!3m5!1s0x80d9456b5884a3d5:0x6a231afd80080baa!8m2!3d32.6510157!4d-116.962655!16s%2Fg%2F11pw0l108w?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D",
  },
  {
    id: "mountain-hawk-park",
    name: "Mountain Hawk Park",
    tier: "park",
    role: "park",
    roleLabel: "Community Park",
    address: {
      street: "1475 Lake Crest Dr",
      city: "Chula Vista",
      state: "CA",
      zip: "91915",
    },
    description:
      "A community park field used for Foundations and Flight-tier training across the East Lake area.",
    uses: ["Foundations", "SoCal Flight"],
    features: ["Open field"],
    image: {
      src: "/media/image/facilities/mountain-hawk-park.png",
      alt: "Mountain Hawk Park, Chula Vista — open field with East Lake homes in the background",
      credit: {
        source: "Provided by client",
      },
    },
    mapsUrl:
      "https://www.google.com/maps/search/Mountain+Hawk+Park+Chula+Vista",
    placeholder: true,
  },
  {
    id: "salt-creek-park",
    name: "Salt Creek Park",
    tier: "park",
    role: "park",
    roleLabel: "Community Park",
    address: {
      street: "2710 Otay Lakes Rd",
      city: "Chula Vista",
      state: "CA",
      zip: "91915",
    },
    description:
      "Salt Creek Park supports CVFC's eastern Chula Vista footprint with open fields for youth and Flight teams.",
    uses: ["Foundations", "SoCal Flight"],
    features: ["Open field"],
    image: {
      src: "/media/image/facilities/salt-creek-park.jpg",
      alt: "Salt Creek Community Park, Chula Vista",
      credit: {
        source: "COAR Design Group / Jeff Katz Architecture (downloaded)",
        url: "https://www.coargroup.com/salt-creek-community-park",
      },
    },
    mapsUrl: "https://www.google.com/maps/search/Salt+Creek+Park+Chula+Vista",
    placeholder: true,
  },
  {
    id: "eucalyptus-park",
    name: "Eucalyptus Park",
    tier: "park",
    role: "park",
    roleLabel: "Community Park",
    address: {
      street: "436 C St",
      city: "Chula Vista",
      state: "CA",
      zip: "91910",
    },
    description:
      "A west-side Chula Vista venue close to downtown — supports younger pathway teams and community programs.",
    uses: ["Foundations"],
    features: ["Open field"],
    image: {
      src: "/media/image/facilities/eucalyptus-park.webp",
      alt: "Eucalyptus Park, Chula Vista",
      credit: {
        source: "Chula Vista Living (downloaded)",
        url: "https://chulavistaliving.com/eucalyptus-park-redevelopment-2025/",
      },
    },
    mapsUrl: "https://www.google.com/maps/search/Eucalyptus+Park+Chula+Vista",
    placeholder: true,
  },
  {
    id: "veterans-park",
    name: "Veterans Park",
    tier: "park",
    role: "park",
    roleLabel: "Community Park",
    address: {
      street: "785 E Palomar St",
      city: "Chula Vista",
      state: "CA",
      zip: "91911",
    },
    description:
      "Veterans Park covers central Chula Vista — used for evening training and community sessions.",
    uses: ["Foundations", "SoCal Flight"],
    features: ["Open field", "Basketball courts", "Skate park"],
    image: {
      src: "/media/image/facilities/veterans-park.png",
      alt: "Veterans Park, Chula Vista — open field with basketball courts and the San Ysidro hills behind",
      credit: {
        source: "Provided by client",
      },
    },
    mapsUrl: "https://www.google.com/maps/search/Veterans+Park+Chula+Vista",
    placeholder: true,
  },
  {
    id: "bonita-long-canyon",
    name: "Bonita Long Canyon Park",
    tier: "park",
    role: "park",
    roleLabel: "Community Park",
    address: {
      street: "Bonita Long Canyon Pkwy",
      city: "Chula Vista",
      state: "CA",
      zip: "91902",
    },
    description:
      "A Bonita-side park field that brings CVFC closer to families on the western edge of the South Bay.",
    uses: ["Foundations", "SoCal Flight"],
    features: ["Open field"],
    image: {
      src: "/media/image/facilities/bonita-long-canyon.png",
      alt: "Bonita Long Canyon Park, Chula Vista",
      credit: {
        source: "City of Chula Vista parks listing (downloaded)",
      },
    },
    mapsUrl: "https://www.google.com/maps/search/Bonita+Long+Canyon+Park",
    placeholder: true,
  },
  {
    id: "rohr-park",
    name: "Rohr Park",
    tier: "park",
    role: "park",
    roleLabel: "Community Park",
    address: {
      street: "4548 Sweetwater Rd",
      city: "Bonita",
      state: "CA",
      zip: "91902",
    },
    description:
      "Rohr Park is the largest field complex on the Bonita side — open green space and full-length fields used for community-level training and Foundations sessions.",
    uses: ["Foundations", "SoCal Flight"],
    features: ["Open field"],
    image: {
      src: "/media/image/facilities/rohr-park.jpg",
      alt: "Rohr Park, Bonita / Chula Vista",
      credit: {
        source: "Pogonest (downloaded)",
        url: "https://pogonest.com/",
      },
    },
    mapsUrl: "https://www.google.com/maps/search/Rohr+Park+Bonita+Chula+Vista",
    placeholder: true,
  },
  {
    id: "harvest-park",
    name: "Harvest Park",
    tier: "park",
    role: "park",
    roleLabel: "Community Park",
    address: {
      street: "1399 Santa Christina Ave",
      city: "Chula Vista",
      state: "CA",
      zip: "91913",
    },
    description:
      "Harvest Park sits in the Otay Ranch area and gives CVFC another east-side training option for younger pathway teams.",
    uses: ["Foundations"],
    features: ["Open field"],
    image: {
      src: "/media/image/facilities/harvest-park.jpg",
      alt: "Harvest Park, Chula Vista",
      credit: {
        source: "Pogonest (downloaded)",
        url: "https://pogonest.com/",
      },
    },
    mapsUrl: "https://www.google.com/maps/search/Harvest+Park+Chula+Vista",
    placeholder: true,
  },
  {
    id: "lauderbach-park",
    name: "Lauderbach Park",
    tier: "park",
    role: "park",
    roleLabel: "Community Park",
    address: {
      street: "333 Oxford St",
      city: "Chula Vista",
      state: "CA",
      zip: "91911",
    },
    description:
      "South-central Chula Vista venue used for community-level training and youth pathway sessions. Reopened in 2023 with a new synthetic turf field.",
    uses: ["Foundations"],
    features: ["Synthetic turf field (renovated 2023)"],
    image: {
      src: "/media/image/facilities/lauderbach-park.webp",
      alt: "Lauderbach Park, Chula Vista — renovated 2023",
      credit: {
        source: "Google Places photo (downloaded)",
      },
    },
    mapsUrl: "https://www.google.com/maps/search/Lauderbach+Park+Chula+Vista",
    placeholder: true,
  },
];

export function getActiveFacilities(facilities: Facility[]): Facility[] {
  return facilities.filter((f) => f.status !== "retired");
}

export type MapLinks = {
  google: string;
  apple: string;
  waze: string;
};

export function getMapLinks(facility: Facility): MapLinks {
  const { street, city, state, zip } = facility.address;
  const query = encodeURIComponent(`${street}, ${city}, ${state} ${zip}`);
  return {
    google: facility.mapsUrl,
    apple: `https://maps.apple.com/?q=${query}`,
    waze: `https://waze.com/ul?q=${query}`,
  };
}

export function getFeaturedFacilities(facilities: Facility[]): Facility[] {
  return getActiveFacilities(facilities).filter((f) => f.tier === "featured");
}

export function getParkFacilities(facilities: Facility[]): Facility[] {
  return getActiveFacilities(facilities).filter((f) => f.tier === "park");
}
