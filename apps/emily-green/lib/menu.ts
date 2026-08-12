import type { TMenuItem } from "@wf/ui";

/** Applied to every outbound link — see `safeRel` for the noopener handling. */
const EXTERNAL = { target: "_blank", rel: "nofollow" } as const;

/**
 * Churchill Mortgage destinations — the single source of truth for every
 * outbound link on this site.
 *
 * CMC website policy: mortgage payment, loan information, available programs,
 * loan applications and rate information must all resolve to the Churchill
 * Mortgage site. Never point these at a local page or an on-page anchor.
 */
export const CMC = {
  rates: "https://www.churchillmortgage.com/interest-rates",
  loanPrograms: "https://www.churchillmortgage.com/loan-programs",
  calculator:
    "https://www.churchillmortgage.com/calculators/monthly-payment-calculator",
  /** Payments/servicing are handled through the Loan Servicing Center. */
  servicing: "https://www.churchillmortgage.com/loan-servicing-center",
  resources: "https://www.churchillmortgage.com/resources",
  /** CMC has no standalone document-checklist page — the starter kit is the
   *  closest approved equivalent. Confirm the target with marketing. */
  documentChecklist:
    "https://www.churchillmortgage.com/ebooks/homebuyer-starter-kit?mlo=1429849",
  loanOfficer: "https://www.churchillmortgage.com/loan-officers/emily-green",
  apply: "https://emily-green.mychurchill.com/create-account",
  login: "https://emily-green.mychurchill.com/sign-in",
  privacy: "https://www.churchillmortgage.com/privacy",
  terms: "https://www.churchillmortgage.com/support/terms-of-use",
} as const;

/** Google Business profile — the source of the Birdeye/Google review count. */
export const GOOGLE_BUSINESS_URL =
  "https://www.google.com/maps/place/Emily+Green+-+Churchill+Mortgage,+NMLS+1429849/data=!4m2!3m1!1s0x0:0xb28f5959918d838f?sa=X&ved=1t:2428&ictx=111";

/**
 * Mock navigation for Emily Green. Mock-first: the chrome renders from these
 * until the CMS provides menus. Single-page site → header links anchor to
 * sections; refine content/hrefs as blocks land.
 */
export const HEADER_NAV: TMenuItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Locations", href: "#locations" },
  { label: "Praise", href: "#testimonials" },
];

/** Header action buttons (right of the nav). `variant` maps to the button skin. */
export type HeaderAction = {
  label: string;
  href: string;
  rel?: string;
  target?: string;
  variant: "outline" | "solid";
};

export const HEADER_ACTIONS: HeaderAction[] = [
  {
    label: "Start Application",
    href: CMC.apply,
    ...EXTERNAL,
    variant: "outline",
  },
  {
    label: "Login",
    href: CMC.login,
    ...EXTERNAL,
    variant: "solid",
  },
];

/** Footer link columns. Every loan/rate/payment link goes to CMC per policy. */
export const FOOTER_NAV: TMenuItem[] = [
  {
    heading: "Loans",
    items: [
      { label: "Current Rates", href: CMC.rates, ...EXTERNAL },
      { label: "Loan Programs", href: CMC.loanPrograms, ...EXTERNAL },
      { label: "Start Application", href: CMC.apply, ...EXTERNAL },
      { label: "Make a Payment", href: CMC.servicing, ...EXTERNAL },
    ],
  },
  {
    heading: "Features",
    items: [
      { label: "Mortgage Calculator", href: CMC.calculator, ...EXTERNAL },
      { label: "Check List", href: CMC.documentChecklist, ...EXTERNAL },
      { label: "Resources", href: CMC.resources, ...EXTERNAL },
      { label: "Frequently Asked Questions", href: "#faq" },
    ],
  },
];

/** Social links — platform maps to a lucide icon in the footer. */
export const SOCIAL_LINKS = [
  {
    platform: "Facebook",
    href: "https://www.facebook.com/emily.green.44788",
    target: "_blank",
    rel: "nofollow",
  },
  {
    platform: "Instagram",
    href: "https://www.instagram.com/savingyougreen.themortgagemama",
    target: "_blank",
    rel: "nofollow",
  },
  {
    platform: "LinkedIn",
    href: "https://www.linkedin.com/in/emilyshomeloans",
    target: "_blank",
    rel: "nofollow",
  },
  {
    platform: "Google",
    href: GOOGLE_BUSINESS_URL,
    target: "_blank",
    rel: "nofollow",
  },
  {
    platform: "Youtube",
    href: "https://www.youtube.com/@savingyougreen",
    target: "_blank",
    rel: "nofollow",
  },
] as const;

/** Bottom-bar legal links. The company privacy disclaimer links back to CMC per
 *  policy. Cookie settings are handled by `CookiePreferencesTrigger`, which the
 *  footer renders alongside these — there is no local cookie-policy route. */
export const LEGAL_LINKS: TMenuItem[] = [
  { label: "Privacy Policy", href: CMC.privacy, ...EXTERNAL },
  { label: "Terms of Service", href: CMC.terms, ...EXTERNAL },
];

/** Referral blurb shown in the footer. */
export const FOOTER_REFERRAL =
  "We treat every referral like family with care, integrity, and a commitment to providing the same level of service we would offer our own loved ones.";

/** NMLS / lending compliance disclosure shown in the footer (mock — confirm the
 *  exact regulated text with the client before launch). */
export const FOOTER_LICENSING =
  "Emily Meadow Green NMLS ID: 1429849; Company NMLS ID: 1591 (www.nmlsconsumeraccess.org); Branch ID: 2129962; AZ BK# 0926494, AZ-LO-2010851; CA-CA-DFPI1429849, Licensed by the Department of Financial Protection and Innovation under the California Residential Mortgage Lending Act, under Churchill Mortgage Corporation, which will do business in California as Churchill Mortgage Home Loans; FL-LO144747; ID-MLO-2081429849; MO-1429849-MLO, Churchill Mortgage, Missouri Branch located at 2300 MAIN ST STE 900, Kansas City, MO 64108-2408; NM-Mortgage Loan Originator; NV-Loan Originator License; OR-Mortgage Loan Originator License; TX-SML Mortgage Loan Originator; VA-MLO-73678VA, Churchill Mortgage Corporation of TN; WA-MLO-1429849; 3597 East Monarch Sky Ln, Suite 245, Meridian, ID 83646, 888-562-6200; Churchill Mortgage Corporation. As a responsible lender, Churchill Mortgage is committed to the principles outlined in federal and state lending laws ensuring all potential borrowers have access to the same information, services, and opportunities throughout the home loan process. Churchill Mortgage Corporation, NMLS #1591 is an Equal Housing Lender — ©2026 All Rights Reserved. Programs are for select loan types only and are not available in all states or locations.";
