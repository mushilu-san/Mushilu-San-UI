# 05 — Missing / Weak Unit Tests

## Executive summary
- **Critical: 0 · High: 3 · Medium: 4 · Low: 1** (gaps, prioritized by complexity × blast radius)
- Aggregate coverage is **strong** (from `coverage/ui/index.html`, last run): **Statements 92.94% (2962/3187) · Branches 92.86% (1914/2061) · Functions 89.57% (584/652) · Lines 94.4% (2059/2181)**. Function coverage (89.57%) is the weakest axis.
- The risk is concentrated in **specific untested files**, not overall percentage: the root-singleton `ToastService`, the timer/touch-heavy `ContextMenuTrigger`, and the drag-math `ResizablePanelGroup` have **no spec at all**.
- 45 source files lack a sibling `*.spec.ts`; many are trivial sub-components covered transitively by parent specs, but the ones below carry real logic.
- Top 3 priorities: (1) `toast.service.ts`; (2) `resizable-panel-group.ts` drag math; (3) `context-menu-trigger.ts` long-press/touch.

---

## Findings (prioritized by risk)

### HIGH

#### T-1 — `ToastService` has no spec (root singleton, high blast radius)
- **File:** [projects/ui/src/lib/feedback/src/toast/toast.service.ts](projects/ui/src/lib/feedback/src/toast/toast.service.ts) — no `toast.service.spec.ts` exists.
- **Why it matters:** `providedIn: 'root'` API consumed across any app using toasts; it owns id assignment and the visible-toast signal. A regression silently breaks every consumer's notifications.
- **Key cases:** `show()` assigns incrementing unique ids; `info/success/warning/danger` set the right variant and pass through options; `dismiss(id)` removes only the matching toast; `dismiss` of an unknown id is a no-op; `clear()` empties; `toasts` is read-only and reflects order (oldest first).

#### T-2 — `ResizablePanelGroup` drag math untested
- **File:** [projects/ui/src/lib/layout/src/resizable/resizable-panel-group.ts](projects/ui/src/lib/layout/src/resizable/resizable-panel-group.ts) — no spec.
- **Why it matters:** Contains the most non-trivial pure logic in `layout`: `registerPanel` normalization, `_applyDelta` min/max clamping with paired-panel compensation, and index math (`Math.floor((handlePos-1)/2)`). Also holds the `parentElement!` null-deref risk (B-5) and zoneless `NgZone` caveat (B-6).
- **Key cases:** `registerPanel` normalizes sizes to sum 100; `_applyDelta` respects `minSize`/`maxSize` on both panels and conserves total; handle-index → panel-index mapping; out-of-range handle returns early; `resizeByPercent` keyboard path.

#### T-3 — `ContextMenuTrigger` long-press/touch untested
- **File:** [projects/ui/src/lib/overlays/src/context-menu/context-menu-trigger.ts](projects/ui/src/lib/overlays/src/context-menu/context-menu-trigger.ts) — no spec.
- **Why it matters:** Timer + touch logic with a real crash bug (B-2 unchecked `touches[0]`) and an unused-`NgZone` caveat. Mobile is the library's primary target.
- **Key cases:** `contextmenu` prevents default + calls `openAt(clientX,clientY)`; long-press after `LONG_PRESS_MS` opens at touch coords; `touchmove`/`touchend` cancel the timer; empty `touches` does not throw; timer cleared on destroy.

### MEDIUM

#### T-4 — `CarouselContent` swipe gesture untested
- **File:** [projects/ui/src/lib/data-display/src/carousel/carousel-content.ts](projects/ui/src/lib/data-display/src/carousel/carousel-content.ts) — no spec.
- **Why it matters:** Pointer-drag threshold logic (`offsetWidth * 0.25`) and listener cleanup; swipe direction → `next()`/`prev()`.
- **Key cases:** swipe past threshold left → `next`, right → `prev`; below threshold → no change; listeners removed on `pointerup` and `ngOnDestroy`.

#### T-5 — Compound-widget sub-components rely entirely on parent specs
- **Files (no own spec):** all `command-*` (8 files), `menubar-*` (5), `navigation-menu-*` (4), `tabs/{tab,tab-list,tab-panel}.ts`, `dropdown-{item,trigger,separator}.ts`, `context-menu-{item,separator}.ts`, `sidebar-{item,section,trigger}.ts`, `accordion-item.ts`, `toggle-group-item.ts`, `hover-card-{content,trigger}.ts`, `popover-trigger.ts`. (Full list from spec-gap scan.)
- **Why it matters:** Keyboard navigation and ARIA wiring (the duplicated logic from DD-2) live in these items. If they're only exercised through a parent's happy-path spec, edge cases (Home/End wrap, disabled-item skip, type-ahead) go untested. Function coverage at 89.57% likely reflects these.
- **Key cases:** per item — roving `tabindex` assignment, Enter/Space activation, Arrow/Home/End handling, `aria-disabled` skip, separator non-focusability.

#### T-6 — `ToastContainer` untested
- **File:** [projects/ui/src/lib/feedback/src/toast/toast-container.ts](projects/ui/src/lib/feedback/src/toast/toast-container.ts) — no spec.
- **Why it matters:** Renders the `ToastService` signal and wires `dismissed` back to `dismiss`. The glue between service and UI.
- **Key cases:** renders one `mui-toast` per service entry with correct inputs; child `dismissed` emit calls `service.dismiss(id)`; empty state renders nothing.

#### T-7 — `Calendar` date-grid edge cases (despite having a spec)
- **File:** [projects/ui/src/lib/forms/src/calendar/calendar.ts](projects/ui/src/lib/forms/src/calendar/calendar.ts) — spec exists; verify it covers the math.
- **Why it matters:** Month-boundary, leap-year, `min`/`max` disabling, keyboard PageUp/PageDown month change, and the bogus guard (B-1) need explicit assertions. The pure date logic should be tested directly (see DD-6 split).
- **Key cases:** Feb leap vs non-leap day count; first-of-month not Sunday alignment; `minDate`/`maxDate` disable the right cells; ArrowDown crossing month flips `viewMonth`; selecting commits a normalized (midnight) date.

### LOW

#### T-8 — Core a11y services thinly/zero tested
- **Files:** [core/a11y/id-generator.ts](projects/ui/src/core/a11y/id-generator.ts) (no usage — see D-1), [core/a11y/live-announcer.ts](projects/ui/src/core/a11y/live-announcer.ts)
- **Why it matters:** Low blast radius today because they're effectively unused (report 09), but if `LiveAnnouncer` is wired up later it needs tests for the polite/assertive re-announce behavior.
- **Key cases:** `LiveAnnouncer.announce` clears then sets `textContent`; politeness attribute set; element removed on destroy. (Or: delete both per report 09 and drop the requirement.)

---

## Note
Coverage numbers above are from the committed `coverage/` artifact; re-run `./dev.sh test` to confirm current values before acting.
