# CCMS Deployment Guide

**Status:** Draft for owner review. Deployment requires authorized access to the Lovable/Supabase
project. Never put credentials in chat, source control, browser code, or screenshots.

## Prerequisites

- A Bun version compatible with the checked-in project dependencies.
- Access to the GitHub repository and the intended Lovable project.
- Authorized Supabase project access for authentication, database, storage, and migrations.
- A reviewed and merged source commit. Do not deploy feature branches as the production baseline.

## Configure application environment

1. Copy `.env.example` to `.env` locally.
2. Set the public Supabase project URL, publishable key, and project ID from the authorized project.
   The `VITE_` values are exposed to the browser and must be public project values only.
3. Configure `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_PROJECT_ID` for server-side
   application configuration as required by the deployment runtime.
4. Set `SUPABASE_SERVICE_ROLE_KEY` only in the deployment's server-side secret store if the server
   runtime requires it. Never set it as a `VITE_` variable.
5. Keep `.env` out of Git; `.gitignore` is expected to exclude it.

## Database and storage

1. Inspect the target project's applied migration history and current schema before applying SQL.
   Do not blindly rerun migrations or assume the Lovable project matches a local environment.
2. Apply the repository migrations in order using the authorized project migration workflow. The
   automatic assignment migration is `drizzle/migrations/0001_auto_assign_complaints.sql`.
3. Realtime publication migration `0002_enable_complaint_realtime.sql` is on `main` (PR #39) but
   must not be treated as applied until it has been run against the project. Check that the
   `supabase_realtime` publication exists and verify table membership afterward.
4. Confirm RLS is enabled and the database functions/triggers are present. Do not replace the
   security-definer status, assignment, or role functions with client-side updates.
5. Confirm `complaint-photos` is a private storage bucket and that its policies restrict uploads to
   the authenticated user's own `<user_id>/...` path. The UI uses signed/authenticated access, not
   public object URLs.

## Authentication configuration

In Supabase Auth URL configuration, set the approved site URL and add the exact deployed app
origins with `/reset-password` to the redirect allow-list. Add local development URLs only in
non-production environments. Test a recovery email end to end after changing the allow-list; do not
infer the redirect is correct solely from the frontend route.

## Build and release

From the repository root:

```sh
bun install --frozen-lockfile
bun run lint
bunx tsc --noEmit
bun run test
bun run build
```

Deploy only a reviewed `main` commit after its CI passes. After deployment, smoke-test authentication,
complaint submission, role access, technician assignment/status updates, notifications, and reports
if included in the release. Record the deployed commit, backend project identifier (not credentials),
test role, results, and date in the FCA/test report.

## Rollback and support

If a deployment fails, use the hosting provider's supported rollback to a known-good application
revision. Database migrations may not be safely reversible; inspect the migration and current data
before attempting any rollback. Preserve logs and report the affected revision and observed error
to the project owner. Do not expose tokens or personal complaint details in a bug report.
