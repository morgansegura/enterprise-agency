/** Area (local geo) pages — "Youth soccer in <community>". SEO cluster: CVFC is
 *  the homegrown South Bay club, so each area page targets a community we serve
 *  with genuinely local content. Mock-first: renders as the fallback until a CMS
 *  page at slug `areas/<slug>` provides a layout, then the club can edit it.
 *
 *  NOTE: the Bonita copy below is a DRAFT for the club to verify (training
 *  location, distances, what's true per community). Unique local content is what
 *  makes these rank — do not just swap the city name across areas. */

import type { IconCardEntry } from "@/components/feature/icon-cards";
import type { FaqEntry } from "@/data/faq";

export type Area = {
  slug: string;
  /** Community name, e.g. "Bonita". */
  name: string;
  /** Broader region, used for schema areaServed. */
  region: string;
  /** Icon for this area's card on the /areas hub (distinct per area). */
  iconToken: string;
  eyebrow: string;
  heading: string;
  intro: string;
  /** Short, distinct one-liner for this area's card on the /areas hub. */
  blurb: string;
  programs: IconCardEntry[];
  faqs: FaqEntry[];
  meta: { title: string; description: string };
};

/** The four pathways every area page links to (shared — the programs don't
 *  change by community, only the local framing around them does). */
const PATHWAY_CARDS: IconCardEntry[] = [
  {
    id: "foundations",
    iconToken: "custom:soccer-ball",
    title: "Foundations (ages 4–9)",
    description:
      "Mini Maestros and CVFC Youth — where young players fall in love with the game and build real technical foundations.",
  },
  {
    id: "boys",
    iconToken: "custom:trophy",
    title: "Boys Competitive Pathway",
    description:
      "MLS NEXT, Elite Academy, and league placement — the pathway that has moved players to college and pro academies.",
  },
  {
    id: "girls",
    iconToken: "custom:medal",
    title: "Girls Competitive Pathway",
    description:
      "DPL, NPL, and showcase teams — top-tier development for girls, all the way to the college recruiting stage.",
  },
  {
    id: "goalkeeper",
    iconToken: "custom:target",
    title: "Goalkeeper Pathway",
    description:
      "Specialized goalkeeper training at every level — position-specific coaching that has produced pro-signed keepers.",
  },
];

const BONITA: Area = {
  slug: "bonita",
  name: "Bonita",
  region: "South Bay, San Diego",
  iconToken: "custom:soccer-field2",
  eyebrow: "Youth Soccer in Bonita",
  blurb:
    "Elite soccer minutes from Bonita, with training at Bonita Long Canyon Park.",
  heading: "Competitive youth soccer for Bonita families — minutes from home.",
  intro:
    "Chula Vista FC has been the South Bay’s homegrown club since 1982. Bonita families train at Bonita Long Canyon Park and nearby CVFC fields just minutes away — an elite MLS NEXT and Elite Academy pathway at a genuinely affordable, community price. Boys and girls, ages 4 to 19, in one club that has moved players on to college programs, professional academies, and Liga MX.",
  programs: PATHWAY_CARDS,
  faqs: [
    {
      id: "bonita-where",
      question: "Where do Bonita players train?",
      answer:
        "At Bonita Long Canyon Park and nearby CVFC fields, just minutes from home — no long commutes to reach an elite club.",
    },
    {
      id: "bonita-cost",
      question: "How does the cost compare to other San Diego clubs?",
      answer:
        "CVFC delivers a top competitive pathway at a fraction of what premium clubs charge — quality and affordability are the reasons the club was founded.",
    },
    {
      id: "bonita-tryouts",
      question: "When are tryouts for Bonita families?",
      answer:
        "Tryouts and personal evaluations are open now for the upcoming season. Request an evaluation and a CVFC coach will be in touch directly.",
    },
    {
      id: "bonita-girls",
      question: "Do you have girls teams?",
      answer:
        "Yes — a full girls pathway from grassroots through DPL and NPL, with a clear route to the college recruiting stage.",
    },
  ],
  meta: {
    title: "Youth Soccer in Bonita, CA",
    description:
      "Competitive youth soccer for Bonita families — boys & girls, ages 4–19. CVFC’s MLS NEXT and Elite Academy pathway at an affordable price, minutes from Bonita.",
  },
};

