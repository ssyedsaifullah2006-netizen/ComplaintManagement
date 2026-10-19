# Configuration Status Accounting

Tracks repository baselines, changes, CI results, audits, and unresolved configuration or product
requirements. Status is evidence-based; a merged PR or green CI does not by itself prove live
backend behavior or an approved product baseline. Last updated: 2026-10-19.

## Baselines and releases

| Version / baseline | Commit    | State                                                                                      |
| ------------------ | --------- | ------------------------------------------------------------------------------------------ |
| Initial source     | `4ed6332` | Initial repository source, version `0.0.0`                                                 |
| `v0.1.0-rc.1`      | `44803d3` | Published release candidate; tag is lightweight, not annotated. Not a final release        |
| Current main | `236be48` | Includes merged PRs #31 and #37; current package version remains `0.1.0-rc.1` |
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

| Issue | PR     | Change                                                             | Repository/CI evidence                                                                                                 | Live behavior evidence                                                                                  |
| ----- | ------ | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| #1-#7 | #8-#13 | Lockfile, lint, CI, tests, package identity, and SCM documentation | Recorded in the historical entries below and GitHub PRs                                                                | Not applicable to all items                                                                             |
| #14   | #22    | Component test proposal                                            | PR closed without merge; no component test suite from that PR is present                                               | Not applicable                                                                                          |
| #15   | #23    | Resolve React Refresh lint warnings                                | Merged; CI passed                                                                                                      | Not applicable                                                                                          |
| #16   | —      | Functional Configuration Audit                                     | Issue closed after owner comment “everything is verified”; no reproducible FCA report/evidence was present at baseline | Incomplete / not independently evidenced                                                                |
| #17   | #25    | Physical Configuration Audit                                       | PCA recorded; rechecked against current main `aeaf61e` in [PCA.md](PCA.md)                                             | Does not test live backend                                                                              |
| #20   | #21    | Prepare `v0.1.0-rc.1`                                              | Merged; release candidate exists                                                                                       | Not applicable                                                                                          |
| #24   | —      | Record lightweight tag discrepancy                                 | Closed; tag unchanged and remains lightweight                                                                          | Not applicable                                                                                          |
| #28   | #29    | Automatic technician assignment                                    | Merged; main CI run `39117462892` passed                                                                               | 2026-10-19: two concurrent live submissions both returned HTTP 201 and reached Assigned; both used the documented fallback because no available HVAC-matching technician was found. Four clearly labeled test complaints CC-1007–CC-1010 remain in the live project. |
| #30   | #31    | Password recovery                                                  | Merged; main CI run `39122094293` passed                                                                               | 2026-10-19: user confirmed the email arrived and they completed the password update from its link; exact callback URL and allow-list were not independently captured |
| #32 | #37 | Align SCM records with SCM1/SCM2 | Merged; CI passed | Not applicable |
| #33-#35 | #39 | Reports, realtime updates, and technician complaint entry | PR open; CI passed; changes remain on the feature branch | 2026-10-19: technician test account submitted four labeled complaints through the live-connected feature preview. Owner authorized migration 0002, but it remains unapplied because no direct migration URL/credentials are configured and the Lovable workspace has no credits or SQL console. Reports and Realtime still need live role/subscription verification. |

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

| Gap                                                                                   | State                                                                                                                          | Tracked in   |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------ |
| SCM1/SCM2 logical CI mapping, status accounting, tool claims, and audit evidence      | This documentation change                                                                                                      | #32          |
| FCA evidence absent despite issue #16 being closed                                    | FCA record explicitly incomplete; must be tested in the authorized live environment                                            | #32          |
| Reports/export and service-performance analytics                                      | Staff report filters and CSV export implemented on feature branch; pending merge and live authorization verification           | #33          |
| Real-time complaint updates                                                           | Client subscriptions and publication migration implemented on feature branch; owner approved migration 0002, but direct database credentials or SQL console are unavailable; live verification remains pending | #34          |
| Technician complaint reporting entry point                                            | Technician navigation to own complaint list/form added on feature branch; live test account filed four test complaints; pending merge | #35          |
| Plans, approved requirements/design, formal test artifacts, manuals, deployment guide | Not found in repository                                                                                                        | #36          |
| Database rules lack automated tests                                                   | Not covered by the current browser/unit test suite                                                                             | No issue yet |
| Password reset email delivery/redirect configuration                                  | User confirmed delivery and successful password update; exact callback URL and deployed allow-list not independently verified | #31          |

## Audit state

| Audit                                | Status                                    | Evidence                                                     |
| ------------------------------------ | ----------------------------------------- | ------------------------------------------------------------ |
| Functional Configuration Audit (FCA) | **Incomplete; no pass claimed**           | [FCA.md](FCA.md); issue #16 lacks reproducible live evidence |
| Physical Configuration Audit (PCA)   | **Path inventory rechecked at `aeaf61e`** | [PCA.md](PCA.md); lightweight tag discrepancy remains        |

The project is not ready for a final `v0.1.0` baseline until its functional requirements and
deliverables are verified, discrepancies resolved or formally accepted, and approvals recorded.
