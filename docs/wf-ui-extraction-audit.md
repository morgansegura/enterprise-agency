# Shared-code extraction audit — what to share for mass production

Goal: spin up client site #2..#N fast. The question isn't "what looks reusable"
but "what is **identical across sites** vs **bespoke per client**." Visual
components are bespoke (that's the product — unique sites). The reusable win is
the **non-visual infrastructure**.

## Current state

- **`@wf/ui` (`packages/ui`)** — bare primitives (Button, Modal, Select,
  ToggleGroup, Switch, …) + Icon infra + `cn`. cvfc re-exports them via
  `components/ui`. **Keep MINIMAL** (per `project_wf_ui_library`): a per-customer
  starting point, not a design system.
- **Per-site (`apps/<tenant>`)** — theme tokens, screens, the feature components
  (Heading/Section/MediaSplit/…), the block set + mappers, `data/*`, seed content.

## Recommendation

### Keep bespoke (do NOT extract) — this is the product

Heading, Section, headingSection, MediaSplit, IconCards, Callout, StatBand,
PortraitGrid, Hero, the screens. Their **styling is the per-client uniqueness**.
They follow a shared _contract_ (each in `name/name.tsx + name.css + index.ts`,
lowercase-hyphenated classes, Tailwind via `@apply`) but live per-site. Sharing
them would force a house style — the opposite of the goal.

### Extract — identical across every site (the real multiplier)

Create a new package (suggest **`@wf/site`**) for the CMS/SEO plumbing that is
copy-pasted today and never differs per client:

| Candidate                                                                           | Today                                    | Notes                                                                         |
| ----------------------------------------------------------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------- |
| CMS client (`getPage`, `getStaff`, `getCmsPosts`, `cmsFind`, `mediaUrl`, Doc types) | `apps/cvfc/lib/cms.ts`                   | Pure transport, tenant-scoped — identical everywhere                          |
| `metadataForPage` (CMS-meta → Next Metadata)                                        | `apps/cvfc/lib/seo.ts`                   | Identical                                                                     |
| Lexical converters (`htmlToLexical` seed, `lexicalToHtml` render)                   | `apps/cms/seed`, `apps/cvfc/lib`         | Identical                                                                     |
| `<Blocks>` renderer shell + registry contract                                       | `apps/cvfc/components/blocks`            | The _shell_ is shared; the _registry entries_ are per-site (block set varies) |
| Seed toolkit (`upsertPage`, `upsertByKey`, `migrateCollection`)                     | ✅ done — `apps/cms/src/seed/helpers.ts` | Already extracted within apps/cms                                             |
| Growth layer (robots/sitemap/llms.txt/JsonLd/consent)                               | per-site                                 | Templatable via the scaffold baseline                                         |

### How to extract (discipline)

One piece at a time, verify **both** deploys after each (per the minimal-extraction
rule). Start with the lowest-risk, highest-reuse: the **CMS client** + **lexical
converters** + **`metadataForPage`** → `@wf/site`. The `<Blocks>` shell goes next
with a typed registry the site supplies. Theme/screens/blocks stay per-site.

### Net

- `@wf/ui` = primitives (unchanged, minimal).
- `@wf/site` = CMS/SEO/lexical plumbing (new) — what makes site #2 fast.
- `apps/<tenant>` = brand, content, blocks, seed (the bespoke 20%).

This keeps every site visually unique while the boring 80% (data plumbing, SEO,
seeding) is shared and battle-tested from cvfc.
