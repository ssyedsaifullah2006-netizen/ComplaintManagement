# CCMS Test and Verification Report

**Status:** Partial execution record; not a complete test report or release approval. Updated
2026-10-19.

## Repository and CI evidence

| Source                                                 | Checks                                                             | Result                                                                                     |
| ------------------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Main `236be48`                                         | PCA path inventory, ignored `.env` check, release tag object check | All registered paths present; `.env` not tracked; `v0.1.0-rc.1` is lightweight             |
| PR #39 head `ee7156a35b1214aabb3a0ed18f37854d68c2a102` | CI workflow: frozen install, lint, typecheck, tests, build         | Passed (GitHub run 39249313487, completed 2026-10-19 12:05 UTC); suite: 6 files / 32 tests |
| PR #38 head `1e8483696852e642c12e53284612b2d9a0f04bda` | CI workflow                                                        | No checks reported by GitHub at review time; manual app check remains unchecked in the PR  |

The PR #39 checks apply to its feature-branch revision, not current `main`. PR #39 remains open and
unmerged; its Realtime migration has not been applied to the live project.

## User-assisted live checks

Checks below used the feature preview with an authorized test account. They are not a complete
role-by-role FCA and do not imply that the current `main` deployment has these changes.

| Check                                  | Observed result                                                                           | Limitation                                                                                                                                  |
| -------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Two simultaneous complaint submissions | Both requests returned HTTP 201 and both complaints were assigned using category fallback | No available HVAC-matching technician was found; both went to the same technician. Distribution across multiple technicians was not tested. |
| Complaint submission retries           | Four labeled test complaints, CC-1007 through CC-1010, were created                       | They remain in the live database. Cleanup was not authorized/performed.                                                                     |
| Password recovery                      | User confirmed the email arrived and password update succeeded                            | Exact redirect target and deployed allow-list were not captured independently.                                                              |
| Technician complaint submission        | Technician test account submitted complaints in the feature preview                       | Post-merge/current production behavior and full role navigation/access matrix remain to be verified.                                        |

## Outstanding verification

- Apply and verify PR #39's Realtime publication migration after merge; test authorized delivery and
  subscription cleanup for reporters, technicians, and estate staff.
- Verify the reports page, staff authorization, filters, metrics, and CSV output against live data.
- Complete functional cases in [TEST_PLAN.md](TEST_PLAN.md), including lifecycle, notifications,
  role/RLS boundaries, and password-reset redirect configuration.
- Check PR #38 CI and complete its manual app review before treating SLA tracking as released.
- Update this report and [FCA.md](FCA.md) with exact source/deployment baseline and evidence.
