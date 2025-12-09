/**
 * Menu and Navigation Type Definitions
 * Enterprise-grade navigation system with WordPress-style menu management
 */

export type IconConfig = {
  name: string;
  position?: "left" | "right";
  size?: number;
};

export type MenuItem = {
  id: string;
  label: string;

  // Link configuration
  type: "page" | "custom" | "category" | "product" | "megamenu";
  reference?: string; // For page/category/product references
  url?: string; // For custom links

  // Visual enhancements
  icon?: IconConfig;
  description?: string;
  badge?: {
    text: string;
    variant: "new" | "hot" | "sale" | "custom";
    color?: string;
  };

  // Hierarchy
  parentId?: string;
  order: number;
  children?: MenuItem[];

  // Mega menu configuration
  megaMenu?: MegaMenuConfig;

  // Meta
  openInNewTab: boolean;
  cssClasses?: string[];
  isActive?: boolean;
};

export type MegaMenuConfig = {
  layout: "columns" | "grid" | "featured";
  columns: MegaMenuColumn[];
  featured?: {
    image: string;
    title: string;
    description: string;
    cta: {
      text: string;
      url: string;
    };
  };
};

export type MegaMenuColumn = {
  id: string;
  title?: string;
  items: MenuItem[];

  // Can contain custom content blocks
  blocks?: Array<{
    _type: string;
    _key: string;
    data: unknown;
  }>;
};

export type Menu = {
  id: string;
  name: string; // "Primary Navigation", "Footer Links"
  slug: string;
  items: MenuItem[];
  location?: "header" | "footer" | "sidebar" | "custom";
};

export type NavigationStyle = "horizontal" | "vertical";

export type NavigationVariant =
  | "default"
  | "pills"
  | "underline"
  | "minimal"
  | "bordered";

export type DropdownTrigger = "hover" | "click";
