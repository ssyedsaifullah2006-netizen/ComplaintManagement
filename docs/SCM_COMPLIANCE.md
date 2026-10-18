# SCM1/SCM2 Repository Compliance

This record compares the repository with the SCM Review-I and Review-II documents supplied for
CCMS. Those PDFs are source requirements stored outside this repository; they are not themselves
versioned configuration items here. This is an evidence-based repository audit, not a claim that
every project deliverable or product requirement is complete.

## Identification and naming

The SCM1 logical identifier format is
`CCMS_<ModuleName>_<ItemType>_<Version>`. The mapping for tracked configuration items is in
[CI_REGISTER.md](../CI_REGISTER.md). These logical labels do not replace readable source paths.
Renaming application files to include CI labels would break imports, routes, generated files, and
tooling without improving traceability. Exact revisions are instead identified by Git commit and
pull request; system releases are identified by `package.json`, changelog entries, and tags.

The SCM1 hierarchy maps to the current source as follows:

| SCM hierarchy level | CCMS example |
|---|---|
| System | Campus Complaint & Maintenance System (CCMS) |
| Subsystem | Complaint management |
| CSCI | Complaint registration and tracking |
| TLCSC | Submission; categorization; lifecycle tracking |
| LLCSC | Form validation, photo upload, category and location selection, status transitions |
| CSU | Validation schemas and route handlers in `src/routes/_authenticated/complaints.new.tsx`; lifecycle rules in `src/lib/ccms.ts`; database ticket generation and rules in `drizzle/migrations/` |

This is a repository-level mapping, not a substitute for the absent approved HLD, LLD, or UML
artifacts.

## Configuration-item completeness

The tracked-file register covers existing code, tests, migrations, configuration, and documentation.
The following SCM1/SCM2 deliverables were not found as controlled repository artifacts at the audited
baseline:

- Project, SCM, and risk-management plans; approved SRS; HLD; LLD; UML diagrams; database-design
  document.
- Formal test plan, test scripts, defect report, and user manual, administrator manual, and
  deployment guide.
- A dedicated maintenance-reporting/export module.

Automated tests and CI exist, but they are not equivalent to a separately approved test plan or
test report. The SCM1 reporting requirement is only partially represented by dashboard counts and
workload metrics; report generation/export is absent. The relevant follow-up items are recorded in
the repository issue tracker; see [docs/STATUS.md](STATUS.md).

## Change control, status accounting, and tools

The observed change-control mechanism is GitHub: issues identify requests, feature branches isolate
changes, pull requests record review and CI, and Git history identifies revisions. GitHub Actions
runs frozen dependency installation, lint, TypeScript checking, tests, and a production build for
pull requests and pushes to `main`.

Do not describe Jira, Chef, Jenkins, Google Sheets/Trello, or SonarQube as tools currently used by
this repository: no configuration or execution evidence for them was found. Agile/Scrum is the
methodology stated in SCM1, but sprint/backlog ceremonies are not evidenced by the repository alone.

The CI register supplies CI IDs and logical names. The status-accounting file records known PRs,
commits, CI results, releases, audit evidence, and unresolved items. It does not invent per-person CI
ownership or approval where the source records do not establish it. GitHub authorship and PR review
are evidence of individual changes, not a complete ownership register for every CI.

## Audit and release state

- **FCA:** Issue #16 was closed after a comment said the features were verified, but no
  `docs/FCA.md`, test report, or reproducible live-test evidence was present at this audit. Treat
  the FCA as **not evidenced / incomplete**, not as a passed audit. See [FCA.md](FCA.md).
- **PCA:** The existing PCA documented an earlier main commit. The repository inventory was
  rechecked at `aeaf61e` (main after PR #31); the updated evidence is in [PCA.md](PCA.md). The
  published `v0.1.0-rc.1` tag is lightweight, contrary to the annotated-tag convention; issue #24
  documents the discrepancy. The published tag is not rewritten.
- **Release baseline:** `v0.1.0-rc.1` is a release candidate only. It is not a final approved
  baseline. Do not claim a final release until FCA and PCA evidence and the required release
  approval are recorded.

## Product requirements with incomplete evidence

| Requirement from SCM1 | Current evidence | Status |
|---|---|---|
| Automatic routing by complaint category | Trigger migration in `drizzle/migrations/0001_auto_assign_complaints.sql`; user reports it was applied to Lovable Cloud | Implemented in source; live state reported, not independently verified |
| Status tracking in real time | Complaint queries poll every 30 seconds in `src/lib/ccms.ts` | Not real-time push updates; tracked in issue #34 |
| Maintenance reports and analytics | Manager counts, overdue items, workload and resolution-time metric | Partial; no report/export workflow; tracked in issue #33 |
| Technician complaint reporting | Complaint registration form supports authenticated users, but technician navigation/dashboard hides the entry point | Function exists at route level; discoverability tracked in issue #35 |
| Password recovery | Supabase recovery and reset routes are in source; email delivery and deployed redirect allow-list are not tested here | Source implemented; live configuration unverified |
| Missing SCM deliverables | Plans, approved requirements/design, formal test artifacts, manuals, and deployment guide are absent | Tracked in issue #36 |

These statuses distinguish source implementation from live backend/deployment verification.

## Evidence reviewed

- SCM1 and SCM2 PDFs supplied by the project owner (not tracked in this repository).
- `CI_REGISTER.md`, `CONTRIBUTING.md`, `docs/STATUS.md`, `docs/PCA.md`, current source and tests.
- GitHub PRs #29 and #31 and their successful CI runs; current main baseline `aeaf61e`.
- Follow-up requests #33-#36 for the identified product gaps and absent SCM deliverables.
