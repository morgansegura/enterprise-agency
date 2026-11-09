# Younger-player tryouts (U7–U9)

The U7–U9 tryouts have their own page, form and Monday board, separate from
evaluations and CVFC Signups.

## Where families find it

- **`/tryouts`**: the dates, the signup form, and the age groups.
- **The homepage**: a Girls card and a Boys card just under the hero.
- **The girls and boys pathway pages**: that pathway's card, under the hero.

Every card links to the form with Girls or Boys already chosen, and each birth
year on a card opens it with that year filled in too
(`/tryouts?player=girls&born=2019`). The full date of birth still decides the
age group, so a wrong click can't put a player in the wrong one.

Each card comes off the homepage and pathway pages once its signups close. When
both have closed, the form on `/tryouts` gives way to a link to evaluations.

## Setting up a season

Everything about a season lives in `lib/tryouts.ts` (`TRYOUT_SEASON`):

| Field       | What it is                                                                                   |
| ----------- | -------------------------------------------------------------------------------------------- |
| `live`      | The switch. `false` takes every card, the form and the dates down at once                    |
| `opens`     | The first day the cards and form show                                                        |
| `label`     | "December 2026": shown on the page and saved on the board                                    |
| `group`     | The Monday group signups land in, made the first time it's needed                            |
| `location`  | Where tryouts are held: name, address and a map link                                         |
| `sessions`  | The girls and boys tryouts, each with one or more days and their 24-hour start and end times |
| `ageGroups` | U7, U8 and U9, each with its August 1 – July 31 birth range                                  |

Signups for each tryout close by themselves the day before its first day, and
its card comes down with them.

## Between seasons

Nothing needs removing. Once both tryouts have passed, the cards are gone from
the homepage and pathway pages, and `/tryouts` stays up with a line saying the
next dates are posted there, and a link to evaluations. The age groups and
search data come down with the cards, since last season's would mislead.

To take everything down early, set `live: false`. Next year, put in the new
dates, `opens` and age groups, and it all goes back up on the `opens` day.

Next season is new values here, then a deploy.

## What happens when a family signs up

1. **The parent submits the form.** The site makes one row on **CVFC Tryouts
   (U7–U9)** in the season's group, with the age group and tryout filled in, and
   emails the parent the date, time and place.
2. **Someone assigns a coach** in the `Coach` column.
3. **Monday tells the site** through the same webhook as Signups, and the site
   emails that coach the player and the parent's contact details. The
   `Coach Notified` column stops a second email for the same coach, as on
   Signups (see `coach-notifications.md`).

## The board

Made by `scripts/setup-monday-tryouts.mjs` (run with `--apply`; without it, it
only prints what it would do). It's safe to run again: it adds only what's
missing.

The board is [CVFC Tryouts (U7–U9)](https://chulavistafc.monday.com/boards/18439154198)
(id `18439154198`, the site's default; `MONDAY_TRYOUTS_BOARD_ID` overrides it).

After it runs:

1. Add the **Coach** column by hand: a Connect boards column named `Coach`,
   linked to **CVFC — Coaches**, one coach per row. Monday's API can't create
   this column type.
2. On the board, add a webhook for "when a column changes" on `Coach`, to the
   same URL as Signups: `https://<host>/api/monday/coach-assigned?secret=…`.
3. Optional: set `TRYOUTS_REPLY_TO` so tryout emails reply to their own inbox.
   Without it they reply to the site's usual address.

One difference from Signups: there's no `Coach Email` mirror column, because
Monday's API can't create one. The site reads the coach's email from the
Coaches board instead, so nothing depends on it.
