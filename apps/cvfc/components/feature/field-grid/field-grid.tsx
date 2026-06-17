import { type Facility } from "@/data/facilities";
import { cn } from "@/lib/utils";

import "./field-grid.css";

const FIELD_PLACEHOLDER_IMAGE =
  "https://chulavistafc.com/wp-content/uploads/2024/02/IMG_6349.jpg";

type FieldGridProps = {
  className?: string;
  fields: Facility[];
};

export function FieldGrid({ className, fields }: FieldGridProps) {
  if (fields.length === 0) return null;

  return (
    <ul className={cn("field-grid", className)}>
      {fields.map((field) => (
        <li key={field.id} className="field-grid-item">
          <a
            href={field.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="field-grid-card"
          >
            <div className="field-grid-card-body">
              <p className="field-grid-card-eyebrow">{field.roleLabel}</p>
              <h3 className="field-grid-card-name">{field.name}</h3>
              <p className="field-grid-card-address">
                {field.address.street}
                <br />
                {field.address.city}, {field.address.state} {field.address.zip}
              </p>
              <span className="field-grid-card-cta">Open in Maps →</span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={field.image?.src ?? FIELD_PLACEHOLDER_IMAGE}
              alt={field.image?.alt ?? `${field.name} field`}
              loading="lazy"
              className="field-grid-card-photo"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
