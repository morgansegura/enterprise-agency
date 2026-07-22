import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { TMenuItem } from "@wf/ui";

import { HEADER_NAV } from "@/lib/menu";
import { cn } from "@/lib/utils";

import "./header-nav.css";

type HeaderNavProps = {
  className?: string;
  items?: TMenuItem[];
};

/** Desktop primary nav. Flat links + hover/focus dropdowns for items with children. */
export function HeaderNav({ className, items = HEADER_NAV }: HeaderNavProps) {
  return (
    <nav className={cn("header-nav", className)} aria-label="Primary">
      {items.map(({ label, title, href, items: subItems, rel, target }) => {
        const hasDropdown = !!subItems?.length;
        return (
          <div key={label} className="header-nav-item" aria-label={title}>
            {hasDropdown ? (
              <span className="header-nav-label">
                {label}
                <ChevronDown className="header-nav-caret" aria-hidden="true" />
              </span>
            ) : (
              <Link
                href={href ?? "#"}
                className="header-nav-label"
                rel={rel}
                target={target}
              >
                {label}
              </Link>
            )}

            {hasDropdown ? (
              <div className="header-nav-dropdown">
                {subItems?.map((sub) => (
                  <Link
                    key={sub.label}
                    href={sub.href ?? "#"}
                    rel={sub?.rel}
                    target={sub?.target}
                    className="header-nav-dropdown-link"
                  >
                    <span className="header-nav-dropdown-label">
                      {sub.label}
                    </span>
                    {sub.description ? (
                      <span className="header-nav-dropdown-description">
                        {sub.description}
                      </span>
                    ) : null}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
