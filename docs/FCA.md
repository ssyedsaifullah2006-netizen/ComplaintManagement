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
| Automatically assign an available category-matching technician; if none matches, assign another available technician; otherwise leave Registered | `drizzle/migrations/0001_auto_assign_complaints.sql`                                                                       | 2026-10-19: two simultaneous live submissions both returned successfully and reached Assigned. Both fell back because no available HVAC-matching technician was found. Four clearly labeled test complaints (CC-1007–CC-1010) were created during retries; all remain in the live project. |
| Track Registered → Assigned → In Progress → Resolved → Closed                                                                                    | `src/lib/ccms.ts`, `drizzle/migrations/0000_migration.sql`                                                                 | Not evidenced in this audit                                                                          |
| Notify reporters, assigned technicians, and estate staff                                                                                         | Database functions in `drizzle/migrations/` and `src/routes/_authenticated/notifications.tsx`                              | Not evidenced in this audit                                                                          |
| Technician work queue and availability                                                                                                           | `src/routes/_authenticated/technician.tsx`                                                                                 | Not evidenced in this audit                                                                          |
| Estate-manager assignment, SLA overview, and technician workload                                                                                 | `src/routes/_authenticated/manager.tsx`                                                                                    | Not evidenced in this audit                                                                          |
| Administrator user, role, category, and location management                                                                                      | `src/routes/_authenticated/admin.tsx`                                                                                      | Not evidenced in this audit                                                                          |
| Password recovery email and password update                                                                                                      | `src/routes/forgot-password.tsx`, `src/routes/reset-password.tsx`                                                          | 2026-10-19: user confirmed the recovery email arrived and they completed the password update from its link. The exact landing URL and deployed redirect allow-list were not independently captured. |
| Maintenance reports for service-quality/performance decisions                                                                                    | Staff-only report route with date/status/category filters, metrics, and CSV export is in the feature branch                | Pending merge, deployment, and live role/RLS verification; tracked in issue #33                      |
| Real-time status updates                                                                                                                         | Client subscriptions and an idempotent publication migration for complaints and timeline updates are in the feature branch | Migration 0002 was authorized on 2026-10-19 but remains unapplied: no direct migration URL/credentials are configured, and no SQL console was available in the Lovable workspace (0 credits). Live authorization/connection verification is also pending; tracked in issue #34. |
| Technician complaint registration                                                                                                                | Technician navigation now exposes their own complaints and the existing registration form in the feature branch            | 2026-10-19: verified via the live-connected feature preview using the technician test account; four labeled test complaints were submitted. Feature branch still awaits merge. |
| SCM plans, formal test artifacts, manuals, and deployment guide                                                                                  | Not present in tracked repository                                                                                          | Tracked in issue #36                                                                                 |

## Verification boundary

Local lint, typecheck, unit/routing tests, and production builds establish source/build quality only.
They are not substitutes for live functional testing. The simultaneous assignment test and recovery
flow now have user-confirmed/live evidence as recorded above. Realtime remains unverified: migration
`0002_enable_complaint_realtime.sql` has not been applied to the live project, and subscription
authorization/connection behavior still needs testing. Record any failed checks as issues and update
this report with dated evidence before baselining a final release. The owner authorized applying
migration `0002` on 2026-10-19; it remains unapplied because this environment has no configured
`LOVABLE_DB_MIGRATION_URL` and the Lovable workspace has no available AI credits or SQL console.
