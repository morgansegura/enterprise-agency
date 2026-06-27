import "server-only";

/**
 * Monday client for CVFC Signups. ONE flat row per player (item name = the
 * child's name); parent contact, player profile, experience, and the matched
 * coach all live on that row. A per-session Submission Token dedupes Back→Save.
 * Server-only — uses the non-public MONDAY_API_KEY.
 */

const API = "https://api.monday.com/v2";
const SIGNUPS_BOARD = process.env.MONDAY_SIGNUPS_BOARD_ID ?? "18414196382";
const COACHES_BOARD = process.env.MONDAY_COACHES_BOARD_ID ?? "18419262953";

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

async function columnMap(boardId: string): Promise<ColMap> {
  const data = await mondayGql<{
    boards: { columns: { id: string; title: string; type: string }[] }[];
  }>(`query ($id: [ID!]) { boards(ids: $id) { columns { id title type } } }`, {
    id: [boardId],
  });
  const map: ColMap = {};
  for (const c of data.boards[0]?.columns ?? []) {
    map[c.title] = { id: c.id, type: c.type };
  }
  return map;
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

// What we know at step 1 (drives the row + coach match + emails).
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

// ── Coach matching ────────────────────────────────────────────────────────
type Coach = {
  name: string;
  email: string;
  gender: string; // Boys | Girls | Both
  from: number;
  to: number;
  position: string; // Field | Goalkeeper | Any
  status: string; // Active | Inactive
};

async function getCoaches(): Promise<Coach[]> {
  const rows = await boardRows(COACHES_BOARD);
  return rows.map(({ v }) => ({
    name: v["Name"] ?? "",
    email: v["Email"] ?? "",
    gender: v["Gender Coached"] ?? "",
    from: Number(v["Coaches Birth Years (From)"]) || 0,
    to: Number(v["Coaches Birth Years (To)"]) || 0,
    position: v["Position Coached"] ?? "",
    status: v["Status"] ?? "",
  }));
}

/** Match a player to a coach by gender + birth year (+ Field/GK when known).
 *  Prefers exact gender, exact position, and the tightest birth-year coverage. */
export async function matchCoach(
  genderLabel: "Boys" | "Girls",
  birthYear: number,
  isGoalkeeper: boolean,
): Promise<CoachMatch | null> {
  const coaches = await getCoaches();
  const candidates = coaches.filter(
    (c) =>
      c.status === "Active" &&
      c.email &&
      (c.gender === genderLabel || c.gender === "Both") &&
      birthYear >= c.from &&
      birthYear <= c.to &&
      (isGoalkeeper
        ? c.position === "Goalkeeper" || c.position === "Any"
        : c.position === "Field" || c.position === "Any"),
  );
  if (candidates.length === 0) return null;
  const score = (c: Coach) =>
    (c.gender === genderLabel ? 2 : 0) +
    (c.position !== "Any" ? 1 : 0) +
    1 / (c.to - c.from + 1);
  candidates.sort((a, b) => score(b) - score(a));
  return { name: candidates[0].name, email: candidates[0].email };
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

/** Step 1: create-or-update the player's Signups row (deduped by token) with
 *  parent + player core + the matched coach. Returns whether it was newly
 *  created (so callers email only once). */
export async function upsertSignup(args: {
  token: string;
  parent: ParentInput;
  player: PlayerCore;
  coach: CoachMatch | null;
}): Promise<{ signupId: string; created: boolean }> {
  const { token, parent, player, coach } = args;
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
    Coach: coach?.name,
    "Coach Email": coach?.email,
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
