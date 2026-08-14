import "server-only";

/**
 * Monday client for CVFC Signups. ONE flat row per player (item name = the
 * child's name); parent contact, player profile and experience live on that
 * row. A per-session Submission Token dedupes Back→Save. The coach is assigned
 * by hand on the board, not written from here.
 * Server-only — uses the non-public MONDAY_API_KEY.
 */

const API = "https://api.monday.com/v2";
export const SIGNUPS_BOARD =
  process.env.MONDAY_SIGNUPS_BOARD_ID ?? "18414196382";
const COACHES_BOARD = process.env.MONDAY_COACHES_BOARD_ID ?? "18419262953";

/** Signups column titles the coach-notification flow depends on. */
export const COACH_COLUMN = "Coach";
export const COACH_EMAIL_COLUMN = "Coach Email";
/** Guard column: the coach address we last emailed for this player. Stops
 *  repeated edits to the Coach column from re-notifying, while a genuine
 *  reassignment still reaches the new coach. Optional — an absent column just
 *  disables the guard. */
export const COACH_NOTIFIED_COLUMN = "Coach Notified";
/** The email column on the CVFC — Coaches board. Note the apostrophe: it is
 *  NOT "Email", and reading the wrong title silently yields no address. */
const COACHES_EMAIL_COLUMN = "Coaches' Email";

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

type ColInfo = { id: string; type: string };
type ColMap = Record<string, ColInfo>;

async function mondayGql<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const token = process.env.MONDAY_API_KEY;
  if (!token) throw new Error("MONDAY_API_KEY is not set");
  const res = await fetch(API, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
      "API-Version": "2024-01",
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  const json = await res.json();
  if (json.errors)
    throw new Error(`Monday API: ${JSON.stringify(json.errors)}`);
  return json.data as T;
}

/** Board columns change rarely; cache per process so a request that needs the
 *  map more than once doesn't pay for it twice. Monday retries webhooks that
 *  take too long, and a retry can mean a duplicate email. */
const colMapCache = new Map<string, Promise<ColMap>>();

async function columnMap(boardId: string): Promise<ColMap> {
  const cached = colMapCache.get(boardId);
  if (cached) return cached;

  const pending = (async () => {
    const data = await mondayGql<{
      boards: { columns: { id: string; title: string; type: string }[] }[];
    }>(
      `query ($id: [ID!]) { boards(ids: $id) { columns { id title type } } }`,
      {
        id: [boardId],
      },
    );
    const map: ColMap = {};
    for (const c of data.boards[0]?.columns ?? []) {
      map[c.title] = { id: c.id, type: c.type };
    }
    return map;
  })();

  colMapCache.set(boardId, pending);
  try {
    return await pending;
  } catch (err) {
    colMapCache.delete(boardId); // don't cache a failure
    throw err;
  }
}

// Fetch every item on a board as a {columnTitle: text} record (+ id).
async function boardRows(
  boardId: string,
): Promise<{ id: string; v: Record<string, string> }[]> {
  const data = await mondayGql<{
    boards: {
      columns: { id: string; title: string }[];
      items_page: {
        items: {
          id: string;
          name: string;
          column_values: { id: string; text: string | null }[];
        }[];
      };
    }[];
  }>(
    `query ($id: [ID!]) {
      boards(ids: $id) {
        columns { id title }
        items_page(limit: 500) { items { id name column_values { id text } } }
      }
    }`,
    { id: [boardId] },
  );
  const board = data.boards[0];
  const titleById: Record<string, string> = {};
  for (const c of board?.columns ?? []) titleById[c.id] = c.title;
  return (board?.items_page.items ?? []).map((it) => {
    const v: Record<string, string> = { Name: it.name };
    for (const cv of it.column_values) v[titleById[cv.id]] = cv.text ?? "";
    return { id: it.id, v };
  });
}

// Format a {columnTitle: value} object into Monday's column_values keyed by id.
// The special "name" column (title "Player") sets the item title.
function buildValues(
  cols: ColMap,
  fields: Record<string, string | number | string[] | undefined>,
): string {
  const out: Record<string, unknown> = {};
  for (const [title, value] of Object.entries(fields)) {
    if (value === undefined || value === "") continue;
    if (Array.isArray(value) && value.length === 0) continue;
    const col = cols[title];
    if (!col) continue;
    if (col.type === "dropdown") {
      out[col.id] = { labels: Array.isArray(value) ? value : [String(value)] };
      continue;
    }
    const v = Array.isArray(value) ? value.join(", ") : String(value);
    switch (col.type) {
      case "email":
        out[col.id] = { email: v, text: v };
        break;
      case "phone":
        out[col.id] = { phone: v.replace(/\D/g, ""), countryShortName: "US" };
        break;
      case "status":
        out[col.id] = { label: v };
        break;
      case "date":
        out[col.id] = { date: v }; // expects YYYY-MM-DD
        break;
      default: // text, long_text, numbers, name
        out[col.id] = v;
    }
  }
  return JSON.stringify(out);
}

