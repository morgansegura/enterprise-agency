"use client";

import Link from "next/link";
import { Button, useHeaderVisibility, type TMenuItem } from "@wf/ui";

import { Logo } from "@/components/ui/logo";
import { HEADER_CTA } from "@/lib/menu";
import { cn } from "@/lib/utils";

import { HeaderNav } from "../header-nav";
import { MobileNav } from "../mobile-nav";

import "./header.css";

type HeaderProps = {
  className?: string;
  items?: TMenuItem[];
};

export function Header({ className, items }: HeaderProps) {
  const visible = useHeaderVisibility();

  return (
    <header
      data-visible={visible ? "true" : "false"}
      className={cn("header", className)}
    >
      <div className="header-inner contain">
        <Link href="/" className="header-logo" aria-label={`Home`}>
          <Logo className="header-logo-mark" />
        </Link>

        <div className="header-actions">
          <HeaderNav items={items} />
          <Button
            className="header-cta"
            render={<Link href={HEADER_CTA.href} />}
          >
            {HEADER_CTA.label}
          </Button>
          <MobileNav items={items} />
        </div>
      </div>
    </header>
  );
}
