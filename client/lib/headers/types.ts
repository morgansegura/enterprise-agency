/**
 * Header Type Definitions
 * Enterprise header system with composable blocks and templates
 */

import type {
  NavigationStyle,
  NavigationVariant,
  DropdownTrigger,
} from "../menus/types";

export type HeaderTemplate =
  | "standard" // Logo left, nav right
  | "centered" // Logo center, nav below
  | "split" // Logo left, nav center, actions right
  | "minimal" // Just logo and hamburger
  | "stacked" // Logo top, nav bottom
  | "sidebar"; // Vertical header

export type HeaderPosition = "static" | "sticky" | "fixed" | "absolute";

export type HeaderBehavior = {
  position: HeaderPosition;

  // Sticky-specific options
  stickyOffset?: number;
  shrinkOnScroll?: boolean; // Reduce height when scrolled
  hideOnScrollDown?: boolean;
  showOnScrollUp?: boolean;

  // Transparency/overlay
  transparent?: boolean;
  transparentUntilScroll?: boolean;

  // Border/shadow behavior
  showBorderOnScroll?: boolean;
  showShadowOnScroll?: boolean;
};

/**
 * Logo reference in header
 * Can be a string ID (references logos registry) or null (no logo)
 */
export type HeaderLogoConfig = string | null;

export type SearchConfig = {
  placeholder?: string;
  action: string;
  showButton?: boolean;
};

export type NavigationConfig = {
  menuId: string;
  style: NavigationStyle;

  // Visual options
  showIcons?: boolean;
  showDescriptions?: boolean;

  // Dropdown behavior
  dropdownTrigger: DropdownTrigger;
  megaMenuEnabled?: boolean;

  // Styling
  variant: NavigationVariant;
};

export type HeaderActionItem =
  | { type: "button"; data: { text: string; url: string; variant?: string } }
  | { type: "search"; data: SearchConfig }
  | { type: "cart"; data: { showCount: boolean } }
  | { type: "account"; data: { showAvatar: boolean } }
  | { type: "language"; data: { languages: string[] } }
  | { type: "theme-toggle"; data: Record<string, never> }
  | {
      type: "custom";
      data: { _type: string; _key: string; data: unknown };
    };

export type HeaderActionsConfig = {
  items: HeaderActionItem[];
};

export type MobileHeaderConfig = {
  breakpoint: "sm" | "md" | "lg" | "xl";
  type: "drawer" | "overlay" | "dropdown";
  drawerSide?: "left" | "right";
  menuId: string; // Can be same or different from desktop
};

export type HeaderStylingConfig = {
  blur?: boolean;
  maxWidth?: "full" | "container" | "narrow";
  variant?: "default" | "bordered" | "shadow";
};

export type HeaderConfig = {
  template: HeaderTemplate;
  behavior: HeaderBehavior;
  logo: HeaderLogoConfig;
  navigation: NavigationConfig;
  actions?: HeaderActionsConfig;
  mobile: MobileHeaderConfig;
  styling?: HeaderStylingConfig;
};

export type HeaderBlock =
  | { type: "logo"; data: HeaderLogoConfig }
  | { type: "navigation"; data: NavigationConfig }
  | { type: "actions"; data: HeaderActionsConfig }
  | { type: "search"; data: SearchConfig }
  | {
      type: "custom";
      data: Array<{ _type: string; _key: string; data: unknown }>;
    };
