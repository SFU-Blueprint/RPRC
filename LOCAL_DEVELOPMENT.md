# Local Development Quick Start

## Prerequisites
- Node.js 18+ installed
- Docker Desktop running (required for local Supabase)
- Git

## Start Local Development

### Option 1: One-Command Launch (Recommended)
```bash
make dev
```

**What this does:**
- Starts local Supabase instance (via Docker)
- Installs dependencies
- Starts Next.js dev server on http://localhost:3000

**Expected output:**
```
Supabase local development setup is running.
Next.js dev server is running at: http://localhost:3000
PostgreSQL is running at: localhost:5432
Supabase Studio is available at: http://localhost:54321
```

---

### Option 2: Step-by-Step (if Make is not available)
```bash
# 1. Start Supabase locally
npx supabase start

# 2. Install dependencies (in another terminal)
npm install

# 3. Start development server (in another terminal)
npm run dev
```

---

## Access Your App

Once running, open these in your browser:

| Service | URL | Purpose |
|---------|-----|---------|
| **Next.js App** | http://localhost:3000 | Your web application |
| **Supabase Studio** | http://localhost:54321 | Database management UI |
| **API Routes** | http://localhost:3000/api | Test API endpoints |

---

## Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format

# Stop Supabase
npx supabase stop

# Reset Supabase (clears data)
npx supabase db reset
```

---

## Environment Variables

**Local development** uses `.env.local` automatically with:
- Local Supabase URL: `http://localhost:54321`
- Test JWT tokens (already configured)

No additional setup needed for local development!

---

## Troubleshooting

### Docker not running?
```bash
# Start Docker Desktop, then try again
make dev
```

### Port already in use?
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Try again
make dev
```

### Supabase won't start?
```bash
# Reset Supabase completely
npx supabase stop
docker volume prune
npx supabase start
```

### Dependencies issues?
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

1. ✅ Run `make dev`
2. ✅ Open http://localhost:3000
3. ✅ Edit files and see hot reload
4. ✅ Check console for errors
5. 📋 Review DEPLOYMENT_ANALYSIS.md for production setup
