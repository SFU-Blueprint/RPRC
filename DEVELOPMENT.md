# Development Workflow Guide

## Project Overview

We have 2 Supabase projects:

- **Supabase_rprc_dev** - Development database (remote)
- **Supabase_rprc_prod** - Production database (remote)

## Understanding Local vs Remote

### Your Local Database

- **Completely isolated** - runs on your machine via Docker
- **Only applies migrations** from `supabase/migrations/` folder
- **Does NOT automatically sync** with remote databases
- **Starts fresh** each time you run `supabase start` (applies all migrations in order)

### Remote Databases (Dev/Prod)

- **Updated automatically** by CI/CD when you merge PRs
- **Dev** gets updated when you merge to `dev` branch
- **Prod** gets updated when you merge to `main` branch

---

## Quick Start

1. **Prerequisites**: Node.js, Docker Desktop, Git, Make
2. **Start Docker Desktop** (must be running)
3. **Clone repo** → `npm install`
4. **Run**: `make dev`
5. **Open**: http://localhost:3000

---

## Daily Development Workflow

### Starting Your Day

```bash
# 1. Get latest code (including any new migrations from teammates)
git pull

# 2. Start local environment (applies all migrations automatically)
make dev
```

**What `make dev` does:**

- Starts local Supabase instance
- Applies all migrations from `supabase/migrations/` folder
- Installs npm packages
- Starts Next.js dev server

### When Someone Else Adds Database Changes

If a teammate creates new migrations and merges them:

```bash
# 1. Pull the latest code (gets new migration files)
git pull

# 2. Restart Supabase to apply new migrations
npx supabase stop
npx supabase start

# Or reset to start fresh
npx supabase db reset
```

**Important**: Your local DB only updates when you:

1. Pull new migration files from git
2. Restart/reset Supabase to apply them

---

## Making Database Schema Changes

### Step 1: Create a Migration File

```bash
npx supabase migration new add_user_table
```

This creates: `supabase/migrations/20240101120000_add_user_table.sql`

### Step 2: Write Your SQL

Edit the migration file with your schema changes:

```sql
-- Example: supabase/migrations/20240101120000_add_user_table.sql
create table users (
  id uuid primary key,
  email text,
  created_at timestamp
);
```

**Alternative**: If you made changes in Supabase Dashboard UI:

```bash
# Generate migration from your local DB changes
npx supabase db diff -f add_user_table
```

### Step 3: Apply Locally

```bash
# Option A: Reset and reapply all migrations (recommended)
npx supabase db reset

# Option B: Just restart (if Supabase is running)
npx supabase stop
npx supabase start
```

### Step 4: Test Locally

```bash
npm run dev
# Test your changes work
```

### Step 5: Validate Before Committing

```bash
# Check migrations are valid
npx supabase db push --dry-run

# Lint your schema
npx supabase db lint
```

### Step 6: Commit and Push

```bash
git add supabase/migrations/20240101120000_add_user_table.sql
git commit -m "Add users table"
git push
```

### Step 7: Open Pull Request

CI automatically runs:

- ✅ Migration validation
- ✅ Schema linting
- ✅ Drift detection
- ✅ Code linting
- ✅ Type checking
- ✅ Build

### Step 8: After Merge

**Merge to `dev` branch:**

- CI/CD automatically applies migrations to **dev database**
- Deploys to dev environment

**Merge to `main` branch:**

- CI/CD automatically applies migrations to **prod database**
- Deploys to production

---

## Common Scenarios

### Scenario 1: Regular Code Changes (No DB Changes)

```bash
make dev
# Write code
npm run lint
npm run build
git commit -m "Update feature"
git push
# Open PR
```

### Scenario 2: You Made Changes in Supabase Dashboard UI

If you accidentally made changes directly in the remote Supabase Dashboard:

```bash
# 1. Link to remote project (one-time, if not already linked)
npx supabase link --project-ref <your-dev-project-ref>

# 2. Pull the schema to create a migration file
npx supabase db pull

# 3. Commit the generated migration file
git add supabase/migrations/
git commit -m "Sync schema from remote UI changes"
git push
```

### Scenario 3: Starting Fresh / Troubleshooting

```bash
# Stop everything
npx supabase stop

# Reset database (drops and recreates, applies all migrations)
npx supabase db reset

# Start fresh
make dev
```

---

## Key Commands Reference

| Command                             | What It Does                                 |
| ----------------------------------- | -------------------------------------------- |
| `make dev`                          | Start local environment (Supabase + Next.js) |
| `npx supabase start`                | Start local Supabase instance                |
| `npx supabase stop`                 | Stop local Supabase instance                 |
| `npx supabase db reset`             | Reset local DB and reapply all migrations    |
| `npx supabase migration new <name>` | Create new migration file                    |
| `npx supabase db diff -f <name>`    | Generate migration from local changes        |
| `npx supabase db pull`              | Pull schema from remote to create migration  |
| `npx supabase db push --dry-run`    | Validate migrations without applying         |
| `npx supabase db lint`              | Check schema for issues                      |

---

## Important Notes

1. **Local DB is isolated** - changes stay local until you create migration files
2. **Migration files are the source of truth** - always commit them to git
3. **CI/CD handles remote** - you never manually push to remote databases
4. **Always pull before starting** - ensures you have latest migrations
5. **Test migrations locally** - use `db reset` to verify they work

---

## Troubleshooting

**"My local DB doesn't match remote"**

```bash
git pull  # Get latest migrations
npx supabase db reset  # Reapply all migrations
```

**"Migration failed"**

- Check the migration file for SQL errors
- Verify it works locally with `npx supabase db reset`
- Check CI logs for specific error messages

**"Supabase won't start"**

- Ensure Docker Desktop is running
- Try: `npx supabase stop` then `npx supabase start`
- Check Docker has enough resources allocated
