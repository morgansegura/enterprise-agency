"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Menu } from "@/lib/menus/types";
import type { MobileHeaderConfig } from "@/lib/headers/types";
import Link from "next/link";
import { useState } from "react";
import "./mobile-nav.css";

type MobileNavProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menu: Menu | null;
  config: MobileHeaderConfig;
};

/**
 * MobileNav - Mobile navigation drawer
 * Uses Sheet component for slide-in drawer
 * Renders menu items vertically with accordion for nested items
 */
export function MobileNav({
  open,
  onOpenChange,
  menu,
  config,
}: MobileNavProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  if (!menu) return null;

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleItemClick = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={config.drawerSide || "left"}
        className="mobile-nav-content"
      >
        <SheetHeader>
          <SheetTitle className="mobile-nav-title">{menu.name}</SheetTitle>
        </SheetHeader>

        <nav className="mobile-nav" aria-label="Mobile navigation">
          <ul className="mobile-nav-list">
            {menu.items.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedItems.has(item.id);

              return (
                <li key={item.id} className="mobile-nav-item">
                  {hasChildren ? (
                    <>
                      <button
                        className="mobile-nav-link"
                        onClick={() => toggleExpanded(item.id)}
                        aria-expanded={isExpanded}
                      >
                        <span>{item.label}</span>
                        <span
                          className="mobile-nav-chevron"
                          data-expanded={isExpanded}
                        >
                          ▼
                        </span>
                      </button>

                      {isExpanded && item.children ? (
                        <ul className="mobile-nav-submenu">
                          {item.children.map((child) => (
                            <li
                              key={child.id}
                              className="mobile-nav-submenu-item"
                            >
                              <Link
                                href={child.url || "#"}
                                className="mobile-nav-submenu-link"
                                onClick={handleItemClick}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </>
                  ) : (
                    <Link
                      href={item.url || "#"}
                      className="mobile-nav-link"
                      onClick={handleItemClick}
                      data-active={item.isActive}
                    >
                      {item.label}
                      {item.badge ? (
                        <span
                          className="mobile-nav-badge"
                          data-variant={item.badge.variant}
                        >
                          {item.badge.text}
                        </span>
                      ) : null}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