const EASTLAKE: Area = {
  slug: "eastlake",
  name: "Eastlake",
  region: "Chula Vista, South Bay",
  iconToken: "custom:location-marker",
  eyebrow: "Youth Soccer in Eastlake",
  blurb:
    "Right in Eastlake — Explorer Park and our Hake Place indoor training center.",
  heading:
    "Competitive youth soccer for Eastlake families — right in your neighborhood.",
  intro:
    "Chula Vista FC trains in the heart of Eastlake — at Explorer Park and our Indoor Training Center on Hake Place. Eastlake families get an elite MLS NEXT and Elite Academy pathway without leaving the neighborhood, at a genuinely affordable, community price. Boys and girls, ages 4 to 19, in the South Bay’s homegrown club since 1982.",
  programs: PATHWAY_CARDS,
  faqs: [
    {
      id: "eastlake-where",
      question: "Where do Eastlake players train?",
      answer:
        "Right in Eastlake — at Explorer Park and our Indoor Training Center on Hake Place, plus additional CVFC fields across east Chula Vista.",
    },
    {
      id: "eastlake-cost",
      question: "How does the cost compare to other San Diego clubs?",
      answer:
        "CVFC delivers a top competitive pathway at a fraction of what premium clubs charge — quality and affordability are the reasons the club was founded.",
    },
    {
      id: "eastlake-tryouts",
      question: "When are tryouts for Eastlake families?",
      answer:
        "Tryouts and personal evaluations are open now for the upcoming season. Request an evaluation and a CVFC coach will be in touch directly.",
    },
    {
      id: "eastlake-girls",
      question: "Do you have girls teams?",
      answer:
        "Yes — a full girls pathway from grassroots through DPL and NPL, with a clear route to the college recruiting stage.",
    },
  ],
  meta: {
    title: "Youth Soccer in Eastlake, Chula Vista",
    description:
      "Competitive youth soccer for Eastlake families — boys & girls, ages 4–19. CVFC trains at Explorer Park and the Hake Pl indoor center, right in your neighborhood.",
  },
};

const OTAY_RANCH: Area = {
  slug: "otay-ranch",
  name: "Otay Ranch",
  region: "Chula Vista, South Bay",
  iconToken: "custom:soccer-ball",
  eyebrow: "Youth Soccer in Otay Ranch",
  blurb: "In the heart of Otay Ranch, at Veterans Park on East Palomar Street.",
  heading:
    "Competitive youth soccer for Otay Ranch families — minutes from home.",
  intro:
    "Chula Vista FC trains right in Otay Ranch — at Veterans Park on East Palomar Street. Otay Ranch families get an elite MLS NEXT and Elite Academy pathway close to home, at a genuinely affordable, community price. Boys and girls, ages 4 to 19, in the South Bay’s homegrown club since 1982.",
  programs: PATHWAY_CARDS,
  faqs: [
    {
      id: "otay-ranch-where",
      question: "Where do Otay Ranch players train?",
      answer:
        "At Veterans Park on East Palomar Street, in the heart of Otay Ranch, plus additional CVFC fields across east Chula Vista.",
    },
    {
      id: "otay-ranch-cost",
      question: "How does the cost compare to other San Diego clubs?",
      answer:
        "CVFC delivers a top competitive pathway at a fraction of what premium clubs charge — quality and affordability are the reasons the club was founded.",
    },
    {
      id: "otay-ranch-tryouts",
      question: "When are tryouts for Otay Ranch families?",
      answer:
        "Tryouts and personal evaluations are open now for the upcoming season. Request an evaluation and a CVFC coach will be in touch directly.",
    },
    {
      id: "otay-ranch-girls",
      question: "Do you have girls teams?",
      answer:
        "Yes — a full girls pathway from grassroots through DPL and NPL, with a clear route to the college recruiting stage.",
    },
  ],
  meta: {
    title: "Youth Soccer in Otay Ranch, Chula Vista",
    description:
      "Competitive youth soccer for Otay Ranch families — boys & girls, ages 4–19. CVFC trains at Veterans Park on East Palomar, minutes from home.",
  },
};

const CHULA_VISTA: Area = {
  slug: "chula-vista",
  name: "Chula Vista",
  region: "South Bay, San Diego",
  iconToken: "custom:soccer-field",
  eyebrow: "Youth Soccer in Chula Vista",
  blurb:
    "Our home city since 1982 — players train across Chula Vista, from Victory Christian Academy to Castle Park High.",
  heading: "Chula Vista’s homegrown club since 1982.",
  intro:
    "Chula Vista FC was founded in Chula Vista in 1982 and has been the city’s homegrown club ever since. Our players train across Chula Vista — with Victory Christian Academy anchoring the week, plus Castle Park High School, Lauderbach Park, and our Indoor Training Center — on an elite MLS NEXT and Elite Academy pathway at a genuinely affordable, community price. Boys and girls, ages 4 to 19, with a track record of moving players on to college programs, professional academies, and Liga MX.",
  programs: PATHWAY_CARDS,
  faqs: [
    {
      id: "chula-vista-where",
      question: "Where do Chula Vista players train?",
      answer:
        "Across Chula Vista — Victory Christian Academy anchors our week, alongside Castle Park High School, Lauderbach Park, and our Indoor Training Center on Hake Place.",
    },
    {
      id: "chula-vista-cost",
      question: "How does the cost compare to other San Diego clubs?",
      answer:
        "CVFC delivers a top competitive pathway at a fraction of what premium clubs charge — quality and affordability are the reasons the club was founded right here in Chula Vista.",
    },
    {
      id: "chula-vista-tryouts",
      question: "When are tryouts for Chula Vista families?",
      answer:
        "Tryouts and personal evaluations are open now for the upcoming season. Request an evaluation and a CVFC coach will be in touch directly.",
    },
    {
      id: "chula-vista-girls",
      question: "Do you have girls teams?",
      answer:
        "Yes — a full girls pathway from grassroots through DPL and NPL, with a clear route to the college recruiting stage.",
    },
  ],
  meta: {
    title: "Youth Soccer in Chula Vista — Fields & Programs",
    description:
      "Chula Vista’s homegrown soccer club since 1982. CVFC trains across the city — Victory Christian, Castle Park HS, Lauderbach Park — with an elite, affordable pathway for boys & girls ages 4–19.",
  },
};

