# CalVer Release Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the broken `changesets/action` release flow with an automatic,
self-computing calendar-versioning (`YYYY.WW.N`) release that runs on every merge
to `main` and can also be triggered manually.

**Architecture:** Two small, independently-testable Node scripts
(`scripts/calver-version.mjs`, `scripts/calver-changelog.mjs`) replace
`changeset version` / `changeset publish`. A rewritten `.github/workflows/release.yml`
calls them as plain CLI steps, then commits+tags+pushes+builds+publishes in one job,
triggered by both `push: [main]` and `workflow_dispatch`.

**Tech Stack:** Node 22 (`.mjs` ESM scripts, no new runtime deps), vitest (already a
devDependency) for script unit tests, GitHub Actions, `@changesets/cli` (kept, but
only for its authoring UX — `npm run changeset`).

## Global Constraints

- Node 22.x required for all local commands: `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22` before any `npm`/`node` invocation (from repo `CLAUDE.md`).
- Package manager is npm — never substitute pnpm/yarn commands.
- Any change to root `package.json` must be followed, in the same commit, by
  `npm install` and committing the resulting `package-lock.json` alongside it (from
  repo `CLAUDE.md` — applies even to script-only changes).
- Run `./scripts/ci-verify.sh` before considering any push ready (from repo `CLAUDE.md`).
- This is tooling/CI work, not a bug fix or a UI component — per `CLAUDE.md` it does
  **not** need a git worktree (that rule is scoped to bug-fix work) and does **not**
  use the per-component `TaskCreate` workflow (that rule is scoped to UI components).
  A normal feature branch off `main` is sufficient.
- Design spec: `docs/superpowers/specs/2026-07-08-calver-release-automation-design.md`
  — every task below implements a specific section of it; consult it for the "why"
  behind any step.

---

### Task 1: Version-computation script

**Files:**
- Create: `scripts/calver-version.mjs`
- Create: `scripts/calver-version.spec.mjs`
- Create: `vitest.scripts.config.mjs`
- Modify: `package.json:4-24` (add a `test:scripts` entry to the `scripts` block)

**Interfaces:**
- Produces: `computeNextVersion(tags: string[], referenceDate?: Date): string` and
  `isoWeekYearAndWeek(date: Date): { year: number, week: number }`, both exported
  from `scripts/calver-version.mjs`. Task 3 consumes this file only as a CLI
  (`node scripts/calver-version.mjs`), not by importing these functions directly.
- CLI contract: running `node scripts/calver-version.mjs` with no arguments reads
  `git tag -l` from the current working directory, computes the next version for
  "now", and — if the `GITHUB_OUTPUT` env var is set — appends `version=<value>\n`
  to the file at that path; otherwise prints `<value>` to stdout.

- [ ] **Step 1: Write the failing test**

Create `scripts/calver-version.spec.mjs`:

```javascript
import { describe, it, expect } from 'vitest';
import { computeNextVersion, isoWeekYearAndWeek } from './calver-version.mjs';

describe('isoWeekYearAndWeek', () => {
  it('computes ISO week for a mid-year date', () => {
    expect(isoWeekYearAndWeek(new Date(Date.UTC(2026, 6, 8)))).toEqual({ year: 2026, week: 28 });
  });

  it('rolls late-December dates into week 1 of the next ISO year', () => {
    expect(isoWeekYearAndWeek(new Date(Date.UTC(2025, 11, 29)))).toEqual({ year: 2026, week: 1 });
  });
});

describe('computeNextVersion', () => {
  it('starts a new week at counter 1 when no tags exist for that week', () => {
    expect(computeNextVersion([], new Date(Date.UTC(2026, 6, 8)))).toBe('2026.28.1');
  });

  it('increments the counter for an existing week', () => {
    const tags = ['v2026.28.1', 'v2026.28.2', 'v2026.27.5'];
    expect(computeNextVersion(tags, new Date(Date.UTC(2026, 6, 8)))).toBe('2026.28.3');
  });

  it('ignores unrelated tag names', () => {
    const tags = ['some-other-tag', 'v2026.28.1'];
    expect(computeNextVersion(tags, new Date(Date.UTC(2026, 6, 8)))).toBe('2026.28.2');
  });

  it('is robust to a gap left by a deleted tag (uses max, not count)', () => {
    const tags = ['v2026.28.1', 'v2026.28.3'];
    expect(computeNextVersion(tags, new Date(Date.UTC(2026, 6, 8)))).toBe('2026.28.4');
  });
});
```

