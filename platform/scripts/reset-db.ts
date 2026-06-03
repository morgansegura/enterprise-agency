/**
 * One-shot DB reset: drops and recreates the public schema.
 * Reads DATABASE_URI from .env (bun auto-loads it) — credentials never printed.
 * Run: bun scripts/reset-db.ts
 */
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URI
if (!connectionString) {
  console.error('DATABASE_URI not set — aborting.')
  process.exit(1)
}

const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } })

try {
  const before = await pool.query(
    "SELECT count(*)::int AS n FROM information_schema.tables WHERE table_schema='public';",
  )
  console.log(`tables in public before: ${before.rows[0].n}`)

  await pool.query('DROP SCHEMA IF EXISTS public CASCADE;')
  await pool.query('CREATE SCHEMA public;')

  const { rows } = await pool.query('SELECT current_user AS u;')
  const user = rows[0].u as string
  await pool.query(`GRANT ALL ON SCHEMA public TO "${user}";`)
  await pool.query('GRANT ALL ON SCHEMA public TO public;')

  const after = await pool.query(
    "SELECT count(*)::int AS n FROM information_schema.tables WHERE table_schema='public';",
  )
  console.log(`public schema reset OK — tables in public now: ${after.rows[0].n}`)
} catch (e) {
  console.error('reset failed:', e instanceof Error ? e.message : e)
  process.exitCode = 1
} finally {
  await pool.end()
}