export type ParentInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

// What we know at step 1 (drives the row + the parent thank-you).
export type PlayerCore = {
  firstName: string;
  lastName: string;
  gender: "boys" | "girls";
  dob: string; // YYYY-MM-DD
  priorLeagueLevel?: string;
};

// What step 2 adds onto the same row.
export type ExperienceInput = {
  positions: string[];
  priorClub?: string;
  priorCoach?: string;
  school?: string;
  referral?: string;
};

export type CoachMatch = { name: string; email: string };

// ── Coach lookup ──────────────────────────────────────────────────────────
type Coach = { id: string; name: string; email: string };

async function getCoaches(): Promise<Coach[]> {
  const rows = await boardRows(COACHES_BOARD);
  return rows.map(({ id, v }) => ({
    id,
    name: v["Name"] ?? "",
    email: v[COACHES_EMAIL_COLUMN] ?? "",
  }));
}

/** Coach names carry stray whitespace on the board (e.g. "Eduardo\tRomo"). */
function normalizeName(value: string): string {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

// ── Signups (one flat row per player) ─────────────────────────────────────
async function findSignupByToken(token: string): Promise<string | null> {
  if (!token) return null;
  const rows = await boardRows(SIGNUPS_BOARD);
  for (const { id, v } of rows) {
    if ((v["Submission Token"] ?? "") === token) return id;
  }
  return null;
}

/**
 * Step 1: create-or-update the player's Signups row (deduped by token) with
 * parent + player core. Returns whether it was newly created.
 *
 * The row is deliberately created with no coach: "Coach" is a board_relation
 * and "Coach Email" is a read-only mirror, and a coach is chosen by hand on the
 * board. Assigning there is what triggers the coach's email, via
 * `app/api/monday/coach-assigned`.
 */
export async function upsertSignup(args: {
  token: string;
  parent: ParentInput;
  player: PlayerCore;
}): Promise<{ signupId: string; created: boolean }> {
  const { token, parent, player } = args;
  const cols = await columnMap(SIGNUPS_BOARD);
  const playerName = `${player.firstName} ${player.lastName}`.trim();
  const [year, month] = player.dob.split("-"); // YYYY-MM-DD
  const fields: Record<string, string | number | string[] | undefined> = {
    "Parent Name": `${parent.firstName} ${parent.lastName}`.trim(),
    "Parent Email": parent.email,
    "Parent Phone": parent.phone,
    Gender: player.gender === "boys" ? "Boys" : "Girls",
    "Date of Birth": player.dob,
    "Player Birth Year": Number(year),
    "Player Birth Month": MONTHS[Number(month) - 1],
    "Prior League / Level": player.priorLeagueLevel,
    "Submission Token": token,
    Status: "New",
  };

  const existing = await findSignupByToken(token);
  if (existing) {
    // Include "Player" so an edited child name updates the item title too.
    const values = buildValues(cols, { ...fields, Player: playerName });
    await mondayGql(
      `mutation ($b: ID!, $i: ID!, $cv: JSON!) {
        change_multiple_column_values(board_id: $b, item_id: $i, column_values: $cv) { id }
      }`,
      { b: SIGNUPS_BOARD, i: existing, cv: values },
    );
    return { signupId: existing, created: false };
  }

  const values = buildValues(cols, fields);
  const item = await mondayGql<{ create_item: { id: string } }>(
    `mutation ($b: ID!, $n: String!, $cv: JSON) {
      create_item(board_id: $b, item_name: $n, column_values: $cv, create_labels_if_missing: true) { id }
    }`,
    { b: SIGNUPS_BOARD, n: playerName, cv: values },
  );
  return { signupId: item.create_item.id, created: true };
}

// ── Coach notification (signup-time + Monday webhook) ─────────────────────

/** Resolve a Signups column id by title (null when the column doesn't exist). */
export async function signupColumnId(title: string): Promise<string | null> {
  const cols = await columnMap(SIGNUPS_BOARD);
  return cols[title]?.id ?? null;
}

export type SignupRow = {
  /** Every column as display text, keyed by column title. */
  values: Record<string, string>;
  /** The linked coach on the Coaches board, when one is assigned. */
  coachItemId: string | null;
  coachName: string;
  /** From the "Coach Email" mirror — may be empty; fall back to a lookup. */
  coachEmail: string;
};

/**
 * One Signups row, flattened to display text.
 *
 * "Coach" is a board_relation and "Coach Email" is a mirror — both return
 * `text: null` from the API, so they need inline fragments (`linked_items` and
 * `display_value`). Reading `text` alone silently yields empty values.
 */
export async function getSignupRow(itemId: string): Promise<SignupRow | null> {
  const data = await mondayGql<{
    boards: { columns: { id: string; title: string }[] }[];
    items: {
      id: string;
      name: string;
      column_values: {
        id: string;
        text: string | null;
        display_value?: string | null;
        linked_item_ids?: string[] | null;
        linked_items?: { id: string; name: string }[] | null;
      }[];
    }[];
  }>(
    `query ($b: [ID!], $i: [ID!]) {
      boards(ids: $b) { columns { id title } }
      items(ids: $i) {
        id
        name
        column_values {
          id
          text
          ... on MirrorValue { display_value }
          ... on BoardRelationValue { linked_item_ids linked_items { id name } }
        }
      }
    }`,
    { b: [SIGNUPS_BOARD], i: [itemId] },
  );

  const item = data.items?.[0];
  if (!item) return null;

  const titleById: Record<string, string> = {};
  for (const c of data.boards[0]?.columns ?? []) titleById[c.id] = c.title;

  const values: Record<string, string> = { Player: item.name };
  let coachItemId: string | null = null;

  for (const cv of item.column_values) {
    const title = titleById[cv.id];
    if (!title) continue;
    const linked = cv.linked_items ?? [];
    if (linked.length) {
      values[title] = linked.map((l) => l.name.replace(/\s+/g, " ")).join(", ");
      if (title === COACH_COLUMN) coachItemId = linked[0].id;
      continue;
    }
    values[title] = cv.display_value ?? cv.text ?? "";
  }

  return {
    values,
    coachItemId,
    coachName: values[COACH_COLUMN] ?? "",
    coachEmail: (values[COACH_EMAIL_COLUMN] ?? "").trim(),
  };
}

/** Read one coach straight off the Coaches board by item id. */
export async function getCoachByItemId(
  itemId: string,
): Promise<CoachMatch | null> {
  const hit = (await getCoaches()).find((c) => c.id === itemId);
  return hit?.email ? { name: hit.name.trim(), email: hit.email } : null;
}

/** Look a coach up on the Coaches board by name — the last-resort fallback
 *  when the mirror is empty and the relation gave us no item id. */
export async function findCoachByName(
  name: string,
): Promise<CoachMatch | null> {
  const wanted = normalizeName(name);
  if (!wanted) return null;
  const coaches = await getCoaches();
  const hit = coaches.find((c) => normalizeName(c.name) === wanted);
  return hit?.email ? { name: hit.name.trim(), email: hit.email } : null;
}

/** Stamp the guard column after a coach has been emailed. No-ops when the
 *  column isn't on the board. */
export async function markCoachNotified(
  itemId: string,
  email: string,
): Promise<void> {
  const cols = await columnMap(SIGNUPS_BOARD);
  if (!cols[COACH_NOTIFIED_COLUMN]) return;
  const values = buildValues(cols, { [COACH_NOTIFIED_COLUMN]: email });
  await mondayGql(
    `mutation ($b: ID!, $i: ID!, $cv: JSON!) {
      change_multiple_column_values(board_id: $b, item_id: $i, column_values: $cv) { id }
    }`,
    { b: SIGNUPS_BOARD, i: itemId, cv: values },
  );
}

/** Step 2: fill the experience columns onto the same row. */
export async function updateExperience(
  signupId: string,
  exp: ExperienceInput,
  additionalPlayers: boolean,
): Promise<void> {
  const cols = await columnMap(SIGNUPS_BOARD);
  const isGoalkeeper = exp.positions.includes("Goalkeeper");
  const values = buildValues(cols, {
    Positions: exp.positions,
    Position: isGoalkeeper ? "Goalkeeper" : "Field",
    "Prior Club Team": exp.priorClub,
    "Prior Coach Name": exp.priorCoach,
    School: exp.school,
    "Referral Source": exp.referral,
    "Additional Players": additionalPlayers ? "Yes" : "No",
  });
  await mondayGql(
    `mutation ($b: ID!, $i: ID!, $cv: JSON!) {
      change_multiple_column_values(board_id: $b, item_id: $i, column_values: $cv) { id }
    }`,
    { b: SIGNUPS_BOARD, i: signupId, cv: values },
  );
}
