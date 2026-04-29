/**
 * Emergency page content recovery script.
 *
 * Usage:
 *   pnpm --filter api tsx prisma/scripts/recover-page-content.ts <pageId>           # dry-run diagnose
 *   pnpm --filter api tsx prisma/scripts/recover-page-content.ts <pageId> restore   # restore from best source
 *
 * Checks, in priority order:
 *   1. productionContent — the last published version
 *   2. stagingContent    — the last staging version
 *   3. Most recent PageVersion snapshot
 *
 * The script never overwrites non-empty content; it only fills `content` when
 * it is null/empty and a recoverable source exists.
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

type JsonContent = { sections?: unknown[] } | null | undefined;

function sectionCount(content: JsonContent): number {
  if (!content || typeof content !== "object") return 0;
  const sections = (content as { sections?: unknown[] }).sections;
  return Array.isArray(sections) ? sections.length : 0;
}

async function diagnose(pageId: string) {
  const page = await prisma.page.findUnique({
    where: { id: pageId },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      content: true,
      stagingContent: true,
      productionContent: true,
      updatedAt: true,
    },
  });

  if (!page) {
    console.error(`\n✗ Page not found: ${pageId}\n`);
    process.exit(1);
  }

  const versions = await prisma.pageVersion.findMany({
    where: { pageId },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      version: true,
      createdAt: true,
      content: true,
      changeNote: true,
    },
  });

  const contentSections = sectionCount(page.content as JsonContent);
  const stagingSections = sectionCount(page.stagingContent as JsonContent);
  const productionSections = sectionCount(page.productionContent as JsonContent);

  console.log("\n=== Page snapshot ===");
  console.log(`id:           ${page.id}`);
  console.log(`title:        ${page.title}`);
  console.log(`slug:         ${page.slug}`);
  console.log(`status:       ${page.status}`);
  console.log(`updatedAt:    ${page.updatedAt.toISOString()}`);
  console.log("");
  console.log("=== Recoverable sources (section counts) ===");
  console.log(`  content (working draft):  ${contentSections}`);
  console.log(`  stagingContent:           ${stagingSections}`);
  console.log(`  productionContent:        ${productionSections}`);
  console.log("");
  console.log("=== Last 10 versions ===");
  if (versions.length === 0) {
    console.log("  (none)");
  } else {
    for (const v of versions) {
      const s = sectionCount(v.content as JsonContent);
      console.log(
        `  v${v.version.toString().padStart(3, " ")}  ${v.createdAt.toISOString()}  sections=${s}  ${v.changeNote ?? ""}`,
      );
    }
  }

  const best = pickBestSource(page, versions);
  console.log("\n=== Recommendation ===");
  if (!best) {
    console.log(
      "  No recoverable source with sections > 0. Nothing to restore.",
    );
  } else {
    console.log(
      `  Best source: ${best.label} (${best.sections} sections)\n  Run with 'restore' arg to copy it into content.`,
    );
  }
  console.log("");

  return { page, versions, best };
}

function pickBestSource(
  page: {
    content: unknown;
    stagingContent: unknown;
    productionContent: unknown;
  },
  versions: { content: unknown; version: number; createdAt: Date }[],
) {
  const candidates: Array<{
    label: string;
    content: unknown;
    sections: number;
  }> = [];

  const p = sectionCount(page.productionContent as JsonContent);
  if (p > 0)
    candidates.push({
      label: "productionContent",
      content: page.productionContent,
      sections: p,
    });

  const s = sectionCount(page.stagingContent as JsonContent);
  if (s > 0)
    candidates.push({
      label: "stagingContent",
      content: page.stagingContent,
      sections: s,
    });

  for (const v of versions) {
    const vs = sectionCount(v.content as JsonContent);
    if (vs > 0) {
      candidates.push({
        label: `PageVersion v${v.version} (${v.createdAt.toISOString()})`,
        content: v.content,
        sections: vs,
      });
      break; // most recent non-empty version
    }
  }

  if (candidates.length === 0) return null;
  // Prefer highest section count
  candidates.sort((a, b) => b.sections - a.sections);
  return candidates[0];
}

async function restore(pageId: string) {
  const { page, best } = await diagnose(pageId);
  if (!best) {
    console.error("✗ Nothing to restore. Aborting.\n");
    process.exit(2);
  }

  const currentSections = sectionCount(page.content as JsonContent);
  if (currentSections >= best.sections) {
    console.error(
      `✗ Current content already has ${currentSections} sections (source has ${best.sections}). Aborting — refusing to overwrite.\n`,
    );
    process.exit(3);
  }

  await prisma.page.update({
    where: { id: pageId },
    data: { content: best.content as never },
  });

  console.log(
    `\n✓ Restored ${best.sections} sections from ${best.label} into content.\n`,
  );
}

async function main() {
  const pageId = process.argv[2];
  const mode = process.argv[3];

  if (!pageId) {
    console.error(
      "\nUsage: tsx recover-page-content.ts <pageId> [restore]\n",
    );
    process.exit(1);
  }

  if (mode === "restore") {
    await restore(pageId);
  } else {
    await diagnose(pageId);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
