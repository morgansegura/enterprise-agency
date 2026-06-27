import { getPayload } from 'payload'

import config from '../src/payload.config'

// Mark the initial migration as already-applied (the live DB already has this
// schema from years of dev-push). Future migrations then apply on top.
const NAME = '20260627_195924_initial_schema'

const payload = await getPayload({ config: await config })
const db = payload.db as unknown as {
  pool: { query: (q: string, p?: unknown[]) => Promise<{ rowCount: number | null }> }
}
const res = await db.pool.query(
  `INSERT INTO payload_migrations (name, batch, updated_at, created_at)
   SELECT $1::text, 1, now(), now()
   WHERE NOT EXISTS (SELECT 1 FROM payload_migrations WHERE name = $1::text)`,
  [NAME],
)
console.log(res.rowCount ? `Baselined: ${NAME}` : `Already baselined: ${NAME}`)
process.exit(0)
