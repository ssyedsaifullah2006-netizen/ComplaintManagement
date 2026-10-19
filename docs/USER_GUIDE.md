# CCMS User Guide

**Status:** Draft for owner review. Describes the repository at `main` commit `236be48` and
identifies behavior that is only available in open PR #39.

## Account access

1. Open the CCMS sign-in page.
2. To create an account, choose **Create account**, enter your name, campus email, password, and
   student or faculty role, then submit. Complete email confirmation if Supabase requests it.
3. Sign in with your email and password.
4. Use **Forgot password?** to request a recovery email. Open its link in the deployed app and use
   the reset form to choose a new password. If the link is invalid or expired, request another.

Self-service signup offers student and faculty roles only. Technicians, estate managers, and
administrators are provisioned or assigned by authorized staff.

## Reporting a complaint

1. Open **My Complaints** and choose **New complaint**.
2. Enter a title (5–120 characters), choose a category and building/location, and provide a
   description (10–2,000 characters). Room/spot and photo are optional. A photo must be an image
   smaller than 5 MB.
3. Select a priority and submit. The app displays the ticket number and opens its detail page.
4. Check **My Complaints** or the complaint detail page for assignment and status.

An available technician is selected automatically. Category-matching technicians are preferred;
when none is available, an available technician from another category may be selected. If no
technician is available, the complaint remains Registered for staff assignment.

Technicians' complaint-entry navigation is included in open PR #39 and is not part of the current
`main` baseline. After that change is merged and deployed, technicians can use **My Complaints** and
its **New complaint** action to report a campus issue. Their assigned jobs remain under **My Jobs**.

## Complaint statuses

| Status      | Meaning                                                                            |
| ----------- | ---------------------------------------------------------------------------------- |
| Registered  | Submitted; awaiting assignment                                                     |
| Assigned    | A technician has been assigned                                                     |
| In Progress | The technician has started work                                                    |
| Resolved    | The technician marked the work complete; reporter/staff may still need to close it |
| Closed      | The complaint workflow is complete                                                 |

The current `main` version refreshes complaint data by polling. Realtime updates are under
implementation in PR #39 and require a database migration before live use.

## Notifications and account safety

Use **Notifications** to view in-app updates. Do not share passwords or reset links. Contact an
administrator if your account has the wrong role or if you cannot see a complaint you are entitled
to access.
