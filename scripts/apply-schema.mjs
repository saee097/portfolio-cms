/**
 * Applies supabase/schema.sql to a Supabase project.
 *
 * DDL cannot be executed through PostgREST, so this uses the Management API's
 * database/query endpoint, which requires a personal access token.
 *
 * Create a token at: https://supabase.com/dashboard/account/tokens
 *
 *   $ SUPABASE_ACCESS_TOKEN=sbp_xxx node scripts/apply-schema.mjs --dry-run
 *   $ SUPABASE_ACCESS_TOKEN=sbp_xxx node scripts/apply-schema.mjs
 *
 * The SQL is rewritten to be idempotent before execution, so a failed or partial run
 * can simply be repeated: CREATE TABLE/INDEX get IF NOT EXISTS, and policies and
 * triggers are dropped before being recreated. Nothing else in the file is altered.
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
const MANAGEMENT_API = 'https://api.supabase.com/v1/projects'
const VERIFY_TABLES = ['profiles', 'projects', 'blog_posts', 'contact_messages', 'site_settings']

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

/** Rewrites the schema so repeated runs cannot fail on already-existing objects. */
function makeIdempotent(sql) {
  return sql
    .replace(/^(\s*)CREATE TABLE (?!IF NOT EXISTS)/gim, '$1CREATE TABLE IF NOT EXISTS ')
    .replace(/^(\s*)CREATE UNIQUE INDEX (?!IF NOT EXISTS)/gim, '$1CREATE UNIQUE INDEX IF NOT EXISTS ')
    .replace(/^(\s*)CREATE INDEX (?!IF NOT EXISTS)/gim, '$1CREATE INDEX IF NOT EXISTS ')
    .replace(
      /^(\s*)CREATE POLICY (\S+) ON ([^\n]+)$/gim,
      (match, indent, name, target) =>
        `${indent}DROP POLICY IF EXISTS ${name} ON ${target};\n${indent}CREATE POLICY ${name} ON ${target}`
    )
    .replace(
      /^(\s*)CREATE TRIGGER (\S+) (BEFORE|AFTER) ([\s\S]*?)(FOR EACH ROW EXECUTE FUNCTION [^;]+;)/gim,
      (match, indent, name, timing, rest, tail) =>
        `${indent}DROP TRIGGER IF EXISTS ${name} ON ${indent}${tableFromTrigger(rest)};\n` +
        `${indent}CREATE TRIGGER ${name} ${timing} ${rest}${tail}`
    )
}

/** Extracts the target table from a CREATE TRIGGER body (FROM "table" ON "table"). */
function tableFromTrigger(body) {
  const match = body.match(/ON\s+"?([a-z_]+)"?/i)
  return match ? `"${match[1]}"` : 'unknown_table'
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

async function verify(ref) {
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
      results.push(`${table.padEnd(18)} HTTP ${response.status}${response.ok ? ' OK' : ' NOT FOUND'}`)
    } catch (error) {
      results.push(`${table.padEnd(18)} probe failed: ${error.message}`)
    }
  }
  return results
}

async function main() {
  const ref = getProjectRef(supabaseUrl)
  const original = readFileSync(SCHEMA_PATH, 'utf8')
  const sql = makeIdempotent(original)

  const tableCount = (sql.match(/CREATE TABLE IF NOT EXISTS/gi) || []).length
  const policyCount = (sql.match(/CREATE POLICY/gi) || []).length

  console.log(`Schema : ${SCHEMA_PATH}`)
  console.log(`Project: ${ref ?? 'unknown (NEXT_PUBLIC_SUPABASE_URL not set)'}`)
  console.log(`Content: ${tableCount} tables, ${policyCount} policies`)

  if (dryRun) {
    console.log('\n--- DRY RUN: no changes made. First 40 lines of executable SQL ---\n')
    console.log(sql.split('\n').slice(0, 40).join('\n'))
    console.log('\nRe-run without --dry-run to apply.')
    return
  }

  if (!accessToken) {
    console.error('\nMissing SUPABASE_ACCESS_TOKEN.')
    console.error('Create one at https://supabase.com/dashboard/account/tokens')
    console.error('Then run: set SUPABASE_ACCESS_TOKEN=sbp_xxx && node scripts/apply-schema.mjs')
    process.exit(1)
  }

  if (!ref) {
    console.error('Could not derive the project ref from NEXT_PUBLIC_SUPABASE_URL')
    process.exit(1)
  }

  console.log('\nApplying schema…')
  try {
    await runQuery(ref, sql)
    console.log('Schema applied successfully.')
  } catch (error) {
    console.error(`\nSchema failed: ${error.message}`)
    console.error('Fix the reported statement in supabase/schema.sql and re-run — it is idempotent.')
    process.exit(1)
  }

  console.log('\nVerification:')
  for (const line of await verify(ref)) console.log(`  ${line}`)

  console.log('\nNext step — promote your admin account:')
  console.log("  UPDATE profiles SET role = 'super_admin' WHERE email = 'admin123@gmail.com';")
}

main()