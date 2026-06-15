# 06 — Missing E2E Tests

## Executive summary
- **Critical: 1 · High: 4 · Medium: 3 · Low: 0**
- **There is no E2E layer at all.** No `playwright.config.*`, no `*.e2e.*` spec, no `@playwright/test` dependency. The only browser-level coverage is Storybook stories (manual/visual) and the `@storybook/addon-a11y` static check — neither drives real user flows or asserts behavior.
- For a published, mobile-first interaction library, the highest-value untested flows are **focus management in overlays**, **keyboard menu navigation**, **form-control CVA round-trips**, and **touch gestures** — exactly the behaviors unit tests in jsdom approximate poorly.
- The library has no app shell to E2E directly; the practical approach is **Playwright against the built Storybook** (`storybook-static/`), driving stories as fixtures.
- Top 3 priorities: (1) overlay focus-trap + Escape + restore; (2) roving keyboard nav across menus/tabs; (3) form CVA round-trip with Angular Reactive Forms.

---

## Setup gap (Critical)

#### E-0 — No E2E framework configured
- **Evidence:** `find` for `playwright.config*` / `*.e2e.*` → none; `@playwright/test` absent from `package.json` devDependencies.
- **Why it matters:** All interaction guarantees rest on jsdom unit tests, which don't reproduce real focus order, pointer/touch behavior, layout/positioning, or screen-reader-affecting DOM. Regressions in overlay focus or gesture handling can ship undetected.
- **Recommended setup:** Add `@playwright/test`, point it at the static Storybook build (`./dev.sh storybook:build` → `storybook-static/`), and write story-driven specs under `projects/ui/e2e/`. Run in CI after the existing `storybook` build step in `scripts/ci-verify.sh`.

---

## Critical flows to cover

### HIGH

#### E-1 — Overlay focus management (Dialog, AlertDialog, Sheet, Dropdown, Popover, Context Menu)
- **Scenario:** Open overlay → focus moves into it → `Tab`/`Shift+Tab` is trapped within → `Escape` closes → focus returns to the trigger. For AlertDialog, assert initial focus lands on the cancel control ([alert-dialog.ts:67](projects/ui/src/lib/feedback/src/alert-dialog/alert-dialog.ts#L67) focuses `cancelRef` via `setTimeout`).
- **Why E2E:** Focus trap, focus restore, and `setTimeout`-based initial focus are timing/DOM-real behaviors jsdom can't reliably assert.

#### E-2 — Keyboard navigation across menus & tabs (roving tabindex)
- **Scenario:** Dropdown/Menubar/Context Menu/Command/NavigationMenu/Tabs — open, then `ArrowDown/Up/Left/Right`, `Home`, `End` move the active item with correct wrap/clamp; `Enter`/`Space` activate; disabled items are skipped; type-ahead (Command) filters.
- **Why E2E:** This is the duplicated, error-prone logic (DD-2); real keyboard event sequencing and `:focus` assertions catch drift between the copies.

#### E-3 — Form control CVA round-trip under Reactive Forms — ✅ RESOLVED (2026-06-15)

- **Resolution:** Added `ReactiveFormBinding` story to `input-otp.stories.ts` (uses `ReactiveFormsModule` + `FormControl`, shows live `ctrl.value`, `ctrl.touched`, `ctrl.disabled`). New `cva.e2e.ts` covers 6 scenarios: empty initial value, typing updates ctrl value, partial entry, blur marks touched, control starts enabled, Backspace clears digit. Covers the core CVA forward path (user input → formControl); writeValue/setDisabledState paths verified by existing unit specs.
- **Files:** [projects/ui/src/lib/forms/src/input-otp/input-otp.stories.ts](projects/ui/src/lib/forms/src/input-otp/input-otp.stories.ts), [projects/ui/e2e/cva.e2e.ts](projects/ui/e2e/cva.e2e.ts)

#### E-4 — Touch gestures (mobile group + carousel)
- **Scenario:** SwipeAction reveal/commit, BottomSheet drag-to-dismiss, MobileNav, and Carousel swipe (`carousel-content` threshold) using Playwright touch emulation; long-press opens Context Menu.
- **Why E2E:** Pointer/touch sequences and the 25%-width swipe threshold cannot be exercised in jsdom; this is the library's core differentiator.

### MEDIUM

#### E-5 — Toast lifecycle
- **Scenario:** Trigger toasts via `ToastService` → they appear, auto-dismiss after `duration`, pause on hover/focus and resume on leave/blur ([toast.ts:63-83](projects/ui/src/lib/feedback/src/toast/toast.ts#L63-L83)), `Escape` dismisses, multiple stack in order.
- **Why E2E:** Timer pause/resume + hover/focus interplay is real-time behavior.

#### E-6 — Tooltip / HoverCard positioning & dismissal
- **Scenario:** Hover/focus shows after delay, positions relative to trigger, dismisses on blur/leave/Escape, and (regression for B-7) stays attached to the trigger on scroll and doesn't overflow the viewport at screen edges.
- **Why E2E:** Real layout + `getBoundingClientRect` positioning only meaningful in a real browser.

#### E-7 — Calendar / DatePicker keyboard + selection
- **Scenario:** Open DatePicker → arrow-key grid navigation crosses month boundaries → `Enter` selects → value reflected in the bound control; `min`/`max` disable correct days; focus follows the active day ([calendar.ts:248](projects/ui/src/lib/forms/src/calendar/calendar.ts#L248) `setTimeout` focus).
- **Why E2E:** Grid focus movement after `setTimeout` and month re-render is DOM-real.

---

## Note
Since the package ships no application, story-driven Playwright against `storybook-static/` is the pragmatic harness; each story listed in the components' `*.stories.ts` can serve as a fixture URL.
