/**
 * Applies supabase/schema.sql (+ contact enrichment migration) to a Supabase project.
 *
 * DDL cannot be executed through PostgREST, so this uses the Management API's
 * database/query endpoint, which requires a personal access token.
 *
 * Create a token at: https://supabase.com/dashboard/account/tokens
 *
 *   $env:SUPABASE_ACCESS_TOKEN="sbp_xxx"; node scripts/apply-schema.mjs --dry-run
 *   $env:SUPABASE_ACCESS_TOKEN="sbp_xxx"; node scripts/apply-schema.mjs
 *
 * schema.sql is already idempotent. The enrichment migration is applied after it
 * so older databases that only need the contact columns still get upgraded.
 */
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

/** Minimal .env reader so this script needs no extra dependency. */
function loadEnv() {
  const path = resolve(process.cwd(), '.env')
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/)
    if (!match) continue
    const value = match[2].replace(/^["']|["']$/g, '')
    if (process.env[match[1]] === undefined) process.env[match[1]] = value
  }
}

loadEnv()

const SCHEMA_PATH = resolve(process.cwd(), 'supabase/schema.sql')
const MIGRATION_PATH = resolve(
  process.cwd(),
  'supabase/migrations/20261004_contact_messages_enrichment.sql'
)
const MANAGEMENT_API = 'https://api.supabase.com/v1/projects'
const VERIFY_TABLES = [
  'profiles',
  'projects',
  'blog_posts',
  'contact_messages',
  'site_settings',
  'experiences',
  'skills',
  'services',
]

const accessToken = process.env.SUPABASE_ACCESS_TOKEN
const dryRun = process.argv.includes('--dry-run')
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function getProjectRef(url) {
  if (!url) return null
  try {
    return new URL(url).hostname.split('.')[0]
  } catch {
    return null
  }
}

async function runQuery(ref, query) {
  const response = await fetch(`${MANAGEMENT_API}/${ref}/database/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })

  const text = await response.text()
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} :: ${text.slice(0, 600)}`)
  }
  return text
}

async function verify() {
  const results = []
  for (const table of VERIFY_TABLES) {
    if (!supabaseUrl || !anonKey) {
      results.push(`${table.padEnd(18)} skipped (no anon key to verify with)`)
      continue
    }
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*&limit=1`, {
        headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      })
      const body = await response.text()
      const code = (() => {
        try {
          return JSON.parse(body)?.code
        } catch {
          return null
        }
      })()
      const ok = response.ok
      results.push(
        `${table.padEnd(18)} HTTP ${response.status}${ok ? ' OK' : code ? ` ${code}` : ' FAIL'}`
      )
    } catch (error) {
      results.push(`${table.padEnd(18)} probe failed: ${error.message}`)
    }
  }
  return results
}

async function main() {
  const ref = getProjectRef(supabaseUrl)
  const schemaSql = readFileSync(SCHEMA_PATH, 'utf8')
  const migrationSql = existsSync(MIGRATION_PATH) ? readFileSync(MIGRATION_PATH, 'utf8') : ''

  const tableCount = (schemaSql.match(/CREATE TABLE IF NOT EXISTS/gi) || []).length
  const policyCount = (schemaSql.match(/CREATE POLICY/gi) || []).length

  console.log(`Schema    : ${SCHEMA_PATH}`)
  console.log(`Migration : ${MIGRATION_PATH}`)
  console.log(`Project   : ${ref ?? 'unknown (NEXT_PUBLIC_SUPABASE_URL not set)'}`)
  console.log(`Content   : ${tableCount} tables, ${policyCount} policies`)

  if (dryRun) {
    console.log('\n--- DRY RUN: no changes made. First 40 lines of schema SQL ---\n')
    console.log(schemaSql.split('\n').slice(0, 40).join('\n'))
    console.log('\nRe-run without --dry-run to apply.')
    return
  }

  if (!accessToken) {
    console.error('\nMissing SUPABASE_ACCESS_TOKEN.')
    console.error('Create one at https://supabase.com/dashboard/account/tokens')
    console.error('Then run:')
    console.error('  $env:SUPABASE_ACCESS_TOKEN="sbp_xxx"; node scripts/apply-schema.mjs')
    console.error('\nOr paste supabase/schema.sql into:')
    if (ref) {
      console.error(`  https://supabase.com/dashboard/project/${ref}/sql/new`)
    } else {
      console.error('  https://supabase.com/dashboard → your project → SQL Editor')
    }
    process.exit(1)
  }

  if (!ref) {
    console.error('Could not derive the project ref from NEXT_PUBLIC_SUPABASE_URL')
    process.exit(1)
  }

  console.log('\nApplying schema…')
  try {
    await runQuery(ref, schemaSql)
    console.log('Schema applied successfully.')
  } catch (error) {
    console.error(`\nSchema failed: ${error.message}`)
    console.error('Fix the reported statement in supabase/schema.sql and re-run — it is idempotent.')
    process.exit(1)
  }

  if (migrationSql.trim()) {
    console.log('Applying contact enrichment migration…')
    try {
      await runQuery(ref, migrationSql)
      console.log('Migration applied successfully.')
    } catch (error) {
      console.error(`\nMigration failed: ${error.message}`)
      process.exit(1)
    }
  }

  console.log('\nVerification:')
  for (const line of await verify()) console.log(`  ${line}`)

  console.log('\nNext steps:')
  console.log('  1. Reload /admin — the “Database is not initialised” banner should be gone.')
  console.log('  2. Ensure an admin user exists: node scripts/create-admin.mjs')
  console.log("  3. If needed: UPDATE profiles SET role = 'super_admin' WHERE email = 'your@email.com';")
}

main()
