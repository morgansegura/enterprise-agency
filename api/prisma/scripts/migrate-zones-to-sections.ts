/**
 * One-time migration — converts legacy zone-based Header/Footer layouts
 * into the new section-based model.
 *
 * Usage:
 *   pnpm --filter api tsx prisma/scripts/migrate-zones-to-sections.ts
 *
 * Strategy:
 * - For each Header where `sections` is empty but `zones` has content,
 *   build a single Section with one Container that flattens the left,
 *   center, and right zone blocks.
 * - For each Footer, do the same. Column-based layouts get one Container
 *   per column.
 *
 * Idempotent: re-running only touches records whose sections array is
 * still empty.
 */

import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

type ZoneBlock = {
  type?: string;
  _type?: string;
  config?: Record<string, unknown>;
  [key: string]: unknown;
};

type HeaderZones = {
  left?: { logo?: unknown; menuId?: string; blocks?: ZoneBlock[] };
  center?: { logo?: unknown; menuId?: string; blocks?: ZoneBlock[] };
  right?: { logo?: unknown; menuId?: string; blocks?: ZoneBlock[] };
};

function genKey(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function zoneToBlocks(
  zone: HeaderZones["left"],
): Array<Record<string, unknown>> {
  const blocks: Array<Record<string, unknown>> = [];
  if (!zone) return blocks;

  if (zone.logo && typeof zone.logo === "object") {
    blocks.push({
      _key: genKey("block"),
      _type: "logo-block",
      data: zone.logo as Record<string, unknown>,
    });
  }

  if (zone.menuId) {
    blocks.push({
      _key: genKey("block"),
      _type: "menu-block",
      data: { menuId: zone.menuId },
    });
  }

  if (Array.isArray(zone.blocks)) {
    for (const b of zone.blocks) {
      const type = (b.type || b._type || "") as string;
      blocks.push({
        _key: genKey("block"),
        _type: type.endsWith("-block") ? type : `${type}-block`,
        data: (b.config || b) as Record<string, unknown>,
      });
    }
  }

  return blocks;
}

function buildSectionFromZones(zones: HeaderZones) {
  const allBlocks = [
    ...zoneToBlocks(zones.left),
    ...zoneToBlocks(zones.center),
    ...zoneToBlocks(zones.right),
  ];

  return {
    _type: "section",
    _key: genKey("section"),
    containers: [
      {
        _type: "container",
        _key: genKey("container"),
        layout: { type: "flex", direction: "row", alignItems: "center" },
        blocks: allBlocks,
      },
    ],
  };
}

async function migrateHeaders() {
  const headers = await prisma.header.findMany();
  let migrated = 0;

  for (const header of headers) {
    const sections = header.sections as unknown as unknown[];
    if (Array.isArray(sections) && sections.length > 0) continue;

    const zones = (header.zones as unknown as HeaderZones) || {};
    const section = buildSectionFromZones(zones);

    await prisma.header.update({
      where: { id: header.id },
      data: { sections: [section] as never },
    });
    migrated++;
    console.log(`  ✓ Migrated header ${header.slug}`);
  }

  console.log(`Headers migrated: ${migrated}/${headers.length}`);
}

async function migrateFooters() {
  const footers = await prisma.footer.findMany();
  let migrated = 0;

  for (const footer of footers) {
    const sections = footer.sections as unknown as unknown[];
    if (Array.isArray(sections) && sections.length > 0) continue;

    const zones = (footer.zones as unknown as HeaderZones) || {};
    const section = buildSectionFromZones(zones);

    await prisma.footer.update({
      where: { id: footer.id },
      data: { sections: [section] as never },
    });
    migrated++;
    console.log(`  ✓ Migrated footer ${footer.slug}`);
  }

  console.log(`Footers migrated: ${migrated}/${footers.length}`);
}

async function main() {
  console.log("Migrating headers...");
  await migrateHeaders();
  console.log("Migrating footers...");
  await migrateFooters();
  console.log("Done.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
