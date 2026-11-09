// Creates the CVFC Tryouts board for the younger-player (U7–U9) tryouts,
// separate from CVFC Signups. One board for every season; each season is a
// group. Safe to re-run: existing columns and groups are left alone.
//
// Run from apps/cvfc:
//   bun scripts/setup-monday-tryouts.mjs            prints the plan, changes nothing
//   bun scripts/setup-monday-tryouts.mjs --apply    creates what's missing
//
// Prints the board id at the end: set MONDAY_TRYOUTS_BOARD_ID to it.
//
// One column is added by hand: "Coach", a Connect boards column linked to
// CVFC — Coaches. Monday's API can't create that column type.

const out = (line = "") => process.stdout.write(`${line}\n`);
const fail = (line) => {
  process.stderr.write(`${line}\n`);
  process.exit(1);
};

const TOKEN = process.env.MONDAY_API_KEY;
if (!TOKEN) fail("MONDAY_API_KEY is not set");

const APPLY = process.argv.includes("--apply");
const API = "https://api.monday.com/v2";
const WORKSPACE = "5875300"; // where CVFC Signups lives
const BOARD_NAME = "CVFC Tryouts (U7–U9)";
/** The first season's group. The site adds later seasons' groups itself. */
const FIRST_GROUP = "Tryouts · December 2026";

const status = (labels) =>
  JSON.stringify({
    labels: Object.fromEntries(labels.map((label, i) => [String(i), label])),
  });
const dropdown = (labels) =>
  JSON.stringify({ labels: labels.map((name, i) => ({ id: i + 1, name })) });

/** In board order. Titles are what lib/tryouts-board.ts writes to. */
const COLUMNS = [
  { title: "Season", type: "dropdown", defaults: dropdown(["December 2026"]) },
  { title: "Tryout", type: "dropdown" },
  { title: "Age Group", type: "status", defaults: status(["U7", "U8", "U9"]) },
  { title: "Gender", type: "status", defaults: status(["Boys", "Girls"]) },
  { title: "Date of Birth", type: "date" },
  { title: "Player Birth Year", type: "numbers" },
  { title: "Parent Name", type: "text" },
  { title: "Parent Email", type: "email" },
  { title: "Parent Phone", type: "phone" },
  {
    title: "Experience",
    type: "dropdown",
    defaults: dropdown(["New to soccer", "Recreational / AYSO", "Club team"]),
  },
  {
    title: "Referral Source",
    type: "dropdown",
    defaults: dropdown([
      "A CVFC coach",
      "Friend or family",
      "Current CVFC player or family",
      "Social media",
      "Web search",
      "Flyer or event",
      "Other",
    ]),
  },
  { title: "Parent Notes", type: "long_text" },
  {
    title: "Status",
    type: "status",
    defaults: status([
      "New",
      "Coach Assigned",
      "Attended",
      "No-show",
      "Offered a Spot",
      "Joined",
      "Not This Season",
    ]),
  },
  { title: "Coach Notified", type: "text" },
  { title: "Coach Assigned", type: "date" },
  { title: "Parent Submitted", type: "creation_log" },
  { title: "Comment/Notes", type: "long_text" },
  { title: "Submission Token", type: "text" },
];

async function gql(query, variables) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: TOKEN,
      "API-Version": "2024-01",
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

async function findBoard() {
  const data = await gql(
    `query ($ws: [ID]) { boards(workspace_ids: $ws, limit: 200) { id name } }`,
    { ws: [WORKSPACE] },
  );
  return data.boards.find((b) => b.name === BOARD_NAME) ?? null;
}

async function boardShape(id) {
  const data = await gql(
    `query ($id: [ID!]) { boards(ids: $id) { columns { id title } groups { id title } } }`,
    { id: [id] },
  );
  return data.boards[0];
}

out(APPLY ? "Applying." : "Plan only. Run with --apply to make these changes.");

let board = await findBoard();
if (board) {
  out(`= board "${BOARD_NAME}" exists (${board.id})`);
} else if (APPLY) {
  const data = await gql(
    `mutation ($n: String!, $ws: ID!) {
      create_board(board_name: $n, board_kind: share, workspace_id: $ws, empty: true) { id }
    }`,
    { n: BOARD_NAME, ws: WORKSPACE },
  );
  board = { id: data.create_board.id, name: BOARD_NAME };
  out(`+ board "${BOARD_NAME}" (${board.id})`);
} else {
  out(`+ board "${BOARD_NAME}" in workspace ${WORKSPACE}`);
}

const shape = board ? await boardShape(board.id) : { columns: [], groups: [] };
const have = new Set(shape.columns.map((c) => c.title.toLowerCase()));

// The item name is the player, as on CVFC Signups.
const nameColumn = shape.columns.find((c) => c.id === "name");
if (nameColumn?.title === "Player") {
  out(`  = "Player" exists`);
} else if (APPLY && nameColumn) {
  await gql(
    `mutation ($b: ID!, $c: String!, $t: String!) {
      change_column_title(board_id: $b, column_id: $c, title: $t) { id }
    }`,
    { b: board.id, c: "name", t: "Player" },
  );
  out(`  ~ "${nameColumn.title}" renamed "Player"`);
} else {
  out(`  ~ the item name column renamed "Player"`);
}

for (const col of COLUMNS) {
  if (have.has(col.title.toLowerCase())) {
    out(`  = "${col.title}" exists`);
    continue;
  }
  if (!APPLY) {
    out(`  + "${col.title}" (${col.type})`);
    continue;
  }
  try {
    await gql(
      `mutation ($b: ID!, $t: String!, $type: ColumnType!, $d: JSON) {
        create_column(board_id: $b, title: $t, column_type: $type, defaults: $d) { id }
      }`,
      { b: board.id, t: col.title, type: col.type, d: col.defaults ?? null },
    );
    out(`  + "${col.title}" (${col.type})`);
  } catch (e) {
    process.stderr.write(`  ! could not add "${col.title}": ${e.message}\n`);
  }
}

if (shape.groups.some((g) => g.title === FIRST_GROUP)) {
  out(`  = group "${FIRST_GROUP}" exists`);
} else if (APPLY) {
  // An empty board still starts with one placeholder group: rename it.
  const placeholder = shape.groups[0];
  if (placeholder) {
    await gql(
      `mutation ($b: ID!, $g: String!, $v: String!) {
        update_group(board_id: $b, group_id: $g, group_attribute: title, new_value: $v) { id }
      }`,
      { b: board.id, g: placeholder.id, v: FIRST_GROUP },
    );
  } else {
    await gql(
      `mutation ($b: ID!, $n: String!) { create_group(board_id: $b, group_name: $n) { id } }`,
      { b: board.id, n: FIRST_GROUP },
    );
  }
  out(`  + group "${FIRST_GROUP}"`);
} else {
  out(`  + group "${FIRST_GROUP}"`);
}

if (board) out(`\nMONDAY_TRYOUTS_BOARD_ID=${board.id}`);
