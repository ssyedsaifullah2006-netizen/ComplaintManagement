# Physical Configuration Audit (PCA)

- **Auditor:** AI assistant using Copilot SDK in VS Code, operating with the authorized `Naresh-Y4` GitHub account
- **Date:** 2026-10-18
- **Repository baseline:** `main` at `337b347765fb97050df4c7aa72700cdba7f2937f`
- **Release baseline:** `v0.1.0-rc.1`

## Scope and method

Compared every path in `CI_REGISTER.md` with the tracked file inventory from
`git ls-tree -r --name-only main`. Directory entries were checked for at least one tracked
descendant. Reviewed the top-level tracked files against the register, checked the registered
version against `package.json`, the release tag, and the changelog, and verified that no `.env`
file is tracked.

## Results

| CI    | Result | Evidence                                                                           |
| ----- | ------ | ---------------------------------------------------------------------------------- |
| CI-01 | Pass   | All registered application source paths exist in the baseline.                     |
| CI-02 | Pass   | `src/integrations/supabase/` contains tracked files.                               |
| CI-03 | Pass   | `src/routeTree.gen.ts` exists.                                                     |
| CI-04 | Pass   | `drizzle/migrations/` contains tracked migration and metadata files.               |
| CI-05 | Pass   | All three registered database tooling paths exist.                                 |
| CI-06 | Pass   | `package.json`, `bun.lock`, and `bunfig.toml` exist.                               |
| CI-07 | Pass   | All three registered build configuration paths exist.                              |
| CI-08 | Pass   | All registered test code and configuration paths exist.                            |
| CI-09 | Pass   | All registered lint and format configuration paths exist.                          |
| CI-10 | Pass   | `.github/workflows/ci.yml` exists.                                                 |
| CI-11 | Pass   | `.env.example` and `.gitignore` exist; no `.env` file is tracked.                  |
| CI-12 | Pass   | `public/` contains tracked assets.                                                 |
| CI-13 | Pass   | All registered project documentation paths exist.                                  |
| CI-14 | Pass   | All registered SCM and audit documentation paths exist after this report is added. |
| CI-15 | Pass   | The issue-template directory and pull request template exist.                      |

The package name and version are `complaint-management` and `0.1.0-rc.1`. Both the release
tag name (`v0.1.0-rc.1`) and the changelog heading (`[0.1.0-rc.1]`) match the package version,
and the tagged commit is an ancestor of the audited `main` commit.

One discrepancy was found: `git cat-file -t v0.1.0-rc.1` reports `commit`, meaning the published
release tag is lightweight. `CONTRIBUTING.md` requires annotated tags. The existing published
tag was not changed; follow-up is tracked in issue #24.

The report adds `docs/` to CI-14 so the PCA (and future audit records) are registered. The
initial configuration-path inventory found no other missing or unregistered configuration items.

## Conclusion

All registered paths in the audited baseline exist, and the package, release tag name, and
changelog version agree. The lightweight-tag policy discrepancy is recorded in issue #24.
