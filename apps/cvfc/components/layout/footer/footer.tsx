import type { ComponentProps } from "react";
import Link from "next/link";

import { Icon } from "@/components/icon";
import { LogoIcon } from "@/components/layout";
import { CookiePreferencesTrigger } from "@/components/cookie-consent";
import { FOOTER_NAV, SOCIAL_MEDIA, type TMenuItem } from "@/lib/menu";
import { cn } from "@/lib/utils";

import "./footer.css";

type IconToken = ComponentProps<typeof Icon>["token"];

type FooterProps = {
  className?: string;
  items?: TMenuItem[];
  tagline?: string;
  values?: string[];
  copyrightName?: string;
  social?: { platform: string; href: string }[];
  year?: number;
};

const DEFAULT_VALUES = ["Passion.", "Unity.", "Respect.", "Attitude."];
const DEFAULT_TAGLINE = "Creating champions on the field, and leaders in life.";
const DEFAULT_COPYRIGHT = "Chula Vista Fútbol Club";

export function Footer({
  className,
  items,
  tagline,
  values,
  copyrightName,
  social,
  year = new Date().getFullYear(),
}: FooterProps) {
  const navItems = items?.length ? items : FOOTER_NAV;
  const wordmarks = values?.length ? values : DEFAULT_VALUES;

  function socialMediaList() {
    if (social?.length) {
      return social.map(({ platform, href }) => (
        <Link
          key={platform}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={platform}
        >
          <Icon token={`ri:${platform}` as IconToken} />
        </Link>
      ));
    }
    return SOCIAL_MEDIA.map(({ label, icon, href, target }) => (
      <Link
        key={label}
        href={href ?? "#"}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        aria-label={label}
      >
        {icon}
      </Link>
    ));
  }

  function navList() {
    return navItems.map(({ heading, items: subItems }) => (
      <div className="nav-list" key={heading}>
        <div>
          <span className="nav-heading">{heading}</span>
        </div>
        {subItems?.map(({ label, href, target }) => (
          <Link
            key={label}
            href={href ?? "#"}
            target={target}
            rel={target === "_blank" ? "noopener noreferrer" : undefined}
            aria-label={label}
          >
            <span className="nav-item">{label}</span>
          </Link>
        ))}
      </div>
    ));
  }

  return (
    <footer className={cn("footer", className)}>
      <div className="contain">
        <div className="nav-row">
          <div className="logo-block">
            <LogoIcon className="logo-icon" />
            <div className="values">
              <div>
                {wordmarks.map((value) => (
                  <span key={value}>{value}</span>
                ))}
              </div>
              <div className="separator" />
              <div>{tagline ?? DEFAULT_TAGLINE}</div>
            </div>
          </div>
          <nav className="nav">{navList()}</nav>
        </div>
      </div>

      <div className="contain copyright">
        <p>
          Copyright &copy; {year} {copyrightName ?? DEFAULT_COPYRIGHT}
        </p>
        <CookiePreferencesTrigger />
        <div className="social-links">{socialMediaList()}</div>
      </div>
    </footer>
  );
}
