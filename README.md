# ComplaintManagement — Campus Care Connect (CCMS)

[![CI](https://github.com/ssyedsaifullah2006-netizen/ComplaintManagement/actions/workflows/ci.yml/badge.svg)](https://github.com/ssyedsaifullah2006-netizen/ComplaintManagement/actions/workflows/ci.yml)

A campus complaint and maintenance system. Students and faculty register complaints about campus
facilities; estate managers assign them to technicians; technicians update progress until the
complaint is resolved and closed.

## Complaint lifecycle

`Registered → Assigned → In Progress → Resolved → Closed`

Roles: student, faculty, technician, estate manager, admin.

## Tech stack

React 19, TypeScript, Vite, TanStack Start / Router / Query, Tailwind CSS 4, Radix UI (shadcn-style
components), Supabase (auth, Postgres with row-level security, storage), Vitest, ESLint, Prettier.
Package manager: **bun** (`bun.lock`).

The database schema and access rules (row-level security policies, the `assign_technician`,
`update_complaint_status` and `set_user_role` functions, notification triggers) are in
[`drizzle/migrations/0000_migration.sql`](drizzle/migrations/0000_migration.sql). Design notes are in
[`AGENTS.md`](AGENTS.md).

## Getting started

```sh
bun install --frozen-lockfile
cp .env.example .env      # fill in your Supabase project values; never commit .env
bun run dev
```

| Command | Purpose |
|---|---|
| `bun run dev` | Start the dev server |
| `bun run build` | Production build |
| `bun run lint` | ESLint (includes Prettier formatting rules) |
| `bunx tsc --noEmit` | Type check |
| `bun run test` | Unit tests (Vitest) |

## Project status

Current verification state, with evidence, is in [`docs/STATUS.md`](docs/STATUS.md). The feature list
above is the intended scope; whether each feature works end to end against a live Supabase project is
recorded by the Functional Configuration Audit, not assumed here.

## Software configuration management

| Document | Purpose |
|---|---|
| [CONTRIBUTING.md](CONTRIBUTING.md) | Branching, commit and tag naming, pull requests, review, release rules |
| [CI_REGISTER.md](CI_REGISTER.md) | Configuration items and their identifiers |
| [docs/STATUS.md](docs/STATUS.md) | Configuration status accounting (changes, CI runs, audits, releases) |
| [CHANGELOG.md](CHANGELOG.md) | Notable changes per version |
