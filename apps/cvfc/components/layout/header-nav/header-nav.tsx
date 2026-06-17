import Link from "next/link";

import { Icon } from "@/components/icon";
import { HEADER_NAV, type TMenuItem } from "@/lib/menu";
import { cn } from "@/lib/utils";

import "./header-nav.css";

type HeaderNavProps = {
  className?: string;
  items?: TMenuItem[];
};

export function HeaderNav({ className, items = HEADER_NAV }: HeaderNavProps) {
  return (
    <nav className={cn("dropdown-menu", className)} aria-label="Primary">
      {items.map(({ label, title, href, items: subItems }) => {
        const hasDropdown = !!subItems?.length;
        return (
          <div key={label} className="menu-item" aria-label={title}>
            {hasDropdown ? (
              <span className="menu-item-label">
                {label} <Icon token="ri:angle-down" />
              </span>
            ) : (
              <Link href={href ?? "#"} className="menu-item-label">
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
