# Changelog

All notable changes to this project are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/). Issue and pull request numbers refer to this repository.

## [Unreleased]

### Added
- GitHub Actions workflow: install (frozen lockfile), lint, typecheck, test, build (#3, PR #10).
- Unit tests for `src/lib/ccms.ts` domain logic; 17 tests in total (#4, PR #11).
- Issue and pull request templates; this changelog (#7).

### Changed
- ESLint and Prettier ignore tool-generated files; source formatted with Prettier (#2, PR #9).
- Package renamed `complaint-management`, version set to `0.1.0` (#6, PR #12).

### Fixed
- `bun.lock` resolved packages from a private cache and failed to install with HTTP 403; regenerated against the public npm registry (#1, PR #8).

## [0.0.0] - 2026-10-17

### Added
- Initial CCMS application source: complaint lifecycle (Registered, Assigned, In Progress, Resolved, Closed), role-based access (student, faculty, technician, estate manager, admin), Supabase backend with row-level security.
