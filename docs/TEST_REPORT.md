# CCMS Test and Verification Report

**Status:** Partial execution record; not a complete test report or release approval. Updated
2026-10-20.

## Repository and CI evidence

| Source                                                 | Checks                                                             | Result                                                                                        |
| ------------------------------------------------------ | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| Main `223da99`                                         | PCA path inventory, ignored `.env` check, release tag object check | All registered paths present in 139 tracked paths; `.env` not tracked; `v0.1.0-rc.1` is lightweight |
| PR #39 head `ee7156a35b1214aabb3a0ed18f37854d68c2a102` | CI workflow: frozen install, lint, typecheck, tests, build         | Passed (GitHub run 39249313487, completed 2026-10-19 12:05 UTC); suite: 6 files / 32 tests    |
| PR #40 head `cff73a08971f397ec16cee329cfb57a414f5a587` | CI workflow: frozen install, lint, typecheck, tests, build         | Passed (GitHub run 39250000423); documentation changes only                                   |
| PR #38 head `1e8483696852e642c12e53284612b2d9a0f04bda` | Local: frozen install, lint, typecheck, tests, build, audit        | Passed 2026-10-19 (fork PR; GitHub CI required maintainer approval and did not run); 36 tests |
| Merged `main` (#38 + #39) before this PR               | Local: lint, typecheck, tests, build on the combined result        | Passed 2026-10-19; 6 files / 45 tests                                                         |

The PR #39 CI run applies to its feature-branch revision. PRs #38 and #39 have since been merged to
`main`; main CI run `39251935863` passed on `223da99`. The owner decided Realtime is not required
for this closeout, and migration `0002` was not applied.

## User-assisted live checks

Older checks used the feature preview; the 2026-10-20 checks used a local preview of `main`
commit `223da99` connected to the configured backend. This does not independently verify the
hosted frontend deployment or complete a role-by-role FCA.

| Check                                  | Observed result                                                                           | Limitation                                                                                                                                  |
| -------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Two simultaneous complaint submissions | Both requests returned HTTP 201 and both complaints were assigned using category fallback | No available HVAC-matching technician was found; both went to the same technician. Distribution across multiple technicians was not tested. |
| Complaint submission retries           | Four labeled test complaints, CC-1007 through CC-1010, were created                       | They remain in the live database. Cleanup was not authorized/performed.                                                                     |
| Password recovery                      | User confirmed the email arrived and password update succeeded                            | Exact redirect target and deployed allow-list were not captured independently.                                                              |
| Technician complaint submission        | Technician test account submitted complaints in the feature preview                       | Full role navigation/access matrix remains to be verified.                                                                                  |
| Admin pages | Dashboard, admin, manager, reports, and notifications loaded data in the latest-main local preview connected to the configured backend | Page loads alone do not prove all actions or role boundaries. |
| Complaint CC-1011 | Submitted with authorization, category-fallback assigned, then timeline showed Registered → Assigned → In Progress → Resolved; registration and assignment notifications appeared after refresh | Record remains Resolved, not Closed. Other notification recipients and every transition edge were not checked. |
| Reports and CSV | HVAC filter reduced 8 results to 4; generated CSV Blob contained expected header and 8 data rows | Tested before CC-1011 creation; actual browser download event and post-creation export were not independently verified. |

## Outstanding verification

- Realtime push/migration are deferred by owner decision and are not claimed as verified.
- Complete remaining [TEST_PLAN.md](TEST_PLAN.md) cases, especially signup, photo upload, role/RLS
  boundaries, admin writes, reset redirect, notification recipients, and status closure.
- Obtain owner approval or explicit acceptance of outstanding SCM documentation and release baseline.
- Do not delete the labeled test complaints unless separately authorized.
