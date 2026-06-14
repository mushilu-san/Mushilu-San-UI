# 09 — Dead Code

## Executive summary
- **Critical: 0 · High: 0 · Medium: 2 · Low: 3**
- Two core `core/a11y/` services are **orphaned**: `IdGenerator` is referenced nowhere outside its own file, and `LiveAnnouncer` is referenced only by a Storybook story — neither is exported from any `public-api.ts` nor injected by a shipped component.
- One block of **logically dead code** exists in Calendar (the always-false `// guard` expressions, cross-listed as bug B-1).
- Minor: a no-op pointer-move listener in Carousel and a stray `debug-storybook.log` in the working tree.
- Top 3 priorities: (1) delete or wire up `IdGenerator`; (2) delete or wire up `LiveAnnouncer`; (3) remove Calendar's dead guard.

---

## Findings

### MEDIUM

#### D-1 — `IdGenerator` service is unused (orphaned) — ✅ RESOLVED (2026-06-14, deleted)
- **Resolution:** Deleted `id-generator.ts`. Components keep their local `nextId` counters (per DD-5); central strategy is blocked by known-issue #9 anyway. Grep confirms no remaining references.
- **File:** [projects/ui/src/core/a11y/id-generator.ts](projects/ui/src/core/a11y/id-generator.ts)
- **Evidence:** Grep for `IdGenerator` across all of `projects/ui/src` matches **only the definition file**. It is not exported from the primary `public-api.ts` (which exports only `provideMushiluUi`), not from any group barrel, and not injected by any component. Components that need ids use their own `let nextId` counters instead (calendar, date-picker, tooltip — see DD-5).
- **Why it matters:** `providedIn: 'root'` makes it tree-shakeable so it won't bloat consumers, but it's maintenance cruft that implies a central id strategy that doesn't actually exist, and it has no spec. It directly contradicts the duplicated local counters.
- **Fix:** Decide DD-5 first. If local counters stay, **delete** `id-generator.ts`. If a central strategy is wanted, export it from the primary entry and migrate components to it.

#### D-2 — `LiveAnnouncer` used only by a story, not by shipped code — ✅ RESOLVED (2026-06-14, deleted)
- **Resolution:** Deleted `live-announcer.ts` (and the now-empty `core/a11y/` dir). The only reference was an inaccurate prose string in `toast.stories.ts`, corrected to describe the real implementation: `toast-container.html` already ships **two persistent** `aria-live` regions (polite + assertive), which is exactly the pattern A-2 recommended — so A-2 is moot. No shipped component injected it.
- **File:** [projects/ui/src/core/a11y/live-announcer.ts](projects/ui/src/core/a11y/live-announcer.ts)
- **Evidence:** Grep for `LiveAnnouncer` outside its own file matches **only** [toast.stories.ts](projects/ui/src/lib/feedback/src/toast/toast.stories.ts). It's not exported from any `public-api.ts` and no shipped component injects it (components act as their own live regions per known-issue #9).
- **Why it matters:** It's effectively dead in the published library while still carrying the a11y bug noted in A-2. A story importing it can't reach it via the package (it's not exported), so even the story coupling is fragile.
- **Fix:** Either delete it, or export it from the primary entry and wire `Toast`/`Alert`/status components to announce through it (then fix A-2 first).

### LOW

#### D-3 — Calendar's always-false `// guard` expressions
- **File:** [projects/ui/src/lib/forms/src/calendar/calendar.ts:150-152](projects/ui/src/lib/forms/src/calendar/calendar.ts#L150-L152)
- **Evidence:** `!date.getMonth().toString || !new Date(...).getMonth().toString` — `.toString` is always defined, so both terms are always `false`. Unreachable effect. (Full analysis in bug B-1; perf cost in P-3.)
- **Why it matters:** Dead boolean terms that allocate a `Date` per cell and obscure the real disabled logic.
- **Fix:** Delete the two `// guard` lines.

#### D-4 — Carousel registers a no-op `pointermove` listener — ✅ RESOLVED (2026-06-14)
- **Resolution:** Removed `_onMove`, `_moveListener`, and all `pointermove` add/remove calls (in `onPointerDown`, `_onUp`, and `ngOnDestroy`). Swipe distance is still computed on `pointerup`. Also resolves P-6. Tests green.
- **File:** [projects/ui/src/lib/data-display/src/carousel/carousel-content.ts:44-46](projects/ui/src/lib/data-display/src/carousel/carousel-content.ts#L44-L46)
- **Evidence:** `_onMove(_event) { /* no-op — handled on up */ }` is attached as a `pointermove` document listener.
- **Why it matters:** The handler and its registration are dead — swipe distance is computed entirely on `pointerup`.
- **Fix:** Remove `_onMove` and its `addEventListener('pointermove', …)`/`removeEventListener` (also P-6).

#### D-5 — Stray `debug-storybook.log` in the working tree — ✅ RESOLVED (2026-06-14, deleted)
- **Resolution:** Deleted the file. It was already covered by `.gitignore` (`*storybook.log`, line 49), so no gitignore change needed.
- **File:** `debug-storybook.log` (repo root, 7,335 bytes)
- **Evidence:** Present on disk; `git ls-files` shows it is **untracked** (not committed).
- **Why it matters:** Stray build/debug artifact at the repo root; clutters the workspace and risks being accidentally committed.
- **Fix:** Delete it and add `*.log` (or `debug-storybook.log`) to `.gitignore` if not already covered.

---

## Categories with no findings (explicit)
- **`@ts-ignore`/`@ts-expect-error`/`eslint-disable` in source:** zero occurrences.
- **Unreachable code branches:** none beyond D-3.
- **Orphaned component files:** every component file is reachable from a group `public-api.ts` (spot-checked overlays barrel; all components re-exported). Sub-components without specs (report 05) are still exported and used by their parents — not dead.
