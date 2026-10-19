# Functional Configuration Audit (FCA)

## Audit status

**Incomplete — no pass or release-baseline claim. Last evidence update: 2026-10-19.**

Issue #16 was closed after the project owner commented that features were verified. The checks
recorded below supplement that report but do not cover every requirement. Automated CI does not
exercise a live Supabase/Lovable Cloud project. A complete FCA must record test account/role
(without credentials), deployed app/backend environment, steps, expected and actual results, and
evidence for every requirement. User-confirmed or observed checks are identified as such; no
credentials or personal identifiers are recorded.

## Requirement checklist

| Requirement                                                                         | Source evidence                                                                               | Live end-to-end result                                                                                                                                                                                                                                       |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Students/faculty sign up and sign in                                                | `src/routes/auth.tsx`                                                                         | Not evidenced in this audit                                                                                                                                                                                                                                  |
| Register complaints with category, location, description, optional photo            | `src/routes/_authenticated/complaints.new.tsx`                                                | Four labeled test complaints were submitted from the PR #39 feature preview. Records CC-1007 through CC-1010 remain in the live database; this is partial submission evidence, not a complete validation of all form paths.                                  |
| Automatically assign an available category-matching technician; otherwise fall back | `drizzle/migrations/0001_auto_assign_complaints.sql`                                          | Two concurrent submissions in the feature preview returned HTTP 201 and were assigned using category fallback. No matching available HVAC technician was found; both were assigned to the same technician. Multi-technician distribution is not established. |
| Track Registered → Assigned → In Progress → Resolved → Closed                       | `src/lib/ccms.ts`, `drizzle/migrations/0000_migration.sql`                                    | Not evidenced end to end                                                                                                                                                                                                                                     |
| Notify reporters, assigned technicians, and estate staff                            | Database functions in `drizzle/migrations/` and `src/routes/_authenticated/notifications.tsx` | Not evidenced end to end                                                                                                                                                                                                                                     |
| Technician work queue and availability                                              | `src/routes/_authenticated/technician.tsx`                                                    | Technician account was used to submit test complaints from the feature preview; queue/status/availability checks are not fully evidenced.                                                                                                                    |
| Estate-manager assignment, SLA overview, and technician workload                    | `src/routes/_authenticated/manager.tsx`                                                       | Not evidenced end to end                                                                                                                                                                                                                                     |
| Administrator user, role, category, and location management                         | `src/routes/_authenticated/admin.tsx`                                                         | Not evidenced end to end                                                                                                                                                                                                                                     |
| Password recovery email and password update                                         | `src/routes/forgot-password.tsx`, `src/routes/reset-password.tsx`                             | User confirmed the reset email arrived and password update succeeded. Exact redirect target and deployed allow-list were not independently captured.                                                                                                         |
| Maintenance reports and CSV export                                                  | `src/routes/_authenticated/reports.tsx` in open PR #39                                        | Unit/source checks are recorded for PR #39; live staff authorization, filters, and export have not been verified. PR is not merged.                                                                                                                          |
| Real-time complaint updates                                                         | Client subscription and migration in open PR #39                                              | Not live-verified. Migration `0002_enable_complaint_realtime.sql` is not applied. Reporter/technician/staff subscription authorization and delivery remain unverified.                                                                                       |
| Technician complaint entry point                                                    | Complaint form and technician navigation change in open PR #39                                | Test complaints were submitted by a technician account on the feature preview. PR is not merged; role-specific navigation tests and post-merge verification remain outstanding.                                                                              |
| SCM plans, approved requirements/design, test artifacts, and manuals                | SCM records and draft documents in `docs/`                                                    | Draft guides and test plan are not stakeholder-approved deliverables; approved plans/designs remain absent.                                                                                                                                                  |

Live checks were performed against the feature preview, not the current `main` deployment. No
cleanup of the four test complaints has been performed. See [TEST_REPORT.md](TEST_REPORT.md) for
the check record and open verification items.

## Verification boundary

Local lint, typecheck, unit/routing tests, and production builds establish source/build quality only.
They are not substitutes for live functional testing. The migration and recovery email behavior must
be tested through the authorized project environment before this audit can pass. Record any failed
checks as issues and update this report with dated evidence before baselining a final release.
