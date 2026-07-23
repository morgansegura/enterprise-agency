import type { ReactNode } from "react";

import { Icon } from "@/components/icon";

export type TMenuItem = {
  label?: string;
  title?: string;
  description?: string;
  href?: string;
  target?: string;
  icon?: ReactNode;
  heading?: string;
  items?: TMenuItem[];
};

export const HEADER_NAV: TMenuItem[] = [
  {
    label: "About",
    title: "Learn about Chula Vista FC",
    href: "#",
    items: [
      {
        label: "Who we are",
        description:
          "An overview of our club’s mission, story, and core values — everything that defines us.",
        href: "/about/who-we-are",
      },
      {
        label: "Coaching Staff",
        description:
          "Meet the certified and passionate coaches guiding our teams.",
        href: "/about/coaching-staff",
      },
      {
        label: "Administrators",
        description:
          "Get to know the leadership team behind the club’s success and organization.",
        href: "/about/administrators",
      },
      {
        label: "Facilities",
        description:
          "Explore the top-quality fields and locations where our players train.",
        href: "/about/facilities",
      },
      {
        label: "Testimonials",
        description:
          "Hear from parents, players, and alumni about their CVFC experience.",
        href: "/about/testimonials",
      },
    ],
  },
  {
    label: "Programs",
    title: "Learn about our elite soccer programs",
    href: "/programs",
    items: [
      {
        label: "Programs",
        description:
          "Every CVFC program from Mini Maestros to MLS NEXT — find the right fit for your player.",
        href: "/programs",
      },
      {
        label: "Foundations",
        description:
          "Mini Maestros and CVFC Youth — foundational training for athletes ages 4–9.",
        href: "/programs/foundations",
      },
      {
        label: "Boys Competitive Pathway",
        description:
          "Elite training and league placement through MLS NEXT, Elite Academy, and more.",
        href: "/programs/boys-competitive-pathway",
      },
      {
        label: "Girls Competitive Pathway",
        description:
          "Top-tier development for girls through DPL, NPL, and competitive showcase teams.",
        href: "/programs/girls-competitive-pathway",
      },
      {
        label: "Goalkeeper Pathway",
        description:
          "Specialized goalkeeper training for all levels to master the position.",
        href: "/programs/goalkeeper-pathway",
      },
    ],
  },
  {
    label: "Champions",
    title: "Championships and signings",
    href: "/champions",
  },
  {
    label: "News",
    title: "Stories from the club",
    href: "/news",
  },
  {
    label: "Support",
    title: "Learn how you can help",
    href: "#",
    items: [
      {
        label: "Donate",
        description:
          "Every dollar helps a young player succeed — contribute now.",
        href: "/support#make-a-donation",
      },
      {
        label: "Become a Sponsor",
        description:
          "Partner with CVFC and build community while supporting youth soccer.",
        href: "/support#become-a-sponsor",
      },
      {
        label: "Partnerships",
        description: "Join forces with us for programs, events, and impact.",
        href: "/support#partnerships",
      },
    ],
  },
];

export const FOOTER_NAV: TMenuItem[] = [
  {
    heading: "Website",
    items: [
      { target: "", label: "Who we are", href: "/about/who-we-are" },
      { target: "", label: "Programs", href: "/programs" },
      { target: "", label: "Areas We Serve", href: "/areas" },
      { target: "", label: "Tryouts/Evaluations", href: "/evaluations" },
      {
        target: "",
        label: "Coaching Opportunities",
        href: "/programs/coaching-opportunities",
      },
      { target: "", label: "Donate", href: "/support#make-a-donation" },
    ],
  },
  {
    heading: "Contact Info",
    items: [
      {
        label: "925 Hake Pl, #A3 Chula Vista, CA 91914",
        target: "_blank",
        href: "https://www.google.com/maps/place/925+Hale+Pl,+Chula+Vista,+CA+91914/@32.6510202,-116.9652353,1295m/data=!3m2!1e3!4b1!4m6!3m5!1s0x80d9456b5884a3d5:0x6a231afd80080baa!8m2!3d32.6510157!4d-116.962655!16s%2Fg%2F11pw0l108w?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D",
      },
      {
        label: "+1 (619) 764-6505",
        target: "_blank",
        href: "tel:+16197646505",
      },
      {
        label: "contact@chulavistafc.com",
        target: "_blank",
        href: "mailto:contact@chulavistafc.com",
      },
    ],
  },
  {
    heading: "Legal",
    items: [
      { target: "", label: "Privacy Policy", href: "/privacy-policy" },
      { target: "", label: "Terms of Service", href: "/terms-of-service" },
      { target: "", label: "Cookie Policy", href: "/cookie-policy" },
      { target: "", label: "Link Policy", href: "/link-policy" },
    ],
  },
];

export const SOCIAL_MEDIA: TMenuItem[] = [
  {
    label: "Chula Vista FC Facebook",
    icon: <Icon token="ri:facebook" />,
    href: "https://www.facebook.com/chulavistafc/",
    target: "_blank",
  },
  {
    label: "Chula Vista FC Instagram",
    icon: <Icon token="ri:instagram" />,
    href: "https://www.instagram.com/chulavistafc/?hl=en",
    target: "_blank",
  },
];
