# Functional Configuration Audit (FCA)

## Audit status

**Partial — no pass or release-baseline claim. Last evidence update: 2026-10-20.**

Issue #16 was closed after the project owner commented that features were verified. The evidence
below supplements that report, but does not cover every requirement or constitute formal release
approval. The application was tested from local preview commit `223da99` against its configured
Lovable Cloud backend using an owner-authorized administrator session. No credentials or personal
identifiers are recorded.

## Requirement checklist

| Requirement                                                                         | Source evidence                                                                                   | Live end-to-end result                                                                                                                                                                                                                                       |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Students/faculty sign up and sign in                                                | `src/routes/auth.tsx`                                                                             | Not evidenced in this audit                                                                                                                                                                                                                                  |
| Register complaints with category, location, description, optional photo            | `src/routes/_authenticated/complaints.new.tsx`                                                    | Submitted authorized test complaint CC-1011 from local preview; details page loaded. Photo upload and invalid-input cases were not tested.                                                                                                                   |
| Automatically assign an available category-matching technician; otherwise fall back | `drizzle/migrations/0001_auto_assign_complaints.sql`                                              | CC-1011 timeline recorded category fallback assignment. Earlier concurrent feature-preview submissions also returned HTTP 201 and used fallback; distribution across multiple technicians remains untested.                                                    |
| Track Registered → Assigned → In Progress → Resolved → Closed                       | `src/lib/ccms.ts`, `drizzle/migrations/0000_migration.sql`                                        | CC-1011 timeline showed Registered, Assigned, In Progress, and Resolved. Closed was not tested.                                                                                                                                                              |
| Notify reporters, assigned technicians, and estate staff                            | Database functions in `drizzle/migrations/` and `src/routes/_authenticated/notifications.tsx`     | Reporter registration and assignment notifications appeared after refreshing Notifications. Technician/staff recipients were not independently checked.                                                                                                        |
| Technician work queue and availability                                              | `src/routes/_authenticated/technician.tsx`                                                        | Assigned technician moved CC-1011 to In Progress and Resolved; availability toggle was not tested.                                                                                                                                                           |
| Estate-manager assignment, SLA overview, and technician workload                    | `src/routes/_authenticated/manager.tsx` (SLA badges and overdue filter: PR #38; unit-tested only) | Manager page loaded backend complaint data; assignment and workload actions were not tested.                                                                                                                                                                 |
| Administrator user, role, category, and location management                         | `src/routes/_authenticated/admin.tsx`                                                             | Admin page loaded user, technician, category, and location listings. No roles or lookup records were changed.                                                                                                                                                 |
| Password recovery email and password update                                         | `src/routes/forgot-password.tsx`, `src/routes/reset-password.tsx`                                 | User confirmed the reset email arrived and password update succeeded. Exact redirect target and deployed allow-list were not independently captured.                                                                                                         |
| Maintenance reports and CSV export                                                  | `src/routes/_authenticated/reports.tsx` (merged, PR #39)                                          | Reports loaded live data; HVAC filter reduced 8 results to 4. Generated CSV Blob had expected 12-column header and 8 data rows. Browser download event and post-CC-1011 export were not checked.                                                                |
| Real-time complaint updates                                                         | Client subscription and migration (merged, PR #39)                                                | Owner accepted real-time push as not required for this closeout. Migration `0002_enable_complaint_realtime.sql` was not applied; delivery is not claimed.                                                                                                     |
| Technician complaint entry point                                                    | Complaint form and technician navigation change (merged, PR #39)                                  | Technician complaint submission was exercised in earlier feature-preview checks; full role navigation/access matrix remains untested.                                                                                                                        |
| SCM plans, approved requirements/design, test artifacts, and manuals                | SCM records and draft documents in `docs/`                                                        | Draft guides and test plan are not stakeholder-approved deliverables; approved plans/designs remain absent.                                                                                                                                                  |

CC-1011 remains in the connected backend in Resolved status, not Closed. Earlier test records
CC-1007 through CC-1010 also remain. No test records were deleted. See [TEST_REPORT.md](TEST_REPORT.md)
for the check record and remaining verification items.

## Verification boundary

Local lint, typecheck, unit/routing tests, and production builds establish source/build quality only.
They are not substitutes for live functional testing. Signup, photo handling, role/RLS boundaries,
admin writes, password-reset redirect, full notification recipients, closure, and several error
paths remain untested. Realtime push is explicitly deferred by the owner and is not claimed as
verified. Do not claim a final `v0.1.0` release until the remaining verification and documentation
gaps are accepted and formal release approval is recorded.
