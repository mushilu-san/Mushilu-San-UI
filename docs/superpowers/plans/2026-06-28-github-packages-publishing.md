# GitHub Packages Publishing — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Switch `@mushilu-san/ui` publishing target from npmjs.org to GitHub Packages npm registry, keeping the existing Changesets version-management workflow intact.

**Architecture:** Four files change — `.npmrc` gets a scope→registry mapping, `projects/ui/package.json` gets a `publishConfig.registry`, `release.yml` swaps registry-url and auth token, and `.changeset/config.json` drops `"access": "public"` (GitHub Packages ignores it and it can cause warnings). No new dependencies, no new workflows.

**Tech Stack:** GitHub Actions, Changesets, npm, ng-packagr (existing — unchanged)

## Global Constraints

- Node `^22.12.0 || >=24.0.0` (from `.nvmrc`, enforced by `engine-strict=true`)
- Package manager: `npm` (not pnpm)
- All GitHub Actions pinned by commit SHA with `# vX.Y.Z` comment
- Lockfile must stay in sync — any `package.json` change requires `nvm use && npm install` + commit both
- `npm ci` in CI — never `npm install`
- Provenance (`NPM_CONFIG_PROVENANCE`) is **not supported** on GitHub Packages — must be removed

---

### Task 1: Configure `.npmrc` scope mapping + update `publishConfig`

**Files:**
- Modify: `.npmrc` (root)
- Modify: `projects/ui/package.json`
- Modify: `.changeset/config.json`

**Interfaces:**
- Consumes: nothing
- Produces: registry configuration that Task 2's workflow relies on for `npm publish`

- [ ] **Step 1: Add GitHub Packages scope mapping to `.npmrc`**

Append the `@mushilu-san` scope registry line. Keep existing settings intact.

`.npmrc` — full file after edit:
```
engine-strict=true
legacy-peer-deps=true
@mushilu-san:registry=https://npm.pkg.github.com
```

- [ ] **Step 2: Update `publishConfig` in `projects/ui/package.json`**

Replace the current `publishConfig` block to point to GitHub Packages:

```json
"publishConfig": {
  "registry": "https://npm.pkg.github.com"
}
```

Remove `"access": "public"` — GitHub Packages visibility is controlled by repo settings, not npm access flags.

- [ ] **Step 3: Update `.changeset/config.json`**

Change `"access"` from `"public"` to `"restricted"`. GitHub Packages does not use npm access levels — `"public"` can trigger warnings. `"restricted"` is the safe default for non-npmjs registries:

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.1.4/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

- [ ] **Step 4: Regenerate lockfile**

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22
npm install
```

This ensures `package-lock.json` reflects the registry change.

- [ ] **Step 5: Commit**

```bash
git add .npmrc projects/ui/package.json .changeset/config.json package-lock.json
git commit -m "chore: configure @mushilu-san scope for GitHub Packages registry"
```

---

### Task 2: Update `release.yml` workflow

**Files:**
- Modify: `.github/workflows/release.yml`

**Interfaces:**
- Consumes: `.npmrc` scope mapping and `publishConfig.registry` from Task 1
- Produces: working CI publish pipeline to GitHub Packages

- [ ] **Step 1: Update the workflow**

Full replacement for `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    branches: [main]

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    timeout-minutes: 20
    permissions:
      contents: write
      pull-requests: write
      packages: write

    steps:
      - uses: actions/checkout@df4cb1c069e1874edd31b4311f1884172cec0e10 # v6.0.3
        with:
          fetch-depth: 0

      - uses: actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e # v6.4.0
        with:
          node-version-file: '.nvmrc'
          cache: 'npm'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@mushilu-san'

      - name: Cache Angular build cache
        uses: actions/cache@27d5ce7f107fe9357f9df03efb73ab90386fccae # v5.0.5
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

      - name: Build library
        run: npm run build

      - name: Create Release Pull Request or Publish
        uses: changesets/action@a45c4d594aa4e2c509dc14a9f2b3b67ba3780d0d # v1.9.0
        with:
          publish: npm run release
          title: 'chore: version packages'
          commit: 'chore: version packages'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Changes from current:**
1. `permissions` — added `packages: write`, removed `id-token: write` (was for npm provenance)
2. `registry-url` — `https://npm.pkg.github.com` (was `https://registry.npmjs.org`)
3. `scope` — added `'@mushilu-san'`
4. `NODE_AUTH_TOKEN` — `${{ secrets.GITHUB_TOKEN }}` (was `${{ secrets.NPM_TOKEN }}`)
5. `NPM_CONFIG_PROVENANCE` env var — **removed** (not supported on GitHub Packages)

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/release.yml
git commit -m "ci: switch release workflow to publish to GitHub Packages"
```

---

### Task 3: Verify end-to-end locally

**Files:**
- None modified

- [ ] **Step 1: Run ci-verify.sh to confirm nothing broke**

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22
./scripts/ci-verify.sh
```

Expected: all steps pass (npm ci → lint → test → build → storybook).

- [ ] **Step 2: Dry-run publish to confirm registry target**

```bash
cd dist/ui && npm publish --dry-run 2>&1
```

Expected output should show:
- `npm notice Publishing to https://npm.pkg.github.com` (or similar registry line)
- Package name: `@mushilu-san/ui`
- No errors

- [ ] **Step 3: Verify npm config resolution**

```bash
npm config get @mushilu-san:registry
```

Expected: `https://npm.pkg.github.com`

---

## Consumer setup

After publishing, anyone installing `@mushilu-san/ui` needs this in their project's `.npmrc`:

```
@mushilu-san:registry=https://npm.pkg.github.com
```

And they must authenticate:
```bash
npm login --registry=https://npm.pkg.github.com
```

Or use a PAT with `read:packages` scope in their `.npmrc`:
```
//npm.pkg.github.com/:_authToken=ghp_XXXXX
```
