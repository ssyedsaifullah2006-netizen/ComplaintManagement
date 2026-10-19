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

Complaint and timeline changes refresh in real time when the database Realtime migration is applied.
Estate managers and admins can filter maintenance reports and export matching complaint records as CSV.
Technicians can register and track their own complaints alongside their assigned jobs.

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

Use **Forgot password?** on the sign-in page to request a reset email and choose a new password.
Configure the Supabase Auth redirect URL allow-list to include each local and deployed app origin
at `/reset-password`.

| Command             | Purpose                                     |
| ------------------- | ------------------------------------------- |
| `bun run dev`       | Start the dev server                        |
| `bun run build`     | Production build                            |
| `bun run lint`      | ESLint (includes Prettier formatting rules) |
| `bunx tsc --noEmit` | Type check                                  |
| `bun run test`      | Unit tests (Vitest)                         |

## Project status

Current verification state, with evidence, is in [`docs/STATUS.md`](docs/STATUS.md). The feature list
above is the intended scope; whether each feature works end to end against a live Supabase project is
recorded by the [Functional Configuration Audit](docs/FCA.md), not assumed here. SCM1/SCM2
traceability and known compliance gaps are recorded in [docs/SCM_COMPLIANCE.md](docs/SCM_COMPLIANCE.md).

## Software configuration management

| Document                                         | Purpose                                                                |
| ------------------------------------------------ | ---------------------------------------------------------------------- |
| [CONTRIBUTING.md](CONTRIBUTING.md)               | Branching, commit and tag naming, pull requests, review, release rules |
| [CI_REGISTER.md](CI_REGISTER.md)                 | Configuration items and their identifiers                              |
| [docs/STATUS.md](docs/STATUS.md)                 | Configuration status accounting (changes, CI runs, audits, releases)   |
| [docs/SCM_COMPLIANCE.md](docs/SCM_COMPLIANCE.md) | SCM1/SCM2 mapping, evidence and known gaps                             |
| [docs/FCA.md](docs/FCA.md)                       | Functional audit status and verification evidence                      |
| [docs/PCA.md](docs/PCA.md)                       | Physical configuration audit                                           |
| [CHANGELOG.md](CHANGELOG.md)                     | Notable changes per version                                            |
