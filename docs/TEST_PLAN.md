# CCMS Functional and Release Test Plan

**Status:** Draft; not approved by the project owner. This plan is not evidence that every test has
passed. Record execution outcomes in [TEST_REPORT.md](TEST_REPORT.md) and the FCA.

## Scope

Verify the browser application, role boundaries, complaint lifecycle, database-backed behavior, and
release build. Automated tests/CI establish code-level checks only; live Supabase/Lovable Cloud
tests require an authorized test project and test accounts.

## Test environment and controls

- Record the source commit/PR, app URL, backend project ID, browser, date, and tester role.
- Use dedicated test accounts and non-sensitive test complaints. Never record passwords, tokens, or
  reset links.
- Obtain approval before creating or deleting records in a shared/production backend. Identify test
  records and clean them up only with explicit authorization.
- Do not use service-role credentials in browser tests.

## Automated checks

Run from the repository root:

```sh
bun install --frozen-lockfile
bun run lint
bunx tsc --noEmit
bun run test
bun run build
```

Record the exact commit, command, result, and relevant CI run. Passing CI does not prove live
database configuration or authorization.

## Functional test cases

| ID    | Scenario                                                                  | Expected result                                                                                               | Evidence to retain                                          |
| ----- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| FT-01 | Student/faculty signup, email confirmation, sign-in, sign-out             | Account can sign in; self-signup cannot grant staff roles                                                     | Redacted result and role                                    |
| FT-02 | Invalid login and malformed signup inputs                                 | Action is rejected with clear feedback                                                                        | Redacted result                                             |
| FT-03 | Password recovery from email link                                         | Link reaches approved reset route; password update works; user can sign in with new password                  | Redirect target, role, and outcome; no email/token/password |
| FT-04 | Submit valid complaint with and without a photo                           | Ticket is created with selected category/location; photo is private; ticket number is shown                   | Ticket IDs and redacted screenshots                         |
| FT-05 | Submit invalid title/description/category/location/photo                  | Client/server validation rejects invalid data and exposes an actionable message                               | Validation results                                          |
| FT-06 | Category-matching available technician exists                             | Complaint is assigned to a matching available technician                                                      | Ticket and role-safe assignment evidence                    |
| FT-07 | No available category match, but another technician is available          | Fallback assignment occurs                                                                                    | Ticket and assignment evidence                              |
| FT-08 | No technicians are available                                              | Complaint remains Registered and is visible to authorized estate staff                                        | Ticket and role-safe result                                 |
| FT-09 | Submit complaints concurrently                                            | Each request completes; assignment selection obeys availability/workload rules without race-condition failure | Request outcomes and resulting assignments                  |
| FT-10 | Technician sees assigned jobs and changes status                          | Only permitted transitions succeed; invalid transitions are rejected server-side                              | Role and status history                                     |
| FT-11 | Reporter, assigned technician, and staff access complaint detail/history  | Each can see only the data permitted by RLS                                                                   | Role-by-role access matrix                                  |
| FT-12 | Notifications and history after submission, assignment, and status change | Database-generated records appear for intended recipients                                                     | Redacted notification/history results                       |
| FT-13 | Estate manager assignment, queue, SLA views                               | Staff-only functions work; unauthorized roles are denied                                                      | Role and result                                             |
| FT-14 | Admin role/category/location management                                   | Admin operations work; non-admin access is rejected                                                           | Role and result                                             |
| FT-15 | Reports filters, metrics, CSV export                                      | Staff can filter/export correct records; other roles cannot access reports                                    | Filter inputs and redacted CSV sample                       |
| FT-16 | Realtime complaint/status update                                          | Authorized reporter, technician, and staff views update promptly; cleanup removes subscriptions               | Timestamped sender/receiver evidence and console errors     |
| FT-17 | Mobile and desktop navigation/accessibility smoke test                    | Navigation, labels, loading/errors, and keyboard interaction are usable                                       | Browser/device and issues                                   |

For each case mark **Pass**, **Fail**, **Blocked**, or **Not run**; include expected/actual results,
test role, date, and linked defect. Do not mark a case Pass based only on code inspection.

## Exit criteria

- Required automated checks pass on the exact release candidate.
- No unresolved release-blocking defects; role/RLS and database migrations are verified against the
  intended backend.
- Required live functional cases are executed or formally accepted as deferred by the owner.
- FCA/PCA, test report, release approval, and dated changelog entry identify the same source baseline.
