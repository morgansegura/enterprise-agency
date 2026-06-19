/**
 * Cookie-consent copy + categories — the per-client editable surface.
 *
 * This is intentionally a plain config object so it can be swapped per site and,
 * later, sourced from the CMS (`SiteSettings.consent` per tenant) without
 * touching the consent logic. Different clients have different legal needs
 * (GDPR/CCPA, more/fewer categories, different wording) — change it here.
 */

export type ConsentCategoryId = "necessary" | "analytics" | "marketing";

export type ConsentCategory = {
  id: ConsentCategoryId;
  label: string;
  description: string;
  /** Always-on (cannot be toggled off). */
  required?: boolean;
};

export const consentConfig = {
  /** localStorage key prefix — keep unique per site. */
  storagePrefix: "cvfc",
  /** Link to the full cookie policy. */
  policyHref: "/cookie-policy",
  banner: {
    title: "We value your privacy",
    body: "We use cookies to run the site, understand traffic, and improve your experience. Choose which cookies to allow. You can change your mind anytime.",
    acceptAll: "Accept all",
    rejectAll: "Reject all",
    customize: "Customize",
  },
  modal: {
    title: "Cookie preferences",
    description:
      "Necessary cookies keep the site working. Turn the others on or off as you like.",
    save: "Save preferences",
    acceptAll: "Accept all",
    rejectAll: "Reject all",
  },
  trigger: {
    label: "Cookie preferences",
  },
  categories: [
    {
      id: "necessary",
      label: "Strictly necessary",
      description:
        "Required for the site to function — security, navigation, and remembering your cookie choices. Always on.",
      required: true,
    },
    {
      id: "analytics",
      label: "Analytics",
      description:
        "Help us understand how visitors use the site so we can improve it. No personal profiles.",
    },
    {
      id: "marketing",
      label: "Marketing",
      description:
        "Used to measure campaigns and show relevant content across sites.",
    },
  ] satisfies ConsentCategory[],
} as const;

export type ConsentConfig = typeof consentConfig;
