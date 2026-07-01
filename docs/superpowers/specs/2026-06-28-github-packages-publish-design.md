# GitHub Actions CI + GitHub Packages Publish Design

**Date:** 2026-06-28  
**Status:** Approved

## Overview

Two GitHub Actions workflows to build/test on CI and auto-publish `@mushilu-san/ui` to GitHub Packages on every merge to `main`.

## Architecture

```
.github/
  workflows/
    ci.yml       # build + lint + test
    publish.yml  # auto-patch bump + publish to GitHub Packages
```

**Flow:**
- PR opened/updated → `ci.yml` → pass/fail shown on PR
- Push to `main` → `ci.yml` → `publish.yml` (only if CI passes)

`publish.yml` uses `workflow_run` trigger gated on `ci.yml` success. Publish never runs unless CI is green.

## `ci.yml`

**Triggers:** `push` to `main`, `pull_request` targeting `main`

**Steps:**
1. Checkout repo
2. Setup Node 22
3. `npm ci`
4. `npm run build` — builds all 8 entry points
5. `npm run test` — Vitest suite
6. `npm run lint` — type/style checks

**Runner:** `ubuntu-latest`

## `publish.yml`

**Triggers:** `workflow_run` on `ci.yml` completing with `success`, branch `main` only

**Steps:**
1. Checkout repo (full git history)
2. Setup Node 22 + configure npm registry to `https://npm.pkg.github.com`
3. `npm ci`
4. `npm version patch --no-git-tag-version` — auto-increment patch in `package.json`
5. `git commit -am "chore: bump version"` + `git push`
6. `npm publish` — publishes to GitHub Packages

**Permissions:**
- `contents: write` — for git commit + push of version bump
- `packages: write` — for npm publish to GitHub Packages

**Secrets:** Uses `GITHUB_TOKEN` only — no extra secrets needed.

## Constraints

- Node 22 required (project hard requirement)
- Package scope must be `@mushilu-san` to match GitHub org/user
- `package.json` must have `"publishConfig": { "registry": "https://npm.pkg.github.com" }` set

## Out of Scope

- Changesets-based versioning (replaced by auto-patch)
- Multi-Node matrix builds
- Publishing to npm public registry
