# 00 — Audit Summary

Read-only senior-reviewer audit of **Mushilu-San-UI** (`@mushilu-san/ui`) — an Angular 22, zoneless, mobile-first component library (8 entry-point groups, 116 component files, 59 specs/stories). No backend, no auth layer, no E2E suite. Date: 2026-06-14.

## Overall posture
The codebase is **high quality**: full `strict` + `strictTemplates`, uniform `OnPush`, all `@for` tracked, **zero `as any`**, **zero XSS sinks**, **0 npm advisories**, ~93% unit coverage, and complete per-component a11y stories. The findings below are refinements, not firefighting — concentrated in **missing E2E**, **cross-component duplication**, and a handful of **localized bugs**.

## Findings by category & severity

| # | Report | Critical | High | Medium | Low | Info |
|---|--------|:--:|:--:|:--:|:--:|:--:|
| 01 | Security | 0 | 0 | 1 | 3 | 2 |
| 02 | Performance | 0 | 0 | 3 | 3 | 1 |
| 03 | Decomposition & Duplication | 0 | 1 | 4 | 2 | 0 |
| 04 | Potential Bugs | 0 | 0 | 4 | 4 | 0 |
| 05 | Missing Unit Tests | 0 | 3 | 4 | 1 | 0 |
| 06 | Missing E2E | 1 | 4 | 3 | 0 | 0 |
| 07 | Accessibility | 0 | 0 | 3 | 2 | 1 |
| 08 | Type Safety | 0 | 0 | 1 | 2 | 1 |
| 09 | Dead Code | 0 | 0 | 2 | 3 | 0 |
| 10 | Dependency Health | 0 | 1 | 1 | 1 | 1 |
| | **Total** | **1** | **9** | **26** | **21** | **6** |

**Total findings: 57** (excluding 6 informational/verified-clean notes).

## Progress log

| Date | Finding(s) | What changed |
|------|-----------|--------------|
| 2026-06-14 | B-2 | Guard `event.touches[0]` in context-menu long-press (+ spec) |
| 2026-06-14 | B-1, D-3, P-3 | Delete Calendar's dead always-false guard — fixes the no-op logic, removes dead code, drops the per-cell `Date` allocation (+ spec) |
| 2026-06-14 | B-5 | Guard `parentElement!` null-deref in `resizable-panel-group` (+ spec) |
| 2026-06-14 | A-1 | Add `prefers-reduced-motion` to the 6 missing CSS files; **0** animating CSS files now lack the guard |
| 2026-06-14 | B-6, P-2, P-5 | Remove all inert `NgZone.run`/`runOutsideAngular` wrappers (resizable, context-menu-trigger, swipe-action); `NgZone` no longer injected/imported in shipped source |
| 2026-06-14 | D-1, D-2, A-2, D-5 | Delete orphaned `IdGenerator` + `LiveAnnouncer` (and empty `core/a11y/`); correct toast story prose to match the real dual-region implementation (A-2 moot); remove stray `debug-storybook.log` |
| 2026-06-14 | D-4, P-6 | Remove Carousel's no-op `pointermove` listener (`_onMove`/`_moveListener` + registrations); swipe still computed on `pointerup` |
| 2026-06-14–15 | E-1, E-2, E-4 | Playwright E2E layer (21 tests): Dialog focus-trap/Escape/backdrop, Tabs keyboard nav, DropdownMenu keyboard nav, Carousel swipe — all passing via `/?path=/story/{id}` + frameLocator; `http-server` replaces `serve` to avoid query-string stripping; story fixes (moduleMetadata) for Tabs/Carousel/Dropdown |
| 2026-06-15 | T-1, T-2, T-3, B-3, B-4, DEP-1 | Confirmed already resolved in codebase (ToastService/ResizablePanelGroup/ContextMenuTrigger specs complete; InputOtp effects already in place; chart.js already optional peerDep) |
| 2026-06-15 | T-4 | Add CarouselContent swipe-gesture tests (threshold left/right/below) to `carousel.spec.ts` — 3 new cases |
| 2026-06-15 | T-6 | New `toast-container.spec.ts`: 10 tests covering empty state, polite/assertive live regions, dismiss wiring, aria-label, placement |