Create `vitest.scripts.config.mjs`:

```javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['scripts/**/*.spec.mjs'],
    environment: 'node',
  },
});
```

In `package.json`, inside the `"scripts"` object, add (after `"e2e:report"`):

```json
    "test:scripts": "vitest run --config vitest.scripts.config.mjs"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22 && npm run test:scripts`
Expected: FAIL — `scripts/calver-version.mjs` does not exist yet (module resolution error).

- [ ] **Step 3: Write the implementation**

Create `scripts/calver-version.mjs`:

```javascript
#!/usr/bin/env node
// Computes the next CalVer release version (YYYY.WW.N) from existing git tags.
// Usage: node scripts/calver-version.mjs
// Writes `version=<value>` to $GITHUB_OUTPUT if set, otherwise prints to stdout.

import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';

export function isoWeekYearAndWeek(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const isoYear = d.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return { year: isoYear, week };
}

export function computeNextVersion(tags, referenceDate = new Date()) {
  const { year, week } = isoWeekYearAndWeek(referenceDate);
  const weekStr = String(week).padStart(2, '0');
  const prefix = `v${year}.${weekStr}.`;
  const counters = tags
    .filter((tag) => tag.startsWith(prefix))
    .map((tag) => Number(tag.slice(prefix.length)))
    .filter((n) => Number.isInteger(n) && n > 0);
  const next = counters.length > 0 ? Math.max(...counters) + 1 : 1;
  return `${year}.${weekStr}.${next}`;
}

function main() {
  const tags = execFileSync('git', ['tag', '-l'], { encoding: 'utf8' })
    .split('\n')
    .map((t) => t.trim())
    .filter(Boolean);
  const version = computeNextVersion(tags, new Date());
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `version=${version}\n`);
  } else {
    console.log(version);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:scripts`
Expected: PASS — 6 tests green.

- [ ] **Step 5: Sync the lockfile and commit**

```bash
npm install
git add scripts/calver-version.mjs scripts/calver-version.spec.mjs vitest.scripts.config.mjs package.json package-lock.json
git commit -m "feat(release): add CalVer version-computation script"
```

---

### Task 2: Changelog / package-version / changeset-consumption script

**Files:**
- Create: `scripts/calver-changelog.mjs`
- Create: `scripts/calver-changelog.spec.mjs`

**Interfaces:**
- Produces: `parseChangesetBody(fileContent: string): string` and
  `buildChangelogSection(version: string, isoDate: string, bodies: string[]): string`,
  both exported from `scripts/calver-changelog.mjs`. Task 3 consumes this file only
  as a CLI, not by importing these functions directly.
- CLI contract: `node scripts/calver-changelog.mjs <version> [notesOutPath]`.
  Reads every `.changeset/*.md` file except `README.md`, prepends a new section to
  `projects/ui/CHANGELOG.md`, sets `version` in `projects/ui/package.json`, deletes
  the consumed changeset files, and writes the generated section text to
  `notesOutPath` (default `/tmp/calver-release-notes.md`). Throws if `<version>` is
  omitted.

- [ ] **Step 1: Write the failing test**

Create `scripts/calver-changelog.spec.mjs`:

```javascript
import { describe, it, expect } from 'vitest';
import { parseChangesetBody, buildChangelogSection } from './calver-changelog.mjs';

describe('parseChangesetBody', () => {
  it('strips YAML frontmatter and trims the body', () => {
    const content = '---\n"@mushilu-san/ui": patch\n---\n\nFixes a bug.\n';
    expect(parseChangesetBody(content)).toBe('Fixes a bug.');
  });
});

describe('buildChangelogSection', () => {
  it('builds a placeholder section when there are no changesets', () => {
    expect(buildChangelogSection('2026.28.1', '2026-07-08', [])).toBe(
      '## 2026.28.1 — 2026-07-08\n\n_Maintenance release (no changesets)._\n',
    );
  });

  it('lists each changeset body as a bullet', () => {
    const result = buildChangelogSection('2026.28.2', '2026-07-08', [
      'Fixes a bug.',
      'Adds a feature.',
    ]);
    expect(result).toBe('## 2026.28.2 — 2026-07-08\n\n- Fixes a bug.\n\n- Adds a feature.\n');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:scripts`
