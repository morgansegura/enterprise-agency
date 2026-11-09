"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";
import { Icon } from "@/components/icon";
import { saveTryout } from "@/lib/actions/tryouts";
import { trackEvent } from "@/lib/analytics";
import { REFERRAL_SOURCES } from "@/lib/registration-options";
import {
  PLAYER_LABELS,
  TRYOUT_EXPERIENCE,
  TRYOUT_SEASON,
  ageGroupFor,
  birthRange,
  birthYears,
  sessionFor,
  shortDay,
  tryoutOpen,
  type TryoutPlayer,
} from "@/lib/tryouts";

// The same look as the evaluations form; this file adds only what's new.
import "../registration-form/registration-form.css";
import "./tryouts-form.css";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const PLAYERS: TryoutPlayer[] = ["boys", "girls"];

type Draft = {
  parentFirstName: string;
  parentLastName: string;
  email: string;
  phone: string;
  playerFirstName: string;
  playerLastName: string;
  player: TryoutPlayer | null;
  month: string; // "1"–"12"
  day: string;
  year: string;
  experience: string;
  referral: string;
  notes: string;
};

const isEmail = (v: string) => /.+@.+\..+/.test(v.trim());
const isPhone = (v: string) => v.replace(/\D/g, "").length >= 10;
const daysIn = (month: string, year: string) =>
  month ? new Date(Number(year) || 2020, Number(month), 0).getDate() : 31;
const pad = (n: string) => n.padStart(2, "0");

/** YYYY-MM-DD once all three parts are chosen, else "". */
const dobOf = (d: Draft) =>
  d.year && d.month && d.day ? `${d.year}-${pad(d.month)}-${pad(d.day)}` : "";

const newToken = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/**
 * The younger-player (U7–U9) tryouts signup: one step, one player. A link can
 * choose the player and birth year (`/tryouts?player=girls&born=2019`), so a
 * parent who clicked "Girls · 2019" on the homepage finds both already set.
 * The age group comes from the full date of birth, never from the link.
 */
