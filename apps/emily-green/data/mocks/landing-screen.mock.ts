/**
 * Landing screen mock content — one entry per block, shaped to match the Payload
 * block output so the CMS is a drop-in with the mock as fallback:
 *   - field names mirror the Payload block fields
 *   - images use `{ url, alt }` (a populated Payload upload's shape)
 *   - options (variants) are flat fields on the block
 * Wiring the CMS later = `cmsOverlay(mock.<block>, <block>FromPage(page))`.
 */

export type MediaValue = {
  url: string;
  alt: string;
};

export type CtaLink = {
  label: string;
  href: string;
  rel?: string;
  target?: string;
};

export type HeroStat = {
  value: string;
  label: string;
};

export type HeroBlock = {
  eyebrow?: string;
  role?: string;
  heading: string;
  body?: string[];
  cta?: CtaLink;
  stats?: HeroStat[];
  image: MediaValue;
};

export type LogoItem = {
  name: string;
  /** Optional logo image; falls back to the name as a text mark until provided. */
  image?: MediaValue;
};

export type LogoCarouselBlock = {
  heading?: string;
  logos: LogoItem[];
};

export type IntroBlock = {
  eyebrow?: string;
  heading: string;
  body?: string[];
  cta?: CtaLink;
  image?: MediaValue;
};

export type StatItem = {
  value: string;
  /** Accent suffix, e.g. "+" or "*". */
  suffix?: string;
  label: string;
};

export type ImageTextBlock = {
  eyebrow?: string;
  heading: string;
  body?: string[];
  cta?: CtaLink;
  stats?: StatItem[];
  image: MediaValue;
  /** Side the image sits on (desktop). Flat option field. */
  imagePosition?: "left" | "right";
};

/** Reusable accordion row — used by the testimonials block and the FAQ block. */
export type AccordionEntry = {
  title: string;
  content: string;
};

export type TestimonialsBlock = {
  eyebrow?: string;
  heading: string;
  link?: CtaLink;
  note?: string;
  items: AccordionEntry[];
  image: MediaValue;
  imagePosition?: "left" | "right";
};

export type TitleBlock = {
  heading: string;
  subtitle?: string;
};

export type StatsImageBlock = {
  stats: StatItem[];
  body?: string[];
  cta?: CtaLink;
  image: MediaValue;
};

export type ServiceCard = {
  /** Text card: heading + body + cta. Image card: image + label. */
  heading?: string;
  body?: string;
  cta?: CtaLink;
  image?: MediaValue;
  label?: string;
};

export type ServicesBlock = {
  eyebrow?: string;
  heading: string;
  cards: ServiceCard[];
  resourceTitle?: string;
  resourceLinks?: CtaLink[];
};

export type FaqBlock = {
  eyebrow?: string;
  heading: string;
  subtitle?: string;
  items: AccordionEntry[];
};

export type ContactBlock = {
  heading: string;
  body?: string[];
  image?: MediaValue;
};

export type LandingScreenMock = {
  hero: HeroBlock;
  logoCarousel: LogoCarouselBlock;
  intro: IntroBlock;
  serving: ImageTextBlock;
  testimonials: TestimonialsBlock;
  title: TitleBlock;
  statsImage: StatsImageBlock;
  services: ServicesBlock;
  faq: FaqBlock;
  contact: ContactBlock;
};

