"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { EvaluationCTA } from "@/components/feature/evaluation-cta";

import { HeaderNav, LogoIcon, MobileNav } from "@/components/layout";

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
          <span>Chula Vista FC</span>
          <LogoNike className="w-10 ml-1" />
        </Link>

        <div className="header-actions">
          <HeaderNav items={items} />
          <EvaluationCTA className="header-cta" label="Evaluations" />
          <MobileNav items={items} />
        </div>
      </div>
    </header>
  );
}
