# Coach notifications — how a coach finds out about a new player

When a family signs up on the website, exactly one coach gets an email with the
player's details and the parent's contact info. This document covers how that
works, how to set it up, and how to check it when something looks wrong.

## The short version

A coach is emailed **when they are assigned to a player** — whether the system
matched them automatically at signup, or Isella assigned them by hand on the
Monday board afterwards.

The club-admin email list is no longer used. Coaches hear directly.

## The two paths

**1. Automatic match at signup.** When a family submits the form, the site looks
at the CVFC — Coaches board and finds a coach whose Gender Coached and birth-year
range fit the player (and Field vs Goalkeeper when known). If there's a match,
the site writes the coach onto the Signups row and emails them right away.

**2. Manual assignment in Monday.** Plenty of players don't match anyone — those
rows land on the board with an empty Coach column. When Isella fills the Coach
column in (or changes an existing one), Monday notifies the site through a
webhook, and the site emails whoever she picked.

Either way the coach gets the same email, built from the site's own template —
player name, birth year and month, gender, goalkeeper flag, prior league, and
the parent's name, email, and phone.

## What stops duplicate emails

The Signups board needs a plain **text column named `Coach Notified`**. The site
writes the coach's email address there every time it sends. Before sending, it
checks that column:

- Column already holds this coach's address → **skip**, they've been told.
- Column is empty or holds a different address → **send**, and update it.

Without that column the code still runs, but the guard is disabled and a player
can generate two emails. **Add the column.**

## Setup

### 1. Add the `Coach Notified` column

On the CVFC Signups board, add a **Text** column named exactly `Coach Notified`.
Nobody needs to fill it in by hand — the site maintains it. Hide it from the
default view if it's noisy.

### 2. Set the environment variables

In the cvfc project on Vercel:

| Variable                | What it's for                                                                                                                                      |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MONDAY_WEBHOOK_SECRET` | Any long random string. Monday sends it back so the site knows the request is genuine.                                                             |
| `MONDAY_API_KEY`        | Already set — reads the boards and writes the columns.                                                                                             |
| `RESEND_API_KEY`        | Already set — sends the email.                                                                                                                     |
| `RESEND_FROM`           | Sender address. Until chulavistafc.com is verified in Resend this falls back to a Resend test address that **only delivers to the account owner**. |

Redeploy after adding `MONDAY_WEBHOOK_SECRET` so the running app picks it up.

### 3. Register the webhook in Monday

On the **CVFC Signups** board: Integrate → Webhooks → Add webhook.

- **URL:** `https://<the live site>/api/monday/coach-assigned?secret=<MONDAY_WEBHOOK_SECRET>`
- **Event:** _When a column value changes_
- **Column:** Coach

Monday verifies the URL by sending a one-time challenge, which the site echoes
back automatically. If Monday says the URL couldn't be verified, the site is
either not deployed yet or the URL is wrong — the secret is not checked during
the handshake, so a verification failure is never a secret problem.

## Checking it works

1. Submit a test signup on the live site with a birth year you know a coach
   covers. That coach should receive the email within a few seconds.
2. On the board, find a row with an empty Coach column and assign a coach.
   That coach should receive the email.
3. Change that same row to a different coach. The new coach gets the email; the
   previous one isn't told anything.

## When something goes wrong

Every step logs to the Vercel runtime logs as structured JSON. Filter on
`scope` — `signup` for path 1, `coach-assigned` for path 2.

| What you see                                   | What it means                                                                                                                                         |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `no coach matched, awaiting manual assignment` | Normal. No coach on the Coaches board covers that gender and birth year, so the row is waiting for Isella.                                            |
| `no email for assigned coach`                  | The coach was assigned but has no address — either the Coach Email column is empty on the row, or that coach's row on the Coaches board has no Email. |
| `rejected unauthenticated webhook`             | The secret in the Monday webhook URL doesn't match `MONDAY_WEBHOOK_SECRET`.                                                                           |
| `skipped: already notified`                    | The guard worked — that coach had already been emailed for this player.                                                                               |
| `coach notification failed`                    | Resend rejected the send. Check `RESEND_FROM` is a verified domain.                                                                                   |
| Nothing logged at all when Isella assigns      | The webhook isn't registered, or it's pointed at a preview deployment instead of the live site.                                                       |

A coach's own row on the CVFC — Coaches board must have **Status = Active** and
an **Email** to be auto-matched. Inactive coaches are skipped entirely.

## What is not wired up

- Adding a coach to the **CVFC — Coaches** board sends nothing. That board is a
  reference list; emails only follow assignment to a player.
- Clearing a Coach column sends nothing.
- The previous coach is not told when a player is reassigned away from them.
