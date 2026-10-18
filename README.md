# ComplaintManagement — Campus Care Connect (CCMS)

[![CI](https://github.com/ssyedsaifullah2006-netizen/ComplaintManagement/actions/workflows/ci.yml/badge.svg)](https://github.com/ssyedsaifullah2006-netizen/ComplaintManagement/actions/workflows/ci.yml)

A campus complaint and maintenance system. Students and faculty register complaints about campus
facilities; available technicians are assigned automatically when a complaint is filed, and estate
managers can assign complaints that have no available technician.

## Complaint lifecycle

`Registered → Assigned → In Progress → Resolved → Closed`

Roles: student, faculty, technician, estate manager, admin.

New complaints are automatically assigned to an available technician in the matching category,
prioritizing technicians with fewer active jobs. If no available technician matches the category,
the system falls back to another available technician; if nobody is available, the complaint stays
registered for the estate manager to assign.

## Tech stack

React 19, TypeScript, Vite, TanStack Start / Router / Query, Tailwind CSS 4, Radix UI (shadcn-style
components), Supabase (auth, Postgres with row-level security, storage), Vitest, ESLint, Prettier.
Package manager: **bun** (`bun.lock`).

The database schema and access rules (row-level security policies, assignment and status functions,
notification triggers) are in [`drizzle/migrations/`](drizzle/migrations/). Design notes are in
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
