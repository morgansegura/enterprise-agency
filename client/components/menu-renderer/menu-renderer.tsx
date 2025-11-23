"use client";

import type {
  Menu,
  NavigationStyle,
  NavigationVariant,
} from "@/lib/menus/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import "@/styles/tokens/menu.css";

type MenuRendererProps = {
  menu: Menu;
  style?: NavigationStyle; // "horizontal" | "vertical"
  variant?: NavigationVariant; // "default" | "pills" | "underline" | "minimal" | "bordered"
  context?: "header" | "footer" | "sidebar" | "custom"; // Context for styling
  dropdownTrigger?: "hover" | "click";
  showIcons?: boolean;
  className?: string;
};

/**
 * MenuRenderer - Reusable menu component with token-based styling
 *
 * Features:
 * - Works in any context (header, footer, sidebar, tabs, etc.)
 * - Multiple style variants (pills, underline, bordered, minimal)
 * - Dropdown support
 * - Badge support
 * - Icon support
 * - Fully token-driven styling
 * - Clean classnames (.menu-link, .menu-item, etc.)
 */
export function MenuRenderer({
  menu,
  style = "horizontal",
  variant = "default",
  context = "header",
  dropdownTrigger = "hover",
  showIcons = false,
  className,
}: MenuRendererProps) {
  return (
    <ul
      className={cn("menu-renderer", className)}
      data-style={style}
      data-variant={variant}
      data-context={context}
      data-dropdown-trigger={dropdownTrigger}
    >
      {menu.items.map((item) => (
        <li key={item.id} className="menu-item">
          <Link
            href={item.url || "#"}
            className="menu-link"
            data-active={item.isActive}
            target={item.openInNewTab ? "_blank" : undefined}
            rel={item.openInNewTab ? "noopener noreferrer" : undefined}
          >
            {/* Icon - Left */}
            {showIcons && item.icon && item.icon.position === "left" && (
              <span className="menu-icon" data-position="left">
                {/* Icon rendering would go here */}
                {/* For now, placeholder */}
              </span>
            )}

            {/* Label */}
            <span>{item.label}</span>

            {/* Badge */}
            {item.badge && (
              <span className="menu-badge" data-variant={item.badge.variant}>
                {item.badge.text}
              </span>
            )}

            {/* Icon - Right */}
            {showIcons && item.icon && item.icon.position === "right" && (
              <span className="menu-icon" data-position="right">
                {/* Icon rendering would go here */}
              </span>
            )}

            {/* Dropdown indicator (chevron) */}
            {item.children && item.children.length > 0 && (
              <svg
                className="menu-icon"
                data-position="right"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 9 12 12 9" />
              </svg>
            )}
          </Link>

          {/* Dropdown menu */}
          {item.children && item.children.length > 0 && (
            <ul className="menu-dropdown">
              {item.children.map((child) => (
                <li key={child.id} className="menu-dropdown-item">
                  <Link
                    href={child.url || "#"}
                    className="menu-dropdown-link"
                    target={child.openInNewTab ? "_blank" : undefined}
                    rel={child.openInNewTab ? "noopener noreferrer" : undefined}
                  >
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}
