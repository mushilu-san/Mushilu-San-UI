# 04 — Potential Bugs

## Executive summary
- **Critical: 0 · High: 0 · Medium: 4 · Low: 4**
- No crashes or data-loss defects found, but several correctness issues exist: a **dead/ineffective guard** in Calendar that never does what its comment claims, an **unchecked `event.touches[0]`** in the context-menu long-press, and an `input()` that's read only once so later updates are silently ignored.
- Error handling is generally fine (no unhandled promise rejections — the library is almost entirely synchronous; no `async`/`await`/`.then` in shipped source).
- Most non-null assertions are guarded; the unguarded `parentElement!` is the main type-assertion risk.
- Top 3 priorities: (1) fix/remove Calendar's bogus guard; (2) guard `touches[0]`; (3) make `input-otp`/`calendar` react to external value changes.

---

## Findings

### MEDIUM

#### B-1 — Calendar's day-disabled guard is a no-op (logic contradicts intent) — ✅ RESOLVED (2026-06-14)
- **Resolution:** Deleted both dead `// guard` lines (also removes the per-cell throwaway `Date` alloc → resolves D-3 and P-3). `isDisabled` now keeps only the real `min`/`max`/outside-month checks. New spec asserts an in-range, in-month day stays enabled.
- **File:** [projects/ui/src/lib/forms/src/calendar/calendar.ts:150-152](projects/ui/src/lib/forms/src/calendar/calendar.ts#L150-L152)
- **Evidence:**
  ```ts
  const isDisabled =
    !date.getMonth().toString ||                                              // guard
    !new Date(date.getFullYear(), date.getMonth(), date.getDate()).getMonth().toString || // guard
    (min != null && date.getTime() < min.getTime()) ||
    ...
  ```
- **Why it matters:** `date.getMonth()` returns a **number**; `.toString` is always a defined function reference, so `!(...).toString` is **always `false`**. These two lines do nothing except allocate a throwaway `Date` per cell (perf, see P-3). They appear intended as some "valid date" guard but cannot ever flag anything. Dead logic masquerading as a safety check invites a real bug later.
- **Fix:** Delete both `// guard` lines. If an invalid-date guard is genuinely wanted, use `Number.isNaN(date.getTime())`.

#### B-2 — `context-menu-trigger` reads `event.touches[0]` without a length check — ✅ RESOLVED (2026-06-14)
- **Resolution:** Added `if (!touch) return;` after `const touch = event.touches[0];`. New spec asserts a `touchstart` with empty `touches` does not throw and does not open the menu.
- **File:** [projects/ui/src/lib/overlays/src/context-menu/context-menu-trigger.ts:33-39](projects/ui/src/lib/overlays/src/context-menu/context-menu-trigger.ts#L33-L39)
- **Evidence:**
  ```ts
  onTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];
    this.touchStartX = touch.clientX;   // touch can be undefined
  ```
- **Why it matters:** `TouchEvent.touches` can be empty (e.g. synthetic events, certain assistive tech, or `touchstart` fired with all touches already ended). `touch.clientX` then throws `TypeError: Cannot read properties of undefined`, breaking the trigger.
- **Fix:** `const touch = event.touches[0]; if (!touch) return;` before dereferencing.

#### B-3 — `input-otp` ignores `[value]` changes after init
- **File:** [projects/ui/src/lib/forms/src/input-otp/input-otp.ts:41-56](projects/ui/src/lib/forms/src/input-otp/input-otp.ts#L41-L56)
- **Evidence:** `value = input('')` is documented as "Initial / externally controlled value … Use [(value)]", but it is read **only** in `ngOnInit` to seed `_slotsData`. There is no `effect`/`computed` reacting to it.
- **Why it matters:** A consumer binding `[value]="otp()"` and later changing `otp` will see the UI **not update** — contradicting the "externally controlled" doc. Only `writeValue` (CVA path) updates after init. This is a silent state-desync bug for template-driven/non-forms usage.
- **Fix:** React to the input with an `effect(() => this._slotsData.set(seed(this.value(), this.length())))`, or document clearly that `value` is init-only and external control requires `formControl`/`ngModel`.

#### B-4 — Calendar `value`/`length`-style desync mirrors B-3 for `length` changes
- **File:** [projects/ui/src/lib/forms/src/input-otp/input-otp.ts:52-56,159-162](projects/ui/src/lib/forms/src/input-otp/input-otp.ts#L52-L56)
- **Evidence:** `_slotsData` is sized from `this.length()` in `ngOnInit`/`writeValue`, but `indices`/`slots` are recomputed from `length()` reactively while `_slotsData` is not. If `length` changes at runtime, `indices` grows but `_slotsData` may be shorter, so `slots()[idx]` is `undefined` for new slots and `emit()` joins a sparse/short array.
- **Why it matters:** Runtime `length` change yields a UI with more inputs than backing data → `undefined` reads and incorrect emitted value.
- **Fix:** Derive slot data length from `length()` reactively (resize `_slotsData` in an `effect` keyed on `length()`), or document `length` as fixed-at-init.

### LOW

#### B-5 — `resizable-panel-group` non-null `parentElement!` can deref null — ✅ RESOLVED (2026-06-14)
- **Resolution:** Replaced `parentElement!` with `const parent = handleEl.parentElement; if (!parent) return;` in both `startResize` and `resizeByPercent`. New spec asserts `resizeByPercent` on a detached handle returns without throwing.
- **File:** [projects/ui/src/lib/layout/src/resizable/resizable-panel-group.ts:81,123](projects/ui/src/lib/layout/src/resizable/resizable-panel-group.ts#L81)
- **Evidence:** `const siblings = Array.from(handleEl.parentElement!.children);`
- **Why it matters:** If a handle element is ever used detached (or during teardown) `parentElement` is `null`; the `!` suppresses the compiler and you get a runtime `TypeError`.
- **Fix:** `const parent = handleEl.parentElement; if (!parent) return;` then use `parent`.

#### B-6 — `NgZone.run` won't trigger change detection under zoneless — ✅ RESOLVED (2026-06-14)
- **Resolution:** Removed all `NgZone.run`/`runOutsideAngular` wrappers from `resizable-panel-group`, `context-menu-trigger`, and `swipe-action` (3 files). `NgZone` is no longer injected or imported anywhere in shipped source (verified by grep). Change detection is driven entirely by signal writes. Also resolves P-2 and P-5.
- **File:** [projects/ui/src/lib/layout/src/resizable/resizable-panel-group.ts:116](projects/ui/src/lib/layout/src/resizable/resizable-panel-group.ts#L116), [context-menu-trigger.ts:38](projects/ui/src/lib/overlays/src/context-menu/context-menu-trigger.ts#L38)
- **Evidence:** `this.ngZone.run(() => { … })`
- **Why it matters:** The library is zoneless; `NgZone` is `NoopNgZone` and `run()` does not schedule CD. Today it happens to work because the wrapped code writes **signals** (which drive CD). But anyone who later puts non-signal state inside `run()` expecting a refresh will get a silent no-update bug.
- **Fix:** Remove the `run`/`runOutsideAngular` wrappers and rely exclusively on signal writes (also a perf win, P-2/P-5).

#### B-7 — Overlays don't reposition on scroll/resize; tooltip text frozen at create
- **File:** [projects/ui/src/lib/data-display/src/tooltip/tooltip.ts:66-91](projects/ui/src/lib/data-display/src/tooltip/tooltip.ts#L66-L91)
- **Evidence:** `position()` runs once on `show()`; `textContent` is set once in `create()` and never refreshed; no `scroll`/`resize` listener; no viewport flip/clamp.
- **Why it matters:** While a tooltip is open, scrolling leaves it at a stale coordinate; if `muiTooltip` input changes while visible the text is stale; near a viewport edge it can render partially off-screen (also a11y, report 07).
- **Fix:** Reposition on `scroll`/`resize` while visible, refresh `textContent` from `muiTooltip()` on show, and clamp/flip within the viewport.

#### B-8 — Carousel item count never decrements; `active` not clamped on shrink
- **File:** [projects/ui/src/lib/data-display/src/carousel/carousel.ts:50-54,84-87](projects/ui/src/lib/data-display/src/carousel/carousel.ts#L50-L54)
- **Evidence:** `registerItem()` only ever increments `_count`; there is no unregister path, and `active` (a `model`) is clamped only inside `goTo`, not when `_count` would shrink.
- **Why it matters:** In a dynamic `@for` of carousel items, removing items leaves `_count` too high and `active` can point past the last item → blank slide / transform past the end.
- **Fix:** Have `CarouselItem` unregister in `ngOnDestroy` (decrement `_count`), and clamp `active` whenever `_count` changes (`effect`).

---

## Categories with no findings (explicit)
- **Unhandled promise rejections / async ordering:** no `async`/`await`/`.then`/`Promise` in shipped source — library is synchronous; not applicable.
- **Off-by-one in pagination/OTP navigation:** reviewed input-otp and calendar arrow/Home/End logic — bounds (`idx < length()-1`, `idx > 0`) are correct.
- **Race conditions:** timer-based code (toast pause/resume, long-press, carousel autoplay) is guarded with null checks and cleared on destroy; no races found beyond the zoneless caveat (B-6).