Expected: FAIL — `scripts/calver-changelog.mjs` does not exist yet.

- [ ] **Step 3: Write the implementation**

Create `scripts/calver-changelog.mjs`:

```javascript
#!/usr/bin/env node
// Consumes pending .changeset/*.md files into a CalVer changelog entry, bumps
// projects/ui/package.json's version, and deletes the consumed changeset files.
// Usage: node scripts/calver-changelog.mjs <version> [notesOutPath]

import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const CHANGESET_DIR = '.changeset';
const CHANGELOG_PATH = 'projects/ui/CHANGELOG.md';
const PACKAGE_JSON_PATH = 'projects/ui/package.json';

export function parseChangesetBody(fileContent) {
  const match = fileContent.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  const body = match ? match[1] : fileContent;
  return body.trim();
}

export function buildChangelogSection(version, isoDate, bodies) {
  const heading = `## ${version} — ${isoDate}`;
  if (bodies.length === 0) {
    return `${heading}\n\n_Maintenance release (no changesets)._\n`;
  }
  const entries = bodies.map((body) => `- ${body}`).join('\n\n');
  return `${heading}\n\n${entries}\n`;
}

function listChangesetFiles() {
  return readdirSync(CHANGESET_DIR)
    .filter((name) => name.endsWith('.md') && name !== 'README.md')
    .map((name) => join(CHANGESET_DIR, name));
}

