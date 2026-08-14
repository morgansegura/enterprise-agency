# Coach notifications — how a coach finds out about a new player

When a family signs up on the website the parent gets a thank-you email and the
player lands on the Monday board with no coach. Nobody else is emailed yet.
A coach hears from us at exactly one moment: **when someone assigns them the
player on the board.**

## The flow

1. **Parent submits the form.** The site creates one row per player on the
   **CVFC Signups** board — parent contact, player details, experience — and
   emails the parent a thank-you. No coach email goes out.
2. **Isella (or whoever is staffing) assigns a coach** by picking a name in the
   `Coach` column, which is linked to the **CVFC — Coaches** board.
3. **Monday tells the site** through a webhook, and the site emails that coach
   with the player's details and the parent's contact info.

The club-admin email list is no longer used, and no coach is ever emailed on a
guess — the assignment is the instruction.

## How the site knows who to email

The `Coach` column is a **connect-boards** column: picking a name links the
signup row to that coach's row on CVFC — Coaches. `Coach Email` is a **mirror**
of that linked coach's Email, which makes it read-only.

From the linked coach the site takes the email address, in this order:

1. the `Coach Email` mirror on the row,
2. failing that, the linked coach's row on the Coaches board, read by id,
3. failing that, a lookup by coach name.

For a coach to be reachable, their row on **CVFC — Coaches** must have an
**Email**. That's the only requirement.

> **Note for future work:** both columns being relation/mirror is why nothing
> can be written to them by the site. Any future automation has to assign the
> _relation_ (by coach item id), not write a name or an address as text.

## What stops duplicate emails

The Signups board needs a plain **text column named `Coach Notified`**. The site
writes the coach's address there each time it sends, and checks it before
sending:

- Column already holds this coach's address → **skip**, they've been told.
- Column is empty or holds a different address → **send**, then update it.

Without that column the code still runs, but the guard is inert and repeated
edits to the Coach column can email the same coach more than once.
**Add the column.**

## Setup

### 1. Add the `Coach Notified` column

On CVFC Signups, add a **Text** column named exactly `Coach Notified`. Nobody
fills it in by hand — the site maintains it. Hide it from the default view if
it's noisy.

### 2. Set the environment variables

In the cvfc project on Vercel:

| Variable                | What it's for                                                                                                                                      |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MONDAY_WEBHOOK_SECRET` | Any long random string. Monday sends it back so the site knows the request is genuine.                                                             |
| `MONDAY_API_KEY`        | Already set — reads the boards and writes `Coach Notified`.                                                                                        |
| `RESEND_API_KEY`        | Already set — sends the email.                                                                                                                     |
| `RESEND_FROM`           | Sender address. Until chulavistafc.com is verified in Resend this falls back to a Resend test address that **only delivers to the account owner**. |

Redeploy after adding `MONDAY_WEBHOOK_SECRET` so the running app picks it up.

### 3. Register the webhook in Monday

On the **CVFC Signups** board: Integrate → Webhooks → Add webhook.

- **URL:** `https://<the live site>/api/monday/coach-assigned?secret=<MONDAY_WEBHOOK_SECRET>`
- **Event:** _When a column value changes_
- **Column:** Coach

Monday verifies the URL by sending a one-time challenge, which the site echoes
back automatically. If verification fails, the site isn't deployed yet or the
URL is wrong — the secret isn't checked during the handshake, so a failed
verification is never a secret problem.

## Checking it works

1. Submit a test signup on the live site. The parent address should get the
   thank-you; no coach should be emailed.
2. On the board, assign a coach to that row. That coach gets the email within
   a few seconds.
3. Change the row to a different coach. The new coach is emailed; the previous
   one isn't told anything.

## When something goes wrong

Everything logs to the Vercel runtime logs as structured JSON. Filter on
`scope`: `signup` for the form submission, `coach-assigned` for the webhook.

| What you see                                | What it means                                                                             |
| ------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `parent thanked, awaiting coach assignment` | Normal. The row is on the board waiting for someone to assign a coach.                    |
| `no email for assigned coach`               | The assigned coach's row on CVFC — Coaches has no Email.                                  |
| `rejected unauthenticated webhook`          | The secret in the Monday webhook URL doesn't match `MONDAY_WEBHOOK_SECRET`.               |
| `skipped: already notified`                 | The guard worked — that coach had already been emailed for this player.                   |
| `skipped: no coach assigned`                | The Coach column was cleared rather than set.                                             |
| `coach notification failed`                 | Resend rejected the send. Check `RESEND_FROM` is a verified domain.                       |
| Nothing logged when a coach is assigned     | The webhook isn't registered, or points at a preview deployment instead of the live site. |

## What is not wired up

- Adding a coach to **CVFC — Coaches** sends nothing. That board is the roster
  the assignment picks from.
- Clearing the Coach column sends nothing.
- The previous coach isn't told when a player is reassigned away from them.
- Reassigning a player back to a coach who was already notified emails them
  again, because the guard only remembers the most recent recipient.
- **Automatic assignment by gender, age group and level is not built.** It's the
  eventual goal; today every assignment is a human decision. The Coaches board
  already carries Gender Coached, birth-year range and position, but has no
  Level field yet.
