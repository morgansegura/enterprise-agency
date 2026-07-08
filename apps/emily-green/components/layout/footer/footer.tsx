import Link from "next/link";
import { Button } from "@wf/ui";

import { FOOTER_REFERRAL, LEGAL_LINKS } from "@/lib/menu";
import { site } from "@/site.config";
import { cn } from "@/lib/utils";

import { FooterNav } from "../footer-nav";

import "./footer.css";

type FooterProps = {
  className?: string;
  /** Referral blurb (left column). */
  referral?: string;
  /** Small-print licensing/disclosure text. */
  licensing?: string;
  year?: number;
};

export function Footer({
  className,
  referral = FOOTER_REFERRAL,
  licensing,
  year = new Date().getFullYear(),
}: FooterProps) {
  return (
    <footer className={cn("footer", className)}>
      <div className="footer-inner contain">
        <div className="footer-top">
          <div className="footer-intro">
            <p className="footer-referral">{referral}</p>
            <Button
              variant="secondary"
              className="footer-refer"
              render={<Link href="#refer" />}
            >
              Refer a Friend
            </Button>
            {licensing ? <p className="footer-licensing">{licensing}</p> : null}
          </div>

          <FooterNav className="footer-columns" />
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            Copyright &copy; {year} All rights reserved.
          </p>
          <nav className="footer-legal" aria-label="Legal">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href ?? "#"}
                className="footer-legal-link"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <span className="sr-only">{site.name}</span>
    </footer>
  );
}