function main() {
  const version = process.argv[2];
  if (!version) {
    throw new Error('Usage: node scripts/calver-changelog.mjs <version> [notesOutPath]');
  }
  const notesOutPath = process.argv[3] ?? '/tmp/calver-release-notes.md';

  const changesetFiles = listChangesetFiles();
  const bodies = changesetFiles.map((path) => parseChangesetBody(readFileSync(path, 'utf8')));

  const isoDate = new Date().toISOString().slice(0, 10);
  const section = buildChangelogSection(version, isoDate, bodies);

  const existingChangelog = readFileSync(CHANGELOG_PATH, 'utf8');
  const titleMatch = existingChangelog.match(/^# .*\n/);
  const title = titleMatch ? titleMatch[0] : '';
  const rest = existingChangelog.slice(title.length).replace(/^\n+/, '');
  writeFileSync(CHANGELOG_PATH, `${title}\n${section}\n${rest}`);

  const packageJson = JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  packageJson.version = version;
  writeFileSync(PACKAGE_JSON_PATH, `${JSON.stringify(packageJson, null, 2)}\n`);

  for (const path of changesetFiles) {
    unlinkSync(path);
  }

  writeFileSync(notesOutPath, section);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:scripts`
Expected: PASS — 9 tests green (6 from Task 1 + 3 new).

- [ ] **Step 5: Manually dry-run the CLI against real repo state, then discard**

This step only inspects behavior — it must not leave changes in the working tree.

```bash
git status --porcelain   # confirm clean before starting
node scripts/calver-changelog.mjs 9999.99.9 /tmp/dry-run-notes.md
cat /tmp/dry-run-notes.md
head -20 projects/ui/CHANGELOG.md
grep '"version"' projects/ui/package.json
git status --porcelain   # should show modified CHANGELOG.md, package.json, and
                          # deleted .changeset/*.md files
git checkout -- projects/ui/CHANGELOG.md projects/ui/package.json .changeset/
git status --porcelain   # must be empty again
```

Expected: the notes file contains a real changelog entry built from whatever
changesets are currently pending in `.changeset/`, `package.json` briefly shows
`"version": "9999.99.9"`, and after the final `git checkout --`, `git status` is
clean again.

- [ ] **Step 6: Commit**

```bash
git add scripts/calver-changelog.mjs scripts/calver-changelog.spec.mjs
git commit -m "feat(release): add CalVer changelog/version-bump script"
```

---

### Task 3: Rewrite the Release workflow

**Files:**
- Modify: `.github/workflows/release.yml` (full rewrite)

**Interfaces:**
- Consumes: the CLI contracts of `scripts/calver-version.mjs` (Task 1) and
  `scripts/calver-changelog.mjs` (Task 2) exactly as documented above.
- Produces: nothing further consumes this file — it is the terminal artifact of
  this plan.

- [ ] **Step 1: Replace the workflow file**

Replace the full contents of `.github/workflows/release.yml` with:

```yaml
name: Release

on:
  push:
    branches: [main]
  workflow_dispatch: {}

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    timeout-minutes: 20
    permissions:
      contents: write
      packages: write

    steps:
      - uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7.0.0
        with:
          fetch-depth: 0
          fetch-tags: true

      - uses: actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e # v6.4.0
        with:
          node-version-file: '.nvmrc'
          cache: 'npm'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@mushilu-san'

      - name: Cache Angular build cache
        uses: actions/cache@55cc8345863c7cc4c66a329aec7e433d2d1c52a9 # v6.1.0
        with:
          path: .angular/cache
          key: angular-cache-${{ runner.os }}-nvmrc-${{ hashFiles('package-lock.json') }}-${{ github.sha }}
          restore-keys: |
            angular-cache-${{ runner.os }}-nvmrc-${{ hashFiles('package-lock.json') }}-
            angular-cache-${{ runner.os }}-nvmrc-

      - name: Install dependencies
        run: npm ci

      - name: Test
        run: npm run test:ci

      - name: Compute release version
        id: version
        run: node scripts/calver-version.mjs

      - name: Update changelog and package version
        run: node scripts/calver-changelog.mjs "${{ steps.version.outputs.version }}"

      - name: Commit and tag release
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git commit -am "chore: release ${{ steps.version.outputs.version }} [skip ci]"
          git tag "v${{ steps.version.outputs.version }}"
          git push origin HEAD:main --follow-tags

      - name: Build library
        run: npm run build

      - name: Publish package
        working-directory: dist/ui
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Create GitHub release
        run: gh release create "v${{ steps.version.outputs.version }}" --notes-file /tmp/calver-release-notes.md
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

- [ ] **Step 2: Validate YAML syntax**

```bash
node -e "require('js-yaml').load(require('fs').readFileSync('.github/workflows/release.yml', 'utf8')); console.log('valid yaml')"
```

Expected: prints `valid yaml` with no errors.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/release.yml
git commit -m "feat(release): drive releases from CalVer scripts instead of changesets/action"
```

---

### Task 4: Update local dev scripts and docs for the new flow

**Files:**
- Modify: `package.json:13-15`
- Modify: `dev.sh:16-18`, `dev.sh:88-96`
- Modify: `CLAUDE.md` (Common commands block, Publishing checklist section)

**Interfaces:** none — this task only removes dead script entries and corrects
documentation to match Tasks 1–3. No code depends on it.

- [ ] **Step 1: Remove the obsolete `version-packages` and `release` npm scripts**

In `package.json`, the `"scripts"` block currently has:

```json
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "npm run build && changeset publish",
```

Replace with:

```json
    "changeset": "changeset",
```

(`version-packages` and `release` are dropped entirely — the new workflow does
their job as discrete steps, and neither command is safe to run locally: doing so
would attempt a real commit/tag/publish outside of CI.)

- [ ] **Step 2: Update `dev.sh`'s help text and command cases**

In `dev.sh`, the header comment currently reads:

```bash
#   changeset         Add a changeset (run before merging a PR)
#   version-packages  Bump versions + update CHANGELOG from changesets
#   release           Build + publish to npm (runs changeset publish)
```

Replace with:

```bash
#   changeset         Add a changeset (run before merging a PR)
#   release-status    Show the release workflow's most recent runs
```

The case block currently has:

```bash
  version-packages)
    echo "▶ Bumping versions and updating CHANGELOG…"
    npm run version-packages
    ;;

  release)
    echo "▶ Building and publishing to npm…"
    npm run release
    ;;
