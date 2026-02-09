# RPRC Website

A revamped website for the Richmond Poverty Reduction Coalition built with Next.js and Supabase.

## About

This is a modern web application that provides:

- **Member Portal**: Sign in/log in and dashboard for members
- **Admin Dashboard**: Administrative interface for managing the organization
- **News Feed**: Latest updates and announcements
- **Events Calendar**: Upcoming events and activities

The project uses:

- **Next.js 16** - React framework
- **Supabase** - Backend as a Service (database, auth, storage)
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Styling

## Quick Start

### Prerequisites

- **Node.js LTS** - Install via [nvm windows](https://github.com/coreybutler/nvm-windows) on Windows
- **Docker Desktop** - Required for local Supabase instance (must be running)
- **Git** - Version control
- **Make** - For running development commands

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd RPRC
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start Docker Desktop** (ensure it's running)

4. **Start the development environment**

   ```bash
   make dev
   ```

5. **Open your browser**
   - **Frontend App**: http://localhost:3000
   - **Supabase Studio**: http://127.0.0.1:54323 (visual database management UI)
     - View/edit tables and data
     - Run SQL queries
     - Manage authentication
     - View API documentation

### Core Commands

| Command               | Description                               |
| --------------------- | ----------------------------------------- |
| `make dev`            | Start local Supabase + Next.js dev server |
| `npm run dev`         | Start Next.js dev server only             |
| `npm run build`       | Build for production                      |
| `npm run lint`        | Run ESLint                                |
| `npm run format`      | Format code with Prettier                 |
| `npm run test`        | Run tests                                 |
| `npx supabase status` | Check Supabase services status            |
| `npx supabase stop`   | Stop local Supabase services              |

### Accessing Your Local Database

**Supabase Studio** (Visual Database UI):

- URL: http://127.0.0.1:54323
- Features:
  - Browse and edit tables/data
  - Run SQL queries
  - View database schema
  - Manage authentication users
  - Test API endpoints
  - View logs

**Database Connection** (for external tools):

- Host: `127.0.0.1`
- Port: `54322`
- Database: `postgres`
- Username: `postgres`
- Password: `postgres`

## Development Guide

For detailed development workflows, database migrations, and best practices, see:

📖 **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Complete development guide

This includes:

- Daily development workflow
- Making database schema changes
- Syncing with remote databases
- Common scenarios and troubleshooting
- Command reference

## Project Structure

```
RPRC/
├── app/              # Next.js app directory
├── supabase/         # Supabase configuration and migrations
│   └── migrations/   # Database migration files
├── .github/          # GitHub Actions workflows
└── scripts/          # Utility scripts
```

## Code Quality

### Linting and Formatting

```bash
npm run lint      # Check for linting errors
npm run format    # Format code with Prettier
```

VS Code extensions (recommended):

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

Auto-formatting is configured to run on file save.

### Testing

```bash
npm run test      # Run test suite
```

## Contributing

1. Read the [Development Guide](./DEVELOPMENT.md)
2. Follow the workflow for database changes
3. Ensure all checks pass before opening a PR
4. Refer to the [RPRC Development Guideline](https://docs.google.com/document/d/1SECkBGbbApRFhOrFFFYxbfcnb0HVOsZOI5pVPgn1XLs/edit?usp=sharing) for team standards
