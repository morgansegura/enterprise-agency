"use client";

import * as React from "react";

import {
  Checkbox,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Icon } from "@/components/icon";
import {
  LEVELS_BY_GENDER,
  POSITIONS,
  REFERRAL_SOURCES,
  type PlayerGender,
} from "@/lib/registration-options";
import { saveSignup, saveExperience } from "@/lib/actions/registration";

import "./registration-form.css";

const GENDERS: { value: PlayerGender; label: string }[] = [
  { value: "boys", label: "Boys" },
  { value: "girls", label: "Girls" },
];
const STEPS = ["Player & Contact", "Experience"] as const;

type Draft = {
  // Contact
  parentFirstName: string;
  parentLastName: string;
  email: string;
  phone: string;
  // Player
  playerFirstName: string;
  playerLastName: string;
  gender: PlayerGender | null;
  dob: string;
  // Experience
  positions: string[];
  priorClub: string;
  priorCoach: string;
  priorLeagueLevel: string;
  school: string;
  referral: string;
  additionalPlayers: boolean;
};

const EMPTY_DRAFT: Draft = {
  parentFirstName: "",
  parentLastName: "",
  email: "",
  phone: "",
  playerFirstName: "",
  playerLastName: "",
  gender: null,
  dob: "",
  positions: [],
  priorClub: "",
  priorCoach: "",
  priorLeagueLevel: "",
  school: "",
  referral: "",
  additionalPlayers: false,
};

const isEmail = (v: string) => /.+@.+\..+/.test(v.trim());
const isPhone = (v: string) => v.replace(/\D/g, "").length >= 10;
const hasErrors = (e: Record<string, string>) => Object.values(e).some(Boolean);

function dobError(dob: string): string {
  if (!dob) return "Required";
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return "Enter a valid date";
  const now = new Date();
  if (d > now) return "Date can't be in the future";
  const age = now.getFullYear() - d.getFullYear();
  if (age > 25) return "Check the birth year";
  if (age < 3) return "Player seems too young";
  return "";
}