```

Replace with:

```bash
  release-status)
    echo "▶ Recent Release workflow runs (releases are automatic on merge to main;"
    echo "  to trigger one on demand: gh workflow run release.yml)…"
    gh run list --workflow=release.yml --limit 10
    ;;
```

- [ ] **Step 3: Update `CLAUDE.md`**

In the "Common commands" code block, this text:

```
# Add a changeset before merging a PR
./dev.sh changeset

# Bump versions + update CHANGELOG
./dev.sh version-packages

# Publish to npm (build + changeset publish)
./dev.sh release
```

Becomes:

```
# Add a changeset before merging a PR
./dev.sh changeset

# Releases are automatic: every merge to main computes the next CalVer
# version (YYYY.WW.N), updates the changelog, tags, and publishes — no
# separate version-bump PR. To trigger one without waiting for a merge:
gh workflow run release.yml
```

The "Publishing checklist" section:

```
## Publishing checklist

1. `./dev.sh test` — all green
2. `./dev.sh build` — dist/ clean
3. `npm run changeset` — describe changes
4. Push PR → merge → Changesets bot opens "Version Packages" PR
5. Merge version PR → `changesets/action` publishes to npm automatically
```

Becomes:

```
## Publishing checklist

1. `./dev.sh test` — all green
2. `./dev.sh build` — dist/ clean
3. `npm run changeset` — describe changes (used as changelog prose only —
   the bump type you pick is ignored by the CalVer release script)
4. Push PR → merge to main → the Release workflow automatically computes
   the next CalVer version (`YYYY.WW.N`), updates the changelog, tags the
   commit, and publishes to GitHub Packages — no separate "Version
   Packages" PR to merge
