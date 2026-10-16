#!/usr/bin/env bash
set -euo pipefail

# This script checks for schema drift between:
#   1. The remote database schema (via `supabase db pull`)
#   2. The local migrations folder (via `supabase db commit`)
#
# It detects cases where the remote schema was changed directly
# in Supabase Studio or elsewhere without generating a migration.

echo "=== Checking for schema drift ==="

# Create temporary working directory
TMP_DIR=$(mktemp -d)
REMOTE_SCHEMA="$TMP_DIR/remote_schema.sql"
MIGRATIONS_SCHEMA="$TMP_DIR/migrations_schema.sql"

echo "Using temporary directory: $TMP_DIR"

# 1. Extract the schema from the remote database
echo "Extracting schema from remote database..."
supabase db pull --schema public --file "$REMOTE_SCHEMA" || {
  echo "Failed to pull remote schema"
  exit 1
}

# 2. Generate SQL schema from local migrations
echo "Generating schema from migrations..."
supabase db commit > "$MIGRATIONS_SCHEMA" || {
  echo "Failed to generate schema from migrations"
  exit 1
}

# 3. Compare the two schemas
echo "Comparing schemas..."
if ! diff -q "$REMOTE_SCHEMA" "$MIGRATIONS_SCHEMA" >/dev/null 2>&1; then
  echo "Schema drift detected"
  echo ""
  echo "Differences:"
  diff --color=always "$REMOTE_SCHEMA" "$MIGRATIONS_SCHEMA" || true
  echo ""
  echo "Fix: Your remote database and migration files are out of sync."
  echo "Usually this occurs when schema changes were made directly in Supabase Studio without creating a migration."
  exit 1
fi

echo "No schema drift detected."
