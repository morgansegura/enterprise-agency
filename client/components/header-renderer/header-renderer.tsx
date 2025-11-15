import type { HeaderConfig } from "@/lib/headers/types";
import type { Menu } from "@/lib/menus/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import "./header-renderer.css";

type HeaderRendererProps = {
  config: HeaderConfig;
  menu?: Menu | null; // Menu data for navigation
  className?: string;
};

/**
 * HeaderRenderer - Renders header based on configuration
 *
 * Handles:
 * - Multiple templates (standard, centered, split, minimal, etc.)
 * - Logo with dark mode support
 * - Navigation (menu items)
 * - Action items (buttons, search, cart, etc.)
 * - Behavior (sticky, fixed, transparent, etc.)
 * - Mobile responsive
 */
export function HeaderRenderer({
  config,
  menu,
  className,
}: HeaderRendererProps) {
  const { template, behavior, logo, navigation, actions, mobile, styling } =
    config;

  return (
    <div
      className={cn("header-renderer", className)}
      data-template={template}
      data-position={behavior.position}
      data-transparent={behavior.transparent}
      data-max-width={styling?.maxWidth || "container"}
      data-variant={styling?.variant || "default"}
    >
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo">
          <Link href={logo.link}>
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className="header-logo-image"
              priority
            />
          </Link>
        </div>

        {/* Navigation - Desktop */}
        {menu && (
          <nav className="header-nav" data-style={navigation.style}>
            <ul className="header-nav-list" data-variant={navigation.variant}>
              {menu.items.map((item) => (
                <li key={item.id} className="header-nav-item">
                  <Link
                    href={item.url || "#"}
                    className="header-nav-link"
                    data-active={item.isActive}
                  >
                    {navigation.showIcons && item.icon && (
                      <span className="header-nav-icon">
                        {/* Icon would be rendered here */}
                      </span>
                    )}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className="header-nav-badge"
                        data-variant={item.badge.variant}
                      >
                        {item.badge.text}
                      </span>
                    )}
                  </Link>

                  {/* Dropdown for child items */}
                  {item.children && item.children.length > 0 && (
                    <ul className="header-nav-dropdown">
                      {item.children.map((child) => (
                        <li key={child.id} className="header-nav-dropdown-item">
                          <Link
                            href={child.url || "#"}
                            className="header-nav-dropdown-link"
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
          </nav>
        )}

        {/* Actions */}
        {actions && (
          <div className="header-actions">
            {actions.items.map((action, index) => {
              const key = `action-${index}`;

              switch (action.type) {
                case "button":
                  return (
                    <Link
                      key={key}
                      href={action.data.url}
                      className="header-action-button"
                      data-variant={action.data.variant || "default"}
                    >
                      {action.data.text}
                    </Link>
                  );

                case "theme-toggle":
                  return (
                    <button
                      key={key}
                      className="header-action-theme-toggle"
                      aria-label="Toggle theme"
                    >
                      {/* Theme toggle icon */}
                    </button>
                  );

                // Add other action types as needed
                default:
                  return null;
              }
            })}
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          className="header-mobile-toggle"
          aria-label="Toggle mobile menu"
        >
          {/* Hamburger icon */}
          <span className="header-mobile-toggle-icon" />
        </button>
      </div>
    </div>
  );
}
