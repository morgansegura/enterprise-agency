// Seeds a few FAKE coaches into the CVFC — Coaches board for testing the
// player→coach matching. All use morgansegura@gmail.com. Idempotent-ish: it
// skips coaches whose name already exists on the board.
// Run from apps/cvfc:  bun scripts/seed-monday-coaches.mjs
const TOKEN = process.env.MONDAY_API_KEY;
if (!TOKEN) {
  console.error("✗ MONDAY_API_KEY not set");
  process.exit(1);
}
const API = "https://api.monday.com/v2";
const BOARD_ID = "18419262953";
const EMAIL = "morgansegura@gmail.com";

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

// title -> { id, type } for the board's columns
const board = (
  await gql(
    `query ($id: [ID!]) { boards(ids: $id) { columns { id title type } items_page(limit: 200) { items { name } } } }`,
    { id: [BOARD_ID] },
  )
).boards[0];
const cols = {};
for (const c of board.columns) cols[c.title] = { id: c.id, type: c.type };
const existingNames = new Set(board.items_page.items.map((i) => i.name));

function values(fields) {
  const out = {};
  for (const [title, value] of Object.entries(fields)) {
    if (value === undefined || value === "") continue;
    const col = cols[title];
    if (!col) continue;
    switch (col.type) {
      case "email":
        out[col.id] = { email: EMAIL, text: EMAIL };
        break;
      case "phone":
        out[col.id] = {
          phone: String(value).replace(/\D/g, ""),
          countryShortName: "US",
        };
        break;
      case "status":
        out[col.id] = { label: String(value) };
        break;
      case "dropdown":
        out[col.id] = {
          labels: Array.isArray(value) ? value : [String(value)],
        };
        break;
      default:
        out[col.id] = String(value);
    }
  }
  return JSON.stringify(out);
}

// gender: Boys | Girls | Both · position: Field | Goalkeeper | Any
const COACHES = [
  {
    name: "Marco Reyes",
    phone: "6195550101",
    gender: "Boys",
    from: 2017,
    to: 2020,
    pathways: ["SoCal Flight"],
    position: "Field",
    teams: "U06–U09 Boys",
  },
  {
    name: "Andre Silva",
    phone: "6195550102",
    gender: "Boys",
    from: 2013,
    to: 2016,
    pathways: ["EA", "EA 2"],
    position: "Field",
    teams: "U10–U13 Boys",
  },
  {
    name: "Diego Navarro",
    phone: "6195550103",
    gender: "Boys",
    from: 2008,
    to: 2012,
    pathways: ["MLS NEXT", "EA"],
    position: "Field",
    teams: "U13–U19 Boys",
  },
  {
    name: "Sofia Mendez",
    phone: "6195550104",
    gender: "Girls",
    from: 2010,
    to: 2015,
    pathways: ["GA", "NPL"],
    position: "Field",
    teams: "U10–U15 Girls",
  },
  {
    name: "Liam Carter",
    phone: "6195550105",
    gender: "Both",
    from: 2007,
    to: 2020,
    pathways: ["Goalkeeper"],
    position: "Goalkeeper",
    teams: "All ages — Goalkeepers",
  },
  {
    name: "Hector Ramirez",
    phone: "6195550106",
    gender: "Boys",
    from: 2010,
    to: 2010,
    pathways: ["MLS NEXT"],
    position: "Field",
    teams: "2010 Boys — MLS NEXT Homegrown",
  },
];

const CREATE = `mutation ($b: ID!, $n: String!, $cv: JSON!) {
  create_item(board_id: $b, item_name: $n, column_values: $cv, create_labels_if_missing: true) { id }
}`;

for (const c of COACHES) {
  if (existingNames.has(c.name)) {
    console.log(`  = ${c.name} already exists, skipping`);
    continue;
  }
  const cv = values({
    Email: EMAIL,
    Phone: c.phone,
    "Gender Coached": c.gender,
    "Coaches Birth Years (From)": c.from,
    "Coaches Birth Years (To)": c.to,
    "Pathways Coached": c.pathways,
    "Position Coached": c.position,
    Teams: c.teams,
    Status: "Active",
  });
  try {
    await gql(CREATE, { b: BOARD_ID, n: c.name, cv });
    console.log(
      `  + ${c.name} (${c.gender}, ${c.from}–${c.to}, ${c.position})`,
    );
  } catch (e) {
    console.error(`  ! ${c.name} failed: ${e.message}`);
  }
}
console.log("Done.");
