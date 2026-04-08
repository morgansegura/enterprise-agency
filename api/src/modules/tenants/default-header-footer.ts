/**
 * Default Header and Footer templates
 *
 * Created automatically when a new tenant is provisioned so the site
 * has working chrome from day one. Both are marked as the default for
 * the tenant and are pre-styled with sensible enterprise defaults.
 */

export interface DefaultHeader {
  name: string;
  slug: string;
  behavior: "STATIC" | "FIXED" | "STICKY" | "SCROLL_HIDE" | "TRANSPARENT";
  animation: string;
  zones: Record<string, unknown>;
  style: Record<string, unknown>;
  mobileMenu: Record<string, unknown>;
  isDefault: boolean;
}

export interface DefaultFooter {
  name: string;
  slug: string;
  layout: string;
  zones: Record<string, unknown>;
  style: Record<string, unknown>;
  isDefault: boolean;
}

/**
 * Generate the default header for a new tenant.
 * Uses a clean, professional layout with logo on left and primary nav center.
 */
export function generateDefaultHeader(businessName: string): DefaultHeader {
  return {
    name: "Default",
    slug: "default",
    behavior: "STICKY",
    animation: "fade",
    zones: {
      left: {
        type: "logo",
        text: businessName,
        size: "md",
      },
      center: {
        type: "menu",
        items: [
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: "About", href: "/about" },
          { label: "Pricing", href: "/pricing" },
          { label: "Blog", href: "/blog" },
        ],
      },
      right: {
        type: "actions",
        items: [
          {
            type: "button",
            label: "Contact",
            href: "/contact",
            variant: "primary",
          },
        ],
      },
    },
    style: {
      backgroundColor: "#ffffff",
      textColor: "#1a1a1a",
      height: "72px",
      padding: "0 24px",
      shadow: "sm",
      borderBottom: "1px solid #e5e7eb",
    },
    mobileMenu: {
      type: "drawer",
      breakpoint: "md",
      animation: "slide",
      trigger: {
        openIcon: "menu",
        closeIcon: "x",
      },
    },
    isDefault: true,
  };
}

/**
 * Generate the default footer for a new tenant.
 * Uses a column layout with company info, links, and copyright.
 */
export function generateDefaultFooter(businessName: string): DefaultFooter {
  const year = new Date().getFullYear();
  return {
    name: "Default",
    slug: "default",
    layout: "columns",
    zones: {
      columns: [
        {
          title: businessName,
          content:
            "Building exceptional digital experiences for businesses that matter.",
        },
        {
          title: "Company",
          links: [
            { label: "About", href: "/about" },
            { label: "Services", href: "/services" },
            { label: "Pricing", href: "/pricing" },
            { label: "Contact", href: "/contact" },
          ],
        },
        {
          title: "Resources",
          links: [
            { label: "Blog", href: "/blog" },
            { label: "FAQ", href: "/faq" },
          ],
        },
        {
          title: "Legal",
          links: [
            { label: "Privacy Policy", href: "/privacy-policy" },
            { label: "Terms of Service", href: "/terms-of-service" },
            { label: "Cookie Policy", href: "/cookie-policy" },
          ],
        },
      ],
      bottom: {
        copyright: `© ${year} ${businessName}. All rights reserved.`,
        links: [
          { label: "Privacy", href: "/privacy-policy" },
          { label: "Terms", href: "/terms-of-service" },
        ],
      },
      social: [],
    },
    style: {
      backgroundColor: "#0f172a",
      textColor: "#cbd5e1",
      headingColor: "#ffffff",
      linkColor: "#94a3b8",
      linkHoverColor: "#ffffff",
      padding: "64px 24px 32px",
    },
    isDefault: true,
  };
}
