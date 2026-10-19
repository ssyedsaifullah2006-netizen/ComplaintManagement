# Physical Configuration Audit (PCA)

## Re-audit of current main

- **Auditor:** AI assistant using Copilot SDK in VS Code
- **Date:** 2026-10-19
- **Repository baseline:** `236be487cdd3c1999ba219555fc40dcf55e8238b` (`main`, current `origin/main`)
- **Release identifier:** `v0.1.0-rc.1`

### Method

Checked every path listed in the CI register at the stated baseline against that baseline's working tree,
confirmed that `.env` is not tracked, and checked the package version and published tag object type.
This is a path/configuration inventory only. It does not verify the live backend, the correctness or
approval of documents, or changes still confined to open pull requests.

### Results

| CI    | Result | Evidence at `236be48`                                              |
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

The audit baseline predates open PRs #38 and #39 and the draft documents added in this documentation
PR. None of those later changes are represented in this PCA. The tracked project plans,
approved requirements/design documents, a formally approved test plan, and approval evidence remain
outstanding. Draft user, admin, deployment, and test documents are not claimed as approved
deliverables.

## Conclusion

All paths registered at baseline `236be48` were present, and no `.env` was tracked. The lightweight
tag discrepancy remains. This PCA does not establish a final release baseline or substitute for
the incomplete FCA recorded in [FCA.md](FCA.md).