5. To release without waiting for a merge: `gh workflow run release.yml`
```

- [ ] **Step 4: Sync the lockfile and commit**

```bash
npm install
git add package.json package-lock.json dev.sh CLAUDE.md
git commit -m "docs(release): update dev.sh and CLAUDE.md for CalVer auto-release"
```

---

### Task 6: Rework release flow to avoid pushing to main (tag-only)

**Amendment (2026-07-12):** `main` has branch-protection requiring a PR + 1
approval, with no bypass allowance available (this org is on GitHub Free —
`bypass_pull_request_allowances` is a paid-plan-only field and silently does not
persist here). The release job can never push a commit directly to `main`. It
can still push a git tag (`refs/tags/*` isn't covered by branch protection).
Full rationale: see the "Amendment (2026-07-12)" section appended to
`docs/superpowers/specs/2026-07-08-calver-release-automation-design.md`.

This task supersedes Tasks 2 and 3's git-push behavior (their file creation
and pure-function work stands; only the commit/push mechanics change).

**Files:**
- Modify: `scripts/calver-version.mjs` (add previous-tag output)
- Modify: `scripts/calver-changelog.mjs` (no CHANGELOG.md write, no file
  deletion, gather "new since last release" via git diff instead)
- Modify: `.github/workflows/release.yml` (drop the commit/push-to-main step;
  tag only after a successful publish)

**Interfaces:**
- `scripts/calver-version.mjs`'s CLI now also writes `previous_tag=<value>` to
  `$GITHUB_OUTPUT` (empty string if no prior CalVer tag exists yet).
- `scripts/calver-changelog.mjs`'s CLI contract changes to:
  `node scripts/calver-changelog.mjs <version> [previousTag] [notesOutPath]`
  (previousTag may be an empty string; notesOutPath still defaults to
  `/tmp/calver-release-notes.md`). `parseChangesetBody` and
  `buildChangelogSection` keep their existing signatures and behavior
  unchanged — only how the input file list is gathered changes.

- [ ] **Step 1: Extend `scripts/calver-version.mjs` with a previous-tag output**

In `scripts/calver-version.mjs`, add this exported function (after
`computeNextVersion`):

```javascript
export function findLatestTag(tags) {
  let best = null;
  for (const tag of tags) {
    const match = tag.match(/^v(\d+)\.(\d+)\.(\d+)$/);
    if (!match) continue;
    const candidate = { tag, year: Number(match[1]), week: Number(match[2]), counter: Number(match[3]) };
    if (
      !best ||
      candidate.year > best.year ||
      (candidate.year === best.year && candidate.week > best.week) ||
      (candidate.year === best.year && candidate.week === best.week && candidate.counter > best.counter)
    ) {
      best = candidate;
    }
  }
  return best ? best.tag : null;
}
```

Update `main()` to also compute and emit this:

```javascript
function main() {
  const tags = execFileSync('git', ['tag', '-l'], { encoding: 'utf8' })
    .split('\n')
    .map((t) => t.trim())
    .filter(Boolean);
  const version = computeNextVersion(tags, new Date());
  const previousTag = findLatestTag(tags) ?? '';
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `version=${version}\n`);
    appendFileSync(process.env.GITHUB_OUTPUT, `previous_tag=${previousTag}\n`);
  } else {
    console.log(version);
    console.log(previousTag);
  }
}
```

Add tests to `scripts/calver-version.spec.mjs` (new `describe` block):

```javascript
describe('findLatestTag', () => {
  it('returns null when no tag matches the vYYYY.WW.N pattern', () => {
    expect(findLatestTag(['some-other-tag', 'v1.2'])).toBeNull();
  });

  it('picks the numerically highest tag across different weeks', () => {
    const tags = ['v2026.27.9', 'v2026.28.1', 'v2025.52.3'];
    expect(findLatestTag(tags)).toBe('v2026.28.1');
  });

  it('compares counters numerically, not lexicographically', () => {
    const tags = ['v2026.28.2', 'v2026.28.10'];
    expect(findLatestTag(tags)).toBe('v2026.28.10');
  });
});
```

Run `npm run test:scripts` — expect all previous tests plus these 3 new ones
passing (13 total: 7 in `calver-version.spec.mjs`'s existing blocks + 3 new +
3 in `calver-changelog.spec.mjs`).

- [ ] **Step 2: Rework `scripts/calver-changelog.mjs`**

Replace the full file with:

```javascript
#!/usr/bin/env node
// Builds CalVer release notes from changesets added since the previous release
// tag, and bumps projects/ui/package.json's version (in the working tree only —
// this is never committed; see the design spec's 2026-07-12 amendment for why).
// Usage: node scripts/calver-changelog.mjs <version> [previousTag] [notesOutPath]

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CHANGESET_DIR = '.changeset';
const PACKAGE_JSON_PATH = 'projects/ui/package.json';

export function parseChangesetBody(fileContent) {
  const match = fileContent.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  const body = match ? match[1] : fileContent;
  return body.trim();
}

export function buildChangelogSection(version, isoDate, bodies) {
  const heading = `## ${version} — ${isoDate}`;
  if (bodies.length === 0) {
    return `${heading}\n\n_Maintenance release (no changesets)._\n`;
  }
  const entries = bodies.map((body) => `- ${body}`).join('\n\n');
  return `${heading}\n\n${entries}\n`;
}

function listNewChangesetFiles(previousTag) {
  if (!previousTag) {
    return readdirSync(CHANGESET_DIR)
      .filter((name) => name.endsWith('.md') && name !== 'README.md')
      .map((name) => join(CHANGESET_DIR, name))
      .sort();
  }
  const output = execFileSync(
    'git',
    ['diff', '--name-only', '--diff-filter=A', `${previousTag}..HEAD`, '--', CHANGESET_DIR],
    { encoding: 'utf8' },
  );
  return output
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.endsWith('.md') && !line.endsWith('README.md'))
    .sort();
}

function main() {
  const version = process.argv[2];
  if (!version) {
    throw new Error('Usage: node scripts/calver-changelog.mjs <version> [previousTag] [notesOutPath]');
  }
  const previousTag = process.argv[3] || null;
  const notesOutPath = process.argv[4] ?? '/tmp/calver-release-notes.md';

  const changesetFiles = listNewChangesetFiles(previousTag);
  const bodies = changesetFiles.map((path) => parseChangesetBody(readFileSync(path, 'utf8')));

  const isoDate = new Date().toISOString().slice(0, 10);
  const section = buildChangelogSection(version, isoDate, bodies);

  const packageJson = JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  packageJson.version = version;
  writeFileSync(PACKAGE_JSON_PATH, `${JSON.stringify(packageJson, null, 2)}\n`);

  writeFileSync(notesOutPath, section);
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
```

`scripts/calver-changelog.spec.mjs` needs no changes — `parseChangesetBody` and
`buildChangelogSection` keep their exact prior signatures and behavior, so the
existing tests still apply unmodified. Run `npm run test:scripts` to confirm.

- [ ] **Step 3: Manually dry-run the reworked CLI, then discard**

```bash
git status --porcelain   # confirm clean before starting
node scripts/calver-changelog.mjs 9999.99.9 "" /tmp/dry-run-notes.md
cat /tmp/dry-run-notes.md
grep '"version"' projects/ui/package.json
git status --porcelain   # should show ONLY projects/ui/package.json modified —
                          # CHANGELOG.md must NOT appear, and no .changeset files
                          # should be deleted
git checkout -- projects/ui/package.json
git status --porcelain   # must be empty again
```

Expected: the notes file contains a changelog entry (or the maintenance
placeholder if `.changeset/` currently has no pending files besides
`README.md`), `package.json` briefly shows `"version": "9999.99.9"`, and
`projects/ui/CHANGELOG.md` and `.changeset/*.md` are both untouched by this run.

- [ ] **Step 4: Rewrite `.github/workflows/release.yml`**

Replace the full file with:

```yaml
name: Release

on:
  push:
    branches: [main]
  workflow_dispatch: {}

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    timeout-minutes: 20
    permissions:
      contents: write
      packages: write

    steps:
      - uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7.0.0
        with:
          fetch-depth: 0
          fetch-tags: true

      - uses: actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e # v6.4.0
        with:
          node-version-file: '.nvmrc'
          cache: 'npm'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@mushilu-san'

      - name: Cache Angular build cache
        uses: actions/cache@55cc8345863c7cc4c66a329aec7e433d2d1c52a9 # v6.1.0
        with:
          path: .angular/cache
          key: angular-cache-${{ runner.os }}-nvmrc-${{ hashFiles('package-lock.json') }}-${{ github.sha }}
          restore-keys: |
            angular-cache-${{ runner.os }}-nvmrc-${{ hashFiles('package-lock.json') }}-
            angular-cache-${{ runner.os }}-nvmrc-

      - name: Install dependencies
        run: npm ci

      - name: Test
        run: npm run test:ci

      - name: Compute release version
        id: version
        run: node scripts/calver-version.mjs

      - name: Build release notes and bump package version (working tree only)
        run: node scripts/calver-changelog.mjs "${{ steps.version.outputs.version }}" "${{ steps.version.outputs.previous_tag }}"

      - name: Build library
        run: npm run build

      - name: Publish package
        working-directory: dist/ui
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Tag release
        run: |
          git tag "v${{ steps.version.outputs.version }}"
          git push origin "v${{ steps.version.outputs.version }}"

      - name: Create GitHub release
        run: gh release create "v${{ steps.version.outputs.version }}" --notes-file /tmp/calver-release-notes.md
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Note the deliberate change in ordering versus the original design: the tag is
now pushed **after** a successful publish, not before — so a tag reliably means
"this exact version made it to the registry." No `git config user.name/email`
is needed anywhere in this file anymore: lightweight tags (`git tag v...`
without `-a`) carry no committer identity, and nothing else in this workflow
commits to git.

- [ ] **Step 5: Validate YAML syntax**

```bash
node -e "require('js-yaml').load(require('fs').readFileSync('.github/workflows/release.yml', 'utf8')); console.log('valid yaml')"
```

Expected: prints `valid yaml`.

- [ ] **Step 6: Commit**

```bash
git add scripts/calver-version.mjs scripts/calver-version.spec.mjs scripts/calver-changelog.mjs .github/workflows/release.yml
git commit -m "fix(release): tag-only release, no push to main (main requires a PR and has no bypass allowance on this GitHub plan)"
```

---

### Task 7: Wire the scripts test suite into CI

The final whole-branch review flagged that `npm run test:scripts` (added in
Task 1) is never run in CI — `ci.yml`'s Test step runs `nx test ui` /
`test:affected`, neither of which touches `scripts/**/*.spec.mjs`, and
`ci-verify.sh` only calls `npm run test:ci`. The calver scripts compute every
published version number and have no CI safety net without this.

**Files:**
- Modify: `.github/workflows/ci.yml:80-90` (the existing "Test" step block)
- Modify: `scripts/ci-verify.sh:42-44` (the existing "Test" block)

**Interfaces:** none — this only adds a CI invocation of the `test:scripts`
npm script that Task 1 already created; no new exports or contracts.

- [ ] **Step 1: Add a step to `ci.yml`**

In `.github/workflows/ci.yml`, immediately after the existing "Test" step
(the one running `npm run test:affected` / `npm run test:ci`), add:

```yaml
      # 3b. Release-tooling scripts — pure-function unit tests for the CalVer
      #     version/changelog scripts that drive every published version.
      - name: Test release scripts
        run: npm run test:scripts
