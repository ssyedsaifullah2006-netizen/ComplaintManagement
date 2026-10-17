# Contributing

## Workflow

1. **Open an issue** (use a template). Give it a type prefix in the title, a label and the milestone.
2. **Branch from `main`**: `<type>/<issue>-<short-kebab-name>`, for example `fix/12-login-redirect`.
3. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/). One real change per commit.
4. **Verify locally**:
   `bun install --frozen-lockfile && bun run lint && bunx tsc --noEmit && bun run test && bun run build`
5. **Open a pull request** to `main` using the template: `Closes #<issue>`, what changed, what you
   actually ran and the real results. Update `CHANGELOG.md` under **Unreleased**.
6. **CI must be green** (the `CI` workflow).
7. **Review:** another team member reviews and approves. The author does not approve their own pull request.
8. **Merge** with a rebase merge so commit messages and authorship are preserved. Delete the branch.

## Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Branch | `<type>/<issue>-<short-kebab-name>` | `test/4-ccms-domain-logic` |
| Commit | `<type>: <imperative summary>` | `fix: regenerate bun.lock against the public npm registry` |
| Types | `feat` `fix` `docs` `test` `ci` `chore` `refactor` `perf` `build` | |
| Issue title | same type prefix as the commit | `ci: add GitHub Actions workflow` |
| Labels | `bug` `enhancement` `documentation` `test` `ci` `chore` `audit` `good first issue` | |
| Configuration item | `CI-NN` | `CI-06` |
| Tag | annotated `vMAJOR.MINOR.PATCH`; pre-release `vMAJOR.MINOR.PATCH-rc.N` | `v0.1.0-rc.1` |

## Rules

- Never commit `.env`, keys, tokens or personal data. `.env.example` lists variable names only.
- Files marked "automatically generated" (`src/integrations/supabase/*`, `src/routeTree.gen.ts`,
  `drizzle/schema.ts`) are not edited by hand.
- Do not record a test, audit, review or release as done unless it was actually done.
- Do not rewrite history on `main`.

## Releases and baselines

- A **release candidate** (`vX.Y.Z-rc.N`) may be tagged when CI is green on `main` and `CHANGELOG.md`
  has the section for that version.
- A **release / baseline** (`vX.Y.Z`) is tagged only after, in addition: the Functional Configuration
  Audit (FCA) and Physical Configuration Audit (PCA) results are recorded in `docs/FCA.md` and
  `docs/PCA.md` with the auditor named, and `docs/STATUS.md` is updated. The change moves from
  **Unreleased** to a dated version section in the changelog.

## Note on early history

Pull requests #8 to #13 and #19 (repository setup and documentation) were merged by the repository owner after CI passed
(from #10 onward, when the CI workflow existed; #8 and #9 predate it) and before a second reviewer was active. Review by a
second team member applies to every pull request after that.