/** Compact multi-select: a popover of checkboxes that reads like a Select. */
function MultiCheckSelect({
  id,
  options,
  value,
  onChange,
  placeholder,
  ariaLabel,
}: {
  id: string;
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  ariaLabel: string;
}) {
  const toggle = (opt: string) =>
    onChange(
      value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt],
    );
  const label =
    value.length === 0
      ? placeholder
      : value.length <= 2
        ? value.join(", ")
        : `${value.length} selected`;

  return (
    <Popover>
      <PopoverTrigger
        id={id}
        type="button"
        className="registration-form-select registration-form-multiselect"
        aria-label={ariaLabel}
        data-empty={value.length === 0 ? "true" : undefined}
      >
        <span className="registration-form-multiselect-value">{label}</span>
        <span
          className="registration-form-multiselect-caret"
          aria-hidden="true"
        >
          ▾
        </span>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="registration-form-multiselect-content"
      >
        {options.map((opt) => (
          <label key={opt} className="registration-form-check">
            <Checkbox
              checked={value.includes(opt)}
              onCheckedChange={() => toggle(opt)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </PopoverContent>
    </Popover>
  );
}

/**
 * Two-step registration form, shared by the /evaluations page (`variant="page"`)
 * and the evaluation modal (`variant="modal"`).
 *
 * Step 1 (Player & Contact) captures the lead INSTANTLY — it creates the parent
 * item in CVFC Signups and keeps its id, so an abandoned form still yields a
 * usable contact. Step 2 (Experience) attaches the player subitem with the full
 * profile. Each step's required fields are validated before it can advance. Coach
 * matching happens server-side and is never shown to the parent.
 */
export function RegistrationForm({
  variant = "page",
  onClose,
}: {
  variant?: "page" | "modal";
  onClose?: () => void;
}) {
  const [step, setStep] = React.useState(0); // 0 Details · 1 Experience · 2 Done
  const [draft, setDraft] = React.useState<Draft>(EMPTY_DRAFT);
  const [signupId, setSignupId] = React.useState<string | null>(null);
  // Per-session token dedupes Back→Save to the same Signups row.
  const [token] = React.useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );
  const [attempted, setAttempted] = React.useState<Record<number, boolean>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) =>
    setDraft((p) => ({ ...p, [k]: v }));

  const detailsErrors = {
    parentFirstName: draft.parentFirstName.trim() ? "" : "Required",
    parentLastName: draft.parentLastName.trim() ? "" : "Required",
    email: !draft.email.trim()
      ? "Required"
      : isEmail(draft.email)
        ? ""
        : "Enter a valid email",
    phone: !draft.phone.trim()
      ? "Required"
      : isPhone(draft.phone)
        ? ""
        : "Enter a valid phone number",
    playerFirstName: draft.playerFirstName.trim() ? "" : "Required",
    playerLastName: draft.playerLastName.trim() ? "" : "Required",
    gender: draft.gender ? "" : "Required",
    dob: dobError(draft.dob),
  };
  const experienceErrors = {
    positions: draft.positions.length ? "" : "Select at least one",
  };

  async function continueDetails(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAttempted((a) => ({ ...a, 0: true }));
    if (hasErrors(detailsErrors) || submitting) return;
    setSubmitting(true);
    setError(null);
    // Save & continue — create-or-update this player's Signups row (deduped by
    // token), match a coach, and email parent + coach (only on first create).
    const res = await saveSignup(
      token,
      {
        firstName: draft.parentFirstName,
        lastName: draft.parentLastName,
        email: draft.email,
        phone: draft.phone,
      },
      {
        firstName: draft.playerFirstName,
        lastName: draft.playerLastName,
        gender: draft.gender as PlayerGender,
        dob: draft.dob,
        priorLeagueLevel: draft.priorLeagueLevel,
      },
    );
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setSignupId(res.signupId);
    setStep(1);
  }

  async function finish() {
    setAttempted((a) => ({ ...a, 1: true }));
    if (hasErrors(experienceErrors) || submitting || !signupId) return;
    setSubmitting(true);
    setError(null);
    const res = await saveExperience(
      signupId,
      {
        positions: draft.positions,
        priorClub: draft.priorClub,
        priorCoach: draft.priorCoach,
        school: draft.school,
        referral: draft.referral,
      },
      draft.additionalPlayers,
    );
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setStep(2);
  }

  // Inline field error (only after that step has been attempted).
  const fieldError = (stepIndex: number, msg: string) =>
    attempted[stepIndex] && msg ? (
      <span className="registration-form-field-error">{msg}</span>
    ) : null;

  const levelOptions = draft.gender ? LEVELS_BY_GENDER[draft.gender] : [];
  const currentStep = Math.min(step, STEPS.length - 1);

  return (
    <div className="registration-form" data-variant={variant}>
      <header className="registration-form-header">
        <p className="registration-form-eyebrow">
          <span className="registration-form-eyebrow-rule" aria-hidden="true" />
          Request an Evaluation
        </p>
        <h3 className="registration-form-title">Tell us about your player</h3>
        <p className="registration-form-subtitle">
          A coach will follow up within 48 hours — finish whenever you can, your
          time is valuable.
        </p>
        <ol className="registration-form-steps" aria-label="Progress">
          {STEPS.map((label, i) => (
            <li
              key={label}
              className="registration-form-step"
              data-state={
                step === 2 || i < currentStep
                  ? "done"
                  : i === currentStep
                    ? "current"
                    : "todo"
              }
            >
              <span className="registration-form-step-dot">{i + 1}</span>
              <span className="registration-form-step-label">{label}</span>
            </li>
          ))}
        </ol>
      </header>

      {/* Step 1 — Player & Contact */}
      {step === 0 ? (
        <form className="registration-form-body" onSubmit={continueDetails}>
          <div className="registration-form-row">
            <div className="registration-form-field">
              <label htmlFor="rf-first" className="registration-form-label">
                Parent first name*
              </label>
              <input
                id="rf-first"
                className="registration-form-input"
                value={draft.parentFirstName}
                onChange={(e) => set("parentFirstName", e.target.value)}
                autoComplete="given-name"
              />
              {fieldError(0, detailsErrors.parentFirstName)}
            </div>
            <div className="registration-form-field">
              <label htmlFor="rf-last" className="registration-form-label">
                Parent last name*
              </label>
              <input
                id="rf-last"
                className="registration-form-input"
                value={draft.parentLastName}
                onChange={(e) => set("parentLastName", e.target.value)}
                autoComplete="family-name"
              />
              {fieldError(0, detailsErrors.parentLastName)}
            </div>
          </div>

          <div className="registration-form-row">
            <div className="registration-form-field">
              <label htmlFor="rf-email" className="registration-form-label">
                Email*
              </label>
              <input
                id="rf-email"
                type="email"
                className="registration-form-input"
                value={draft.email}
                onChange={(e) => set("email", e.target.value)}
                autoComplete="email"
              />
              {fieldError(0, detailsErrors.email)}
            </div>
            <div className="registration-form-field">
              <label htmlFor="rf-phone" className="registration-form-label">
                Phone*
              </label>
              <input
                id="rf-phone"
                type="tel"
                className="registration-form-input"
                value={draft.phone}
                onChange={(e) => set("phone", e.target.value)}
                autoComplete="tel"
              />
              {fieldError(0, detailsErrors.phone)}
            </div>
          </div>

          <hr className="registration-form-divider" />

          <div className="registration-form-row">
            <div className="registration-form-field">
              <label
                htmlFor="rf-player-first"
                className="registration-form-label"
              >
                Player first name*
              </label>
              <input
                id="rf-player-first"
                className="registration-form-input"
                value={draft.playerFirstName}
                onChange={(e) => set("playerFirstName", e.target.value)}
                autoComplete="off"
              />
              {fieldError(0, detailsErrors.playerFirstName)}
            </div>
            <div className="registration-form-field">
              <label
                htmlFor="rf-player-last"
                className="registration-form-label"
              >
                Player last name*
              </label>
              <input
                id="rf-player-last"
                className="registration-form-input"
                value={draft.playerLastName}
                onChange={(e) => set("playerLastName", e.target.value)}
                autoComplete="off"
              />
              {fieldError(0, detailsErrors.playerLastName)}
            </div>
          </div>

          <div className="registration-form-row">
            <div className="registration-form-field">
              <label htmlFor="rf-pathway" className="registration-form-label">
                Pathway*
              </label>
              <Select
                value={draft.gender ?? undefined}
                onValueChange={(value) =>
                  setDraft((p) => ({
                    ...p,
                    gender: (value as PlayerGender) || null,
                    priorLeagueLevel: "",
                  }))
                }
              >
                <SelectTrigger
                  id="rf-pathway"
                  className="registration-form-select"
                  aria-label="Pathway"
                >
                  <SelectValue placeholder="Select pathway…" />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldError(0, detailsErrors.gender)}
            </div>
            <div className="registration-form-field">
              <label htmlFor="rf-dob" className="registration-form-label">
                Player date of birth*
              </label>
              <input
                id="rf-dob"
                type="date"
                className="registration-form-input"
                value={draft.dob}
                onChange={(e) => set("dob", e.target.value)}
              />
              {fieldError(0, detailsErrors.dob)}
            </div>
          </div>

          <div className="registration-form-field">
            <label htmlFor="rf-league" className="registration-form-label">
              Prior league / level{" "}
              <span className="registration-form-optional">(optional)</span>
            </label>
            <Select
              value={draft.priorLeagueLevel || undefined}
              onValueChange={(value) => set("priorLeagueLevel", value || "")}
              disabled={!draft.gender}
            >
              <SelectTrigger
                id="rf-league"
                className="registration-form-select"
                aria-label="Prior league / level"
              >
                <SelectValue
                  placeholder={
                    draft.gender ? "Select level…" : "Choose a pathway first…"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {levelOptions.map((lvl) => (
                  <SelectItem key={lvl} value={lvl}>
                    {lvl}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error ? (
            <p className="registration-form-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="registration-form-actions">
            <button
              type="submit"
              className="registration-form-next"
              disabled={submitting}
            >
              <span>{submitting ? "Saving…" : "Save & continue"}</span>
              {!submitting ? (
                <Icon token="ri:arrow-right" aria-hidden="true" />
              ) : null}
            </button>
          </div>
        </form>
      ) : null}

      {/* Step 2 — Experience */}
      {step === 1 ? (
        <div className="registration-form-body">
          <div className="registration-form-field">
            <label htmlFor="rf-positions" className="registration-form-label">
              Positions played
            </label>
            <MultiCheckSelect
              id="rf-positions"
              ariaLabel="Positions played"
              placeholder="Select position(s)…"
              options={POSITIONS}
              value={draft.positions}
              onChange={(next) => set("positions", next)}
            />
            {fieldError(1, experienceErrors.positions)}
          </div>

          <div className="registration-form-row">
            <div className="registration-form-field">
              <label htmlFor="rf-club" className="registration-form-label">
                Prior club team{" "}
                <span className="registration-form-optional">(optional)</span>
              </label>
              <input
                id="rf-club"
                className="registration-form-input"
                value={draft.priorClub}
                onChange={(e) => set("priorClub", e.target.value)}
              />
            </div>
            <div className="registration-form-field">
              <label htmlFor="rf-coach" className="registration-form-label">
                Prior coach name{" "}
                <span className="registration-form-optional">(optional)</span>
              </label>
              <input
                id="rf-coach"
                className="registration-form-input"
                value={draft.priorCoach}
                onChange={(e) => set("priorCoach", e.target.value)}
              />
            </div>
          </div>

          <div className="registration-form-field">
            <label htmlFor="rf-school" className="registration-form-label">
              School{" "}
              <span className="registration-form-optional">(optional)</span>
            </label>
            <input
              id="rf-school"
              className="registration-form-input"
              value={draft.school}
              onChange={(e) => set("school", e.target.value)}
            />
          </div>

          <div className="registration-form-field">
            <label htmlFor="rf-referral" className="registration-form-label">
              Where did you hear about tryouts?{" "}
              <span className="registration-form-optional">(optional)</span>
            </label>
            <Select
              value={draft.referral || undefined}
              onValueChange={(value) => set("referral", value || "")}
            >
              <SelectTrigger
                id="rf-referral"
                className="registration-form-select"
                aria-label="Where did you hear about tryouts?"
              >
                <SelectValue placeholder="Select one…" />
              </SelectTrigger>
              <SelectContent>
                {REFERRAL_SOURCES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <label className="registration-form-toggle">
            <Checkbox
              checked={draft.additionalPlayers}
              onCheckedChange={(c) => set("additionalPlayers", c === true)}
            />
            <span className="registration-form-toggle-text">
              I have additional players to register
              <span className="registration-form-toggle-hint">
                No need to re-submit — your coach will collect their details
                when they reach out.
              </span>
            </span>
          </label>

          {error ? (
            <p className="registration-form-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="registration-form-actions">
            <button
              type="button"
              className="registration-form-back"
              onClick={() => setStep(0)}
            >
              <Icon token="ri:arrow-left" aria-hidden="true" />
              <span> Back</span>
            </button>
            <button
              type="button"
              className="registration-form-next registration-form-next-inline"
              onClick={finish}
              disabled={submitting}
            >
              <span>{submitting ? "Saving…" : "Submit registration"}</span>
              {!submitting ? (
                <Icon token="ri:arrow-right" aria-hidden="true" />
              ) : null}
            </button>
          </div>
        </div>
      ) : null}

      {/* Done */}
      {step === 2 ? (
        <div className="registration-form-body">
          <div className="registration-form-success">
            <span className="registration-form-success-icon" aria-hidden="true">
              ✓
            </span>
            <p className="registration-form-success-title">
              You&rsquo;re all set.
            </p>
            <p className="registration-form-success-text">
              A CVFC coach will reach out within 48 hours with next steps.
              {draft.additionalPlayers
                ? " They'll also collect details for your additional players then."
                : ""}{" "}
              Thanks for choosing Chula Vista FC.
            </p>
          </div>
          {variant === "modal" && onClose ? (
            <div className="registration-form-actions">
              <button
                type="button"
                className="registration-form-next"
                onClick={onClose}
              >
                <span>Done</span>
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {variant === "modal" && onClose && step < 2 ? (
        <footer className="registration-form-footer">
          <button
            type="button"
            className="registration-form-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
        </footer>
      ) : null}
    </div>
  );
}
