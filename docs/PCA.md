# Physical Configuration Audit (PCA)

## Re-audit of current main

- **Auditor:** AI assistant using Copilot SDK in VS Code
- **Date:** 2026-10-20
- **Repository baseline:** `223da99a533f12c00e0205c64ad88cb980f325d4` (`main`, after PRs #38–#40)
- **Release identifier:** `v0.1.0-rc.1`

### Method

Compared the CI register paths with `git ls-tree -r --name-only 223da99a533f12c00e0205c64ad88cb980f325d4`,
confirmed `.env` is not tracked, and checked the package version and published tag object type.
All registered file paths and directories were present; no registered path was missing. This is a
path/configuration inventory only. It does not verify the live backend, the correctness or approval
of documents, or formal release approval.

### Results

| CI    | Result | Evidence at `223da99`                                               |
| ----- | ------ | ------------------------------------------------------------------ |
| CI-01 | Pass   | Registered source directories and entry files exist                |
| CI-02 | Pass   | Supabase integration directory exists                              |
| CI-03 | Pass   | Generated route tree exists                                        |
| CI-04 | Pass   | Database migrations exist                                          |
| CI-05 | Pass   | Drizzle configuration, schema, and `supabase/config.toml` exist    |
| CI-06 | Pass   | Package manifest, Bun lockfile, and Bun config exist               |
| CI-07 | Pass   | Registered build configuration exists                              |
| CI-08 | Pass   | Registered tests and Vitest configuration exist                    |
| CI-09 | Pass   | Registered lint and format configuration exists                    |
| CI-10 | Pass   | GitHub Actions workflow exists                                     |
| CI-11 | Pass   | Environment template and ignore rules exist; `.env` is not tracked |
| CI-12 | Pass   | Public assets directory exists                                     |
| CI-13 | Pass   | Registered project documentation paths exist                       |
| CI-14 | Pass   | SCM and audit documentation paths exist                            |
| CI-15 | Pass   | Issue template directory and pull request template exist           |

The package version and release-candidate tag are `0.1.0-rc.1` and `v0.1.0-rc.1`. The tag points
to a commit object, so it is lightweight rather than annotated as required by
`CONTRIBUTING.md`. Issue #24 records the discrepancy; the published tag was not rewritten. Future
release tags must be annotated.

The tracked project/SCM/risk plans, approved requirements/design documents, formal test evidence,
and stakeholder approval remain outstanding. The user, admin, deployment, and test documents are
drafts and are not claimed as approved deliverables.

## Conclusion

All CI-register paths at baseline `223da99` were present, and no `.env` was tracked. The lightweight
tag discrepancy remains. This PCA does not establish a final release baseline or substitute for
the partial FCA recorded in [FCA.md](FCA.md).
