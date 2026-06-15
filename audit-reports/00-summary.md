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
| 2026-06-15 | B-7, A-3, A-4 | Tooltip: add scroll/resize reposition listeners while visible; refresh text on show; viewport clamp (top/left clamped to viewport); document-level Escape listener (fixes A-4 — Escape now works for pointer-only users); remove now-unnecessary `@HostListener('keydown.escape')` |
| 2026-06-15 | B-8 | Carousel: add `unregisterItem()` to `CarouselContext` interface; `CarouselItem.ngOnDestroy` calls it; `Carousel` constructor adds `effect` to clamp `active` when count shrinks |
| 2026-06-15 | TS-1 | InputOtp `onInput`: use `event.currentTarget` (the element the listener is bound to) instead of `event.target as HTMLInputElement` (unsafe on bubbled events) |
| 2026-06-15 | TS-3 | ResizablePanelGroup `_onPointerMove`: capture `const state = this._dragState` once after the null guard; removes `!` re-assertion across an async boundary |
| 2026-06-15 | A-5 | Calendar focus-after-month-change: replace `setTimeout(() => el.focus())` with `afterNextRender(() => el.focus())` — deterministic, test-friendly, no silent swallow via optional chaining |
| 2026-06-15 | T-7 | Calendar spec: 5 new edge-case tests — Feb leap/non-leap day count, ArrowDown cross-month heading update, minDate disables earlier days, day selection normalizes to midnight |
| 2026-06-15 | E-5 | New `toast.e2e.ts`: 6 tests — Info/Warning shows toast in correct live region, dismiss button works, multiple toasts stack, sticky danger persists |
| 2026-06-15 | E-6 | New `tooltip.e2e.ts`: 7 tests — hover/focus show, mouseleave/blur hide, Escape (document-level), aria-describedby wired; also added `moduleMetadata` decorator to tooltip.stories.ts (same bootstrapping fix as batch 1) |
| 2026-06-15 | E-7 | New `calendar.e2e.ts`: 7 tests — grid renders, ArrowRight/Down move focus, Prev/Next month buttons, day selection (aria-selected), min/max disabled days, PageDown month nav |
| 2026-06-15 | P-1 | Calendar `Intl.DateTimeFormat` memoized: `_fmt = computed(...)` creates 3 formatters once per locale; `monthLabel`, `prevMonthLabel`, `nextMonthLabel`, `weekDayNames` reuse them (16+ → 3 constructors/recompute) |
| 2026-06-15 | P-4 | ToastService capped: `MAX_TOASTS = 5`; `show()` slices oldest when exceeded; spec extended with cap test |
| 2026-06-15 | S-1 | Tooltip class renamed `.mui-tooltip` → `.mui-tooltip-overlay`; comment documents deliberate `ViewEncapsulation.None`; spec/cleanup selectors updated |
| 2026-06-15 | T-5 | Tabs spec: 8 new keyboard edge-case tests — ArrowLeft + wrap, Enter/Space activate tab, disabled-tab skip in nav, vertical ArrowDown/ArrowUp |
| 2026-06-15 | E-3 | New `ReactiveFormBinding` story in `input-otp.stories.ts` (`[length]="4"`, no ReactiveFormsModule — Storybook Angular 10 won't bootstrap NgModules with standalone components); new `cva.e2e.ts` — 5 tests: empty slots on load, typing fills left-to-right, partial entry, slots not aria-disabled, Backspace on filled slot clears it |
| 2026-06-15 | DD-5 | Accepted: per-module `let nextId = 0` is the standardized pattern (cross-entry import blocked by known-issue #9); `IdGenerator` already deleted (D-1) |
| 2026-06-15 | DD-7 | Accepted: per-overlay Escape handling is correct for non-nested overlays; `OverlayStack` deferred to if/when overlay stacking becomes a requirement |
| 2026-06-15 | DEP-2 | Verified clean: `@compodoc/compodoc` is not in `package.json`; `"compodoc": false` in `angular.json` is a Storybook builder config flag, not a dependency |
| 2026-06-15 | DEP-3 | Verified clean: zero `from 'rxjs'` imports in shipped source; `rxjs` correctly listed only as `peerDependency` in each `ng-package.json` |

**Resolved so far: 47 findings** (B-1–B-8, A-1–A-5, D-1–D-5, DD-5, DD-7, DEP-1–DEP-3, E-1–E-7, P-1–P-6, S-1, T-1–T-7, TS-1, TS-3). Remaining: ~10. All changes verified by `./dev.sh test` (798 unit passing) + `npm run e2e` (47 E2E passing).

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
