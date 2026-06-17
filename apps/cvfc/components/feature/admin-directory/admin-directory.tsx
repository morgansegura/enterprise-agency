"use client";

import * as React from "react";

import { Image } from "@/components/ui";
import { type AdminMember } from "@/data/administrators";
import { cn } from "@/lib/utils";

import "./admin-directory.css";

type AdminDirectoryProps = {
  className?: string;
  administrators: AdminMember[];
};

export function AdminDirectory({
  className,
  administrators,
}: AdminDirectoryProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const detailRef = React.useRef<HTMLDivElement>(null);

  const selected = React.useMemo(
    () => administrators.find((a) => a.id === selectedId) ?? null,
    [administrators, selectedId],
  );

  React.useEffect(() => {
    if (selected && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selected]);

  return (
    <section className={cn("admin-directory", className)}>
      <div className="admin-directory-inner contain">
        {selected ? (
          <article
            ref={detailRef}
            className="admin-directory-detail"
            aria-live="polite"
          >
            <Image
              src={selected.image?.src}
              alt={selected.image?.alt ?? selected.name}
              className="admin-directory-detail-photo"
              loading="eager"
            />

            <div className="admin-directory-detail-body">
              <p className="admin-directory-detail-eyebrow">
                <span className="eyebrow-rule" aria-hidden="true" />
                {selected.department ?? "Administration"}
              </p>
              <h3 className="admin-directory-detail-name">{selected.name}</h3>
              <p className="admin-directory-detail-title">{selected.title}</p>

              {selected.joinedYear ? (
                <p className="admin-directory-detail-tenure">
                  Joined CVFC {selected.joinedYear}
                </p>
              ) : null}

              {selected.credentials?.length ? (
                <div className="admin-directory-detail-section">
                  <p className="admin-directory-detail-section-label">
                    Credentials
                  </p>
                  <ul className="admin-directory-detail-credentials">
                    {selected.credentials.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {selected.bio ? (
                <p className="admin-directory-detail-bio">{selected.bio}</p>
              ) : null}

              {selected.contact?.email || selected.contact?.phone ? (
                <dl className="admin-directory-detail-contact">
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

        <ul className="admin-directory-grid">
          {administrators.map((admin) => {
            const isSelected = admin.id === selectedId;
            return (
              <li key={admin.id}>
                <button
                  type="button"
                  className="admin-directory-card"
                  data-selected={isSelected ? "true" : "false"}
                  onClick={() => setSelectedId(isSelected ? null : admin.id)}
                  aria-pressed={isSelected}
                  aria-label={`View ${admin.name} profile`}
                >
                  <Image
                    src={admin.image?.src}
                    alt={admin.image?.alt ?? admin.name}
                    className="admin-directory-card-photo"
                  />
                  <div className="admin-directory-card-content">
                    {admin.department ? (
                      <p className="admin-directory-card-department">
                        {admin.department}
                      </p>
                    ) : null}
                    <p className="admin-directory-card-name">{admin.name}</p>
                    <p className="admin-directory-card-title">{admin.title}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
