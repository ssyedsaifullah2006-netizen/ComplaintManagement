# Configuration Status Accounting

Records the state of the configuration items, changes, CI runs, audits and releases. Only results that
were actually run or performed are recorded. Last updated: 2026-10-18.

## Baselines and releases

| Version | Commit | State |
|---|---|---|
| Initial source | `4ed6332` | Initial commit on `main` (version `0.0.0` in CHANGELOG) |
| `v0.1.0-rc.1` | see `git show v0.1.0-rc.1` | Release candidate (#20): tagged on the merge commit of its PR after CI is green on `main`. FCA pending; not a final release |
| `v0.1.0` | _pending_ | Requires FCA (#16) and PCA (#17) recorded, then CHANGELOG section dated |

## State of the initial source (before any change), run locally 2026-10-17

| Check | Result |
|---|---|
| `bun install --frozen-lockfile` | **Failed**: lockfile pinned to a private package cache (HTTP 403) |
| `bun run lint` | **Failed**: 715 errors (714 formatting, 1 `prefer-const` in a generated file), 7 warnings |
| `bunx tsc --noEmit` | Passed |
| `bun run test` | Passed: 1 test (routing only) |
| `bun run build` | Passed |

## Change log

| Issue | PR | Type | Change | Result |
|---|---|---|---|---|
| #1 | #8 | fix | Regenerate `bun.lock` from the public registry | `--frozen-lockfile` exits 0 from a clean `node_modules` (local) |
| #2 | #9 | chore | Ignore generated files; apply Prettier | lint 0 errors, 7 warnings; tsc, tests, build pass (local) |
| #3 | #10 | ci | GitHub Actions workflow | First run green: run 39053319328 |
| #4 | #11 | test | 16 unit tests for `src/lib/ccms.ts` (17 total) | 17/17 pass; 2 fail when bugs are injected; CI green: run 39053399633 |
| #6 | #12 | chore | Package name `complaint-management`, version `0.1.0` | CI green: run 39053513745 |
| #7 | #13 | docs | CHANGELOG, issue and PR templates | CI green: run 39053585847 |
| #5 | #19 | docs | README, CI register, contributing guide, this page | CI green: run 39072036657 |
| #20 | #21 | chore | Release candidate `v0.1.0-rc.1`: version and changelog section | CI result recorded on the PR |
| #28 | #29 | feat | Automatic technician assignment; application source and database trigger migration | Local frozen install, lint, typecheck, tests, build, audit and Drizzle migration check passed; no live database migration applied |
| #30 | #31 | feat | Password recovery flow; application source and validation/routing tests | Local frozen install, lint, typecheck, tests and production build passed; password email delivery not verified against live auth |

## CI runs on `main`

| Run | After PR | Result |
|---|---|---|
| 39053377451 | #10 | success |
| 39053442227 | #11 | success |
| 39053557775 | #12 | success |
| 39053628417 | #13 | success |
| 39072090117 | #19 | success |

The CI workflow runs: `bun install --frozen-lockfile`, lint, `tsc --noEmit`, tests, build.

## Known open items

| Item | Tracked in |
|---|---|
| 7 `react-refresh/only-export-components` lint warnings | #15 |
| No component tests for `StatusBadge`, `ComplaintTable`, `AssignDialog` | #14; PR #18 open from a fork, awaiting review and a first CI run |
| Feature behaviour against a live Supabase project not verified end to end | #16 (FCA) |
| Database rules (RLS policies, security-definer functions) have no automated tests | not yet raised |

## Audits

| Audit | State | Tracked in |
|---|---|---|
| Functional Configuration Audit (FCA) | **Not yet performed** | #16 |
| Physical Configuration Audit (PCA) | **Performed 2026-10-18**; lightweight tag discrepancy tracked in #24 | [PCA.md](PCA.md), #17 |
