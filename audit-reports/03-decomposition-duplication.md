# 03 — Component Decomposition & Duplication

## Executive summary
- **Critical: 0 · High: 1 · Medium: 4 · Low: 2**
- Component file sizes are healthy (largest is Calendar at 292 lines); no "god component" exists. The issues are **cross-component duplication** of three patterns: floating-panel positioning, roving-tabindex/menu keyboard nav, and pointer-drag listener setup.
- The biggest gap: the documented "shared floating-panel primitive (Popover)" is **only reused by Hover Card** — Tooltip, Dropdown, Context Menu, Command, and Combobox each re-implement anchored positioning independently.
- CVA boilerplate (`_onChange`/`_onTouched`/`cvaDisabled`) is copy-pasted across every form control.
- Top 3 priorities: (1) extract a shared positioning util/directive; (2) extract a roving-tabindex menu-nav directive; (3) extract a CVA base/helper for form controls.

---

## Findings

### HIGH

#### DD-1 — Floating-panel positioning re-implemented per overlay (Popover not reused)
- **Files:** [tooltip.ts:93-138](projects/ui/src/lib/data-display/src/tooltip/tooltip.ts#L93-L138), [slider.ts](projects/ui/src/lib/forms/src/slider/slider.ts), [resizable-panel-group.ts:88](projects/ui/src/lib/layout/src/resizable/resizable-panel-group.ts#L88) — plus Dropdown/Context-Menu/Command/Combobox panels. Only [hover-card.ts](projects/ui/src/lib/overlays/src/hover-card/hover-card.ts) imports `Popover`.
- **Currently mixes:** Each overlay owns: anchor measurement (`getBoundingClientRect`), placement math (top/bottom/left/right), and DOM/style application. The same `placement` switch in Tooltip (lines 113-131) reappears conceptually in each overlay.
- **Why it matters:** CLAUDE.md states overlays "compose on top of" the Popover primitive, but in practice only Hover Card does. This means N copies of edge-case-prone positioning logic (no viewport flipping/clamping in any of them — see `04-bugs.md` B-7, `07-accessibility.md`), N places to fix when adding collision detection, and inconsistent behavior across overlays.
- **Suggested split:** Extract a framework-agnostic `computePosition(anchorRect, panelSize, placement, { gap, flip, clamp })` pure function plus a thin `[muiAnchored]` directive. Tooltip, Popover, Dropdown, Context Menu, Hover Card, Command, Combobox all consume it.
- **Where shared code lives:** New `projects/ui/src/lib/overlays/src/positioning/` util, re-exported into the overlays entry. (Keep it inside the overlays group to respect known-issue #9 — secondary entries can't relative-import `core/`.)

### MEDIUM

#### DD-2 — Roving-tabindex / menu keyboard navigation duplicated
- **Files:** [dropdown-menu.ts](projects/ui/src/lib/overlays/src/dropdown-menu/dropdown-menu.ts), [menubar.ts](projects/ui/src/lib/navigation/src/menubar/menubar.ts), [command.ts](projects/ui/src/lib/overlays/src/command/command.ts), [context-menu.ts](projects/ui/src/lib/overlays/src/context-menu/context-menu.ts), navigation-menu, [tabs/tab-list.ts](projects/ui/src/lib/navigation/src/tabs/tab-list.ts)
- **Currently mixes:** Each compound widget manages "active index + Arrow/Home/End/Enter handling + `tabindex="0"` on the active item" itself.
- **Why it matters:** This is the most error-prone a11y code in the library and it's written ~6 times. A keyboard-nav bug must be fixed in every copy; behavior drifts (e.g. wrap-around vs clamp).
- **Suggested split:** Extract a `RovingFocus` directive/util (active index signal + key handler + tabindex assignment). Components register items and delegate keydown.
- **Where shared code lives:** A shared util under `navigation`/`overlays` (or duplicated minimally per group to satisfy entry-point isolation). Document the chosen home.

#### DD-3 — CVA boilerplate copy-pasted across all form controls
- **Files (representative):** [calendar.ts:266-291](projects/ui/src/lib/forms/src/calendar/calendar.ts#L266-L291), [input-otp.ts:146-172](projects/ui/src/lib/forms/src/input-otp/input-otp.ts#L146-L172) — same pattern in input, select, checkbox, radio, textarea, toggle, slider.
- **Currently mixes:** Each control re-declares `private _onChange`, `_onTouched`, `cvaDisabled = signal(false)`, `isDisabled = computed(...)`, and the four CVA methods (`writeValue/registerOnChange/registerOnTouched/setDisabledState`).
- **Why it matters:** ~10 near-identical implementations; easy to get `setDisabledState`/`isDisabled` wiring subtly wrong in one of them.
- **Suggested split:** A small `useCva<T>()` helper (returns `{ onChange, onTouched, disabled, registerOnChange, ... }`) or an abstract base, leaving each control to wire its value signal.
- **Where shared code lives:** `projects/ui/src/lib/forms/src/cva/` util within the forms entry.

#### DD-4 — Pointer-drag listener setup duplicated
- **Files:** [carousel-content.ts:36-64](projects/ui/src/lib/data-display/src/carousel/carousel-content.ts#L36-L64), [resizable-panel-group.ts:101-159](projects/ui/src/lib/layout/src/resizable/resizable-panel-group.ts#L101-L159), [slider.ts](projects/ui/src/lib/forms/src/slider/slider.ts)
- **Currently mixes:** "pointerdown → add document pointermove/pointerup → compute delta → cleanup on up + ngOnDestroy" reimplemented each time, including the bound-listener fields and double cleanup.
- **Why it matters:** Each copy must independently get cleanup right (a missed `removeEventListener` is a leak). Carousel even adds a no-op move listener (see `02-performance.md` P-6).
- **Suggested split:** A `createDrag({ onMove, onEnd })` helper returning `{ start(event), destroy() }` that owns listener lifecycle.

#### DD-5 — ARIA id generation reinvented locally; `IdGenerator` unused
- **Files:** [calendar.ts:17,57](projects/ui/src/lib/forms/src/calendar/calendar.ts#L17), [date-picker.ts](projects/ui/src/lib/forms/src/date-picker/date-picker.ts), [tooltip.ts:13,44](projects/ui/src/lib/data-display/src/tooltip/tooltip.ts#L13) vs the unused [core/a11y/id-generator.ts](projects/ui/src/core/a11y/id-generator.ts)
- **Currently mixes:** Each component declares its own `let nextId = 0` module counter, while the purpose-built `IdGenerator` service is never injected anywhere (see `09-dead-code.md` D-1).
- **Why it matters:** Duplicated counters + a dead service. The duplication is partly forced by known-issue #9 (secondary entries can't import `core/`), so the right fix is a tiny per-group helper, not the central service.
- **Suggested split:** Either (a) delete `IdGenerator` and standardize on a 3-line per-group `nextId()` helper, or (b) export an id helper from the **primary** entry and import via the package path. Decide one and apply uniformly.

### LOW

#### DD-6 — Calendar mixes date math, i18n formatting, keyboard nav, and CVA
- **File:** [calendar.ts](projects/ui/src/lib/forms/src/calendar/calendar.ts) (292 lines)
- **Currently mixes:** Month-grid generation, `Intl` formatting, full keyboard grid navigation, and ControlValueAccessor in one class.
- **Why it matters:** Largest file; the date-grid logic is pure and independently testable but currently entangled with the component.
- **Suggested split:** Extract pure `buildMonthGrid(year, month, {min,max,today})` and `moveFocus(date, key)` functions to a `calendar/date-grid.ts` util; the component keeps rendering + CVA. Also enables unit-testing the math without a DOM.

#### DD-7 — Escape-to-close handled independently in 9 components
- **Evidence:** `keydown.escape` / `key === 'Escape'` appears in 9 source files (dialog, sheet, alert-dialog, dropdown, context-menu, popover, hover-card, toast, tooltip).
- **Why it matters:** Minor, but the "Escape closes the topmost overlay" semantics (and focus-restore) are reimplemented per overlay with no shared stacking model.
- **Suggested split:** Optional `OverlayStack` service to coordinate Escape + focus restoration if nested overlays become a requirement.
