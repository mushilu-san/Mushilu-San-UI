# 10 — Dependency Health

## Executive summary
- **Critical: 0 · High: 1 · Medium: 1 · Low: 1 · Info: 1**
- `npm audit --omit=dev` → **0 vulnerabilities** (Node v22.22.3, 2026-06-14). Toolchain is current: Angular 22, TypeScript 6, ng-packagr 22, Storybook 10.4, ESLint 10, Vitest 4.
- The one structural issue: **`chart.js` is a hard runtime `dependency`** but is imported by exactly one component (`Chart`). Every consumer of `@mushilu-san/ui` installs (and risks bundling) chart.js even if they never use the Chart component.
- `@compodoc/compodoc` is a devDependency that appears **disabled/unused** (`compodoc: false` in `angular.json`).
- Top 3 priorities: (1) move `chart.js` to an optional peer dependency; (2) drop or activate `@compodoc/compodoc`; (3) keep `npm audit` + `size-limit` gating in CI.

---

## Findings

### HIGH

#### DEP-1 — `chart.js` is a mandatory runtime dependency used by one component
- **File:** [package.json:33](package.json#L33) (`"chart.js": "^4.5.1"` under `dependencies`)
- **Evidence:** Only consumers are [chart.ts](projects/ui/src/lib/data-display/src/chart/chart.ts) and [chart.types.ts](projects/ui/src/lib/data-display/src/chart/chart.types.ts). The `size-limit` config already `ignore`s chart.js for bundle measurement, confirming it's treated as an external peer for sizing — yet it's declared as a hard `dependency`.
- **Why it matters:** chart.js is a heavyweight library (~tens of KB minzipped + Canvas internals). As a hard `dependency` it is installed for **every** consumer and pulled into the dependency graph regardless of whether they import the `data-display` Chart. This inflates install size and transitive risk for users who only want, say, Button + Input.
- **Fix:** Declare `chart.js` as an **optional `peerDependency`** (`peerDependenciesMeta: { "chart.js": { optional: true } }`) so only consumers using Chart install it; document the requirement on the Chart component. Per CLAUDE.md's lockfile rule, regenerate `package-lock.json` in the same commit (`nvm use && npm install`, commit both files).

### MEDIUM

#### DEP-2 — `@compodoc/compodoc` devDependency appears unused
- **File:** [package.json:46](package.json#L46); [angular.json:45,55](angular.json#L45)
- **Evidence:** Referenced only in `package.json`/`package-lock.json` and as `"compodoc": false` in two `angular.json` Storybook builder configs. No `compodoc` npm script, no docs generation step in `scripts/ci-verify.sh`.
- **Why it matters:** Carries an unused devDependency (and its transitive tree) that must be installed in CI and kept patched for no benefit.
- **Fix:** Remove `@compodoc/compodoc` (and the `compodoc: false` flags if the builder defaults are fine), or wire up an actual `docs` script if compodoc output is intended. Regenerate the lockfile in the same commit.

### LOW

#### DEP-3 — `rxjs` is a near-unused runtime dependency
- **File:** [package.json:34](package.json#L34) (`"rxjs": "~7.8.0"`)
- **Evidence:** The library is signal-based and zoneless; RxJS imports in shipped source are minimal (no `takeUntilDestroyed`/observable patterns surfaced in the leak scan). RxJS is an Angular transitive peer anyway.
- **Why it matters:** If the library truly doesn't import rxjs directly, listing it as a direct `dependency` is unnecessary surface; if it does, it should stay. Worth confirming.
- **Fix:** Grep shipped source for direct `from 'rxjs'` imports; if none, drop it from `dependencies` (Angular still provides it transitively). Verify build + regenerate lockfile.

### INFO (verified healthy — no action)

#### DEP-4 — Toolchain current, no advisories, budgets enforced
- `npm audit --omit=dev` → **0 vulnerabilities**. All Angular packages pinned to `^22`, TS `~6.0`, consistent major versions (no duplicate Angular majors). `size-limit` per-entry budgets are configured in `package.json` (7–12 KB/group) and GitHub Actions are SHA-pinned per CLAUDE.md. **No action.**

---

## Notes & method
- `npm audit` was run with `--omit=dev` to reflect what consumers actually install; a full `npm audit` (incl. dev) is worth running in CI too, but dev-only advisories don't ship.
- Could not run `npm-check`/`depcheck` in this read-only pass; DEP-2/DEP-3 are based on grep + config inspection. Confirm with `npx depcheck` before removing any package, and follow CLAUDE.md's mandatory "commit `package.json` + `package-lock.json` together under the correct Node" rule for any change here.