```

- [ ] **Step 2: Add the same call to `ci-verify.sh`**

In `scripts/ci-verify.sh`, immediately after the existing test block:

```bash
if [ "$AFFECTED" = true ]; then
  echo "==> Test (affected only, base=$AFFECTED_BASE)"
  node scripts/affected-run.mjs unit --base "$AFFECTED_BASE"
else
  echo "==> Test"
  npm run test:ci
fi
```

add:

```bash
echo "==> Test release scripts"
npm run test:scripts
```

- [ ] **Step 3: Verify**

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22
npm run test:scripts
bash -n scripts/ci-verify.sh
node -e "require('js-yaml').load(require('fs').readFileSync('.github/workflows/ci.yml', 'utf8')); console.log('valid yaml')"
```

Expected: tests pass, `ci-verify.sh` has valid bash syntax, `ci.yml` is valid
YAML.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/ci.yml scripts/ci-verify.sh
git commit -m "ci: run the CalVer release scripts' test suite in CI"
```

---

### Task 5: Ship it — PR, merge, and first live verification

**Files:** none (process task)

**Interfaces:** none — terminal task.

- [ ] **Step 1: Run the full local CI mirror**

```bash
./scripts/ci-verify.sh
```

Expected: exits 0 (lint, test, build, storybook all pass) — this also exercises
`npm run test:scripts` if it's wired into that script; if not, run it separately:
`npm run test:scripts`.

- [ ] **Step 2: Push the branch and open a PR**

```bash
git push -u origin feat/calver-release-automation
gh pr create --title "feat(release): CalVer auto-release on merge to main" --body "$(cat <<'EOF'
## Summary
- Replaces the broken changesets/action release flow (blocked by a disabled repo
  permission) with calendar versioning (YYYY.WW.N) computed from git tags
