"use client";

import * as React from "react";

import { Image, ToggleGroup, ToggleGroupItem } from "@/components/ui";
import { Icon } from "@/components/icon";
import { COACH_FILTERS, filterCoaches, type Coach } from "@/data/coaches";
import { cn } from "@/lib/utils";

import "./staff-directory.css";

type StaffDirectoryProps = {
  className?: string;
  coaches: Coach[];
};

export function StaffDirectory({ className, coaches }: StaffDirectoryProps) {
  const [filterId, setFilterId] = React.useState<string>("all");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const detailRef = React.useRef<HTMLDivElement>(null);

  const visible = React.useMemo(
    () => filterCoaches(coaches, filterId),
    [coaches, filterId],
  );

  // Derive the selection — null when the active filter hides it (no effect).
  const selected = React.useMemo(() => {
    const found = coaches.find((c) => c.id === selectedId) ?? null;
    return found && visible.some((c) => c.id === found.id) ? found : null;
  }, [coaches, selectedId, visible]);

  React.useEffect(() => {
    if (selected && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selected]);

  return (
    <section className={cn("staff-directory", className)}>
      <div className="staff-directory-inner contain">
        {selected ? (
          <article
            ref={detailRef}
            className="staff-directory-detail"
            aria-live="polite"
          >
            <Image
              src={selected.image?.src}
              alt={selected.image?.alt ?? selected.name}
              className="staff-directory-detail-photo"
              loading="eager"
            />

            <div className="staff-directory-detail-body">
              <p className="staff-directory-detail-eyebrow">
                <span className="eyebrow-rule" aria-hidden="true" />
                Coaching Staff
              </p>
              <h3 className="staff-directory-detail-name">{selected.name}</h3>
              <p className="staff-directory-detail-title">
                {selected.team
                  ? selected.title.split(",")[0].trim()
                  : selected.title}
              </p>

              <div className="staff-directory-detail-meta">
                {selected.team ? (
                  <p className="staff-directory-detail-team">
                    <Icon token="ri:soccer-ball" aria-hidden="true" />
                    <span>{selected.team}</span>
                  </p>
                ) : null}
                {selected.joinedYear ? (
                  <p className="staff-directory-detail-tenure">
                    Joined CVFC {selected.joinedYear}
                  </p>
                ) : null}
              </div>

              {selected.credentials?.length ? (
                <div className="staff-directory-detail-section">
                  <p className="staff-directory-detail-section-label">
                    Credentials
                  </p>
                  <ul className="staff-directory-detail-credentials">
                    {selected.credentials.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {selected.achievements?.length ? (
                <div className="staff-directory-detail-section">
                  <p className="staff-directory-detail-section-label">
                    Achievements
                  </p>
                  <ul className="staff-directory-detail-achievements">
                    {selected.achievements.map((a) => (
                      <li key={a}>
                        <Icon token="ri:badge" aria-hidden="true" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {selected.bio ? (
                <p className="staff-directory-detail-bio">{selected.bio}</p>
              ) : (
                <p className="staff-directory-detail-bio-placeholder">
                  Full bio coming soon. Request an evaluation and a CVFC coach
                  will be in touch directly.
                </p>
              )}

              {selected.contact?.email || selected.contact?.phone ? (
                <dl className="staff-directory-detail-contact">
                  {selected.contact?.email ? (
                    <div>
                      <dt>Email</dt>
                      <dd>
                        <a href={`mailto:${selected.contact.email}`}>
                          {selected.contact.email}
                        </a>
                      </dd>
                    </div>
                  ) : null}
                  {selected.contact?.phone ? (
                    <div>
                      <dt>Phone</dt>
                      <dd>
                        <a href={`tel:${selected.contact.phone}`}>
                          {selected.contact.phone}
                        </a>
                      </dd>
                    </div>
                  ) : null}
                </dl>
              ) : null}
            </div>
          </article>
        ) : null}

        <ToggleGroup
          type="single"
          value={filterId}
          onValueChange={(v) => v && setFilterId(v)}
          className="staff-directory-filters"
          aria-label="Browse coaches"
        >
          {COACH_FILTERS.map((f) => (
            <ToggleGroupItem
              key={f.id}
              value={f.id}
              aria-label={f.label}
              className="staff-directory-filter"
            >
              {f.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        {visible.length === 0 ? (
          <p className="staff-directory-empty">
            No coaches in this group yet.{" "}
            <button
              type="button"
              className="staff-directory-empty-reset"
              onClick={() => setFilterId("all")}
            >
              View all coaches
            </button>
          </p>
        ) : (
          <ul className="staff-directory-grid">
            {visible.map((coach) => {
              const isSelected = coach.id === selectedId;
              return (
                <li key={coach.id}>
                  <button
                    type="button"
                    className="staff-directory-card"
                    data-selected={isSelected ? "true" : "false"}
                    onClick={() => setSelectedId(isSelected ? null : coach.id)}
                    aria-pressed={isSelected}
                    aria-label={`View ${coach.name} profile`}
                  >
                    <Image
                      src={coach.image?.src}
                      alt={coach.image?.alt ?? coach.name}
                      className="staff-directory-card-photo"
                    />
                    <div className="staff-directory-card-content">
                      <p className="staff-directory-card-name">{coach.name}</p>
                      <p className="staff-directory-card-title">
                        {coach.title}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
