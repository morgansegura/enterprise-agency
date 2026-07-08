import type { TMenuItem } from "@wf/ui";

/**
 * Mock navigation for Emily Green. Mock-first: the chrome renders from these
 * until the CMS provides menus. Single-page site → header links anchor to
 * sections; refine content/hrefs as blocks land.
 */
export const HEADER_NAV: TMenuItem[] = [
  { label: "Services", href: "#services" },
  {
    label: "Resources",
    href: "#resources",
    items: [
      {
        label: "Mortgage Calculator",
        href: "#mortgage-calculator",
        description: "Estimate payments and rates.",
      },
      {
        label: "Document Checklist",
        href: "#document-checklist",
        description: "What you need to get started.",
      },
      {
        label: "Download Resources",
        href: "#download-resources",
        description: "Guides and homebuyer tools.",
      },
    ],
  },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

/** Header call-to-action button. */
export const HEADER_CTA = { label: "Free consultation", href: "#contact" };

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
  { platform: "Facebook", href: "https://facebook.com" },
  { platform: "Instagram", href: "https://instagram.com" },
  { platform: "Twitter", href: "https://twitter.com" },
  { platform: "LinkedIn", href: "https://linkedin.com" },
] as const;

/** Bottom-bar legal links. */
export const LEGAL_LINKS: TMenuItem[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Cookies Settings", href: "/cookie-policy" },
];

/** Referral blurb + licensing text shown in the footer. */
export const FOOTER_REFERRAL =
  "We treat every referral like family with care, integrity, and a commitment to providing the same level of service we would offer our own loved ones.";
