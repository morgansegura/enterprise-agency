// Adds "Highest Level Played" + "Positions" dropdown columns to the Subitems of
// CVFC Signups board, matching the registration form's options.
// Run from apps/cvfc:  bun scripts/setup-monday-player-profile.mjs
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

const SUBITEMS_BOARD = "18414203458";
const LEVELS = [
  "MLS Next (Homegrown)",
  "Elite Club National League (ECNL)",
  "MLS Next (Academy)",
  "Elite Club Regional League (ECRL)",
  "Elite Academy",
  "SoCal Flight 1",
  "SoCal Flight 2",
  "SoCal Flight 3",
];
const POSITIONS = ["Goalkeeper", "Defender", "Midfielder", "Forward"];

const COLUMNS = [
  {
    title: "Highest Level Played",
    type: "dropdown",
    defaults: {
      settings: { labels: LEVELS.map((name, i) => ({ id: i + 1, name })) },
    },
  },
  {
    title: "Positions",
    type: "dropdown",
    defaults: {
      settings: { labels: POSITIONS.map((name, i) => ({ id: i + 1, name })) },
    },
  },
];

const existing = (
  await gql(`query ($id: [ID!]) { boards(ids: $id) { columns { title } } }`, {
    id: [SUBITEMS_BOARD],
  })
).boards[0].columns.map((c) => c.title.toLowerCase());

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
      d: JSON.stringify(col.defaults),
    });
    console.log(`  + ${col.title} (${col.type})`);
  } catch (e) {
    console.error(`  ! ${col.title} failed: ${e.message}`);
  }
}
console.log("Done.");
