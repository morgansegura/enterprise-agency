"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icon } from "@/components/icon";
import { HEADER_NAV, type TMenuItem } from "@/lib/menu";
import { cn } from "@/lib/utils";

import "./header-nav.css";

type HeaderNavProps = {
  className?: string;
  items?: TMenuItem[];
};

export function HeaderNav({ className, items = HEADER_NAV }: HeaderNavProps) {
  const [open, setOpen] = useState<string | null>(null);

  // Close any open dropdown on route change (adjust state during render —
  // React's recommended alternative to setState-in-effect).
  const pathname = usePathname();
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpen(null);
  }

  return (
    <nav
      className={cn("dropdown-menu", className)}
      aria-label="Primary"
      onMouseLeave={() => setOpen(null)}
    >
      {items.map(({ label, title, href, items: subItems }) => {
        const hasDropdown = !!subItems?.length;
        const key = label ?? "";
        const isOpen = open === key;
        return (
          <div
            key={key}
            className="menu-item"
            aria-label={title}
            data-open={isOpen}
            onMouseEnter={() => hasDropdown && setOpen(key)}
          >
            {hasDropdown ? (
              <button
                type="button"
                className="menu-item-label"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : key)}
              >
                {label} <Icon token="ri:angle-down" />
              </button>
            ) : (
              <Link
                href={href ?? "#"}
                className="menu-item-label"
                onClick={() => setOpen(null)}
              >
                {label}
              </Link>
            )}

            {hasDropdown ? (
              <div className="item-card">
                {subItems?.map(
                  ({ label: subLabel, description, href: subHref }) => (
                    <Link
                      key={subLabel}
                      href={subHref ?? "#"}
                      className="item-container"
                      onClick={() => setOpen(null)}
                    >
                      <span className="item-label">{subLabel}</span>
                      <span className="item-description">{description}</span>
                    </Link>
                  ),
                )}
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
