import Link from "next/link";

import { Button } from "@/components/ui";
import { Icon } from "@/components/icon";
import { LogoIcon } from "@/components/layout";
import { cn } from "@/lib/utils";

import "./portrait-grid.css";

export type PortraitEntry = {
  id: string;
  name: string;
  role: string;
  credential?: string;
  image?: { src: string; alt: string };
};

type PortraitGridCta = {
  label: string;
  href: string;
  variant?: "default" | "secondary" | "outline";
  iconToken?: string;
};

type PortraitGridProps = {
  className?: string;
  eyebrow?: string;
  heading: string;
  description?: string;
  people: PortraitEntry[];
  cta?: PortraitGridCta;
  background?: "bone" | "white" | "midnight";
};

export function PortraitGrid({
  className,
  eyebrow,
  heading,
  description,
  people,
  cta,
  background = "bone",
}: PortraitGridProps) {
  return (
    <section data-bg={background} className={cn("portrait-grid", className)}>
      <div className="portrait-grid-inner contain">
        <header className="portrait-grid-heading-block">
          {eyebrow ? (
            <p className="eyebrow-full">
              <span>{eyebrow}</span>
            </p>
          ) : null}
          <h2 className="portrait-grid-heading">{heading}</h2>
          {description ? (
            <p className="portrait-grid-description">{description}</p>
          ) : null}
        </header>

        <ul className="portrait-grid-list">
          {people.map((p) => (
            <li key={p.id} className="portrait-card">
              <div className="portrait-card-photo">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image.src}
                    alt={p.image.alt}
                    loading="lazy"
                    className="portrait-card-image"
                  />
                ) : (
                  <LogoIcon className="portrait-card-fallback" />
                )}
              </div>
              <div className="portrait-card-content">
                <p className="portrait-card-name">{p.name}</p>
                <p className="portrait-card-role">{p.role}</p>
                {p.credential ? (
                  <p className="portrait-card-credential">{p.credential}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>

        {cta ? (
          <div className="portrait-grid-cta-row">
            <Button
              variant={cta.variant ?? "secondary"}
              render={<Link href={cta.href} />}
            >
              {cta.iconToken ? (
                <Icon token={cta.iconToken as never} aria-hidden="true" />
              ) : null}
              <span>{cta.label}</span>
              <Icon token="ri:arrow-right" aria-hidden="true" />
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
