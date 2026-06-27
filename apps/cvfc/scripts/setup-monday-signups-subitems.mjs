// Sets up the player-as-subitem model on CVFC Signups:
//  - Parent stays the main item (Parent Name/Email/Phone)
//  - Each player is a subitem with their own fields + a LINK to the matched coach
// Adds columns to the "Subitems of CVFC Signups" board.
// Run from apps/cvfc:  bun scripts/setup-monday-signups-subitems.mjs
const TOKEN = process.env.MONDAY_API_KEY;
if (!TOKEN) {
  console.error("✗ MONDAY_API_KEY not set");
  process.exit(1);
}
const API = "https://api.monday.com/v2";
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

const SUBITEMS_BOARD = "18414203458"; // Subitems of CVFC Signups
const COACHES_BOARD = 18419262953; // CVFC — Coaches
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

// Skip any column already on the subitems board (idempotent re-runs).
const existing = (
  await gql(`query ($id: [ID!]) { boards(ids: $id) { columns { title } } }`, {
    id: [SUBITEMS_BOARD],
  })
).boards[0].columns.map((c) => c.title.toLowerCase());

const COLUMNS = [
  { title: "Player Birth Year", type: "numbers" },
  {
    title: "Player Birth Month",
    type: "dropdown",
    defaults: {
      settings: { labels: MONTHS.map((m, i) => ({ id: i + 1, name: m })) },
    },
  },
  {
    title: "Gender",
    type: "status",
    defaults: { labels: { 1: "Boys", 2: "Girls" } },
  },
  {
    title: "Position",
    type: "status",
    defaults: { labels: { 1: "Field", 2: "Goalkeeper" } },
  },
  // The association: links each player-subitem to a coach in CVFC — Coaches.
  {
    title: "Coach",
    type: "board_relation",
    defaults: { boardIds: [COACHES_BOARD] },
  },
];

const CREATE = `mutation ($b: ID!, $t: String!, $type: ColumnType!, $d: JSON) {
  create_column(board_id: $b, title: $t, column_type: $type, defaults: $d) { id title }
}`;

for (const col of COLUMNS) {
  if (existing.includes(col.title.toLowerCase())) {
    console.log(`  = ${col.title} already exists, skipping`);
    continue;
  }
  try {
    await gql(CREATE, {
      b: SUBITEMS_BOARD,
      t: col.title,
      type: col.type,
      d: col.defaults ? JSON.stringify(col.defaults) : null,
    });
    console.log(`  + ${col.title} (${col.type})`);
  } catch (e) {
    try {
      await gql(CREATE, {
        b: SUBITEMS_BOARD,
        t: col.title,
        type: col.type,
        d: null,
      });
      console.log(
        `  + ${col.title} (${col.type}) — created WITHOUT preset (${e.message})`,
      );
    } catch (e2) {
      console.error(`  ! ${col.title} failed: ${e2.message}`);
    }
  }
}
console.log("Done.");
