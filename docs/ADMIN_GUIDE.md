# CCMS Administrator and Estate Staff Guide

**Status:** Draft for owner review. Verify against the final merged release before approval.

## Estate manager workflow

1. Sign in with an estate-manager account and open **All Complaints**.
2. Filter complaints by status or category. Review registered complaints and the technician-load
   panel.
3. Assign or reassign a technician to a complaint that is Registered or Assigned.
4. Monitor status, response targets, and overdue work.

Estate staff can view the staff complaint queue and perform assignments. The server-side
`assign_technician` function enforces assignment rules; client-side role checks are not a substitute
for database authorization.

## Administrator workflow

Open **Administration** using an admin account:

- **Users & roles:** Search accounts and change roles. A user cannot change their own role from this
  page. Technicians may have a service category/trade.
- **Categories:** Add or remove complaint categories and set a response target in hours. The UI
  accepts a target from 1 to 720 hours.
- **Locations:** Add or remove campus buildings/locations.

Role changes are sent through the database function `set_user_role`. Do not grant privileged roles
by directly editing client data or by modifying a user's signup payload. Signup is limited to
student/faculty; administrative role changes require an authorized admin session.

## Technician workflow

Technicians use **My Jobs** to see assigned active and completed work. They can toggle availability
and move an assigned job to In Progress, then to Resolved. The database function
`update_complaint_status` validates permitted transitions. The technician complaint-reporting entry
point is part of open PR #39; verify after merge/deployment.

## Reports and audit trail

Maintenance reports and CSV export are implemented in open PR #39, not the current `main` baseline.
After merge, verify the route is staff-only, filters match the intended period/category/status, and
the downloaded CSV contains only authorized data.

Complaint history and notification rows are written by database triggers/functions. Do not insert
or edit those rows directly from the client; preserving the database-generated audit trail is
required.

## Access and incident handling

- Use individual named accounts and grant only the role required for the person's work.
- Never place service-role credentials in browser code, tickets, screenshots, or this repository.
- If data appears to cross user/role boundaries, stop testing with real data and report it to the
  project owner for an RLS review.
- Do not delete live test or user complaints without the owner's explicit approval and a verified,
  narrowly scoped cleanup procedure.
