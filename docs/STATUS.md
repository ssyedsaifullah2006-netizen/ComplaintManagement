# Configuration Status Accounting

Tracks repository baselines, changes, CI results, audits, and unresolved configuration or product
requirements. Status is evidence-based; a merged PR or green CI does not by itself prove live
backend behavior or an approved product baseline. Last updated: 2026-10-19.

## Baselines and releases

| Version / baseline | Commit    | State                                                                                      |
| ------------------ | --------- | ------------------------------------------------------------------------------------------ |
| Initial source     | `4ed6332` | Initial repository source, version `0.0.0`                                                 |
| `v0.1.0-rc.1`      | `44803d3` | Published release candidate; tag is lightweight, not annotated. Not a final release        |
| Current main       | `1f85c46` | Includes merged PRs #31, #37, #38 and #39; package version remains `0.1.0-rc.1`            |
| `v0.1.0`           | Pending   | Do not tag until FCA evidence, PCA, release review, and dated changelog entry are complete |

`v0.1.0-rc.1` points to a commit object instead of an annotated tag object. Issue #24 records the
policy discrepancy. The published tag will not be rewritten; use annotated tags for future releases.

## CI lifecycle and accountable ownership

SCM1 logical names and repository mappings are in [CI_REGISTER.md](../CI_REGISTER.md). Logical
`v1.0` identifiers do not mean a CI is approved or baselined. Git commits and PRs identify exact
revisions. A complete per-CI individual owner/approval register is not available in the source
documents or GitHub records reviewed; owners and approvals are therefore recorded as **not
established**, not inferred from a single commit author. PR review/merge and CI results are evidence
of change control, not substitutes for named CI approval.

## Change and verification log

| Issue         | PR     | Change                                                                  | Repository/CI evidence                                                                                                                        | Live behavior evidence                                                                                  |
| ------------- | ------ | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| #1-#7         | #8-#13 | Lockfile, lint, CI, tests, package identity, and SCM documentation      | Recorded in the historical entries below and GitHub PRs                                                                                       | Not applicable to all items                                                                             |
| #14           | #22    | Component test proposal                                                 | PR closed without merge; no component test suite from that PR is present                                                                      | Not applicable                                                                                          |
| #15           | #23    | Resolve React Refresh lint warnings                                     | Merged; CI passed                                                                                                                             | Not applicable                                                                                          |
| #16           | —      | Functional Configuration Audit                                          | Issue closed after owner comment “everything is verified”; no reproducible FCA report/evidence was present at baseline                        | Incomplete / not independently evidenced                                                                |
| #17           | #25    | Physical Configuration Audit                                            | Rechecked against current main `236be48` in [PCA.md](PCA.md)                                                                                  | Does not test live backend                                                                              |
| #20           | #21    | Prepare `v0.1.0-rc.1`                                                   | Merged; release candidate exists                                                                                                              | Not applicable                                                                                          |
| #24           | —      | Record lightweight tag discrepancy                                      | Closed; tag unchanged and remains lightweight                                                                                                 | Not applicable                                                                                          |
| #28           | #29    | Automatic technician assignment                                         | Merged; main CI run `39117462892` passed                                                                                                      | Owner reports migration applied through Lovable Cloud; not independently verified from this environment |
| #30           | #31    | Password recovery                                                       | Merged; main CI run `39122094293` passed                                                                                                      | Email delivery and deployed redirect allow-list not verified                                            |
| #32           | #37    | Align SCM records with SCM1/SCM2                                        | Merged; SCM mapping, status, and audit records updated                                                                                        | Not applicable                                                                                          |
| #33, #34, #36 | #39    | Reports/export, technician complaint entry, and realtime source changes | Merged (`545b8d7`); CI run `39249313487` passed on the branch. #34 closed; #33 and #36 remain open                                            | Reports/realtime not verified live; Realtime migration `0002` unapplied                                 |
| #35           | #40    | SCM project artifacts and manuals                                       | Documentation CI passed; owner approval and missing plans/designs remain outstanding (issue stays open)                                       | Not applicable                                                                                          |
| —             | #38    | SLA tracking response time (external contributor)                       | Merged (`1f85c46`) after local install, lint, typecheck, 36 tests, build and audit passed; fork CI needed maintainer approval and did not run | Manual in-app check not performed                                                                       |

Historical initial-source checks (run 2026-10-17) are retained as a snapshot, not current results:

| Check                           | Initial-source result                                         |
| ------------------------------- | ------------------------------------------------------------- |
| `bun install --frozen-lockfile` | Failed: lockfile pinned to a private package cache (HTTP 403) |
| `bun run lint`                  | Failed: 715 errors and 7 warnings                             |
| `bunx tsc --noEmit`             | Passed                                                        |
| `bun run test`                  | Passed: 1 routing test                                        |
| `bun run build`                 | Passed                                                        |

The current CI workflow runs `bun install --frozen-lockfile`, lint, TypeScript checking, tests, and
production build. The latest verified main runs after PR #29 and #31 passed: `39117462892` and
`39122094293`, respectively. These validate the repository build, not live service configuration.

## Open discrepancies and follow-up work

| Gap                                                                              | State                                                                                                 | Tracked in   |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------ |
| SCM1/SCM2 logical CI mapping, status accounting, tool claims, and audit evidence | This documentation change                                                                             | #32          |
| FCA evidence absent despite issue #16 being closed                               | FCA record explicitly incomplete; must be tested in the authorized live environment                   | #32          |
| Reports/export and service-performance analytics                                 | Merged in PR #39; live staff authorization/filter/CSV verification remains                            | #33          |
| Real-time complaint updates                                                      | Merged in PR #39; migration `0002` is unapplied and delivery/authorization unverified                 | #36          |
| Technician complaint reporting entry point                                       | Merged in PR #39 and issue #34 closed; confirm on the deployed `main` build with a technician account | #34          |
| Project/SCM/risk plans, approved SRS/HLD/LLD/UML/database design                 | Not available from repository evidence; owner-provided approved source materials required             | #35          |
| Test plan/report and user/admin/deployment manuals                               | Draft documents added; owner review/approval and check against final merged behavior required         | #35          |
| Database rules lack automated tests                                              | Not covered by the current browser/unit test suite                                                    | No issue yet |
| Password reset email delivery/redirect configuration                             | User confirmed email and password update; exact redirect target/allow-list not independently captured | #31 / FCA    |
| Previous release tag metadata                                                    | `v0.1.0-rc.1` is lightweight; preserve published tag and use annotated tags going forward             | #24          |

## Audit state

| Audit                                | Status                                    | Evidence                                                     |
| ------------------------------------ | ----------------------------------------- | ------------------------------------------------------------ |
| Functional Configuration Audit (FCA) | **Incomplete; no pass claimed**           | [FCA.md](FCA.md); issue #16 lacks reproducible live evidence |
| Physical Configuration Audit (PCA)   | **Path inventory rechecked at `236be48`** | [PCA.md](PCA.md); lightweight tag discrepancy remains        |

The project is not ready for a final `v0.1.0` baseline. Rerun the PCA at the
resulting merged baseline, apply and verify the Realtime migration, finish live functional tests,
resolve or formally accept outstanding SCM deliverables, record owner approvals, and update the
dated changelog before release.
