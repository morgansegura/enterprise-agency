import type { ReactNode } from "react";

/**
 * Shared navigation item shape used by headers, footers, and mobile drawers
 * across sites. One level of nesting via `items`. `heading` groups footer
 * columns; `description` is the sub-text in header dropdowns; `icon` is for
 * social/link rows.
 */
export type TMenuItem = {
  label?: string;
  title?: string;
  heading?: string;
  description?: string;
  href?: string;
  target?: string;
  icon?: ReactNode;
  items?: TMenuItem[];
};
