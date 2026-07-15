"use client";

import Link from "next/link";
import { useScrolled, type TMenuItem } from "@wf/ui";

import { Logo } from "@/components/ui/logo";
import { HEADER_ACTIONS } from "@/lib/menu";
import { cn, safeRel } from "@/lib/utils";

import { HeaderNav } from "../header-nav";
import { MobileNav } from "../mobile-nav";

import "./header.css";

type HeaderProps = {
  className?: string;
  items?: TMenuItem[];
};

/** Site header — transparent over the (dark) hero at the top; scrolls away once
 *  past the top and stays hidden until the user returns to the top. */
export function Header({ className, items }: HeaderProps) {
  const scrolled = useScrolled(24);

  return (
    <header
      data-scrolled={scrolled ? "true" : "false"}
      className={cn("header", className)}
    >
      <div className="header-inner contain">
        <Link href="/" className="header-logo" aria-label="Home">
          <Logo className="header-logo-mark" />
        </Link>

        <div className="header-actions">
          <HeaderNav items={items} />
          <div className="header-buttons">
            {HEADER_ACTIONS.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                target={action.target}
                rel={safeRel(action.target, action.rel)}
                className={cn(
                  "header-button",
                  `header-button-${action.variant}`,
                )}
              >
                {action.label}
              </Link>
            ))}
          </div>
          <MobileNav items={items} />
        </div>
      </div>
    </header>
  );
}
