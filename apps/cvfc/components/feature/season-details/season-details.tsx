import "./season-details.css";

export type SeasonFact = { id: string; value: string; label: string };
export type SeasonDivision = { id: string; title: string; birthYears: string };
export type SeasonColumn = { id: string; label: string; items: string[] };

type SeasonDetailsProps = {
  className?: string;
  /** Short punchy values only — long strings belong in `dateline`. */
  facts: SeasonFact[];
  dateline: string;
  datelineNote?: string;
  divisions?: SeasonDivision[];
  columns?: SeasonColumn[];
  footnote?: React.ReactNode;
};

export function SeasonDetails({
  className,
  facts,
  dateline,
  datelineNote,
  divisions,
  columns,
  footnote,
}: SeasonDetailsProps) {
  return (
    <div className={className}>
      <p className="season-dateline">
        {datelineNote ? (
          <span className="season-dateline-note">{datelineNote}</span>
        ) : null}
        <span className="season-dateline-dates">{dateline}</span>
      </p>

      <dl className="season-grid">
        {facts.map((f) => (
          <div key={f.id} className="season-cell">
            <dt className="season-fact-label">{f.label}</dt>
            <dd className="season-fact-value">{f.value}</dd>
          </div>
        ))}
        {divisions?.map((d) => (
          <div key={d.id} className="season-cell">
            <dt className="season-division-title">{d.title}</dt>
            <dd className="season-division-years">{d.birthYears}</dd>
          </div>
        ))}
      </dl>

      {columns?.length ? (
        <div className="season-columns">
          {columns.map((c) => (
            <div key={c.id} className="season-column">
              <p className="season-column-label">{c.label}</p>
              <ul className="season-column-list">
                {c.items.map((item, i) => (
                  <li key={i} className="season-column-item">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}

      {footnote ? <p className="season-footnote">{footnote}</p> : null}
    </div>
  );
}
