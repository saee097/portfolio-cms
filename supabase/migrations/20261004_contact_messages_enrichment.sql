-- Enrichment for the public contact form.
-- Idempotent: safe to run against a database that already has these columns.
-- Also included in supabase/schema.sql — running both is harmless.

ALTER TABLE contact_messages
    ADD COLUMN IF NOT EXISTS company TEXT,
    ADD COLUMN IF NOT EXISTS topic TEXT,
    ADD COLUMN IF NOT EXISTS budget TEXT,
    ADD COLUMN IF NOT EXISTS timeline TEXT;

-- Supports the per-IP submission throttle enforced by POST /api/contact.
CREATE INDEX IF NOT EXISTS idx_contact_messages_ip_created ON contact_messages(ip_address, created_at DESC);

-- Supports filtering the admin inbox by inquiry type.
CREATE INDEX IF NOT EXISTS idx_contact_messages_topic ON contact_messages(topic);

-- Only staff reads these; the public has INSERT only.
REVOKE UPDATE, DELETE ON contact_messages FROM anon, authenticated;
GRANT UPDATE, DELETE ON contact_messages TO authenticated;