**Resolved so far: 26 findings** (B-1, B-2, B-3, B-4, B-5, B-6, A-1, A-2, D-1, D-2, D-3, D-4, D-5, DEP-1, E-1, E-2, E-4, P-2, P-3, P-5, P-6, T-1, T-2, T-3, T-4, T-6). Remaining: ~31. All changes verified by `./dev.sh test` (785 passing) + `./dev.sh build` (clean).

## Prioritized top-10 actions

| # | Action | Source | Severity | Effort |
|---|--------|--------|----------|--------|
| 1 | **Stand up an E2E layer** (Playwright over `storybook-static/`); start with overlay focus-trap + Escape + restore, and touch gestures | E-0, E-1, E-4 | Critical/High | L |
| 2 | **Extract a shared overlay positioning util** with viewport flip/clamp; make Tooltip/Dropdown/Context-Menu/Command/Combobox reuse it (Popover today only reused by Hover Card) | DD-1, A-3, B-7 | High | M |
| 3 | ✅ **Fixed Calendar's always-false `// guard`** (deleted both dead lines — resolves bug + dead code + per-cell allocation). Trimming the 6-week grid itself is deferred. | B-1, D-3, P-3 | Medium | S |
| 4 | ✅ **Guarded `event.touches[0]`** in the context-menu long-press (mobile crash) | B-2 | Medium | S |
| 5 | **Add a `ToastService` spec** (root singleton, high blast radius) and specs for `ResizablePanelGroup` / `ContextMenuTrigger` | T-1, T-2, T-3 | High | M |
| 6 | **Make `input-otp` react to external `[value]`/`length`** (or document as init-only) | B-3, B-4 | Medium | S |
| 7 | ✅ **Added `prefers-reduced-motion`** to the 6 CSS files missing it (mandatory rule) | A-1 | Medium | S |
| 8 | **Extract a roving-tabindex menu-nav directive** (deduplicates ~6 widgets; unblocks E-2 keyboard E2E) | DD-2, E-2 | Medium | M |
| 9 | **Move `chart.js` to an optional peer dependency** so non-Chart consumers don't install it | DEP-1 | High | S |
| 10 | **Resolve orphaned `IdGenerator` + `LiveAnnouncer`** (delete or wire up; if wiring `LiveAnnouncer`, fix the single-node politeness bug) | D-1, D-2, A-2 | Medium | S |

Effort: S = <½ day · M = 1–2 days · L = >2 days.

## Cross-cutting themes
- **Duplication over abstraction:** three patterns (overlay positioning, roving keyboard nav, pointer-drag, CVA boilerplate) are re-implemented per component. Extracting them removes the largest source of latent bugs and a11y drift. (Report 03)
- **Zoneless leftovers:** `NgZone.run`/`runOutsideAngular` calls are inert under the zoneless model and rely implicitly on signals — remove them. (P-2, P-5, B-6)
- **Test pyramid is top-heavy on unit, empty on E2E:** strong jsdom coverage masks untested real-browser behaviors (focus, gestures, positioning). (Reports 05, 06)
- **Two unused core a11y services** suggest an intended central strategy that components bypass due to entry-point isolation (known-issue #9). Pick one direction. (Reports 03, 09)

## Method & caveats
- Static read-only pass (Grep/Glob/Read) + `npm audit --omit=dev` (0 vulns, Node v22.22.3). No code changed.
- **Not machine-verified:** WCAG color-contrast ratios (needs token-value resolution — recommend a CI check) and `depcheck`-grade unused-dependency confirmation (DEP-2/DEP-3 are grep+config based — confirm with `npx depcheck`).
- Coverage figures are from the committed `coverage/` artifact; re-run `./dev.sh test` to confirm.
- All `path:line` references were taken from the files as read during this audit; spot-check before acting on any single line.
