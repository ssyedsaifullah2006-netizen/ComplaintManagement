# Functional Configuration Audit (FCA)

## Audit status

**Incomplete — no pass or release-baseline claim.**

Issue #16 was closed after the project owner commented that features were verified. At the current
repository baseline, however, no checklist results, test report, screenshots, or reproducible
end-to-end evidence from the live backend were present. This record makes that evidence gap explicit;
it does not invalidate the owner's report, but it cannot independently substantiate it.

The application has automated checks, but they do not exercise a live Supabase/Lovable Cloud
project. A complete FCA must record the test account/role (without credentials), deployment and
backend environment, steps, expected and actual results, and evidence for each row below.

## Requirement checklist

| Requirement                                                                                                                                      | Source evidence                                                                                                            | Live end-to-end result                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Students/faculty sign up and sign in                                                                                                             | `src/routes/auth.tsx`                                                                                                      | Not evidenced in this audit                                                                          |
| Register complaints with category, location, description, optional photo                                                                         | `src/routes/_authenticated/complaints.new.tsx`                                                                             | Not evidenced in this audit                                                                          |
| Automatically assign an available category-matching technician; if none matches, assign another available technician; otherwise leave Registered | `drizzle/migrations/0001_auto_assign_complaints.sql`                                                                       | Migration application reported by owner; simultaneous submissions have not been independently tested |
| Track Registered → Assigned → In Progress → Resolved → Closed                                                                                    | `src/lib/ccms.ts`, `drizzle/migrations/0000_migration.sql`                                                                 | Not evidenced in this audit                                                                          |
| Notify reporters, assigned technicians, and estate staff                                                                                         | Database functions in `drizzle/migrations/` and `src/routes/_authenticated/notifications.tsx`                              | Not evidenced in this audit                                                                          |
| Technician work queue and availability                                                                                                           | `src/routes/_authenticated/technician.tsx`                                                                                 | Not evidenced in this audit                                                                          |
| Estate-manager assignment, SLA overview, and technician workload                                                                                 | `src/routes/_authenticated/manager.tsx`                                                                                    | Not evidenced in this audit                                                                          |
| Administrator user, role, category, and location management                                                                                      | `src/routes/_authenticated/admin.tsx`                                                                                      | Not evidenced in this audit                                                                          |
| Password recovery email and password update                                                                                                      | `src/routes/forgot-password.tsx`, `src/routes/reset-password.tsx`                                                          | Email delivery and redirect allow-list not evidenced                                                 |
| Maintenance reports for service-quality/performance decisions                                                                                    | Staff-only report route with date/status/category filters, metrics, and CSV export is in the feature branch                | Pending merge, deployment, and live role/RLS verification; tracked in issue #33                      |
| Real-time status updates                                                                                                                         | Client subscriptions and an idempotent publication migration for complaints and timeline updates are in the feature branch | Pending migration application and live authorization/connection verification; tracked in issue #34   |
| Technician complaint registration                                                                                                                | Technician navigation now exposes their own complaints and the existing registration form in the feature branch            | Pending merge and live role verification; tracked in issue #35                                       |
| SCM plans, formal test artifacts, manuals, and deployment guide                                                                                  | Not present in tracked repository                                                                                          | Tracked in issue #36                                                                                 |

## Verification boundary

Local lint, typecheck, unit/routing tests, and production builds establish source/build quality only.
They are not substitutes for live functional testing. The migration and recovery email behavior must
be tested through the authorized project environment before this audit can pass. Record any failed
checks as issues and update this report with dated evidence before baselining a final release.