const CITY_HEIGHTS: Area = {
  slug: "city-heights",
  name: "City Heights",
  region: "San Diego",
  iconToken: "custom:soccer-ball2",
  eyebrow: "Youth Soccer in City Heights",
  blurb:
    "Inside the City of San Diego — CVFC match days at Hoover High School in City Heights.",
  heading: "Competitive youth soccer in City Heights, San Diego.",
  intro:
    "Chula Vista FC brings its pathway into the City of San Diego, competing at Hoover High School in City Heights. Families here get access to an elite MLS NEXT and Elite Academy pathway at a genuinely affordable, community price — the same homegrown club that has developed players since 1982. Boys and girls, ages 4 to 19, with a track record of moving players on to college programs, professional academies, and Liga MX.",
  programs: PATHWAY_CARDS,
  faqs: [
    {
      id: "city-heights-where",
      question: "Where do City Heights players play?",
      answer:
        "CVFC competes at Hoover High School on El Cajon Boulevard in City Heights, with training across our South Bay and San Diego fields.",
    },
    {
      id: "city-heights-cost",
      question: "How does the cost compare to other San Diego clubs?",
      answer:
        "CVFC delivers a top competitive pathway at a fraction of what premium clubs charge — quality and affordability are the reasons the club was founded.",
    },
    {
      id: "city-heights-tryouts",
      question: "When are tryouts?",
      answer:
        "Tryouts and personal evaluations are open now for the upcoming season. Request an evaluation and a CVFC coach will be in touch directly.",
    },
    {
      id: "city-heights-girls",
      question: "Do you have girls teams?",
      answer:
        "Yes — a full girls pathway from grassroots through DPL and NPL, with a clear route to the college recruiting stage.",
    },
  ],
  meta: {
    title: "Youth Soccer in City Heights, San Diego",
    description:
      "Competitive youth soccer in City Heights — CVFC competes at Hoover High School, bringing an elite, affordable pathway into the City of San Diego. Boys & girls, ages 4–19.",
  },
};

const SOUTHEAST_SAN_DIEGO: Area = {
  slug: "southeast-san-diego",
  name: "Southeast San Diego",
  region: "San Diego",
  iconToken: "custom:cleats",
  eyebrow: "Youth Soccer in Southeast San Diego",
  blurb:
    "Rooted in Southeast San Diego — training at O'Farrell Charter School in Skyline.",
  heading: "Competitive youth soccer in Southeast San Diego.",
  intro:
    "Chula Vista FC extends into Southeast San Diego — training at O'Farrell Charter School in the Skyline and Encanto communities. Families here get an elite MLS NEXT and Elite Academy pathway close to home, at a genuinely affordable, community price. The South Bay’s homegrown club since 1982 — boys and girls, ages 4 to 19, with a track record of moving players on to college programs, professional academies, and Liga MX.",
  programs: PATHWAY_CARDS,
  faqs: [
    {
      id: "southeast-san-diego-where",
      question: "Where do Southeast San Diego players train?",
      answer:
        "At O'Farrell Charter School on Skyline Drive, in the heart of Southeast San Diego, plus additional CVFC fields nearby.",
    },
    {
      id: "southeast-san-diego-cost",
      question: "How does the cost compare to other San Diego clubs?",
      answer:
        "CVFC delivers a top competitive pathway at a fraction of what premium clubs charge — quality and affordability are the reasons the club was founded.",
    },
    {
      id: "southeast-san-diego-tryouts",
      question: "When are tryouts?",
      answer:
        "Tryouts and personal evaluations are open now for the upcoming season. Request an evaluation and a CVFC coach will be in touch directly.",
    },
    {
      id: "southeast-san-diego-girls",
      question: "Do you have girls teams?",
      answer:
        "Yes — a full girls pathway from grassroots through DPL and NPL, with a clear route to the college recruiting stage.",
    },
  ],
  meta: {
    title: "Youth Soccer in Southeast San Diego (Skyline / Encanto)",
    description:
      "Competitive youth soccer in Southeast San Diego — CVFC trains at O'Farrell Charter School in Skyline/Encanto. An elite, affordable pathway for boys & girls, ages 4–19.",
  },
};

export const AREAS: Area[] = [
  CHULA_VISTA,
  BONITA,
  EASTLAKE,
  OTAY_RANCH,
  CITY_HEIGHTS,
  SOUTHEAST_SAN_DIEGO,
];

export const getArea = (slug: string): Area | undefined =>
  AREAS.find((a) => a.slug === slug);
