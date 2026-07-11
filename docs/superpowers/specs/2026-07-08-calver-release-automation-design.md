# CalVer release automation — design

Date: 2026-07-08
Status: approved (pending implementation plan)

## Problem

The `Release` workflow (`.github/workflows/release.yml`) has failed on every push to
`main` since at least 2026-07-04. `changesets/action` correctly computes a semver bump
and pushes the `changeset-release/main` branch, but fails when opening the "Version
Packages" PR:

```
HttpError: GitHub Actions is not permitted to create or approve pull requests.
```

This is a repo-level setting ("Allow GitHub Actions to create and approve pull
requests", currently off) that overrides the workflow's own `pull-requests: write`
permission. As a result no package version has been bumped or published since
2026-06-12 (the last merged "Version Packages" PR, #1). ~15 merges to `main` since
2026-07-04 have queued changesets with nowhere to land.

Separately, the project wants to move off semver entirely and adopt calendar
versioning: `YYYY.WW.N` (ISO year, ISO week, Nth release that week), and wants both
an automatic release path (every merge to `main`) and a manual on-demand path
(re-run the same workflow whenever).

## Decisions

- **Every merge to `main` publishes immediately.** No separate approval PR. This is
  the whole point of "automatic," and it fits a weekly release counter naturally.
- **Every merge publishes, regardless of what changed** (docs-only, chores, deps —
  not just `projects/ui/**`). Simplest rule: one merge, one version.
- **Version format:** `{ISO year}.{ISO week}.{Nth release this week}`, e.g. `2026.28.1`,
  `2026.28.2`. Counter resets naturally each ISO week since the week number itself
  changes.
- **Source of truth for the counter is git tags** (`v{version}`), not the npm
  registry and not a committed state file. Tags are free, atomic under the existing
  `concurrency` group, and require no registry read credentials to query.
- **`changesets/action` is dropped entirely**, along with `changeset version` and
  `changeset publish` — both are semver-shaped (bump type: major/minor/patch) and
  don't map onto a calendar-based scheme. `@changesets/cli` stays as a devDependency
  *only* for its authoring UX: `npm run changeset` still prompts a contributor to
  describe their change in a `.changeset/*.md` file. The bump-type they pick
  (major/minor/patch) is simply ignored at release time — only the markdown body is
  used, as changelog prose.
- **This also resolves the original bug as a side effect.** No PR is ever opened by
  Actions in the new flow, so the disabled repo permission becomes irrelevant to
  releases. (It may still be worth enabling separately for unrelated reasons, but is
  out of scope for this change.)

## Design

### Trigger & concurrency

Single workflow, `.github/workflows/release.yml`, rewritten (not a new file):

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch: {}

concurrency: ${{ github.workflow }}-${{ github.ref }}
```

Both triggers run the identical job. `workflow_dispatch` needs no inputs — the
version is always derived from existing tags at run time, so a manual run and an
automatic run behave identically.

GitHub natively skips workflow runs whose triggering commit message contains
`[skip ci]` (all events, no extra config). This is what prevents the release job's
own commit-and-push from re-triggering itself in an infinite loop.

### Job steps (single job, replacing today's "Create Release Pull Request or Publish"
step)

1. `actions/checkout` with `fetch-depth: 0` and `fetch-tags: true` (need full tag
   history to count same-week releases).
2. `actions/setup-node` (unchanged: `.nvmrc`, npm cache, `registry-url:
   https://npm.pkg.github.com`, `scope: '@mushilu-san'`).
3. `npm ci`
4. `npm run test:ci`
5. **Compute next version** (`scripts/calver-version.mjs`):
   - `week = ISO year.week` of the current UTC date (e.g. `2026.28`)
   - list local tags matching `v{week}.*`, count them, `next = count + 1`
   - version = `{week}.{next}` (e.g. `2026.28.1`)
   - a pure function taking `(tagList, date) -> version` so it's unit-testable
     without touching real git state; a thin CLI wrapper calls it with real
     `git tag -l` output and today's date, and writes the result to
     `$GITHUB_OUTPUT`.
6. **Update changelog + package.json + consume changesets**
   (`scripts/calver-changelog.mjs`):
   - Read every `.changeset/*.md` except `README.md`.
   - Ignore the YAML frontmatter (bump type — not meaningful for CalVer); use only
     the markdown body as changelog prose.
   - If there are no pending changeset files, write a single placeholder line:
     `_Maintenance release (no changesets)._`
   - Prepend a new `## {version}` section (with today's date) to
     `projects/ui/CHANGELOG.md`.
   - Set `version` in `projects/ui/package.json` to the computed version. (Root
     `package.json` stays untouched — it's `private: true`, version `0.0.0`, never
     published.)
   - Delete the consumed `.changeset/*.md` files.
7. Commit: `git commit -am "chore: release {version} [skip ci]"`
8. Tag: `git tag v{version}`
9. Push: `git push origin main --follow-tags`
10. `npm run build` — must run *after* step 6, so `ng-packagr` copies the bumped
    version from `projects/ui/package.json` into `dist/ui/package.json`.
11. Publish: `cd dist/ui && npm publish` directly. (Registry auth already flows
    from `setup-node`'s `registry-url` + the job's `NODE_AUTH_TOKEN` env — same as
    today.)
12. Optional, for parity with today's `createGithubReleases: true`:
    `gh release create v{version} --notes-file <generated-notes>`.

### What's removed from the workflow

- The `changesets/action` step (`Create Release Pull Request or Publish`)
- The `npm run release` script's reliance on `changeset publish` (script gets
  repurposed or removed — exact wiring decided at plan time)
- `pull-requests: write` permission on the job (no longer needed — nothing opens a
  PR)

### Error handling

- If `npm ci` / tests / build fail **before** step 6 (version bump), nothing is
  committed or tagged. Clean no-op — next trigger starts fresh.
- If `npm publish` (step 11) fails **after** the commit+tag already pushed (step 9),
  that version is "burned": tagged and in the changelog, but never actually
  published. This is an accepted tradeoff — a retry (manual `workflow_dispatch` or
  the next merge) simply computes the *next* counter value and publishes that. There
  is no scenario where a retry collides with or gets blocked by the failed version,
  so no manual cleanup is ever required.
- The `concurrency` group ensures two releases never run simultaneously and race on
  the tag count.

### Testing

- `scripts/calver-version.mjs`'s pure version-computation function gets a vitest
  unit test: given a fake list of existing tags and a fixed date, assert the
  correct next version. Covers: first release of a new week (counter resets to 1),
  Nth release of an existing week, ISO year boundary (late-December dates that fall
  in week 1 of the next ISO year, per `%G`/`%V` semantics).
- End-to-end verification is manual: after this ships, trigger `workflow_dispatch`
  once and confirm a real tag, changelog entry, and published package appear.

### Documentation follow-up

`CLAUDE.md`'s "Publishing checklist" (step 4: "Merge version PR → changesets/action
publishes to npm automatically") becomes inaccurate and must be updated in the same
change to describe the new auto-publish-on-merge flow instead.

## Out of scope

- Enabling the repo's "Allow GitHub Actions to create and approve pull requests"
  setting — made irrelevant by this design, not addressed here.
- Splitting version-bump and publish into two separate workflows (considered as an
  alternative — see rejected approaches below). Not adopted: the self-healing
  counter already gives retry safety without the extra workflow file.

## Rejected approaches

1. **Two-workflow split** (a version-bump workflow on push/dispatch, a separate
   publish workflow triggered by tag push). Would allow retrying just the publish
   step in isolation. Rejected as unnecessary complexity: because a failed publish
   simply burns one counter value and the next run is unaffected, there's no stuck
   state that a two-workflow split would meaningfully improve on.
2. **Bending `changesets/action`/`@changesets/cli` itself to emit CalVer strings.**
   No supported hook exists for a custom version-string generator — bump type is
   hardcoded to major/minor/patch semantics. Would require monkeypatching internals,
   fragile across upgrades. Rejected.

## Amendment (2026-07-12): tag-only release, no commit pushed to `main`

During implementation, the final whole-branch review flagged that `main` has
branch protection requiring a pull request + 1 approval
(`required_pull_request_reviews`, `required_approving_review_count: 1`) with no
bypass allowance configured. GitHub rejects any direct push to a
protected-with-required-PR branch for any non-exempt actor — the workflow's
`contents: write` permission scopes what the token's API calls may do, but does
not override this server-side ref-update rule. `github-actions[bot]` is not
exempt.

The fix would normally be `bypass_pull_request_allowances` (letting a specific
actor bypass required reviews while everyone else still needs them) — but this
field is a GitHub Team/Enterprise Cloud feature. This org is on GitHub Free:
`PATCH .../required_pull_request_reviews` with a `bypass_pull_request_allowances`
body returns 200 but silently never persists the field. Confirmed by re-fetching
the resource immediately after two separate attempts.

**Decision:** the release job never pushes a commit to `main`. It pushes only a
git tag (`refs/tags/v{version}`) — tags are not covered by branch protection,
which only governs `refs/heads/*`. This changes two things from the original
design:

- **The version bump in `projects/ui/package.json` is never committed.** It's
  written directly in the ephemeral CI checkout, just long enough for
  `npm run build` (via ng-packagr) to pick it up before publish. The working
  tree changes are discarded when the runner is torn down. `main`'s committed
  `package.json` version is no longer expected to match the latest published
  version — the tag and the GitHub Release are the source of truth for "what's
  actually published," not the committed file.
- **`projects/ui/CHANGELOG.md` is no longer written to at all.** The changelog
  text becomes the GitHub Release body (via `gh release create --notes-file`)
  instead of a committed file section. Consequently, `.changeset/*.md` files
  are no longer deleted either — deleting them would require a commit, which we
  no longer make. Instead, "which changesets are new this release" is computed
  by diffing against the previous release tag: `git diff --name-only
  --diff-filter=A <previous-tag>..HEAD -- .changeset` (or, if no previous CalVer
  tag exists yet, every current changeset file). `parseChangesetBody` and
  `buildChangelogSection` are unchanged — only how the input file list is
  gathered changes.

**Accepted tradeoff:** `.changeset/*.md` files accumulate in the repository
indefinitely rather than being pruned after each release (there is no commit to
prune them in). This is a real accretion of files over time with no automated
cleanup. It's accepted as the cost of never touching a protected branch
directly; a periodic manual cleanup (or a separate, human-reviewed PR) can prune
already-released changeset files if this becomes a nuisance — out of scope for
this change.

**Side benefit:** this also eliminates the final review's other Important
finding about a non-fast-forward race on concurrent merges (Task 2/3's original
design pushed a commit to `main`, which could lose a race to a second merge
landing first). With no commit pushed to `main`, there is nothing to race —
only the serialized-by-`concurrency` tag push remains, which doesn't have this
failure mode.
