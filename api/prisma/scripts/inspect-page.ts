/**
 * Inspect a page's current content — list every block type so we can tell
 * whether the UI is rendering correctly or mis-typing blocks at insert.
 *
 * Usage: npx tsx prisma/scripts/inspect-page.ts <pageId>
 */
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

interface Section {
  _key?: string;
  _type?: string;
  containers?: Container[];
}
interface Container {
  _key?: string;
  _type?: string;
  blocks?: BlockNode[];
}
interface BlockNode {
  _key?: string;
  _type?: string;
  data?: { blocks?: BlockNode[] };
}

function walk(blocks: BlockNode[] | undefined, depth: number, prefix: string) {
  if (!Array.isArray(blocks)) return;
  for (const b of blocks) {
    console.log(
      `${"  ".repeat(depth)}${prefix}${b._type ?? "<?>"}  key=${b._key ?? "?"}`,
    );
    if (b.data?.blocks) walk(b.data.blocks, depth + 1, "↳ ");
  }
}

async function main() {
  const pageId = process.argv[2];
  if (!pageId) {
    console.error("Usage: tsx inspect-page.ts <pageId>");
    process.exit(1);
  }
  const page = await prisma.page.findUnique({
    where: { id: pageId },
    select: { title: true, slug: true, content: true, updatedAt: true },
  });
  if (!page) {
    console.error("not found");
    process.exit(1);
  }
  console.log(`\n${page.title} (${page.slug})`);
  console.log(`updatedAt: ${page.updatedAt.toISOString()}\n`);

  const sections = (page.content as { sections?: Section[] } | null)
    ?.sections;
  if (!Array.isArray(sections) || sections.length === 0) {
    console.log("(no sections)");
    return;
  }

  for (const [si, s] of sections.entries()) {
    console.log(`section[${si}]  key=${s._key ?? "?"}`);
    for (const [ci, c] of (s.containers ?? []).entries()) {
      console.log(`  container[${ci}]  key=${c._key ?? "?"}`);
      walk(c.blocks, 2, "");
    }
  }
  console.log("");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
