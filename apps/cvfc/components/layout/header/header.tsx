"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { EvaluationCTA } from "@/components/feature/evaluation-cta";

import { HeaderNav, LogoIcon, MobileNav } from "@/components/layout";

import { GIVE_MONTHLY_HREF } from "@/lib/donate";
import { useHeaderVisibility } from "@/lib/hooks/use-header-visibility";
import type { TMenuItem } from "@/lib/menu";

import "./header.css";
import { LogoNike } from "../logo-icon/logo-icon";

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
      <div className="header-container contain">
        <Link href="/" className="header-logo" aria-label="Chula Vista FC home">
          <LogoIcon />
          <span className="hidden sm:flex md:hidden lg:flex">
            Chula Vista FC
          </span>
          <span className="flex sm:hidden md:flex lg:hidden">CVFC</span>
          <LogoNike className="w-10 ml-1" />
        </Link>

        <div className="header-actions">
          <HeaderNav items={items} />
          <EvaluationCTA className="header-cta" label="Evaluations" />
          <EvaluationCTA
            className="header-cta"
            href={GIVE_MONTHLY_HREF}
            variant="secondary"
          >
            <span>Give Monthly</span>
            <span className="header-cta-reason">
              Join us in helping a kid play this season
            </span>
          </EvaluationCTA>
          <MobileNav items={items} />
        </div>
      </div>
    </header>
  );
}
