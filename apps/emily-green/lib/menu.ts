import type { TMenuItem } from "@wf/ui";

/**
 * Mock navigation for Emily Green. Mock-first: the chrome renders from these
 * until the CMS provides menus. Single-page site → header links anchor to
 * sections; refine content/hrefs as blocks land.
 */
export const HEADER_NAV: TMenuItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Locations", href: "#locations" },
  { label: "Praise", href: "#praise" },
];

/** Header action buttons (right of the nav). `variant` maps to the button skin. */
export type HeaderAction = {
  label: string;
  href: string;
  variant: "outline" | "solid";
};

export const HEADER_ACTIONS: HeaderAction[] = [
  { label: "Start Application", href: "#apply", variant: "outline" },
  { label: "Login", href: "#login", variant: "solid" },
];

/** Footer link columns. */
export const FOOTER_NAV: TMenuItem[] = [
  {
    heading: "Features",
    items: [
      { label: "Mortgage Calculator", href: "#mortgage-calculator" },
      { label: "Check List", href: "#document-checklist" },
      { label: "Resources", href: "#resources" },
      { label: "Frequently Asked Questions", href: "#faq" },
    ],
  },
];

/** Social links — platform maps to a lucide icon in the footer. */
export const SOCIAL_LINKS = [
  { platform: "Facebook", href: "https://www.facebook.com/emily.green.44788" },
  {
    platform: "Instagram",
    href: "https://www.instagram.com/savingyougreen.themortgagemama",
  },
  { platform: "LinkedIn", href: "https://www.linkedin.com/in/emilyshomeloans" },
  {
    platform: "Google",
    href: "google.com/maps/place/Emily+Green+-+Churchill+Mortgage,+NMLS+1429849/data=!4m2!3m1!1s0x0:0xb28f5959918d838f?sa=X&ved=1t:2428&ictx=111",
  },
  { platform: "Youtube", href: "https://www.youtube.com/@savingyougreen" },
] as const;

/** Bottom-bar legal links. */
export const LEGAL_LINKS: TMenuItem[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Cookies Settings", href: "/cookie-policy" },
];

/** Referral blurb shown in the footer. */
export const FOOTER_REFERRAL =
  "We treat every referral like family with care, integrity, and a commitment to providing the same level of service we would offer our own loved ones.";

/** NMLS / lending compliance disclosure shown in the footer (mock — confirm the
 *  exact regulated text with the client before launch). */
export const FOOTER_LICENSING =
  "Emily Meadow Green NMLS ID: 1429849; Company NMLS ID: 1591 (www.nmlsconsumeraccess.org); Branch ID: 2129962; AZ BK# 0926494, AZ-LO-2010851; CA-CA-DFPI1429849, Licensed by the Department of Financial Protection and Innovation under the California Residential Mortgage Lending Act, under Churchill Mortgage Corporation, which will do business in California as Churchill Mortgage Home Loans; FL-LO144747; ID-MLO-2081429849; MO-1429849-MLO, Churchill Mortgage, Missouri Branch located at 2300 MAIN ST STE 900, Kansas City, MO 64108-2408; NM-Mortgage Loan Originator; NV-Loan Originator License; OR-Mortgage Loan Originator License; TX-SML Mortgage Loan Originator; VA-MLO-73678VA, Churchill Mortgage Corporation of TN; WA-MLO-1429849; 3597 East Monarch Sky Ln, Suite 245, Meridian, ID 83646, 888-562-6200; Churchill Mortgage Corporation. As a responsible lender, Churchill Mortgage is committed to the principles outlined in federal and state lending laws ensuring all potential borrowers have access to the same information, services, and opportunities throughout the home loan process. Churchill Mortgage Corporation, NMLS #1591 is an Equal Housing Lender — ©2026 All Rights Reserved. Programs are for select loan types only and are not available in all states or locations.";
