"use client";

import type { HeaderConfig } from "@/lib/headers/types";
import type { Menu } from "@/lib/menus/types";
import type { LogoConfig } from "@/lib/logos/types";
import { Logo } from "@/components/logo";
import { MenuRenderer } from "@/components/menu-renderer";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect } from "react";
import { MobileNav } from "./mobile-nav";

import "@/styles/tokens/header.css";

type HeaderRendererProps = {
  config: HeaderConfig;
  menu?: Menu | null; // Menu data for navigation
  logos?: Record<string, LogoConfig>; // Logo registry
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
  logos = {},
  className,
}: HeaderRendererProps) {
  const { template, behavior, logo, navigation, actions, mobile, styling } =
    config;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null,
  );
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 10;

      // Determine if scrolled past threshold
      setScrolled(currentScrollY > scrollThreshold);

      // Determine scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection("up");
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Determine visibility based on scroll behavior
  const shouldHide =
    behavior.hideOnScrollDown && scrollDirection === "down" && scrolled;
  const shouldShow = behavior.showOnScrollUp && scrollDirection === "up";

  return (
    <div
      className={cn("header-renderer", className)}
      data-template={template}
      data-position={behavior.position}
      data-transparent={
        behavior.transparentUntilScroll
          ? !scrolled && behavior.transparent
          : behavior.transparent
      }
      data-scrolled={scrolled}
      data-shrink={behavior.shrinkOnScroll && scrolled}
      data-hidden={shouldHide && !shouldShow}
      data-show-shadow={
        behavior.showShadowOnScroll ? scrolled : styling?.variant === "shadow"
      }
      data-show-border={behavior.showBorderOnScroll && scrolled}
      data-max-width={styling?.maxWidth || "container"}
      data-variant={styling?.variant || "default"}
    >
      <div className="header-container">
        {/* Logo */}
        {logo && logos[logo] && (
          <div className="header-logo">
            <Logo config={logos[logo]} size="md" />
          </div>
        )}

        {/* Navigation - Desktop */}
        {menu && (
          <nav className="header-nav" data-style={navigation.style}>
            <MenuRenderer
              menu={menu}
              style={navigation.style}
              variant={navigation.variant}
              context="header"
              dropdownTrigger={navigation.dropdownTrigger}
              showIcons={navigation.showIcons}
            />
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

                case "search":
                  return (
                    <button
                      key={key}
                      className="header-action-search"
                      aria-label="Search"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                      </svg>
                    </button>
                  );

                case "cart":
                  return (
                    <button
                      key={key}
                      className="header-action-cart"
                      aria-label="Shopping cart"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                      {action.data.showCount && (
                        <span className="header-action-cart-count">0</span>
                      )}
                    </button>
                  );

                case "theme-toggle":
                  return (
                    <button
                      key={key}
                      className="header-action-theme-toggle"
                      aria-label="Toggle theme"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2" />
                        <path d="M12 20v2" />
                        <path d="m4.93 4.93 1.41 1.41" />
                        <path d="m17.66 17.66 1.41 1.41" />
                        <path d="M2 12h2" />
                        <path d="M20 12h2" />
                        <path d="m6.34 17.66-1.41 1.41" />
                        <path d="m19.07 4.93-1.41 1.41" />
                      </svg>
                    </button>
                  );

                case "account":
                  return (
                    <button
                      key={key}
                      className="header-action-account"
                      aria-label="Account"
                    >
                      {action.data.showAvatar ? (
                        <div className="header-action-account-avatar" />
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      )}
                    </button>
                  );

                default:
                  return null;
              }
            })}
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          className="header-mobile-toggle"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Toggle mobile menu"
        >
          <svg
            className="header-mobile-toggle-icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileNav
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        menu={menu || null}
        config={mobile}
      />
    </div>
  );
}
