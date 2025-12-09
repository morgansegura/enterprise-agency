import type { HeaderConfig } from "@/lib/headers/types";
import type { Menu } from "@/lib/menus/types";

/**
 * Example header configuration
 */
export const headerConfigMock: HeaderConfig = {
  template: "standard",

  behavior: {
    position: "fixed",
    shrinkOnScroll: true,
    showShadowOnScroll: true,
    transparent: false,
  },

  logo: "primary", // Reference to logo in logos registry

  navigation: {
    menuId: "primary",
    style: "horizontal",
    variant: "default",
    dropdownTrigger: "hover",
    showIcons: false,
    showDescriptions: false,
    megaMenuEnabled: false,
  },

  actions: {
    items: [
      {
        type: "button",
        data: {
          text: "Visit Us",
          url: "/visit",
          variant: "default",
        },
      },
      {
        type: "theme-toggle",
        data: {},
      },
    ],
  },

  mobile: {
    breakpoint: "lg",
    type: "drawer",
    drawerSide: "right",
    menuId: "primary",
  },

  styling: {
    maxWidth: "container",
    variant: "default",
    blur: false,
  },
};

/**
 * Example primary menu
 */
export const primaryMenuMock: Menu = {
  id: "primary",
  name: "Primary Navigation",
  slug: "primary",
  location: "header",
  items: [
    {
      id: "home",
      label: "Home",
      type: "page",
      url: "/",
      order: 0,
      openInNewTab: false,
      isActive: true,
    },
    {
      id: "about",
      label: "About",
      type: "page",
      url: "/about",
      order: 1,
      openInNewTab: false,
      children: [
        {
          id: "about-us",
          label: "About Us",
          type: "page",
          url: "/about/us",
          parentId: "about",
          order: 0,
          openInNewTab: false,
        },
        {
          id: "about-staff",
          label: "Our Staff",
          type: "page",
          url: "/about/staff",
          parentId: "about",
          order: 1,
          openInNewTab: false,
        },
      ],
    },
    {
      id: "ministries",
      label: "Ministries",
      type: "page",
      url: "/ministries",
      order: 2,
      openInNewTab: false,
    },
    {
      id: "events",
      label: "Events",
      type: "page",
      url: "/events",
      order: 3,
      openInNewTab: false,
      badge: {
        text: "New",
        variant: "new",
      },
    },
    {
      id: "give",
      label: "Give",
      type: "page",
      url: "/give",
      order: 4,
      openInNewTab: false,
    },
    {
      id: "contact",
      label: "Contact",
      type: "page",
      url: "/contact",
      order: 5,
      openInNewTab: false,
    },
  ],
};
