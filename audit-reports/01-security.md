# 01 — Security Audit

## Executive summary
- **Critical: 0 · High: 0 · Medium: 1 · Low: 3 · Info: 2**
- This is a client-side Angular **component library** with no backend, no auth, no network/IO layer, and no user-credential handling — the classic server-side attack surface (injection, SSRF, deserialization, CORS, auth bypass) is **not applicable**.
- `npm audit --omit=dev` reports **0 vulnerabilities** (run under Node v22.22.3, 2026-06-14).
- No `innerHTML`, `[innerHTML]`, or `bypassSecurityTrust*` usage exists in shipped source — DOM is built with `textContent`/`createElement`, so the XSS surface is minimal.
- Top 3 priorities: (1) document/keep the `bypassSecurityTrust` ban as a lint rule; (2) review `ViewEncapsulation.None` global CSS injection in Tooltip; (3) keep `npm audit` in CI.

---

## Findings

### MEDIUM

#### S-1 — Global CSS injection via `ViewEncapsulation.None` in Tooltip — ✅ RESOLVED (2026-06-15)

- **Resolution:** Renamed the global class from `.mui-tooltip` → `.mui-tooltip-overlay` in both `tooltip.css` and `tooltip.ts`. The class comment was updated to document the deliberate `ViewEncapsulation.None` pattern and note the collision-avoidance namespace. `tooltip.spec.ts` and cleanup selectors updated to match.
- **File:** [projects/ui/src/lib/data-display/src/tooltip/tooltip.ts](projects/ui/src/lib/data-display/src/tooltip/tooltip.ts), [tooltip.css](projects/ui/src/lib/data-display/src/tooltip/tooltip.css)

### LOW

#### S-2 — Build/CI hook scripts execute child processes (dev-only)
- **File:** [scripts/team-hooks/lockfile-guard.mjs:5](scripts/team-hooks/lockfile-guard.mjs#L5)
- **Evidence:** `import { execFileSync } from 'node:child_process';`
- **Why it matters:** Shelling out is the usual command-injection vector. Here it uses `execFileSync` (argument vector, **no shell interpolation**), which is the safe form, and the scripts are dev-only tooling never shipped in the npm package. Risk is low but worth noting because these scripts run automatically as Claude/Cursor hooks.
- **Fix:** Keep `execFileSync` (never switch to `execSync`/template-string `exec`). Confirm `scripts/` and `team/` are excluded from the published tarball (`files`/`.npmignore`).

#### S-3 — Hook scripts read marker files and resolve paths from env
- **File:** [scripts/team-hooks/freeze.mjs:14-28](scripts/team-hooks/freeze.mjs#L14-L28)
- **Evidence:**
  ```js
  const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const frozenAbs = resolve(projectDir, dir);
  ```
- **Why it matters:** Path is taken from a file (`.mui-team/freeze`) and an env var, then used in `resolve` + `startsWith` containment checks. The containment check (`child === parent || child.startsWith(parent + '/')`) is correct and prevents prefix-escape, but this is security-adjacent logic that gates edits — a regression here weakens the freeze guard.
- **Fix:** Add a unit test for the `within()` containment helper covering sibling-prefix attacks (e.g. `/a/bc` vs parent `/a/b`). Already mitigated by the `+ '/'` suffix; lock it with a test.

#### S-4 — `tooltip`/`live-announcer`/`calendar` write to `document.body` directly
- **Files:** [tooltip.ts:89](projects/ui/src/lib/data-display/src/tooltip/tooltip.ts#L89), [live-announcer.ts:36](projects/ui/src/core/a11y/live-announcer.ts#L36)
- **Evidence:** `document.body.appendChild(...)` / `this.doc.body.appendChild(this.el)`
- **Why it matters:** Not an injection risk (content is `textContent`), but direct `document` access bypasses Angular's `DOCUMENT` token in Tooltip (live-announcer correctly injects `DOCUMENT`). In SSR or a sandboxed context this can throw or leak nodes across renders.
- **Fix:** Inject `DOCUMENT` in Tooltip rather than referencing the global `document` (consistency + SSR-safety).

### INFO (verified clean — no action)

#### S-5 — No XSS sinks, no unsafe HTML binding
- Grep for `innerHTML` / `[innerHTML]` / `bypassSecurityTrust*` across `projects/ui/src` returns **only doc-comments** in [breadcrumb.ts:26](projects/ui/src/lib/navigation/src/breadcrumb/breadcrumb.ts#L26) and [avatar.ts:34](projects/ui/src/lib/primitives/src/avatar/avatar.ts#L34) noting that Angular's built-in URL sanitizer applies to `[src]`/`[href]`. No bypasses. **No action needed.**

#### S-6 — No hardcoded secrets / credentials
- Grep for `api_key|secret|password|token|bearer = "…"` across `projects` and `scripts` returns nothing. `npm audit --omit=dev` → **0 vulnerabilities**. **No action needed.**

---

## Categories with no findings (explicit)
- **Injection (SQL/command/template):** N/A — no DB, no server, hook scripts use `execFileSync`.
- **Auth / authorization:** N/A — library has no auth.
- **Unsafe deserialization / SSRF / CORS:** N/A — no `JSON.parse` of untrusted input, no `fetch`/HTTP, no server.
- **Sensitive data in logs:** none found.
