# Changelog

All notable changes to this project are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/). Issue and pull request numbers refer to this repository.

## [Unreleased]

### Added

- Automatic technician assignment on complaint submission, preferring category matches and balancing active workload (#28).
- Password recovery with emailed reset links and validated password updates (#30).
- SCM1/SCM2 logical CI naming, evidence-based status accounting, and audit-gap records (#32).
- Draft user, administrator, deployment guides and functional test records for project completion (#35).

### Changed

- Resolved the React Refresh lint warnings by moving the technician query out of `AssignDialog` and documenting the shadcn UI rule exception (#15).

### Fixed

- Fixed Zod schema imports so the test suite also runs with Bun/Vitest on Windows.
- Overrode the vulnerable `esbuild` dependency used by Drizzle's deprecated loader.

## [0.1.0-rc.1] - 2026-10-18

Release candidate. CI is green on `main`; the Functional and Physical Configuration Audits (#16, #17) are not yet recorded, so this is not yet `0.1.0`.

### Added

- GitHub Actions workflow: install (frozen lockfile), lint, typecheck, test, build (#3, PR #10).
- Unit tests for `src/lib/ccms.ts` domain logic; 17 tests in total (#4, PR #11).
- Issue and pull request templates; this changelog (#7, PR #13).
- README, configuration item register (`CI_REGISTER.md`), contributing guide with naming conventions, and status accounting (`docs/STATUS.md`) (#5, PR #19).

### Changed

- ESLint and Prettier ignore tool-generated files; source formatted with Prettier (#2, PR #9).
- Package renamed `complaint-management`, version set to `0.1.0` (#6, PR #12).

### Fixed

- `bun.lock` resolved packages from a private cache and failed to install with HTTP 403; regenerated against the public npm registry (#1, PR #8).

## [0.0.0] - 2026-10-17

### Added

- Initial CCMS application source: complaint lifecycle (Registered, Assigned, In Progress, Resolved, Closed), role-based access (student, faculty, technician, estate manager, admin), Supabase backend with row-level security.
