# Physical Configuration Audit (PCA)

## Re-audit of current main

- **Auditor:** AI assistant using Copilot SDK in VS Code
- **Date:** 2026-10-18
- **Repository baseline:** `aeaf61e939d0615f15ef31ae13075a6411a13bd1` (main after PR #31)
- **Release identifier:** `v0.1.0-rc.1`

### Method

Compared the registered CI paths in `CI_REGISTER.md` against
`git ls-tree -r --name-only origin/main`, checked for a tracked `.env`, and compared package,
changelog, and tag identifiers. Directories were accepted when the tracked tree had at least one
descendant. The audit covers the stated main commit only; changes in this pull request are not yet
part of that baseline.

### Results

| CI | Result | Evidence at `aeaf61e` |
|---|---|---|
| CI-01 | Pass | All registered source directories and entry files exist |
| CI-02 | Pass | Supabase integration directory has tracked files |
| CI-03 | Pass | Generated route tree exists |
| CI-04 | Pass | Migration directory has tracked SQL and metadata |
| CI-05 | Pass | Registered database tooling paths exist |
| CI-06 | Pass | Package manifest, lockfile, and Bun config exist |
| CI-07 | Pass | Build configuration paths exist |
| CI-08 | Pass | Registered tests and test configuration exist, including `src/lib/auth.test.ts` |
| CI-09 | Pass | Registered lint/format configuration paths exist |
| CI-10 | Pass | GitHub Actions workflow exists |
| CI-11 | Pass | Environment template and ignore rules exist; no `.env` is tracked |
| CI-12 | Pass | Public assets directory contains tracked files |
| CI-13 | Pass | Registered project documentation paths exist |
| CI-14 | Pass | SCM and audit documentation directory and registered files exist |
| CI-15 | Pass | Issue template directory and pull request template exist |

The package version is `0.1.0-rc.1`. The tag name and changelog heading match. However,
`git cat-file -t v0.1.0-rc.1` returns `commit`, so this published tag is lightweight rather than
annotated as required by `CONTRIBUTING.md`. The discrepancy was recorded in issue #24 and was not
rewritten. Future release tags must be annotated.

This physical-path audit does not establish that every SCM1/SCM2 deliverable exists: plans,
approved design/requirements documents, formal test artifacts, manuals, and the deployment guide
are absent. The current repository compliance record lists those gaps in
[SCM_COMPLIANCE.md](SCM_COMPLIANCE.md) and issue #36.

## Conclusion

Every path currently registered in `CI_REGISTER.md` was present at baseline `aeaf61e`, and no
`.env` file was tracked. The tag metadata discrepancy remains. This PCA does not establish a final
release baseline or substitute for the incomplete FCA recorded in [FCA.md](FCA.md).
