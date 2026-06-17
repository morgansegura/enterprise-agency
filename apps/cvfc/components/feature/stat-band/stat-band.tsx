import { cn } from "@/lib/utils";

import "./stat-band.css";

export type StatBandStat = {
  id: string;
  value: string;
  label: string;
};

export type StatBandHighlight = {
  id: string;
  tag: string;
  title: string;
  body?: string;
};

type StatBandProps = {
  className?: string;
  eyebrow?: string;
  heading?: string;
  description?: React.ReactNode;
  stats: StatBandStat[];
  highlights?: StatBandHighlight[];
  variant?: "midnight" | "bone";
  footnote?: React.ReactNode;
};

export function StatBand({
  className,
  eyebrow,
  heading,
  description,
  stats,
  highlights,
  variant = "midnight",
  footnote,
}: StatBandProps) {
  return (
    <section
      data-variant={variant}
      className={cn("stat-band", className)}
      aria-labelledby={heading ? "stat-band-heading" : undefined}
    >
      <div className="stat-band-inner contain">
        {(eyebrow || heading || description) && (
          <header className="stat-band-heading-block">
            {eyebrow ? (
              <p className="eyebrow-full">
                <span>{eyebrow}</span>
              </p>
            ) : null}
            {heading ? (
              <h2 id="stat-band-heading" className="stat-band-heading">
                {heading}
              </h2>
            ) : null}
            {description ? (
              <p className="stat-band-description">{description}</p>
            ) : null}
          </header>
        )}

        <dl className="stat-band-grid">
          {stats.map((stat) => (
            <div key={stat.id} className="stat-band-stat">
              <dt className="stat-band-stat-label">{stat.label}</dt>
              <dd className="stat-band-stat-value">{stat.value}</dd>
            </div>
          ))}
        </dl>

        {highlights && highlights.length > 0 ? (
          <ul className="stat-band-highlights">
            {highlights.map((h) => (
              <li key={h.id} className="stat-band-highlight">
                <span className="stat-band-highlight-tag">{h.tag}</span>
                <p className="stat-band-highlight-title">{h.title}</p>
                {h.body ? (
                  <p className="stat-band-highlight-body">{h.body}</p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}

        {footnote ? <p className="stat-band-footnote">{footnote}</p> : null}
      </div>
    </section>
  );
}
