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

#### B-3 — `input-otp` ignores `[value]` changes after init — ✅ RESOLVED (2026-06-15)

- **Resolution:** Added two `effect`s in the constructor: (1) reacts to `value()` signal changes and re-seeds `_slotsData` (non-CVA path only); (2) reacts to `length()` changes in CVA mode to resize slots while preserving existing content. A `_cvaActive` flag gates which effect applies.
- **File:** [projects/ui/src/lib/forms/src/input-otp/input-otp.ts](projects/ui/src/lib/forms/src/input-otp/input-otp.ts)

#### B-4 — Calendar `value`/`length`-style desync mirrors B-3 for `length` changes — ✅ RESOLVED (2026-06-15)

- **Resolution:** Resolved together with B-3. The constructor's second effect resizes `_slotsData` when `length()` changes (in CVA mode), so the slot count always matches `indices`.
- **File:** [projects/ui/src/lib/forms/src/input-otp/input-otp.ts](projects/ui/src/lib/forms/src/input-otp/input-otp.ts)

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

#### B-7 — Overlays don't reposition on scroll/resize; tooltip text frozen at create — ✅ RESOLVED (2026-06-15)

- **Resolution:** Tooltip now adds `scroll`/`resize` listeners (captured/passive) on `show()` and removes them on `hide()`; `textContent` is refreshed from `muiTooltip()` on re-show; `position()` clamps `top`/`left` within the viewport (4px margins).
- **File:** [projects/ui/src/lib/data-display/src/tooltip/tooltip.ts](projects/ui/src/lib/data-display/src/tooltip/tooltip.ts)

#### B-8 — Carousel item count never decrements; `active` not clamped on shrink — ✅ RESOLVED (2026-06-15)

- **Resolution:** Added `unregisterItem()` to `CarouselContext` interface; `CarouselItem.ngOnDestroy` calls it; `Carousel` constructor adds an `effect` that clamps `active` to `_count - 1` whenever the count shrinks.
- **File:** [projects/ui/src/lib/data-display/src/carousel/carousel.ts](projects/ui/src/lib/data-display/src/carousel/carousel.ts), [carousel-item.ts](projects/ui/src/lib/data-display/src/carousel/carousel-item.ts)

---

## Categories with no findings (explicit)
- **Unhandled promise rejections / async ordering:** no `async`/`await`/`.then`/`Promise` in shipped source — library is synchronous; not applicable.
- **Off-by-one in pagination/OTP navigation:** reviewed input-otp and calendar arrow/Home/End logic — bounds (`idx < length()-1`, `idx > 0`) are correct.
- **Race conditions:** timer-based code (toast pause/resume, long-press, carousel autoplay) is guarded with null checks and cleared on destroy; no races found beyond the zoneless caveat (B-6).