export const landingScreenMock: LandingScreenMock = {
  hero: {
    eyebrow: "Emily Green",
    role: "Home Loan Expert & Branch Manager",
    heading: "Honest Advise. Happy Homeowners.",
    body: [
      "I'm here to help you build a clear mortgage plan so you can win in any market with the right strategy.",
      "I've built my business on simple truths: treating people right and helping my customers buy or refinance with confidence. My reviews from past customers tell the story of families who felt taken care of, and I'd love for you to feel that way too.",
    ],
    stats: [
      { value: "125", label: "Reviews" },
      { value: "5*", label: "Average Rating" },
    ],
    cta: { label: "Free Consultation", href: "#contact" },
    image: {
      url: "/media/image/image-hero-main.png",
      alt: "Emily Green, home loan expert",
    },
  },
  logoCarousel: {
    // heading: "Trusted lending partners",
    // Mock: text marks until real logo assets land — add `image: { url, alt }`.
    logos: [
      { name: "Churchill Mortgage" },
      { name: "Fannie Mae" },
      { name: "Freddie Mac" },
      { name: "FHA" },
      { name: "VA Loans" },
      { name: "USDA" },
      { name: "Equal Housing Lender" },
      { name: "NMLS #1591" },
    ],
  },
  intro: {
    eyebrow: "About Emily",
    heading: "Saving you ‘Green’ on Your Mortgage",
    body: [
      "Emily Green is a joyful and seasoned Mortgage Consultant with 10 years of experience helping clients secure financing for home purchases and refinances. As a Mortgage Consultant, understanding borrowers’ financial plans and goals is key. Emily provides tailored mortgage solutions to fit each client’s needs. She is dedicated to creating the smoothest, most efficient, informative, and FUN home buying process possible. Emily has two boys and an adoring husband. Outside of work, she enjoys camping, fishing, and making the mundane moments magical for her family. She is always up for taking on new challenges! Emily is fluent in Spanish.",
    ],
    cta: {
      label: "Free Consultation",
      href: "mailto:emily.green@churchillmortgage.com",
    },
  },
  serving: {
    eyebrow: "Proudly Serving",
    heading:
      "Arizona, California, Florida, Idaho, Missouri, Nevada, New Mexico, Oregon, Texas, Virginia, Washington",
    body: [
      "Proudly serving the Boise Treasure Valley. Providing local expertise and personalized mortgage solutions tailored to the unique needs of homebuyers and homeowners throughout Boise, Meridian, Eagle, Nampa, and the surrounding communities.",
    ],
    cta: { label: "Google Maps", href: "#locations" },
    stats: [
      { value: "1,150", suffix: "+", label: "Happy Clients" },
      { value: "300", suffix: "+", label: "Mortgages Closed Annually" },
    ],
    image: {
      url: "/media/image/image-proudly-serving.png",
      alt: "House keys with a home keychain on a mortgage document",
    },
    imagePosition: "left",
  },
  testimonials: {
    eyebrow: "Testimonials",
    heading: "Real Stories from the People We’ve Had the Honor to Serve",
    link: { label: "Show More Reviews", href: "#reviews" },
    note: "Powered By Birdeye",
    items: [
      {
        title: "“…incredibly smooth experience…”",
        content:
          "Working with Emily was an incredibly smooth experience from pre-approval to closing. She kept us informed at every step.",
      },
      {
        title: "“Wow, what a competent, timely, responsive Lender!”",
        content:
          "Emily answered every question quickly and made a complex process feel simple. Highly recommend.",
      },
      {
        title:
          "“I can’t say enough good things about our interaction with Emily…”",
        content:
          "She went above and beyond to get us the right loan for our family — truly a partner throughout.",
      },
      {
        title: "“Outstanding service from start to finish!”",
        content:
          "Professional, warm, and thorough. We felt taken care of the entire way.",
      },
    ],
    image: {
      url: "/media/image/image-testimonials.png",
      alt: "Gold star trophies rising on steps",
    },
    imagePosition: "right",
  },
  title: {
    heading:
      "For over 10 years, I've been helping clients navigate their Mortgage Needs.",
    subtitle: "A Decade of Guiding Clients Through Their Mortgage Journey",
  },
  statsImage: {
    stats: [
      { value: "10", suffix: "K", label: "United States" },
      { value: "20", suffix: "%", label: "Savings" },
      { value: "50", suffix: "M", label: "Total Home Loans" },
    ],
    body: [
      "Every client’s situation is unique, and I’m committed to providing thoughtful solutions that align with your goals — making the mortgage process feel less overwhelming and more empowering from start to finish.",
    ],
    cta: { label: "Free consultation", href: "#contact" },
    image: {
      url: "/media/image/image-city-scape.png",
      alt: "Boise, Idaho skyline at sunset",
    },
  },
  services: {
    eyebrow: "Services",
    heading:
      "Churchill Mortgage is dedicated to give more power, clarity and peace to our clients. Our goal is to provide a loan that fits your financial goals.",
    resourceTitle: "Resources",
    resourceLinks: [
      {
        label: "Home Buyer Starter Kit",
        href: "https://www.churchillmortgage.com/ebooks/homebuyer-starter-kit?mlo=1429849",
        rel: "nofollow",
        target: "_blank",
      },
      {
        label: "6 hidden Traps",
        href: "https://www.churchillmortgage.com/ebooks/6-hidden-traps?mlo=1429849",
        rel: "nofollow",
        target: "_blank",
      },
      {
        label: "5 Steps to Buying a Home in 2025",
        href: "https://www.churchillmortgage.com/ebooks/5-steps-to-buying-a-home-in-2025?mlo=1429849",
        rel: "nofollow",
        target: "_blank",
      },
    ],
    cards: [
      {
        heading: "Local Experts Servicing All Loan Types",
        body: "Providing personalized home financing solutions including conventional, FHA, VA, and jumbo loans, along with refinancing and homebuyer guidance designed to help clients achieve long-term financial stability and confident homeownership.",
        cta: {
          label: "Resources",
          href: "https://www.churchillmortgage.com/loan-officers/emily-green",
          rel: "nofollow",
          target: "_blank",
        },
      },
      {
        image: {
          url: "/media/image/image-calculator.png",
          alt: "Calculator on a desk",
        },
        label: "Mortgage Calculator",
      },
      {
        image: {
          url: "/media/image/image-checklist.png",
          alt: "Checklist with checkmarks",
        },
        label: "Document Checklist",
      },
      {
        image: {
          url: "/media/image/image-mortgage.png",
          alt: "Model house on mortgage paperwork",
        },
        label: "Download Resources",
      },
    ],
  },
  faq: {
    eyebrow: "The Village at Meridian",
    heading: "Boise Local with an Office in Meridian",
    subtitle:
      "Proudly serving the Treasure Valley with personalized, community-focused mortgage guidance.",
    items: [
      {
        title: "What areas do you serve?",
        content:
          "Emily serves the Boise Treasure Valley — Boise, Meridian, Eagle, Nampa, and the surrounding communities — plus lending across 11 states.",
      },
      {
        title: "What types of loans do you offer?",
        content:
          "Conventional, FHA, VA, USDA, and jumbo loans, along with refinancing and first-time homebuyer programs.",
      },
      {
        title: "How do I get pre-approved?",
        content:
          "Reach out for a free consultation and Emily will walk you through a quick pre-approval so you know exactly what you can afford.",
      },
      {
        title: "How long does the mortgage process take?",
        content:
          "Most loans close in 30–45 days, though timelines vary. Emily keeps you informed at every step.",
      },
    ],
  },
  contact: {
    heading: "Connect",
    body: [
      "We welcome the opportunity to connect and look forward to learning more about your goals — please complete the contact form and submit. Emily personally reviews and responds to every inquiry.",
    ],
    image: {
      url: "/media/image/image-logo-secondary.png",
      alt: "Home Loan Expert — Emily Green",
    },
  },
};
