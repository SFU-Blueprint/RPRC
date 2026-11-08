.PHONY: dev reset types

# Starts local Supabase (DB + auth + Mailpit) and runs Next.js. Uses .env.local.
dev:
	npm install
	npm run dev

# Wipe the local database, re-run migrations and supabase/seed.sql.
reset:
	npm run db:reset

# Regenerate types/database.ts from the local database.
types:
	npm run types
