import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  type LucideIcon,
} from "lucide-react";
import type { TMenuItem } from "@wf/ui";

import { FOOTER_NAV, SOCIAL_LINKS } from "@/lib/menu";
import { cn, safeRel } from "@/lib/utils";

import "./footer-nav.css";

const SOCIAL_ICON: Record<string, LucideIcon> = {
  Facebook,
  Instagram,
  Twitter,
  LinkedIn: Linkedin,
};

type FooterNavProps = {
  className?: string;
  items?: TMenuItem[];
  social?: ReadonlyArray<{
    platform: string;
    href: string;
    target?: string;
    rel?: string;
  }>;
};

/** Footer link columns + a Follow (social) column. */
export function FooterNav({
  className,
  items = FOOTER_NAV,
  social = SOCIAL_LINKS,
}: FooterNavProps) {
  return (
    <div className={cn("footer-nav", className)}>
      {items.map((col) => (
        <nav
          key={col.heading}
          className="footer-nav-col"
          aria-label={col.heading}
        >
          <p className="footer-nav-heading">{col.heading}</p>
          <ul className="footer-nav-list">
            {col.items?.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href ?? "#"}
                  target={link.target}
                  rel={safeRel(link.target, link.rel)}
                  className="footer-nav-link"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ))}

      <nav className="footer-nav-col" aria-label="Follow">
        <p className="footer-nav-heading">Follow</p>
        <ul className="footer-nav-list">
          {social.map(({ platform, href, target = "_blank", rel }) => {
            const Icon = SOCIAL_ICON[platform];
            return (
              <li key={platform}>
                <Link
                  href={href}
                  target={target}
                  rel={safeRel(target, rel)}
                  className="footer-nav-social"
                  aria-label={platform}
                >
                  {Icon ? (
                    <Icon className="footer-nav-social-icon" aria-hidden />
                  ) : null}
                  <span>{platform}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
