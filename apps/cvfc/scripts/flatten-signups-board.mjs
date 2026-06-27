// Restructure CVFC Signups to ONE flat row per player: add the player/experience
// columns onto the parent board and rename the item column to "Player".
// Run from apps/cvfc:  bun scripts/flatten-signups-board.mjs
const TOKEN = process.env.MONDAY_API_KEY;
if (!TOKEN) {
  console.error("✗ MONDAY_API_KEY not set");
  process.exit(1);
}
const API = "https://api.monday.com/v2";
const BOARD = "18414196382";
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
const POSITIONS = ["Goalkeeper", "Defender", "Midfielder", "Forward"];
const REFERRAL = [
  "A CVFC coach",
  "Friend or family",
  "Current CVFC player or family",
  "Social media",
  "Web search",
  "Flyer or event",
  "Other",
];
const dd = (labels) => ({
  settings: { labels: labels.map((name, i) => ({ id: i + 1, name })) },
});

const COLUMNS = [
  {
    title: "Gender",
    type: "status",
    defaults: { labels: { 1: "Boys", 2: "Girls" } },
  },
  { title: "Date of Birth", type: "date" },
  { title: "Player Birth Year", type: "numbers" },
  { title: "Player Birth Month", type: "dropdown", defaults: dd(MONTHS) },
  { title: "Positions", type: "dropdown", defaults: dd(POSITIONS) },
  {
    title: "Position",
    type: "status",
    defaults: { labels: { 1: "Field", 2: "Goalkeeper", 3: "Any" } },
  },
  { title: "Prior Club Team", type: "text" },
  { title: "Prior Coach Name", type: "text" },
  { title: "Prior League / Level", type: "text" },
  { title: "School", type: "text" },
  { title: "Referral Source", type: "dropdown", defaults: dd(REFERRAL) },
  { title: "Coach", type: "text" },
  { title: "Coach Email", type: "email" },
];

const board = (
  await gql(`query($id:[ID!]){boards(ids:$id){columns{id title type}}}`, {
    id: [BOARD],
  })
).boards[0];
const existing = board.columns.map((c) => c.title.toLowerCase());
const CREATE = `mutation($b:ID!,$t:String!,$type:ColumnType!,$d:JSON){create_column(board_id:$b,title:$t,column_type:$type,defaults:$d){id title}}`;
for (const col of COLUMNS) {
  if (existing.includes(col.title.toLowerCase())) {
    console.log(`  = ${col.title} exists`);
    continue;
  }
  try {
    await gql(CREATE, {
      b: BOARD,
      t: col.title,
      type: col.type,
      d: col.defaults ? JSON.stringify(col.defaults) : undefined,
    });
    console.log(`  + ${col.title} (${col.type})`);
  } catch (e) {
    console.error(`  ! ${col.title}: ${e.message}`);
  }
}
// item column → "Player"
const nameCol = board.columns.find((c) => c.type === "name");
if (nameCol) {
  await gql(
    `mutation($b:ID!,$c:String!,$t:String!){change_column_title(board_id:$b,column_id:$c,title:$t){id}}`,
    { b: BOARD, c: nameCol.id, t: "Player" },
  );
  console.log("  ~ item column → Player");
}
console.log("Done.");