- Every merge to main now publishes automatically; workflow_dispatch triggers the
  same flow on demand
- See docs/superpowers/specs/2026-07-08-calver-release-automation-design.md for
  the full design rationale

## Test plan
- [x] scripts/calver-version.spec.mjs and scripts/calver-changelog.spec.mjs pass
- [x] .github/workflows/release.yml YAML validated
- [x] ./scripts/ci-verify.sh green
- [ ] After merge: confirm the Release workflow run succeeds and a real tag +
      changelog entry + published package appear
EOF
)"
```

**CHECKPOINT — do not merge without explicit user go-ahead.** Merging this PR
causes the very next Release workflow run to push a real tag to `main` and publish
a real package version to GitHub Packages. Stop here and let the user review/merge
the PR themselves, or get their explicit confirmation before merging on their
behalf.

- [ ] **Step 3: After the PR is merged, verify the live release**

```bash
gh run list --workflow=release.yml --limit 3
gh run view <run-id> --log   # substitute the run ID from the command above
git fetch --tags && git tag -l 'v2*' | tail -5
```

Expected: the run succeeds end-to-end (test → version → changelog → commit/tag/push
→ build → publish → GitHub release), a new tag matching `v{ISO-year}.{ISO-week}.1`
(or `.N` if this isn't the week's first release) exists, and
`projects/ui/CHANGELOG.md` on `main` has a new section for it.
