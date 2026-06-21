"use client";

import * as React from "react";

import {
  ModalClose,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui";
import { Icon } from "@/components/icon";
import {
  TRACK_LABELS,
  evaluateRoute,
  getBirthYearOptions,
  type EvaluationTrack,
} from "@/lib/evaluations";

const TRACKS: EvaluationTrack[] = ["boys", "girls", "goalkeeper"];

/**
 * The evaluation modal's body (radix Select + ToggleGroup + routing logic).
 * Split out and lazy-loaded by EvaluationCTA so this weight stays out of the
 * initial bundle until a user actually opens the modal.
 */
export function EvaluationForm({ onClose }: { onClose: () => void }) {
  const [track, setTrack] = React.useState<EvaluationTrack | null>(null);
  const [birthYear, setBirthYear] = React.useState<number | null>(null);
  const result = evaluateRoute({ track, birthYear });
  const years = React.useMemo(() => getBirthYearOptions(), []);

  return (
    <div className="evaluation-cta-modal">
      <header className="evaluation-cta-header">
        <p className="evaluation-cta-eyebrow">
          <span className="evaluation-cta-eyebrow-rule" aria-hidden="true" />
          Request an Evaluation
        </p>
        <h3 className="evaluation-cta-title">Tell us about your player</h3>
        <p className="evaluation-cta-subtitle">
          We&rsquo;ll route you to the right tryout or year-round evaluation.
        </p>
      </header>

      <div className="evaluation-cta-body">
        <fieldset className="evaluation-cta-field">
          <label className="evaluation-cta-label">Player Track</label>
          <ToggleGroup
            type="single"
            value={track ?? ""}
            onValueChange={(value) =>
              setTrack(value ? (value as EvaluationTrack) : null)
            }
            className="evaluation-cta-tracks"
          >
            {TRACKS.map((t) => (
              <ToggleGroupItem key={t} value={t} aria-label={TRACK_LABELS[t]}>
                {TRACK_LABELS[t]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </fieldset>

        <div className="evaluation-cta-field">
          <label htmlFor="evaluation-cta-year" className="evaluation-cta-label">
            Player&rsquo;s birth year
          </label>
          <Select
            value={birthYear ? String(birthYear) : undefined}
            onValueChange={(value) =>
              setBirthYear(value ? Number(value) : null)
            }
          >
            <SelectTrigger
              id="evaluation-cta-year"
              className="evaluation-cta-select"
              aria-label="Player's birth year"
            >
              <SelectValue placeholder="Select year…" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {result.kind === "match" ? (
          <div className="evaluation-cta-result" data-kind="match">
            <p className="evaluation-cta-result-eyebrow">Tryouts open</p>
            <p className="evaluation-cta-result-label">
              {result.program.label}
            </p>
            {result.program.windowLabel ? (
              <p className="evaluation-cta-result-window">
                {result.program.windowLabel}
              </p>
            ) : null}
            <a
              href={result.program.signupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="evaluation-cta-continue"
              onClick={onClose}
            >
              <span>Continue to Registration</span>
              <Icon token="ri:arrow-right" aria-hidden="true" />
            </a>
          </div>
        ) : null}

        {result.kind === "year-round" ? (
          <div className="evaluation-cta-result" data-kind="year-round">
            <p className="evaluation-cta-result-eyebrow">
              Year-round evaluation
            </p>
            <p className="evaluation-cta-result-description">
              {result.program.description}
            </p>
            <a
              href={result.program.signupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="evaluation-cta-continue"
              onClick={onClose}
            >
              <span>Begin Individual Evaluation</span>
              <Icon token="ri:arrow-right" aria-hidden="true" />
            </a>
          </div>
        ) : null}
      </div>

      <footer className="evaluation-cta-footer">
        <p className="evaluation-cta-note">
          <strong>Have multiple players?</strong>
          Once you sign up, you will be able to add additional players inside
          your account.
        </p>
        <ModalClose className="evaluation-cta-cancel">Cancel</ModalClose>
      </footer>
    </div>
  );
}
