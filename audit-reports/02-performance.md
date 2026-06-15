# 02 — Performance Audit

## Executive summary
- **Critical: 0 · High: 0 · Medium: 3 · Low: 3 · Info: 1**
- Change-detection hygiene is **strong**: every `@Component` declares `ChangeDetectionStrategy.OnPush`, every `@for` uses `track` (no un-tracked loops found), and template bindings are signal calls (`label()`, `weeks()`) which are cheap and pull-based under zoneless OnPush — **not** a CD problem.
- Real costs are localized: repeated `Intl.DateTimeFormat` construction in Calendar, redundant `NgZone` usage in a zoneless library, and the always-6-row calendar grid.
- The `chart.js` runtime dependency is the only heavy bundle contributor (see `10-dependency-health.md`).
- Top 3 priorities: (1) memoize `Intl.DateTimeFormat` in Calendar; (2) remove ineffective `NgZone` calls; (3) trim the calendar grid to the weeks actually needed.

---

## Findings

### MEDIUM

#### P-1 — `Intl.DateTimeFormat` reconstructed on every Calendar recompute — ✅ RESOLVED (2026-06-15)

- **Resolution:** Added `private readonly _fmt = computed(() => ({ monthYear, weekdayShort, weekdayLong }))` that creates all 3 formatters once per `locale()` change. `monthLabel`, `prevMonthLabel`, `nextMonthLabel`, and `weekDayNames` now call `this._fmt()` and reuse the cached instances. Down from 16+ constructors per recompute to 3, rebuilt only on locale change.
- **File:** [projects/ui/src/lib/forms/src/calendar/calendar.ts](projects/ui/src/lib/forms/src/calendar/calendar.ts)

#### P-2 — Redundant `NgZone` orchestration in a zoneless library — ✅ RESOLVED (2026-06-14)
- **Resolution:** Removed the `runOutsideAngular`/`run` wrappers; the `addEventListener` calls and `_applyDelta`/`startPos` writes now run directly (signal writes already drive CD). `NgZone` injection and import dropped.
- **File:** [projects/ui/src/lib/layout/src/resizable/resizable-panel-group.ts:101-119](projects/ui/src/lib/layout/src/resizable/resizable-panel-group.ts#L101-L119)
- **Evidence:**
  ```ts
  this.ngZone.runOutsideAngular(() => {
    document.addEventListener('pointermove', this._moveListener);
    document.addEventListener('pointerup', this._upListener);
  });
  ...
  this.ngZone.run(() => { this._applyDelta(...); this._dragState!.startPos = pos; });
  ```
- **Why it matters:** The library is explicitly zoneless (no zone.js). In a zoneless app `NgZone` is `NoopNgZone`: `runOutsideAngular` is a no-op and `run()` does **not** trigger change detection. The actual re-render is driven by the `_sizes` **signal** in `_applyDelta`, so the `run()` wrapper adds overhead and false reassurance without doing anything. (See also `04-bugs.md` B-6.)
- **Fix:** Remove `runOutsideAngular`/`run` wrappers; rely on signals for CD. If zone-based consumers must be supported, document it — but the signal write already covers both modes.

#### P-3 — Calendar always renders a fixed 6×7 (42-cell) grid
- **File:** [projects/ui/src/lib/forms/src/calendar/calendar.ts:146](projects/ui/src/lib/forms/src/calendar/calendar.ts#L146)
- **Evidence:** `for (let w = 0; w < 6; w++) { … 7 cells … }` — always 42 `CalDay` objects + 42 `norm()` Date allocations per recompute, even for months that fit in 4–5 weeks.
- **Why it matters:** Each cell also runs the (ineffective) guard expressions in lines 150-152 that allocate **another** `new Date(...)` per cell (84 Date objects/recompute). Combined with P-1 this makes month navigation needlessly allocation-heavy.
- **Fix:** Compute the number of weeks needed (`Math.ceil((firstDayOffset + daysInMonth) / 7)`) and stop early. Remove the dead guard `new Date()` allocation (see `04-bugs.md` B-1 / `09-dead-code.md` D-3).

### LOW

#### P-4 — `ToastService` toast list is unbounded — ✅ RESOLVED (2026-06-15)

- **Resolution:** Added `MAX_TOASTS = 5` constant; `show()` now slices to the last 5 entries after each push, dropping the oldest. Spec extended with a cap-verification test.
- **File:** [projects/ui/src/lib/feedback/src/toast/toast.service.ts](projects/ui/src/lib/feedback/src/toast/toast.service.ts)

#### P-5 — `context-menu-trigger` uses `NgZone.run` in zoneless context — ✅ RESOLVED (2026-06-14)
- **Resolution:** Unwrapped `zone.run(() => this.ctx.openAt(…))` to a direct call; `NgZone` injection/import removed. Same cleanup applied to `swipe-action` (`offsetX.set`).
- **File:** [projects/ui/src/lib/overlays/src/context-menu/context-menu-trigger.ts:38](projects/ui/src/lib/overlays/src/context-menu/context-menu-trigger.ts#L38)
- **Evidence:** `this.zone.run(() => this.ctx.openAt(...))`
- **Why it matters:** Same as P-2 — `openAt` presumably sets a signal that drives CD; the `zone.run` wrapper is inert under zoneless. Minor overhead + misleading.
- **Fix:** Call `this.ctx.openAt(...)` directly.

#### P-6 — `carousel-content` registers a no-op `pointermove` listener — ✅ RESOLVED (2026-06-14)
- **Resolution:** Dropped the `pointermove` listener entirely (+ `_onMove`/`_moveListener`); only `pointerup` remains. Same change as D-4.
- **File:** [projects/ui/src/lib/data-display/src/carousel/carousel-content.ts:40-46](projects/ui/src/lib/data-display/src/carousel/carousel-content.ts#L40-L46)
- **Evidence:** `document.addEventListener('pointermove', this._moveListener)` where `_onMove` is `/* no-op — handled on up */`.
- **Why it matters:** Attaching a document-level `pointermove` handler that does nothing fires on every move during a drag — pure overhead. Swipe distance is computed on `pointerup` from `_startX`, so the move listener is unnecessary.
- **Fix:** Drop the `pointermove` listener entirely; keep only `pointerup`.

### INFO (verified strong — no action)

#### P-7 — OnPush + tracked loops + signal templates
- All `@Component` files set `OnPush`; no `*ngFor`/`@for` without `track`/`trackBy` exists. Template method-style bindings are signal reads (cheap, memoized). **No CD findings.**

---

## Categories with no findings (explicit)
- **Memory leaks from listeners/timers:** every `addEventListener`/`setTimeout`/`setInterval` site has matching cleanup in `ngOnDestroy` (verified in carousel, carousel-content, resizable, toast, hover-card, context-menu-trigger). No missing `takeUntilDestroyed` (RxJS is barely used).
- **Blocking sync work on Node side:** N/A — no server runtime; build scripts are short-lived.
- **N+1 / unbatched calls:** N/A — no data layer.