export function TryoutsForm({
  player = null,
  born = null,
  open = true,
}: {
  player?: TryoutPlayer | null;
  born?: number | null;
  /** False once signups close: the form gives way to a note. */
  open?: boolean;
}) {
  const [draft, setDraft] = React.useState<Draft>({
    parentFirstName: "",
    parentLastName: "",
    email: "",
    phone: "",
    playerFirstName: "",
    playerLastName: "",
    player,
    month: "",
    day: "",
    year: born ? String(born) : "",
    experience: "",
    referral: "",
    notes: "",
  });
  const [token, setToken] = React.useState(newToken);
  const [attempted, setAttempted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState<string | null>(null);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) =>
    setDraft((p) => ({ ...p, [k]: v }));

  const dob = dobOf(draft);
  const group = dob ? ageGroupFor(dob) : null;
  const session = draft.player ? sessionFor(draft.player) : null;

  const errors = {
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
    player: !draft.player
      ? "Required"
      : tryoutOpen(draft.player)
        ? ""
        : `Signups for the ${draft.player} tryout${sessionFor(draft.player)?.days.length === 1 ? " have" : "s have"} closed`,
    dob: !dob ? "Required" : group ? "" : "Outside U7–U9",
  };
  const invalid = Object.values(errors).some(Boolean);
  const fieldError = (msg: string) =>
    attempted && msg ? (
      <span className="registration-form-field-error">{msg}</span>
    ) : null;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAttempted(true);
    if (invalid || submitting || !draft.player) return;
    setSubmitting(true);
    setError(null);
    const res = await saveTryout(token, {
      parent: {
        firstName: draft.parentFirstName.trim(),
        lastName: draft.parentLastName.trim(),
        email: draft.email.trim(),
        phone: draft.phone.trim(),
      },
      player: {
        firstName: draft.playerFirstName.trim(),
        lastName: draft.playerLastName.trim(),
        gender: draft.player,
        dob,
        experience: draft.experience || undefined,
      },
      referral: draft.referral || undefined,
      notes: draft.notes.trim() || undefined,
    });
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    trackEvent("tryout_signup", {
      player_gender: draft.player,
      age_group: group?.label,
      referral_source: draft.referral || undefined,
    });
    setDone(draft.playerFirstName.trim());
  }

  /** Same parent, next child: keep the contact, clear the player. */
  function another() {
    setDraft((p) => ({
      ...p,
      playerFirstName: "",
      month: "",
      day: "",
      year: "",
      experience: "",
      notes: "",
    }));
    setToken(newToken());
    setAttempted(false);
    setDone(null);
  }

  return (
    <div
      className="registration-form tryouts-form"
      data-variant="page"
      data-clarity-mask="true"
    >
      <header className="registration-form-header">
        <p className="registration-form-eyebrow">
          <span className="registration-form-eyebrow-rule" aria-hidden="true" />
          U7–U9 Tryouts · {TRYOUT_SEASON.label}
        </p>
        <h3 className="registration-form-title">Sign up for tryouts</h3>
        <p className="registration-form-subtitle">
          For players born {birthRange()}. One player per signup.
        </p>
      </header>

      {!open ? (
        <div className="registration-form-body">
          <p className="registration-form-note">
            Signups for this season&rsquo;s tryouts have closed. You can still{" "}
            <a href="/evaluations" className="tryouts-form-link">
              request an evaluation
            </a>
            .
          </p>
        </div>
      ) : done ? (
        <div className="registration-form-body">
          <div className="registration-form-success">
            <span className="registration-form-success-icon" aria-hidden="true">
              ✓
            </span>
            <p className="registration-form-success-title">
              {done} is signed up.
            </p>
            <p className="registration-form-success-text">
              We&rsquo;ve emailed you the tryout details, and a CVFC coach will
              be in touch before tryouts.
            </p>
          </div>
          <div className="registration-form-actions">
            <button
              type="button"
              className="registration-form-secondary"
              onClick={another}
            >
              <Icon token="ri:plus" aria-hidden="true" />
              <span>Sign up another player</span>
            </button>
          </div>
        </div>
      ) : (
        <form className="registration-form-body" onSubmit={submit} noValidate>
          <div className="registration-form-row">
            <div className="registration-form-field">
              <label htmlFor="tf-player" className="registration-form-label">
                Pathway*
              </label>
              <Select
                value={draft.player ?? undefined}
                onValueChange={(v) => v && set("player", v as TryoutPlayer)}
              >
                <SelectTrigger
                  id="tf-player"
                  className="registration-form-select"
                  aria-label="Pathway"
                >
                  <SelectValue placeholder="Select pathway…" />
                </SelectTrigger>
                <SelectContent>
                  {PLAYERS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {PLAYER_LABELS[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldError(errors.player)}
            </div>
            <div className="registration-form-field">
              <label
                htmlFor="tf-experience"
                className="registration-form-label"
              >
                Experience{" "}
                <span className="registration-form-optional">(optional)</span>
              </label>
              <Select
                value={draft.experience || undefined}
                onValueChange={(v) => set("experience", v)}
              >
                <SelectTrigger
                  id="tf-experience"
                  className="registration-form-select"
                >
                  <SelectValue placeholder="Select one…" />
                </SelectTrigger>
                <SelectContent>
                  {TRYOUT_EXPERIENCE.map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="registration-form-row">
            <div className="registration-form-field">
              <label
                htmlFor="tf-player-first"
                className="registration-form-label"
              >
                Player first name*
              </label>
              <input
                id="tf-player-first"
                className="registration-form-input"
                value={draft.playerFirstName}
                onChange={(e) => set("playerFirstName", e.target.value)}
                autoComplete="off"
              />
              {fieldError(errors.playerFirstName)}
            </div>
            <div className="registration-form-field">
              <label
                htmlFor="tf-player-last"
                className="registration-form-label"
              >
                Player last name*
              </label>
              <input
                id="tf-player-last"
                className="registration-form-input"
                value={draft.playerLastName}
                onChange={(e) => set("playerLastName", e.target.value)}
                autoComplete="off"
              />
              {fieldError(errors.playerLastName)}
            </div>
          </div>

          <fieldset className="registration-form-field tryouts-form-dob">
            <legend className="registration-form-label">
              Player date of birth*
            </legend>
            <div className="tryouts-form-dob-parts">
              <Select
                value={draft.month || undefined}
                onValueChange={(v) => set("month", v)}
              >
                <SelectTrigger
                  className="registration-form-select"
                  aria-label="Birth month"
                >
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m, i) => (
                    <SelectItem key={m} value={String(i + 1)}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={draft.day || undefined}
                onValueChange={(v) => set("day", v)}
              >
                <SelectTrigger
                  className="registration-form-select"
                  aria-label="Birth day"
                >
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(
                    { length: daysIn(draft.month, draft.year) },
                    (_, i) => String(i + 1),
                  ).map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={draft.year || undefined}
                onValueChange={(v) => set("year", v)}
              >
                <SelectTrigger
                  className="registration-form-select"
                  aria-label="Birth year"
                >
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {birthYears().map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {dob && group ? (
              <p className="tryouts-form-placement" aria-live="polite">
                Plays in <strong>{group.label}</strong>
                {session
                  ? ` · ${PLAYER_LABELS[session.player]} tryout${session.days.length > 1 ? "s" : ""}: ${session.days.map((d) => shortDay(d.date)).join(" and ")}`
                  : ""}
              </p>
            ) : dob ? (
              <p className="registration-form-note" aria-live="polite">
                These tryouts are for players born {birthRange()}. For other
                ages,{" "}
                <a href="/evaluations" className="tryouts-form-link">
                  request an evaluation
                </a>
                .
              </p>
            ) : (
              fieldError(errors.dob)
            )}
          </fieldset>

          <hr className="registration-form-divider" />

          <div className="registration-form-row">
            <div className="registration-form-field">
              <label htmlFor="tf-first" className="registration-form-label">
                Parent first name*
              </label>
              <input
                id="tf-first"
                className="registration-form-input"
                value={draft.parentFirstName}
                onChange={(e) => set("parentFirstName", e.target.value)}
                autoComplete="given-name"
              />
              {fieldError(errors.parentFirstName)}
            </div>
            <div className="registration-form-field">
              <label htmlFor="tf-last" className="registration-form-label">
                Parent last name*
              </label>
              <input
                id="tf-last"
                className="registration-form-input"
                value={draft.parentLastName}
                onChange={(e) => set("parentLastName", e.target.value)}
                autoComplete="family-name"
              />
              {fieldError(errors.parentLastName)}
            </div>
          </div>

          <div className="registration-form-row">
            <div className="registration-form-field">
              <label htmlFor="tf-email" className="registration-form-label">
                Parent email*
              </label>
              <input
                id="tf-email"
                type="email"
                className="registration-form-input"
                value={draft.email}
                onChange={(e) => set("email", e.target.value)}
                autoComplete="email"
              />
              {fieldError(errors.email)}
            </div>
            <div className="registration-form-field">
              <label htmlFor="tf-phone" className="registration-form-label">
                Parent phone*
              </label>
              <input
                id="tf-phone"
                type="tel"
                className="registration-form-input"
                value={draft.phone}
                onChange={(e) => set("phone", e.target.value)}
                autoComplete="tel"
              />
              {fieldError(errors.phone)}
            </div>
          </div>

          <div className="registration-form-field">
            <label htmlFor="tf-referral" className="registration-form-label">
              Where did you hear about tryouts?{" "}
              <span className="registration-form-optional">(optional)</span>
            </label>
            <Select
              value={draft.referral || undefined}
              onValueChange={(v) => set("referral", v)}
            >
              <SelectTrigger
                id="tf-referral"
                className="registration-form-select"
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

          <div className="registration-form-field">
            <label htmlFor="tf-notes" className="registration-form-label">
              Anything we should know?{" "}
              <span className="registration-form-optional">(optional)</span>
            </label>
            <Textarea
              id="tf-notes"
              className="tryouts-form-notes"
              value={draft.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={3}
            />
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
              <span>{submitting ? "Signing up…" : "Sign up for tryouts"}</span>
              {!submitting ? (
                <Icon token="ri:arrow-right" aria-hidden="true" />
              ) : null}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
