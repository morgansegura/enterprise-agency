// Creates the "CVFC — Coaches" board + columns in Monday via the GraphQL API.
// Reads MONDAY_API_KEY from env (never printed). Run from apps/cvfc:
//   bun scripts/setup-monday-coaches.mjs
//
// Idempotency: Monday has no "create board if not exists", so running this twice
// makes two boards. Run once; if you need to re-run, delete the prior board first.

const TOKEN = process.env.MONDAY_API_KEY;
if (!TOKEN) {
  console.error(
    "✗ MONDAY_API_KEY is not set. Add it to apps/cvfc/.env.local and re-run.",
  );
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

// Columns that route a player → coach (Gender / Birth Year range / Pathway /
// Position), plus contact + admin fields. Status/dropdown columns ship with
// preset labels so the director can start filling immediately.
const COLUMNS = [
  { title: "Email", type: "email" },
  { title: "Phone", type: "phone" },
  {
    title: "Gender",
    type: "status",
    defaults: { labels: { 1: "Boys", 2: "Girls", 3: "Both" } },
  },
  { title: "Birth Year From", type: "numbers" },
  { title: "Birth Year To", type: "numbers" },
  {
    title: "Pathway",
    type: "dropdown",
    defaults: {
      settings: {
        labels: [
          { id: 1, name: "MLS NEXT" },
          { id: 2, name: "MLS NEXT 2" },
          { id: 3, name: "EA" },
          { id: 4, name: "EA 2" },
          { id: 5, name: "NPL" },
          { id: 6, name: "DPL" },
          { id: 7, name: "GA" },
          { id: 8, name: "SoCal Flight" },
          { id: 9, name: "Goalkeeper" },
        ],
      },
    },
  },
  {
    title: "Position",
    type: "status",
    defaults: { labels: { 1: "Field", 2: "Goalkeeper", 3: "Any" } },
  },
  { title: "Teams", type: "text" },
  {
    title: "Status",
    type: "status",
    defaults: { labels: { 1: "Active", 2: "Inactive" } },
  },
];

const CREATE_COLUMN = `mutation ($boardId: ID!, $title: String!, $type: ColumnType!, $defaults: JSON) {
  create_column(board_id: $boardId, title: $title, column_type: $type, defaults: $defaults) { id title }
}`;

async function createColumn(boardId, col) {
  try {
    const data = await gql(CREATE_COLUMN, {
      boardId,
      title: col.title,
      type: col.type,
      defaults: col.defaults ? JSON.stringify(col.defaults) : null,
    });
    console.log(`  + ${data.create_column.title} (${col.type})`);
  } catch (e) {
    // Fallback: create the column without preset labels so it still exists.
    try {
      await gql(CREATE_COLUMN, {
        boardId,
        title: col.title,
        type: col.type,
        defaults: null,
      });
      console.log(
        `  + ${col.title} (${col.type}) — created WITHOUT preset labels, add them in Monday (${e.message})`,
      );
    } catch (e2) {
      console.error(`  ! ${col.title} failed: ${e2.message}`);
    }
  }
}

async function main() {
  // create_board is blocked on this plan, so the board is made in the UI; we
  // find it by name (fuzzy: CVFC … Coaches) and add the columns via API.
  const data = await gql(`query { boards(limit: 500) { id name state } }`, {});
  const matches = (data.boards || []).filter(
    (b) => b.state === "active" && /cvfc.*coach/i.test(b.name),
  );
  if (matches.length === 0) {
    console.error(
      `✗ No active board matching "CVFC … Coaches" found.\n` +
        `  Create one in Monday (New board → from scratch → name it "CVFC — Coaches"), then re-run.`,
    );
    process.exit(1);
  }
  if (matches.length > 1) {
    console.error(
      `! Multiple matches: ${matches.map((b) => `"${b.name}" (${b.id})`).join(", ")}.\n` +
        `  Rename so only one matches, then re-run.`,
    );
    process.exit(1);
  }
  const boardId = matches[0].id;
  console.log(
    `✓ Found board "${matches[0].name}" (id ${boardId}) — adding columns:`,
  );

  for (const col of COLUMNS) {
    await createColumn(boardId, col);
  }

  console.log(
    `\nDone. Save this for the form's routing:\n  MONDAY_COACHES_BOARD_ID=${boardId}`,
  );
}

main().catch((e) => {
  console.error("✗ Setup failed:", e.message);
  process.exit(1);
});
