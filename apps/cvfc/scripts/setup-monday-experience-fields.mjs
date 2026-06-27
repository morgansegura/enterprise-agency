// Adds the director's Step 2/3 fields to the Subitems of CVFC Signups board:
// Date of Birth, Primary Position, Prior Club Team, Prior Coach Name,
// Prior League / Level, School, Referral Source.
// Run from apps/cvfc:  bun scripts/setup-monday-experience-fields.mjs
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
const POSITIONS = ["Goalkeeper", "Defender", "Midfielder", "Forward"];
const REFERRAL_SOURCES = [
  "A CVFC coach",
  "Friend or family",
  "Current CVFC player or family",
  "Social media",
  "Web search",
  "Flyer or event",
  "Other",
];

const dropdown = (labels) => ({
  settings: { labels: labels.map((name, i) => ({ id: i + 1, name })) },
});

const COLUMNS = [
  { title: "Date of Birth", type: "date" },
  {
    title: "Primary Position",
    type: "dropdown",
    defaults: dropdown(POSITIONS),
  },
  { title: "Prior Club Team", type: "text" },
  { title: "Prior Coach Name", type: "text" },
  { title: "Prior League / Level", type: "text" },
  { title: "School", type: "text" },
  {
    title: "Referral Source",
    type: "dropdown",
    defaults: dropdown(REFERRAL_SOURCES),
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
      d: col.defaults ? JSON.stringify(col.defaults) : undefined,
    });
    console.log(`  + ${col.title} (${col.type})`);
  } catch (e) {
    console.error(`  ! ${col.title} failed: ${e.message}`);
  }
}
console.log("Done.");
